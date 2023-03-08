import { useCallback, useId, useMemo, useState } from "react";
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
import { saveCard } from "@app/redux/payments";

/** Payment card props types */
interface PaymentCardProps {
    /** All payments */
    payments: Array<Payment>;

    /** Is payment module state initialized */
    initialized: boolean;

    /** Payment types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Save current card values */
    saveCard: (values: Array<FieldValue>, id?: string) => Promise<void>;
}

const PaymentCard = ({
    payments, initialized, availableTypesAsDropdownItems,
    saveCard,
}: PaymentCardProps): JSX.Element => {
    const { id } = useParams();

    const name = useId();
    const navigate = useNavigate();

    const payment = payments.find(x => x.id === +id!);
    const selectedType = useMemo(() => getDropdownItem(availableTypesAsDropdownItems, payment?.typeId), [payment?.typeId, availableTypesAsDropdownItems]);
    const selectedMonth = useMemo(() => getDropdownItem(monthsAsDropdownItems(), payment?.month), [payment?.month]);
    const selectedYear = useMemo(() => getDropdownItem(yearsAsDropdownItems(), payment?.year), [payment?.year]);
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(false);

    const onSubmit = useCallback((values: Array<FieldValue>) => {
        setIsSubmitAvailable(true);

        saveCard(values, id)
            .then(() => {
                navigate("/payment", { replace: true });
            })
            .catch(() => setIsSubmitAvailable(false));
    }, [id, saveCard, navigate]);


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
                    caption: "Save",
                    disabled: isSubmitAvailable
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
                        readonly: isSubmitAvailable,
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
                        readonly: isSubmitAvailable,
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
                        readonly: isSubmitAvailable,
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
                        readonly: isSubmitAvailable,
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
                        defaultValue: payment?.description,
                        readonly: isSubmitAvailable,
                    }
                ]}
            />
        </section>
    );
};

/** Payment card */
export default connect(
    ({ payments }: CompositeAppState) => ({ ...payments }),
    ({ saveCard })
)(PaymentCard);
