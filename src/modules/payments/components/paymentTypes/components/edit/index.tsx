import { FC, useCallback, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { hexToRgb, isNullish, isNotNullish } from "@bodynarf/utils";

import { ButtonStyle } from "@bodynarf/react.components";
import { FieldValue } from "@bodynarf/react.components.form";
import Form from "@bodynarf/react.components.form/component";

import { PaymentType } from "@app/models/payments";

import { CompositeAppState } from "@app/redux";
import { saveTypeCard } from "@app/redux/payments";

import ModuleLoader from "@app/sharedComponents/moduleLoader";

/** Payment card props types */
interface PaymentTypeCardProps {
    /** Payment types indexed by id */
    typesMap: Map<string, PaymentType>;

    /** Is payment module state initialized */
    initialized: boolean;

    /** Save current card values */
    saveCard: (values: Array<FieldValue>, id?: string) => Promise<void>;
}

const PaymentTypeCard: FC<PaymentTypeCardProps> = ({
    typesMap, initialized,
    saveCard,
}) => {
    const { id } = useParams();

    const name = useId();
    const navigate = useNavigate();

    const item = typesMap.get(id!);
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(false);

    const defaultColor = isNotNullish(item) && isNotNullish(item!.color)
        ? hexToRgb(item!.color!)
        : undefined;

    const onSubmit = useCallback((values: Array<FieldValue>) => {
        setIsSubmitAvailable(true);

        saveCard(values, id)
            .then(() => {
                navigate("/payment/types");
            })
            .catch(() => setIsSubmitAvailable(false));
    }, [id, saveCard, navigate]);


    if (!initialized) {
        return <ModuleLoader />;
    }

    if (id !== undefined && isNullish(item)) {
        return (
            <div className="message is-danger">
                <div className="message-body">
                    Payment type not found.
                </div>
            </div>
        );
    }

    return (
        <section>
            <Form
                name={name}
                caption={isNullish(item)
                    ? "Create new payment type"
                    : "Edit payment type"
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
    ({ payments }: CompositeAppState) => ({
        typesMap: payments.typesMap,
        initialized: payments.initialized,
    }),
    ({
        saveCard: saveTypeCard,
    })
)(PaymentTypeCard);
