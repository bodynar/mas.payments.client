import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { generateGuid, isNullOrEmpty, isNullOrUndefined } from "@bodynarf/utils";
import { ElementSize, SelectableItem } from "@bodynarf/react.components";
import Dropdown from "@bodynarf/react.components/components/dropdown";
import Button from "@bodynarf/react.components/components/button";

import "./style.scss";

import { LookupDate } from "@app/models";
import { AddMeasurementRecordData, AddMeasurements, MeasurementGroupedByType, MeasurementType } from "@app/models/measurements";
import { monthsAsDropdownItems, yearsAsDropdownItems } from "@app/constants";
import { validateMeasurementCreateData } from "@app/core/measurement";

import { CompositeAppState } from "@app/redux";
import { groupByType, saveCard } from "@app/redux/measurements";

import Table from "@app/sharedComponents/table";
import MeasurementCreateCardItem from "./item";

/** Measurement card props types */
interface MeasurementCreateCardProps {
    /** All measurement types */
    availableTypes: Array<MeasurementType>;

    /** Is measurement module state initialized */
    initialized: boolean;

    /** All measurements grouped by type */
    groupedByType?: Array<MeasurementGroupedByType>;

    /** Save current card values */
    saveCard: (values: AddMeasurements, id?: string) => Promise<void>;

    /** Group measurements by type */
    groupByType: () => void;
}

/**
 * Validate measurement items
 * @param items Measurement items to validate
 * @returns [Has validation error, mapped measurement items]
 */
const validateItems = (
    items: Array<AddMeasurementRecordDataExtended>
): [boolean, Array<AddMeasurementRecordDataExtended>] => {

    const validatedItems = items.map(item => ({
        ...item,
        validationError: validateMeasurementCreateData(item)
    }));

    return [
        !validatedItems.some(({ validationError }) => !isNullOrEmpty(validationError)),
        validatedItems
    ];
};

const MeasurementCreateCard = ({
    initialized, groupedByType, availableTypes,
    saveCard, groupByType,
}: MeasurementCreateCardProps): JSX.Element => {
    const navigate = useNavigate();

    useEffect(() => {
        if (initialized && isNullOrUndefined(groupedByType)) {
            groupByType();
        }

    }, [groupedByType, initialized, groupByType]);

    const [model, setModel] = useState<AddMeasurements>({ measurements: [] });
    const [items, setItems] = useState<Array<AddMeasurementRecordDataExtended>>([]);
    const [date, setDate] = useState<LookupDate>();
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(true);

    const changeItems = useCallback((newArray: Array<AddMeasurementRecordData>) => setItems(newArray), []);
    const onRemoveAllClick = useCallback(() => changeItems([]), [changeItems]);

    const getPreviousValues = useCallback(
        () => (groupedByType ?? []).map(group => ({
            typeId: group.key as number,
            value: group.items[group.items.length - 1]!.value
        })),
        [groupedByType]
    );

    const onAddMeasurementClick = useCallback(
        () => changeItems([...items, { id: generateGuid(), previousValues: getPreviousValues(), }]),
        [changeItems, getPreviousValues, items]
    );

    const onChangeItem = useCallback(
        (id: string, newValues: AddMeasurementRecordDataExtended) =>
            changeItems(
                items.map(item => item.id === id
                    ? ({ ...item, ...newValues })
                    : item
                )
            ),
        [changeItems, items]
    );

    const onSubmit = useCallback(() => {
        const [isValid, validatedItems] = validateItems(items);

        if (!isValid) {
            changeItems(validatedItems);
            return;
        }

        setIsSubmitAvailable(false);

        saveCard({
            ...model,
            measurements: validatedItems,
        })
            .then(() => {
                navigate("/measurement", { replace: true });
            })
            .catch(() => setIsSubmitAvailable(true));
    }, [items, saveCard, model, changeItems, navigate]);

    const onAddForAllTypesClick = useCallback(
        () => {
            const previousValues = getPreviousValues();

            changeItems(
                availableTypes.map(type => ({
                    id: generateGuid(),
                    typeId: type.id,
                    previousValues: previousValues,
                    value: previousValues.find(({ typeId }) => typeId === type.id)?.value,
                }))
            );
        },
        [availableTypes, changeItems, getPreviousValues]
    );

    const onDeleteItemClick = useCallback(
        (itemId: string) => changeItems([...items.filter(({ id }) => id !== itemId)]),
        [items, changeItems]
    );

    const onYearSelect = useCallback(
        (year?: SelectableItem) => {
            setDate(date => ({ ...date, year }));

            setModel(x => ({
                ...x,
                year: isNullOrUndefined(year) ? undefined : +year!.value,
            }));
        },
        []
    );

    const onMonthSelect = useCallback(
        (month?: SelectableItem) => {
            setDate(date => ({ ...date, month }));
            setModel(x => ({
                ...x,
                month: isNullOrUndefined(month) ? undefined : +month!.value,
            }));
        },
        []
    );

    if (!initialized) {
        return <></>; // TODO: add skeleton
    }

    return (
        <section>
            <div className="columns m-0">
                <div className="bbr-form__field column is-6">
                    <Dropdown
                        value={date?.year}
                        placeholder="Year"
                        hideOnOuterClick={true}
                        onSelect={onYearSelect}
                        items={yearsAsDropdownItems()}
                        label={{
                            caption: "Year",
                            horizontal: true,
                            className: "is-required"
                        }}
                    />
                </div>
                <div className="bbr-form__field column is-6">
                    <Dropdown
                        value={date?.month}
                        placeholder="Month"
                        hideOnOuterClick={true}
                        onSelect={onMonthSelect}
                        items={monthsAsDropdownItems()}
                        label={{
                            caption: "Month",
                            horizontal: true,
                            className: "is-required"
                        }}
                    />
                </div>
            </div>
            <hr />
            <div className="field is-grouped">
                <p className="control">
                    <Button
                        type="primary"
                        outlined={true}
                        caption="Create"
                        size={ElementSize.Small}
                        onClick={onAddMeasurementClick}
                        title="Add new measurement record"
                    />
                </p>
                {items.length === 0
                    &&
                    <p className="control">
                        <Button
                            type="info"
                            outlined={true}
                            size={ElementSize.Small}
                            caption="Create for all types"
                            onClick={onAddForAllTypesClick}
                            title="Add measurement records for all existed types"
                        />
                    </p>
                }
                {items.length !== 0
                    &&
                    <p className="control">
                        <Button
                            type="danger"
                            outlined={true}
                            size={ElementSize.Small}
                            caption="Remove all"
                            onClick={onRemoveAllClick}
                            title="Remove all lines"
                        />
                    </p>
                }
            </div>
            {items.length > 0
                &&
                <>
                    <Table
                        zebra={true}
                        fullWidth={true}
                        headings={tableHeadings}
                        headerBorderless={true}
                    >
                        {items.map(x =>
                            <MeasurementCreateCardItem
                                key={x.id}
                                item={x}
                                deleteItem={onDeleteItemClick}
                                updateItem={onChangeItem}
                                validationError={x.validationError}
                            />
                        )}
                    </Table>

                    <div className="field is-grouped">
                        <p className="control">
                            <Button
                                type="primary"
                                caption="Create"
                                onClick={onSubmit}
                                title="Create measurements"
                                disabled={!isSubmitAvailable}
                            />
                        </p>
                    </div>
                </>
            }

        </section>
    );
};

/** Measurement card */
export default connect(
    ({ measurements: state }: CompositeAppState) => ({
        initialized: state.initialized,
        groupedByType: state.groupedByType,
        availableTypes: state.availableTypes,
    }),
    ({
        saveCard,
        groupByType: groupByType
    })
)(MeasurementCreateCard);

/** Measurement add table headings */
const tableHeadings = [
    { caption: "Type", sortable: false, className: "has-text-centered width--is-15rem is-vertical-align--center" },
    { caption: "Value", sortable: false, className: "has-text-centered width--is-15rem is-vertical-align--center width--is-15rem" },
    { caption: "Comment", sortable: false, className: "has-text-centered is-vertical-align--center width--is-25rem" },
    { caption: "", sortable: false, className: "has-text-centered is-vertical-align--center width--is-5rem" },
];

/** Temporary extension for add measurement model */
interface AddMeasurementRecordDataExtended extends AddMeasurementRecordData {
    /** Validation error */
    validationError?: string;
}
