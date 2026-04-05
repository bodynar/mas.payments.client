import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonStyle, ElementSize } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";

import { PaymentType } from "@app/models/payments";
import { ColorSquare } from "@app/sharedComponents/colorSquare";

/** Payment type list item props type */
interface PaymentTypeListItemProps {
    /** Payment type information */
    item: PaymentType;

    /** Delete specified payment type */
    deletePaymentType: (id: string) => void;
}

/** Payment type list item */
const PaymentTypeListItem: FC<PaymentTypeListItemProps> = ({
    item,
    deletePaymentType,
}) => {
    const navigate = useNavigate();

    const onEditClick = useCallback(() => navigate(`edit/${item.id}`), [item.id, navigate]);
    const onDeleteClick = useCallback(() => deletePaymentType(item.id), [deletePaymentType, item]);

    return (
        <tr key={item.id}>
            <td className="has-text-centered is-vertical-align--center">
                <ColorSquare color={item.color}/>
            </td>
            <td className="has-text-centered is-vertical-align--center">{item.caption}</td>
            <td className="has-text-centered is-vertical-align--center">{item.company}</td>
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

export default PaymentTypeListItem;
