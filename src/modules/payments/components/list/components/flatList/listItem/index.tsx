import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getFontColorFromString, isNullish } from "@bodynarf/utils";

import { ButtonStyle, ElementSize } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Tag from "@bodynarf/react.components/components/tag";

import { Payment, PaymentType } from "@app/models/payments";

import { getMonthName } from "@app/utils";

/** Payment list item props type */
interface PaymentListItemProps {
    /** Payment information */
    item: Payment;

    /** Payment types map */
    typesMap: Map<string, PaymentType>;

    /** Delete specified payment */
    deletePayment: (id: string) => void;

    /** On payment type click handler */
    onPaymentTypeClick?: (paymentTypeId: string) => void;

    /**
     * Is component used in group view.
     * Removes month & year columns from display
     */
    useInGroupView?: boolean;
}

/** Payment list item */
const PaymentListItem: FC<PaymentListItemProps> = ({
    item, typesMap, useInGroupView,
    deletePayment, onPaymentTypeClick,
}) => {
    const navigate = useNavigate();

    const paymentType = typesMap.get(item.typeId);
    const typeCaption = paymentType?.caption ?? "";
    const typeColor = paymentType?.color;

    const onEditClick = useCallback(() => navigate(`edit/${item.id}`, { replace: true }), [item.id, navigate]);
    const onDeleteClick = useCallback(() => deletePayment(item.id), [deletePayment, item]);
    const onTypeClick = useCallback(() => onPaymentTypeClick!(item.typeId), [item.typeId, onPaymentTypeClick]);

    return (
        <tr key={item.id}>
            {useInGroupView !== true
                &&
                <>
                    <td className="has-text-centered is-vertical-align--center">{getMonthName(item.month)}</td>
                    <td className="has-text-centered is-vertical-align--center">{item.year}</td>
                </>
            }
            <td className="has-text-centered is-vertical-align--center">
                <Tag
                    content={typeCaption}
                    customColor={isNullish(typeColor) ? undefined : {
                        color: getFontColorFromString(typeColor!),
                        backgroundColor: typeColor!
                    }}
                    onClick={
                        isNullish(onPaymentTypeClick)
                            ? undefined
                            : onTypeClick
                    }
                    title={
                        isNullish(onPaymentTypeClick)
                            ? undefined
                            : `Filter by type "${typeCaption}" additionally`
                    }
                />
            </td>
            <td className="has-text-centered is-vertical-align--center">{item.price}</td>
            <td>{item.description}</td>
            <td className="is-vertical-align--center">
                <div className="field is-grouped is-justify-content-space-evenly">
                    <div className="control">
                        <Button
                            style={ButtonStyle.Warning}
                            icon={{ name: "pencil", size: ElementSize.Medium }}
                            onClick={onEditClick}
                            title="Edit record"
                        />
                    </div>
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
        </tr>
    );
};

export default PaymentListItem;
