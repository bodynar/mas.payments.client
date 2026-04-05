import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { isNullish, isNullOrEmpty, isNotNullish, getFontColorFromString } from "@bodynarf/utils";
import { ButtonStyle, ElementPosition, ElementSize } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Text from "@bodynarf/react.components/components/primitives/text";
import Multiline from "@bodynarf/react.components/components/primitives/multiline";
import Tag from "@bodynarf/react.components/components/tag";
import Multiselect, { MultiselectItem } from "@bodynarf/react.components/components/multiselect";

import { PaymentGroupTemplate, PaymentType, AddPaymentGroupTemplate, UpdatePaymentGroupTemplate } from "@app/models/payments";

import { CompositeAppState } from "@app/redux";
import { loadTemplates, saveTemplate } from "@app/redux/payments";

import ModuleLoader from "@app/sharedComponents/moduleLoader";

interface TemplateCardProps {
    /** Is payment module state initialized */
    initialized: boolean;

    /** Whether templates have been loaded from the server */
    templatesLoaded: boolean;

    /** All templates indexed by id */
    templatesMap: Map<string, PaymentGroupTemplate>;

    /** Payment types indexed by id */
    typesMap: Map<string, PaymentType>;

    /** Save template */
    saveTemplate: (model: AddPaymentGroupTemplate | UpdatePaymentGroupTemplate) => Promise<boolean | undefined>;

    /** Load templates from server */
    loadTemplates: () => void;
}

interface TemplateFormProps {
    /** Template id when editing; undefined when creating */
    id: string | undefined;

    /** Template being edited; undefined when creating */
    template: PaymentGroupTemplate | undefined;

    /** All payment types */
    allTypes: PaymentType[];

    /** Save template */
    saveTemplate: (model: AddPaymentGroupTemplate | UpdatePaymentGroupTemplate) => Promise<boolean | undefined>;

    /** Navigate callback */
    navigate: (path: string) => void;
}

const TemplateForm: FC<TemplateFormProps> = ({ id, template, allTypes, saveTemplate, navigate }) => {
    const [name, setName] = useState<string | undefined>(template?.name);
    const [description, setDescription] = useState<string | undefined>(template?.description);
    const [selectedTypeIds, setSelectedTypeIds] = useState<Set<string>>(
        () => new Set(template?.paymentTypes.map(pt => pt.paymentTypeId) ?? [])
    );
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(true);
    const [validationError, setValidationError] = useState("");

    const onTypeChange = useCallback(
        (item: MultiselectItem, selected: boolean) => {
            setSelectedTypeIds(prev => {
                const next = new Set(prev);
                if (selected) {
                    next.add(item.id);
                } else {
                    next.delete(item.id);
                }
                return next;
            });
        },
        [],
    );

    const onTypesClear = useCallback(() => setSelectedTypeIds(new Set()), []);

    const multiselectItems = useMemo<Array<MultiselectItem>>(
        () => allTypes.map(type => ({
            id: type.id,
            value: type.caption,
            displayValue: type.caption,
            selected: selectedTypeIds.has(type.id),
        })),
        [allTypes, selectedTypeIds],
    );

    const selectedTypes = useMemo(
        () => allTypes.filter(t => selectedTypeIds.has(t.id)),
        [allTypes, selectedTypeIds],
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

        saveTemplate(model).then((result) => {
            if (result) {
                navigate("/payment/templates");
            } else {
                setIsSubmitAvailable(true);
            }
        });
    }, [name, description, selectedTypeIds, id, saveTemplate, navigate]);

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
            <div className="columns m-0">
                <div className="bbr-form__field column is-12">
                    <Multiselect
                        hideOnOuterClick
                        onClear={onTypesClear}
                        onChange={onTypeChange}
                        items={multiselectItems}
                        placeholder="Select payment types"
                        searchable
                        label={{
                            caption: "Payment types",
                            horizontal: true,
                        }}
                    />
                </div>
            </div>

            {selectedTypes.length > 0 &&
                <div className="columns m-0">
                    <div className="column is-12">
                        <div className="is-flex is-flex-wrap-wrap" style={{ gap: "0.5rem", pointerEvents: "none" }}>
                            {selectedTypes.map(type => (
                                <Tag
                                    key={type.id}
                                    content={type.caption}
                                    customColor={isNullish(type.color) ? undefined : {
                                        color: getFontColorFromString(type.color!),
                                        backgroundColor: type.color!,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            }

            <hr />
            <div className="field is-grouped">
                <p className="control">
                    <Button
                        caption="Save"
                        onClick={onSubmit}
                        style={ButtonStyle.Success}
                        disabled={!isSubmitAvailable}
                    />
                </p>
            </div>
        </section>
    );
};

const TemplateCard: FC<TemplateCardProps> = ({
    initialized, templatesLoaded, templatesMap, typesMap,
    saveTemplate, loadTemplates,
}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const template = useMemo(() => isNotNullish(id) ? templatesMap.get(id!) : undefined, [templatesMap, id]);
    const allTypes = useMemo(() => [...typesMap.values()], [typesMap]);

    useEffect(() => {
        if (initialized && isNotNullish(id) && !templatesLoaded) {
            loadTemplates();
        }
    }, [initialized, id, templatesLoaded, loadTemplates]);

    if (!initialized) {
        return <ModuleLoader />;
    }

    if (isNotNullish(id) && !templatesLoaded) {
        return (
            <p className="subtitle has-text-centered is-italic mt-4 has-text-grey">
                Loading...
            </p>
        );
    }

    if (isNotNullish(id) && isNullish(template)) {
        return (
            <article className="message is-danger">
                <div className="message-header">
                    <p>Template not found</p>
                </div>
                <div className="message-body">
                    <p className="mb-4">The requested template does not exist or has been deleted.</p>
                    <Button
                        style={ButtonStyle.Danger}
                        outlined
                        caption="Back to list"
                        onClick={() => navigate("/payment/templates")}
                        icon={{ name: "arrow-left", size: ElementSize.Medium, position: ElementPosition.Left }}
                    />
                </div>
            </article>
        );
    }

    return (
        <TemplateForm
            key={id ?? "new"}
            id={id}
            template={template}
            allTypes={allTypes}
            saveTemplate={saveTemplate}
            navigate={navigate}
        />
    );
};

/** Template card */
export default connect(
    ({ payments }: CompositeAppState) => ({
        initialized: payments.initialized,
        templatesLoaded: payments.templatesLoaded,
        templatesMap: payments.templatesMap,
        typesMap: payments.typesMap,
    }),
    ({
        saveTemplate,
        loadTemplates,
    })
)(TemplateCard);
