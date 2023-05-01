import { useCallback, useId, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { isNullOrUndefined } from "@bodynarf/utils";

import { SelectableItem } from "@bodynarf/react.components";
import { FieldValue } from "@bodynarf/react.components.form";
import Form from "@bodynarf/react.components.form/component";

import { getDropdownItem } from "@app/core";
import { Measurement } from "@app/models/measurements";
import { getMonthName, monthsAsDropdownItems, yearsAsDropdownItems } from "@app/utils";

import { CompositeAppState } from "@app/redux";
import { saveCard } from "@app/redux/measurements";

/** Measurement card props types */
interface MeasurementEditCardProps {
    /** All measurements */
    measurements: Array<Measurement>;

    /** Is measurement module state initialized */
    initialized: boolean;

    /** Measurement types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Save current card values */
    saveCard: (values: Array<FieldValue>, id?: string) => Promise<void>;
}

const MeasurementEditCard = ({
    measurements, initialized, availableTypesAsDropdownItems,
    saveCard,
}: MeasurementEditCardProps): JSX.Element => {
    const { id } = useParams();

    const name = useId();
    const navigate = useNavigate();

    const measurement = measurements.find(x => x.id === +id!);
    const selectedType = useMemo(() => getDropdownItem(availableTypesAsDropdownItems, measurement?.typeId), [measurement?.typeId, availableTypesAsDropdownItems]);
    const selectedMonth = useMemo(() => getDropdownItem(monthsAsDropdownItems(), measurement?.month), [measurement?.month]);
    const selectedYear = useMemo(() => getDropdownItem(yearsAsDropdownItems(), measurement?.year), [measurement?.year]);
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(false);

    const onSubmit = useCallback((values: Array<FieldValue>) => {
        setIsSubmitAvailable(true);

        saveCard(values, id)
            .then(() => {
                navigate("/measurement", { replace: true });
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
                caption={isNullOrUndefined(measurement)
                    ? "Create new measurement record"
                    : `Edit measurement for ${getMonthName(measurement!.month)} ${measurement!.year} [${measurement!.typeCaption}]`
                }
                onSubmit={onSubmit}
                submitButtonConfiguration={{
                    type: "success",
                    caption: "Save",
                    disabled: isSubmitAvailable
                }}
                items={[
                    {
                        name: "value",
                        label: { caption: "Value" },
                        type: "number",
                        viewConfig: {
                            layout: {
                                column: 0,
                                columnSpan: 12,
                                row: 0,
                            }
                        },
                        defaultValue: measurement?.value,
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
                        name: "comment",
                        label: { caption: "Comment" },
                        type: "multiline",
                        viewConfig: {
                            layout: {
                                column: 0,
                                columnSpan: 12,
                                row: 3,
                            }
                        },
                        defaultValue: measurement?.description,
                        readonly: isSubmitAvailable,
                    }
                ]}
            />
        </section>
    );
};

/** Measurement card */
export default connect(
    ({ measurements }: CompositeAppState) => ({ ...measurements }),
    ({ saveCard })
)(MeasurementEditCard);
