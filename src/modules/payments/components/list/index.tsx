import { useCallback } from "react";

import { connect } from "react-redux";

import { useNavigate } from "react-router-dom";

import Button from "@bodynarf/react.components/components/button";

import { CompositeAppState } from "@app/redux/rootReducer";

import PaymentFilter from "../filter";
import { Payment } from "@app/models/payments";

type PaymentListProps = {
    filteredItems: Array<Payment>;
};

const PaymentList = ({ filteredItems }: PaymentListProps): JSX.Element => {
    const navigate = useNavigate();

    const onCreateClick = useCallback(() => navigate('/payment/create', { replace: true }), [navigate]);
    const onTypeManageClick = useCallback(() => navigate('/payment/types', { replace: true }), [navigate]);

    return (
        <section>
            <nav className="field is-grouped">
                <p className="control">
                    <Button
                        type="primary"
                        caption="Create"
                        onClick={onCreateClick}
                    />
                </p>
                <p className="control">
                    <Button
                        type="info"
                        caption="Manage types"
                        outlined={true}
                        onClick={onTypeManageClick}
                    />
                </p>
            </nav>
            <PaymentFilter />
            <section>
                ({filteredItems.length})
                {filteredItems.map(x =>
                    <p key={x.id}>
                        {x.price}
                    </p>
                )}
            </section>
        </section>
    );
};

/** Payments list */
export default connect(
    ({ payments }: CompositeAppState) => ({ filteredItems: payments.filteredItems }),
    ({})
)(PaymentList);