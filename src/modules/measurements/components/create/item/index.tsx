import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";

import { getClassName, isNullOrUndefined } from "@bodynarf/utils";
import { ElementSize, SelectableItem } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Dropdown from "@bodynarf/react.components/components/dropdown";
import Number from "@bodynarf/react.components/components/primitives/number";
import Text from "@bodynarf/react.components/components/primitives/text";

import { AddMeasurementRecordData } from "@app/models/measurements";
import { CompositeAppState } from "@app/redux/types";
import { getDropdownItem } from "@app/core";

/** Measurement card props types */
interface MeasurementCreateCardItemProps {
    /** Data container */
    item: AddMeasurementRecordData;

    /** Measurement types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Current validation error */
    validationError?: string;

    /** Delete specified item */
    deleteItem: (id: string) => void;

    /** Update item values */
    updateItem: (id: string, newValues: AddMeasurementRecordData) => void;
}

const MeasurementCreateCardItem = ({
    item, availableTypesAsDropdownItems,
    validationError,
    deleteItem, updateItem,
}: MeasurementCreateCardItemProps): JSX.Element => {
    const onDeleteClick = useCallback(() => deleteItem(item.id), [deleteItem, item]);

    const [selectedType, setType] = useState<SelectableItem | undefined>(getDropdownItem(availableTypesAsDropdownItems, item.typeId));
    const [diff, setDiff] = useState<number | undefined>();
    const [lastMeasurement, setLastMeasurement] = useState<number | undefined>(
        isNullOrUndefined(item.typeId)
            ? undefined
            : item.previousValues
                .filter(({ typeId }) => typeId === item.typeId!)
                .pop()?.value
    );

    useEffect(
        () =>
            setDiff(!isNullOrUndefined(lastMeasurement) && !isNullOrUndefined(item.value)
                ? +item.value! - lastMeasurement!
                : undefined
            ),
        [item.value, lastMeasurement]
    );

    const onTypeSelect = useCallback(
        (type?: SelectableItem) => {
            updateItem(item.id, {
                ...item,
                typeId: isNullOrUndefined(type) ? undefined : +type!.value,
                value: !isNullOrUndefined(type)
                    ? item.previousValues.find(({ typeId }) => typeId === +type!.value)?.value ?? undefined
                    : undefined,
            });
            setType(type);

            if (isNullOrUndefined(type)) {
                setLastMeasurement(undefined);
            } else {
                const lastItem = item.previousValues
                    .filter(({ typeId }) => typeId === +type!.value)
                    .pop();

                setLastMeasurement(lastItem?.value);
            }
        },
        [item, updateItem]
    );

    const onValueChange = useCallback(
        (value?: number) => updateItem(item.id, { ...item, value: value }),
        [item, updateItem]
    );

    const onCommentChange = useCallback(
        (text?: string) => updateItem(item.id, { ...item, comment: text }),
        [item, updateItem]
    );

    const className = getClassName([
        "measurements_table__item",
        !isNullOrUndefined(validationError) ? "measurements_table__item--has-error" : "",
    ]);

    return (
        <tr className={className}>
            <td className="is-vertical-align--center">
                <Dropdown
                    placeholder="Type"
                    deselectable={true}
                    hideOnOuterClick={true}
                    onSelect={onTypeSelect}
                    value={selectedType}
                    items={availableTypesAsDropdownItems}
                />
            </td>
            <td className="is-vertical-align--center">
                <div className="field has-addons">
                    <Number
                        placeholder="Value"
                        onValueChange={onValueChange}
                        defaultValue={item.value}
                    />
                    {!isNullOrUndefined(diff) && diff! > 0
                        &&
                        <div className="control">
                            <Button
                                type="default"
                                static={true}
                                caption={`+${diff}`}
                            />
                        </div>
                    }
                </div>
            </td>
            <td className="is-vertical-align--center">
                <Text
                    placeholder="Comment"
                    onValueChange={onCommentChange}
                />
            </td>
            <td className="is-vertical-align--center">
                <div className="field is-grouped is-justify-content-space-evenly">
                    <div className="control">
                        <Button
                            type="danger"
                            icon={{ name: "trash", size: ElementSize.Medium }}
                            onClick={onDeleteClick}
                            title="Delete record"
                        />
                    </div>
                </div>
            </td>
            {!isNullOrUndefined(validationError)
                &&
                <td className="is-vertical-align--center width--is-15rem has-text-weight-bold">
                    {validationError}
                </td>
            }
        </tr>
    );
};

/** Measurement single item component */
export default connect(
    ({ measurements: state }: CompositeAppState) => ({
        availableTypesAsDropdownItems: state.availableTypesAsDropdownItems,
    }),
    ({})
)(MeasurementCreateCardItem);
