import { FC, useCallback, useId, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { isNullish, isNotNullish } from "@bodynarf/utils";

import { ButtonStyle, SelectableItem } from "@bodynarf/react.components";
import { FieldValue } from "@bodynarf/react.components.form";
import Form from "@bodynarf/react.components.form/component";

import { getDropdownItem } from "@app/core";
import { Payment } from "@app/models/payments";
import { getDateOrNowLookup, getMonthName, monthsAsDropdownItems, yearsAsDropdownItems } from "@app/utils";

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

const PaymentCard: FC<PaymentCardProps> = ({
    payments, initialized, availableTypesAsDropdownItems,
    saveCard,
}) => {
    const { id } = useParams();

    const name = useId();
    const navigate = useNavigate();

    const payment = payments.find(x => x.id === id);
    const selectedType = useMemo(() => getDropdownItem(availableTypesAsDropdownItems, payment?.typeId), [payment?.typeId, availableTypesAsDropdownItems]);

    const { year, month } = useMemo(() => getDateOrNowLookup(payment), [payment]);
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(false);

    const onSubmit = useCallback((values: Array<FieldValue>) => {
        setIsSubmitAvailable(true);

        saveCard(values, id)
            .then(() => {
                navigate("/payment");
            })
            .catch(() => setIsSubmitAvailable(false));
    }, [id, saveCard, navigate]);

    if (!initialized) {
        return <></>;
    }
    if (initialized && isNotNullish(id) && isNullish(payment)) {
        return <>ERROR: Payment not found</>;
    }

    return (
        <section>
            <Form
                name={name}
                caption={isNullish(payment)
                    ? `Payment for ${getMonthName(+month!.value)} ${year!.value}`
                    : `Edit payment for ${getMonthName(payment!.month)} ${payment!.year}`
                }
                onSubmit={onSubmit}
                submitButtonConfiguration={{
                    type: "success",
                    style: ButtonStyle.Success,
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
                        defaultValue: month,
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
                        defaultValue: year,
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
    ({ payments }: CompositeAppState) => ({
        payments: payments.records,
        initialized: payments.initialized,
        availableTypesAsDropdownItems: payments.availableTypesAsDropdownItems,
    }),
    ({ saveCard })
)(PaymentCard);

