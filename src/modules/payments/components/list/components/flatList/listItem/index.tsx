import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getFontColorFromString, isNullOrUndefined } from "@bodynarf/utils";

import { ElementSize } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Tag from "@bodynarf/react.components/components/tag";

import { Payment } from "@app/models/payments";

import { getMonthName } from "@app/utils";

/** Payment list item props type */
interface PaymentListItemProps {
    /** Payment information */
    item: Payment;

    /** Delete specified payment */
    deletePayment: (id: number) => void;

    /** On payment type click handler */
    onPaymentTypeClick?: (paymentTypeId: number) => void;

    /**
     * Is component used in group view.
     * Removes month & year columns from display
     */
    useInGroupView?: boolean;
}

/** Payment list item */
const PaymentListItem = ({
    item, useInGroupView,
    deletePayment, onPaymentTypeClick,
}: PaymentListItemProps): JSX.Element => {
    const navigate = useNavigate();

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
                    content={item.typeCaption}
                    customColor={isNullOrUndefined(item.typeColor) ? undefined : {
                        color: getFontColorFromString(item.typeColor!),
                        backgroundColor: item.typeColor!
                    }}
                    onClick={
                        isNullOrUndefined(onPaymentTypeClick)
                            ? undefined
                            : onTypeClick
                    }
                    title={
                        isNullOrUndefined(onPaymentTypeClick)
                            ? undefined
                            : `Filter by type "${item.typeCaption}" additionaly`
                    }
                />
            </td>
            <td className="has-text-centered is-vertical-align--center">{item.price}</td>
            <td>{item.description}</td>
            <td className="is-vertical-align--center">
                <div className="field is-grouped is-justify-content-space-evenly">
                    <div className="control">
                        <Button
                            type="warning"
                            icon={{ name: "pencil", size: ElementSize.Medium }}
                            onClick={onEditClick}
                            title="Edit record"
                        />
                    </div>
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
        </tr>
    );
};

export default PaymentListItem;
