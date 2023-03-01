import { useCallback } from "react";

import { useNavigate } from "react-router-dom";

import Button from "@bodynarf/react.components/components/button";

import { Payment } from "@app/models/payments";

import { getMonthName } from "@app/static";

/** Payment list item props type */
type PaymentListItemProps = {
    /** Payment information */
    item: Payment;
};

/** Payment list item */
const PaymentListItem = ({ item }: PaymentListItemProps): JSX.Element => {
    const navigate = useNavigate();

    const onEditClick = useCallback(() => navigate(`edit/${item.id}`, { replace: true }), [item.id, navigate]);
    const onDeleteClick = useCallback(() => {

    }, []);

    return (
        <tr key={item.id}>
            <td className="has-text-centered is-vertical-align--center">{getMonthName(item.month)}</td>
            <td className="has-text-centered is-vertical-align--center">{item.year}</td>
            <td className="has-text-centered is-vertical-align--center">{item.typeCaption}</td>
            <td className="has-text-centered is-vertical-align--center">{item.price}</td>
            <td>{item.description}</td>
            <td className="is-vertical-align--center">
                <div className="field is-grouped is-justify-content-space-evenly">
                    <div className="control">
                        <Button
                            type="warning"
                            icon={{ name: "pencil" }}
                            onClick={onEditClick}
                        />
                    </div>
                    <div className="control">
                        <Button
                            type="danger"
                            icon={{ name: "trash" }}
                            onClick={onDeleteClick}
                        />
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default PaymentListItem;
