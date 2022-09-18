import { useCallback } from "react";

import { useNavigate } from "react-router-dom";

import Button from "@bodynarf/react.components/components/button";

import PaymentFilter from "../filter";

const PaymentList = (): JSX.Element => {
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
                List
            </section>
        </section>
    );
};

export default PaymentList;
