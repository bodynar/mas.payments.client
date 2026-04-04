import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { generateGuid, isNullOrEmpty, isNullish } from "@bodynarf/utils";
import { ButtonStyle, ElementSize, SelectableItem } from "@bodynarf/react.components";
import Dropdown from "@bodynarf/react.components/components/dropdown";
import Button from "@bodynarf/react.components/components/button";

import "./style.scss";

import { Group } from "@bodynarf/utils";

import { LookupDate } from "@app/models";
import { AddMeasurementRecordData, AddMeasurements, Measurement, MeasurementType } from "@app/models/measurements";
import { getPreviousMonthDate, getPreviousMonthDateLookup, monthsAsDropdownItems, yearsAsDropdownItems } from "@app/utils";
import { validateMeasurementCreateData } from "@app/core/measurement";

import { CompositeAppState } from "@app/redux";
import { groupByType, saveCard } from "@app/redux/measurements";

import Table from "@bodynarf/react.components/components/table";
import MeasurementCreateCardItem from "./item";

/** Measurement card props types */
interface MeasurementCreateCardProps {
    /** Measurement types indexed by id */
    typesMap: Map<string, MeasurementType>;

    /** Is measurement module state initialized */
    initialized: boolean;

    /** All measurements grouped by type */
    groupedByType?: Array<Group<Measurement>>;

    /** Save current card values */
    saveCard: (values: AddMeasurements, id?: string) => Promise<boolean | undefined>;

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

const MeasurementCreateCard: FC<MeasurementCreateCardProps> = ({
    initialized, groupedByType, typesMap,
    saveCard, groupByType,
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (initialized && isNullish(groupedByType)) {
            groupByType();
        }

    }, [groupedByType, initialized, groupByType]);

    const [model, setModel] = useState<AddMeasurements>({ measurements: [], ...getPreviousMonthDate() });
    const [items, setItems] = useState<Array<AddMeasurementRecordDataExtended>>([]);
    const [date, setDate] = useState<LookupDate>(getPreviousMonthDateLookup());
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(true);
    const [validationError, setValidationError] = useState("");

    const changeItems = useCallback((newArray: Array<AddMeasurementRecordData>) => setItems(newArray), []);
    const onRemoveAllClick = useCallback(() => changeItems([]), [changeItems]);

    const getPreviousValues = useCallback(
        () => (groupedByType ?? []).map(group => ({
            typeId: String(group.key),
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

        changeItems(validatedItems);

        if (!isValid) {
            setValidationError("Measurement items contain errors. See description below");
            return;
        }

        if (isNullish(date) || isNullish(date!.year) || isNullish(date!.month)) {
            setValidationError("Date is not set");
            return;
        }

        setValidationError("");
        setIsSubmitAvailable(false);

        saveCard({
            ...model,
            measurements: validatedItems,
        })
            .then((result) => {
                if (result) {
                    navigate("/measurement", { replace: true });
                } else {
                    setIsSubmitAvailable(true);
                }
            });
    }, [items, date, saveCard, model, changeItems, navigate]);

    const onAddForAllTypesClick = useCallback(
        () => {
            const previousValues = getPreviousValues();

            changeItems(
                [...typesMap.values()].map(type => ({
                    id: generateGuid(),
                    typeId: type.id,
                    previousValues: previousValues,
                    value: previousValues.find(({ typeId }) => typeId === type.id)?.value,
                }))
            );
        },
        [typesMap, changeItems, getPreviousValues]
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
                year: isNullish(year) ? undefined : +year!.value,
            }));
        },
        []
    );

    const onMonthSelect = useCallback(
        (month?: SelectableItem) => {
            setDate(date => ({ ...date, month }));
            setModel(x => ({
                ...x,
                month: isNullish(month) ? undefined : +month!.value,
            }));
        },
        []
    );

    if (!initialized) {
        return <></>;
    }

    return (
        <section>
            <div className="columns m-0">
                <div className="bbr-form__field column is-6">
                    <Dropdown
                        value={date?.year}
                        placeholder="Year"
                        hideOnOuterClick
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
                        hideOnOuterClick
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
            {!isNullOrEmpty(validationError)
                &&
                <article className="message is-danger">
                    <div className="message-body">
                        {validationError}
                    </div>
                </article>
            }
            <hr />
            <div className="field is-grouped">
                <p className="control">
                    <Button
                        outlined
                        caption="Add"
                        size={ElementSize.Small}
                        style={ButtonStyle.Primary}
                        onClick={onAddMeasurementClick}
                        title="Add new measurement record"
                    />
                </p>
                {items.length === 0
                    &&
                    <p className="control">
                        <Button
                            style={ButtonStyle.Info}
                            outlined
                            size={ElementSize.Small}
                            caption="Add for all types"
                            onClick={onAddForAllTypesClick}
                            title="Add measurement records for all existed types"
                        />
                    </p>
                }
                {items.length !== 0
                    &&
                    <p className="control">
                        <Button
                            style={ButtonStyle.Danger}
                            outlined
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
                        zebra
                        fullWidth
                        headings={tableHeadings}
                        headerBorderless
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
                                style={ButtonStyle.Primary}
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
        typesMap: state.typesMap,
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
