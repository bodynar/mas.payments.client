import { useCallback, useId, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { hexToRgb, isNullOrUndefined } from "@bodynarf/utils";

import { FieldValue } from "@bodynarf/react.components.form";
import Form from "@bodynarf/react.components.form/component";

import { MeasurementType } from "@app/models/measurements";

import { CompositeAppState } from "@app/redux";
import { saveTypeCard } from "@app/redux/measurements";
import { SelectableItem } from "@bodynarf/react.components";
import { getDropdownItem } from "@app/core";

/** Measurement card props types */
interface MeasurementTypeCardProps {
    /** All measurements */
    availableTypes: Array<MeasurementType>;

    /** Is measurement module state initialized */
    initialized: boolean;

    /** Payment types mapped to dropdown items to cache values */
    paymentTypesAsDropdownItems: Array<SelectableItem>;

    /** Save current card values */
    saveCard: (values: Array<FieldValue>, id?: string) => Promise<void>;
}

const MeasurementTypeCard = ({
    availableTypes, initialized, paymentTypesAsDropdownItems,
    saveCard,
}: MeasurementTypeCardProps): JSX.Element => {
    const { id } = useParams();

    const name = useId();
    const navigate = useNavigate();

    const item = availableTypes.find(x => x.id === +id!);
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(false);
    const selectedType = useMemo(() => getDropdownItem(paymentTypesAsDropdownItems, item?.paymentTypeId), [paymentTypesAsDropdownItems, item?.paymentTypeId]);

    const defaultColor = !isNullOrUndefined(item) && !isNullOrUndefined(item!.color)
        ? hexToRgb(item!.color!)
        : undefined;

    const onSubmit = useCallback((values: Array<FieldValue>) => {
        setIsSubmitAvailable(true);

        saveCard(values, id)
            .then(() => {
                navigate("/measurement/types", { replace: true });
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
                    ? "Create new measurement type"
                    : "Edit measurement type"
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
                        name: "paymentType",
                        label: { caption: "Payment type" },
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
                        readonly: isSubmitAvailable,
                        items: paymentTypesAsDropdownItems,
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

/** Measurement type card */
export default connect(
    ({ measurements, payments }: CompositeAppState) => ({
        availableTypes: measurements.availableTypes,
        initialized: measurements.initialized,
        paymentTypesAsDropdownItems: payments.availableTypesAsDropdownItems,
    }),
    ({
        saveCard: saveTypeCard,
    })
)(MeasurementTypeCard);
