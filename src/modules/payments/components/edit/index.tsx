import { useCallback, useId, useMemo } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { connect } from "react-redux";

import { isNullOrUndefined } from "@bodynarf/utils";

import { SelectableItem } from "@bodynarf/react.components";
import { FieldValue } from "@bodynarf/react.components.form";
import Form from "@bodynarf/react.components.form/component";

import { getDropdownItem } from "@app/core";
import { Payment } from "@app/models/payments";
import { getMonthName, monthsAsDropdownItems, yearsAsDropdownItems } from "@app/constants";

import { CompositeAppState } from "@app/redux";
import { loadPayments, saveCard } from "@app/redux/payments";

/** Payment card props types */
interface PaymentCardProps {
    /** All payments */
    payments: Array<Payment>;

    /** Is payment module state initialized */
    initialized: boolean;

    /** Payment types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Load all payments */
    loadPayments: () => Promise<void>;

    /** Save current card values */
    saveCard: (values: Array<FieldValue>, id?: string) => Promise<void>;
}

const PaymentCard = ({
    payments, initialized, availableTypesAsDropdownItems,
    loadPayments, saveCard,
}: PaymentCardProps): JSX.Element => {
    const { id } = useParams();

    const name = useId();
    const navigate = useNavigate();

    const payment = payments.find(x => x.id === +id!);
    const selectedType = useMemo(() => getDropdownItem(availableTypesAsDropdownItems, payment?.typeId), [payment?.typeId, availableTypesAsDropdownItems]);
    const selectedMonth = useMemo(() => getDropdownItem(monthsAsDropdownItems(), payment?.month), [payment?.month]);
    const selectedYear = useMemo(() => getDropdownItem(yearsAsDropdownItems(), payment?.year), [payment?.year]);

    const onSubmit = useCallback((values: Array<FieldValue>) => {
        saveCard(values, id)
            .then(() => {
                loadPayments().then(() => navigate("/payment", { replace: true }));
            });
    }, [id, loadPayments, saveCard, navigate]);


    if (!initialized) {
        return <></>; // TODO: add skeleton
    }

    return (
        <section>
            <Form
                name={name}
                caption={isNullOrUndefined(payment)
                    ? "Create new payment record"
                    : `Edit payment for ${getMonthName(payment!.month)} ${payment!.year}`
                }
                onSubmit={onSubmit}
                submitButtonConfiguration={{
                    type: "success",
                    caption: "Save"
                }}
                items={[
                    {
                        name: "amount",
                        label: { caption: "Amount" },
                        type: "number",
                        viewConfig: {
                            layout: {
                                column: 0,
                                columnSpan: 12,
                                row: 0,
                            }
                        },
                        defaultValue: payment?.price,
                        required: true,
                    },
                    {
                        name: "type",
                        label: { caption: "Type" },
                        type: "lookup",
                        viewConfig: {
                            layout: {
                                column: 0,
                                columnSpan: 12,
                                row: 1,
                            }
                        },
                        defaultValue: selectedType,
                        required: true,
                        items: availableTypesAsDropdownItems,
                    },
                    {
                        name: "month",
                        label: { caption: "Month" },
                        type: "lookup",
                        viewConfig: {
                            layout: {
                                column: 0,
                                columnSpan: 6,
                                row: 2,
                            }
                        },
                        defaultValue: selectedMonth,
                        required: true,
                        items: monthsAsDropdownItems(),
                    },
                    {
                        name: "year",
                        label: { caption: "Year" },
                        type: "lookup",
                        viewConfig: {
                            layout: {
                                column: 6,
                                columnSpan: 6,
                                row: 2,
                            }
                        },
                        defaultValue: selectedYear,
                        required: true,
                        items: yearsAsDropdownItems(),
                    },
                    {
                        name: "description",
                        label: { caption: "Description" },
                        type: "multiline",
                        viewConfig: {
                            layout: {
                                column: 0,
                                columnSpan: 12,
                                row: 3,
                            }
                        },
                        defaultValue: payment?.description
                    }
                ]}
            />
        </section>
    );
};

/** Payment card */
export default connect(
    ({ payments }: CompositeAppState) => ({ ...payments }),
    ({
        loadPayments, saveCard
    })
)(PaymentCard);
