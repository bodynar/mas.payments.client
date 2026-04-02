import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { isNullish, isNullOrEmpty, isNotNullish, getFontColorFromString } from "@bodynarf/utils";
import { ButtonStyle } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Text from "@bodynarf/react.components/components/primitives/text";
import Multiline from "@bodynarf/react.components/components/primitives/multiline";
import CheckBox from "@bodynarf/react.components/components/primitives/checkbox";
import Tag from "@bodynarf/react.components/components/tag";

import { PaymentGroupTemplate, PaymentType, AddPaymentGroupTemplate, UpdatePaymentGroupTemplate } from "@app/models/payments";

import { CompositeAppState } from "@app/redux";
import { loadTemplates, saveTemplate } from "@app/redux/payments";

interface TemplateCardProps {
    /** Is payment module state initialized */
    initialized: boolean;

    /** All templates indexed by id */
    templatesMap: Map<string, PaymentGroupTemplate>;

    /** Payment types indexed by id */
    typesMap: Map<string, PaymentType>;

    /** Save template */
    saveTemplate: (model: AddPaymentGroupTemplate | UpdatePaymentGroupTemplate) => Promise<void>;

    /** Load templates from server */
    loadTemplates: () => void;
}

const TemplateCard: FC<TemplateCardProps> = ({
    initialized, templatesMap, typesMap,
    saveTemplate, loadTemplates,
}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const template = useMemo(() => isNotNullish(id) ? templatesMap.get(id!) : undefined, [templatesMap, id]);
    const allTypes = useMemo(() => [...typesMap.values()], [typesMap]);

    useEffect(() => {
        if (initialized && isNotNullish(id) && templatesMap.size === 0) {
            loadTemplates();
        }
    }, [initialized, id, templatesMap.size, loadTemplates]);

    const [name, setName] = useState<string | undefined>(template?.name);
    const [description, setDescription] = useState<string | undefined>(template?.description);
    const [selectedTypeIds, setSelectedTypeIds] = useState<Set<string>>(
        () => new Set(template?.paymentTypes.map(pt => pt.paymentTypeId) ?? [])
    );
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(true);
    const [validationError, setValidationError] = useState("");

    useEffect(() => {
        if (isNotNullish(template)) {
            setName(template!.name);
            setDescription(template!.description);
            setSelectedTypeIds(new Set(template!.paymentTypes.map(pt => pt.paymentTypeId)));
        }
    }, [template]);

    const onTypeToggle = useCallback(
        (typeId: string) => {
            setSelectedTypeIds(prev => {
                const next = new Set(prev);
                if (next.has(typeId)) {
                    next.delete(typeId);
                } else {
                    next.add(typeId);
                }
                return next;
            });
        },
        [],
    );

    const onSubmit = useCallback(() => {
        if (isNullOrEmpty(name)) {
            setValidationError("Name is required");
            return;
        }

        if (selectedTypeIds.size === 0) {
            setValidationError("At least one payment type must be selected");
            return;
        }

        setValidationError("");
        setIsSubmitAvailable(false);

        const model: AddPaymentGroupTemplate | UpdatePaymentGroupTemplate = isNullish(id)
            ? {
                name: name!,
                description: description ?? "",
                paymentTypeIds: [...selectedTypeIds],
            }
            : {
                id: id!,
                name: name!,
                description: description ?? "",
                paymentTypeIds: [...selectedTypeIds],
            };

        saveTemplate(model)
            .then(() => navigate("/payment/templates", { replace: true }))
            .catch(() => setIsSubmitAvailable(true));
    }, [name, description, selectedTypeIds, id, saveTemplate, navigate]);

    if (!initialized) {
        return <></>;
    }
    if (initialized && isNotNullish(id) && isNullish(template) && templatesMap.size > 0) {
        return <>ERROR: Template not found</>;
    }

    return (
        <section>
            <h4 className="title is-4">
                {isNullish(id) ? "Create new template" : "Edit template"}
            </h4>

            <div className="columns m-0">
                <div className="bbr-form__field column is-12">
                    <Text
                        placeholder="Template name"
                        onValueChange={setName}
                        defaultValue={name}
                        label={{
                            caption: "Name",
                            horizontal: true,
                            className: "is-required",
                        }}
                    />
                </div>
            </div>
            <div className="columns m-0">
                <div className="bbr-form__field column is-12">
                    <Multiline
                        placeholder="Description"
                        onValueChange={setDescription}
                        defaultValue={description}
                        label={{
                            caption: "Description",
                            horizontal: true,
                        }}
                    />
                </div>
            </div>

            {!isNullOrEmpty(validationError)
                &&
                <article className="message is-danger">
                    <div className="message-body">
                        {validationError}
                    </div>
                </article>
            }

            <hr />
            <h5 className="title is-5">Payment types ({selectedTypeIds.size} selected)</h5>

            <div className="columns is-multiline m-0">
                {allTypes.map(type => (
                    <div key={type.id} className="column is-4">
                        <div className="is-flex is-align-items-center gap-2">
                            <CheckBox
                                defaultValue={selectedTypeIds.has(type.id)}
                                onValueChange={() => onTypeToggle(type.id)}
                                label={{
                                    horizontal: true,
                                    caption: "",
                                }}
                            />
                            <Tag
                                content={type.caption}
                                customColor={isNullish(type.color) ? undefined : {
                                    color: getFontColorFromString(type.color!),
                                    backgroundColor: type.color!,
                                }}
                            />
                            {isNotNullish(type.company) &&
                                <span className="has-text-grey is-size-7">({type.company})</span>
                            }
                        </div>
                    </div>
                ))}
            </div>

            <hr />
            <div className="field is-grouped">
                <p className="control">
                    <Button
                        style={ButtonStyle.Success}
                        caption="Save"
                        onClick={onSubmit}
                        disabled={!isSubmitAvailable}
                    />
                </p>
            </div>
        </section>
    );
};

/** Template card */
export default connect(
    ({ payments }: CompositeAppState) => ({
        initialized: payments.initialized,
        templatesMap: payments.templatesMap,
        typesMap: payments.typesMap,
    }),
    ({
        saveTemplate,
        loadTemplates,
    })
)(TemplateCard);
