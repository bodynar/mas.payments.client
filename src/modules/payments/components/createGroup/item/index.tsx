import { FC, useCallback, useState } from "react";
import { connect } from "react-redux";

import { getClassName, isNullish, isNotNullish } from "@bodynarf/utils";
import { ButtonStyle, ElementSize, SelectableItem } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Dropdown from "@bodynarf/react.components/components/dropdown";
import Number from "@bodynarf/react.components/components/primitives/number";
import Text from "@bodynarf/react.components/components/primitives/text";

import { AddPaymentGroupItem } from "@app/models/payments";
import { CompositeAppState } from "@app/redux/types";

interface PaymentGroupCardItemProps {
    /** Data container */
    item: AddPaymentGroupItem;

    /** Payment types mapped to dropdown items */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Current validation error */
    validationError?: string;

    /** Delete specified item */
    deleteItem: (id: string) => void;

    /** Update item values */
    updateItem: (id: string, newValues: AddPaymentGroupItem) => void;
}

const PaymentGroupCardItem: FC<PaymentGroupCardItemProps> = ({
    item, availableTypesAsDropdownItems,
    validationError,
    deleteItem, updateItem,
}) => {
    const onDeleteClick = useCallback(() => deleteItem(item.id), [deleteItem, item]);

    const [selectedType, setType] = useState<SelectableItem | undefined>(
        availableTypesAsDropdownItems.find(({ value }) => value === item.paymentTypeId),
    );

    const onTypeSelect = useCallback(
        (type?: SelectableItem) => {
            updateItem(item.id, {
                ...item,
                paymentTypeId: isNullish(type) ? undefined : type!.value,
            });
            setType(type);
        },
        [item, updateItem],
    );

    const onAmountChange = useCallback(
        (value?: number) => updateItem(item.id, { ...item, amount: value }),
        [item, updateItem],
    );

    const onDescriptionChange = useCallback(
        (text?: string) => updateItem(item.id, { ...item, description: text }),
        [item, updateItem],
    );

    const className = getClassName([
        "payment-group-card_table__item",
        isNotNullish(validationError) ? "payment-group-card_table__item--has-error" : "",
    ]);

    return (
        <tr className={className}>
            <td className="is-vertical-align--center">
                <Dropdown
                    placeholder="Type"
                    deselectable
                    hideOnOuterClick
                    onSelect={onTypeSelect}
                    value={selectedType}
                    items={availableTypesAsDropdownItems}
                />
            </td>
            <td className="is-vertical-align--center">
                <Number
                    placeholder="Amount"
                    onValueChange={onAmountChange}
                    defaultValue={item.amount}
                />
            </td>
            <td className="is-vertical-align--center">
                <Text
                    placeholder="Description"
                    onValueChange={onDescriptionChange}
                />
            </td>
            <td className="is-vertical-align--center">
                <div className="field is-grouped is-justify-content-space-evenly">
                    <div className="control">
                        <Button
                            style={ButtonStyle.Danger}
                            icon={{ name: "trash", size: ElementSize.Medium }}
                            onClick={onDeleteClick}
                            title="Delete record"
                        />
                    </div>
                </div>
            </td>
            {isNotNullish(validationError)
                &&
                <td className="is-vertical-align--center width--is-15rem has-text-weight-bold">
                    {validationError}
                </td>
            }
        </tr>
    );
};

export default connect(
    ({ payments: state }: CompositeAppState) => ({
        availableTypesAsDropdownItems: state.availableTypesAsDropdownItems,
    }),
    ({}),
)(PaymentGroupCardItem);
