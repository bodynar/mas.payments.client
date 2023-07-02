import { useCallback, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { hexToRgb, isNullOrUndefined } from "@bodynarf/utils";

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

    const item = availableTypes.find(x => x.id === +id!);
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(false);

    const defaultColor = !isNullOrUndefined(item) && !isNullOrUndefined(item!.color)
        ? hexToRgb(item!.color!)
        : undefined;

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
                caption={isNullOrUndefined(item)
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
                        defaultValue: item?.caption,
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
                        defaultValue: item?.company,
                        readonly: isSubmitAvailable,
                    },
                    {
                        name: "color",
                        label: { caption: "Badge color" },
                        type: "color",
                        viewConfig: {
                            layout: {
                                column: 0,
                                columnSpan: 12,
                                row: 2,
                            }
                        },
                        defaultValue: defaultColor,
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
                        defaultValue: item?.description,
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
