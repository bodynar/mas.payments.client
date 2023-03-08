import { useCallback, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { isNullOrUndefined } from "@bodynarf/utils";

import { FieldValue } from "@bodynarf/react.components.form";
import Form from "@bodynarf/react.components.form/component";

import { PaymentType } from "@app/models/payments";

import { CompositeAppState } from "@app/redux";
import { saveTypeCard } from "@app/redux/payments";

/** Payment card props types */
interface PaymentTypeCardProps {
    /** All payments */
    availableTypes: Array<PaymentType>;

    /** Is payment module state initialized */
    initialized: boolean;

    /** Save current card values */
    saveCard: (values: Array<FieldValue>, id?: string) => Promise<void>;
}

const PaymentTypeCard = ({
    availableTypes, initialized,
    saveCard,
}: PaymentTypeCardProps): JSX.Element => {
    const { id } = useParams();

    const name = useId();
    const navigate = useNavigate();

    const paymentType = availableTypes.find(x => x.id === +id!);
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(false);

    const onSubmit = useCallback((values: Array<FieldValue>) => {
        setIsSubmitAvailable(true);

        saveCard(values, id)
            .then(() => {
                navigate("/payment/types", { replace: true });
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
                caption={isNullOrUndefined(paymentType)
                    ? "Create new payment type"
                    : "Edit payment type"
                }
                onSubmit={onSubmit}
                submitButtonConfiguration={{
                    type: "success",
                    caption: "Save",
                    disabled: isSubmitAvailable
                }}
                items={[
                    {
                        name: "caption",
                        label: { caption: "Caption" },
                        type: "text",
                        viewConfig: {
                            layout: {
                                column: 0,
                                columnSpan: 12,
                                row: 0,
                            }
                        },
                        defaultValue: paymentType?.caption,
                        required: true,
                        readonly: isSubmitAvailable,
                    },
                    {
                        name: "provider",
                        label: { caption: "Provider" },
                        type: "text",
                        viewConfig: {
                            layout: {
                                column: 0,
                                columnSpan: 12,
                                row: 1,
                            }
                        },
                        defaultValue: paymentType?.company,
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
                                row: 2,
                            }
                        },
                        defaultValue: paymentType?.description,
                        readonly: isSubmitAvailable,
                    }
                ]}
            />
        </section>
    );
};

/** Payment type card */
export default connect(
    ({ payments }: CompositeAppState) => ({ ...payments }),
    ({
        saveCard: saveTypeCard,
    })
)(PaymentTypeCard);
