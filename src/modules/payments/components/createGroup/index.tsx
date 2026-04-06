import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { generateGuid, isNullOrEmpty, isNullish, isNotNullish } from "@bodynarf/utils";
import { ButtonStyle, ElementSize, SelectableItem } from "@bodynarf/react.components";
import FileUpload from "@bodynarf/react.components/components/file";
import Dropdown from "@bodynarf/react.components/components/dropdown";
import Button from "@bodynarf/react.components/components/button";
import Text from "@bodynarf/react.components/components/primitives/text";
import Table from "@bodynarf/react.components/components/table";

import "./style.scss";

import { LookupDate } from "@app/models";
import { AddPaymentGroup, AddPaymentGroupItem, PaymentGroupTemplate } from "@app/models/payments";
import { getPreviousMonthDate, getMonthName, monthsAsDropdownItems, yearsAsDropdownItems } from "@app/utils";
import { validatePaymentGroupItem } from "@app/core/payment";

import { CompositeAppState } from "@app/redux";
import { saveGroupCard, loadTemplates } from "@app/redux/payments";

import { useValidation } from "@app/hooks";
import ModuleLoader from "@app/sharedComponents/moduleLoader";

import PaymentGroupCardItem from "./item";

interface PaymentGroupCardProps {
    /** Is payment module state initialized */
    initialized: boolean;

    /** Available payment types as dropdown items */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Payment group templates as dropdown items, keyed by id */
    templatesAsDropdownItems: Map<string, SelectableItem>;

    /** Payment group templates indexed by id */
    templatesMap: Map<string, PaymentGroupTemplate>;

    /** Save payment group */
    saveGroupCard: (values: AddPaymentGroup, file?: File) => Promise<boolean | undefined>;

    /** Load templates from server */
    loadTemplates: () => void;
}

interface AddPaymentGroupItemExtended extends AddPaymentGroupItem {
    validationError?: string;
}

const validateItems = (
    items: Array<AddPaymentGroupItemExtended>
): [boolean, Array<AddPaymentGroupItemExtended>] => {
    const validatedItems = items.map(item => ({
        ...item,
        validationError: validatePaymentGroupItem(item),
    }));

    return [
        !validatedItems.some(({ validationError }) => !isNullOrEmpty(validationError)),
        validatedItems,
    ];
};

const PaymentGroupCard: FC<PaymentGroupCardProps> = ({
    initialized, availableTypesAsDropdownItems, templatesAsDropdownItems, templatesMap,
    saveGroupCard, loadTemplates,
}) => {
    const navigate = useNavigate();
    const months = monthsAsDropdownItems();
    const years = yearsAsDropdownItems();
    const prevDate = getPreviousMonthDate();

    useEffect(() => {
        if (initialized && templatesAsDropdownItems.size === 0) {
            loadTemplates();
        }
    }, [initialized, templatesAsDropdownItems.size, loadTemplates]);

    const templateDropdownItems: Array<SelectableItem> = useMemo(
        () => [...templatesAsDropdownItems.values()],
        [templatesAsDropdownItems],
    );

    const [model, setModel] = useState<AddPaymentGroup>({
        payments: [],
        month: prevDate.month,
        year: prevDate.year,
        paymentDate: new Date().toISOString(),
    });
    const [items, setItems] = useState<Array<AddPaymentGroupItemExtended>>([]);
    const [date, setDate] = useState<LookupDate>(() => ({
        month: months.find(x => x.value === String(prevDate.month)),
        year: years.find(x => x.value === String(prevDate.year)),
    }));
    const [comment, setComment] = useState<string | undefined>();
    const [isSubmitAvailable, setIsSubmitAvailable] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<SelectableItem | undefined>();
    const [selectedFile, setSelectedFile] = useState<File | undefined>();

    const { validation, setValidation, invalid, clearField } = useValidation<"year" | "month" | "items">();

    const changeItems = useCallback(
        (newArray: Array<AddPaymentGroupItemExtended>) => setItems(newArray),
        [],
    );

    const onRemoveAllClick = useCallback(() => {
        setSelectedTemplate(undefined);
        changeItems([]);
    }, [changeItems]);

    const onTemplateSelect = useCallback(
        (selected?: SelectableItem) => {
            setSelectedTemplate(selected);

            if (isNullish(selected)) {
                return;
            }

            const template = templatesMap.get(selected!.value);
            if (isNullish(template)) {
                return;
            }

            changeItems(
                template!.paymentTypes.map(pt => ({
                    id: generateGuid(),
                    paymentTypeId: pt.paymentTypeId,
                })),
            );
        },
        [templatesMap, changeItems],
    );

    const onAddPaymentClick = useCallback(
        () => {
            setSelectedTemplate(undefined);
            changeItems([...items, { id: generateGuid() }]);
        },
        [changeItems, items],
    );

    const onAddForAllTypesClick = useCallback(
        () => {
            setSelectedTemplate(undefined);
            changeItems(
                availableTypesAsDropdownItems.map(type => ({
                    id: generateGuid(),
                    paymentTypeId: type.value,
                })),
            );
        },
        [availableTypesAsDropdownItems, changeItems],
    );

    const onChangeItem = useCallback(
        (id: string, newValues: AddPaymentGroupItemExtended) =>
            changeItems(
                items.map(item => item.id === id
                    ? ({ ...item, ...newValues })
                    : item,
                ),
            ),
        [changeItems, items],
    );

    const onDeleteItemClick = useCallback(
        (itemId: string) => {
            setSelectedTemplate(undefined);
            changeItems([...items.filter(({ id }) => id !== itemId)]);
        },
        [items, changeItems],
    );

    const onYearSelect = useCallback(
        (year?: SelectableItem) => {
            clearField("year");
            setDate(date => ({ ...date, year }));
            setModel(x => ({
                ...x,
                year: isNullish(year) ? undefined : +year.value,
            }));
        },
        [clearField],
    );

    const onMonthSelect = useCallback(
        (month?: SelectableItem) => {
            clearField("month");
            setDate(date => ({ ...date, month }));
            setModel(x => ({
                ...x,
                month: isNullish(month) ? undefined : +month.value,
            }));
        },
        [clearField],
    );

    const onCommentChange = useCallback(
        (text?: string) => {
            setComment(text);
            setModel(x => ({ ...x, comment: text }));
        },
        [],
    );

    const onSubmit = useCallback(() => {
        const [isValid, validatedItems] = validateItems(items);

        changeItems(validatedItems);

        if (!isValid) {
            setValidation({ items: invalid("Payment items contain errors. See description below") });
            return;
        }

        if (isNullish(date) || isNullish(date!.year) || isNullish(date!.month)) {
            setValidation({
                year: isNullish(date?.year) ? invalid("Year is required") : undefined,
                month: isNullish(date?.month) ? invalid("Month is required") : undefined,
            });
            return;
        }

        if (validatedItems.length === 0) {
            setValidation({ items: invalid("At least one payment is required") });
            return;
        }

        setIsSubmitAvailable(false);

        saveGroupCard({
            ...model,
            comment,
            paymentDate: new Date(Date.UTC(model.year!, model.month! - 1, 1)).toISOString(),
            payments: validatedItems,
        }, selectedFile)
            .then((result) => {
                if (result) {
                    navigate("/payment");
                } else {
                    setIsSubmitAvailable(true);
                }
            });
    }, [items, date, saveGroupCard, model, comment, changeItems, navigate, selectedFile, setValidation, invalid]);


    if (!initialized) {
        return <ModuleLoader />;
    }

    return (
        <section>
            <h4 className="title is-4">
                {"Payment for "}
                {date?.month ? getMonthName(+date.month.value) : ""}
                {date?.year ? ` ${date.year.value}` : ""}
            </h4>
            <div className="columns m-0">
                <div className="bbr-form__field column is-6">
                    <Dropdown
                        items={years}
                        hideOnOuterClick
                        placeholder="Year"
                        value={date?.year}
                        onSelect={onYearSelect}
                        validationState={validation.year}
                        label={{
                            caption: "Year",
                            horizontal: true,
                            className: "is-required",
                        }}
                    />
                </div>
                <div className="bbr-form__field column is-6">
                    <Dropdown
                        items={months}
                        hideOnOuterClick
                        value={date?.month}
                        placeholder="Month"
                        onSelect={onMonthSelect}
                        validationState={validation.month}
                        label={{
                            caption: "Month",
                            horizontal: true,
                            className: "is-required",
                        }}
                    />
                </div>
            </div>
            <div className="columns m-0">
                <div className="bbr-form__field column is-12">
                    <Text
                        placeholder="Comment"
                        defaultValue={comment}
                        onValueChange={onCommentChange}
                        label={{
                            caption: "Comment",
                            horizontal: true,
                        }}
                    />
                </div>
            </div>
            {isNotNullish(validation.items)
                &&
                <article className="message is-danger">
                    <div className="message-body">
                        {validation.items!.messages![0]}
                    </div>
                </article>
            }
            <div className="columns m-0 mt-2">
                <div className="column is-12">
                    <div className="field">
                        <label className="label">File <span className="has-text-grey is-size-7">(PDF, optional)</span></label>
                        <FileUpload
                            name="groupFile"
                            displayFileName
                            placeholder="Attach file…"
                            accept=".pdf,application/pdf"
                            disabled={!isSubmitAvailable}
                            onValueChange={setSelectedFile}
                            clearSelectionTitle="Clear selection"
                        />
                    </div>
                </div>
            </div>
            <hr />
            {templateDropdownItems.length > 0
                &&
                <div className="columns m-0 mb-4">
                    <div className="bbr-form__field column is-6">
                        <Dropdown
                            deselectable
                            hideOnOuterClick
                            value={selectedTemplate}
                            onSelect={onTemplateSelect}
                            items={templateDropdownItems}
                            placeholder="Select template to pre-fill types"
                            label={{
                                caption: "Template",
                                horizontal: true,
                            }}
                        />
                    </div>
                </div>
            }
            <div className="field is-grouped">
                <p className="control">
                    <Button
                        outlined
                        caption="Add"
                        size={ElementSize.Small}
                        style={ButtonStyle.Primary}
                        onClick={onAddPaymentClick}
                        title="Add new payment record"
                    />
                </p>
                {items.length === 0
                    &&
                    <p className="control">
                        <Button
                            style={ButtonStyle.Info}
                            outlined
                            size={ElementSize.Small}
                            caption="Add for all types"
                            onClick={onAddForAllTypesClick}
                            title="Add payment records for all existed types"
                        />
                    </p>
                }
                {items.length !== 0
                    &&
                    <p className="control">
                        <Button
                            outlined
                            caption="Remove all"
                            title="Remove all lines"
                            size={ElementSize.Small}
                            onClick={onRemoveAllClick}
                            style={ButtonStyle.Danger}
                        />
                    </p>
                }
            </div>
            {items.length > 0
                &&
                <>
                    <Table
                        zebra
                        fullWidth
                        headings={tableHeadings}
                        headerBorderless
                    >
                        {items.map(x =>
                            <PaymentGroupCardItem
                                key={x.id}
                                item={x}
                                deleteItem={onDeleteItemClick}
                                updateItem={onChangeItem}
                                validationError={x.validationError}
                            />,
                        )}
                    </Table>

                    <div className="field is-grouped">
                        <p className="control">
                            <Button
                                caption="Create"
                                onClick={onSubmit}
                                style={ButtonStyle.Primary}
                                title="Create payment group"
                                disabled={!isSubmitAvailable}
                            />
                        </p>
                    </div>
                </>
            }
        </section>
    );
};

export default connect(
    ({ payments: state }: CompositeAppState) => ({
        initialized: state.initialized,
        availableTypesAsDropdownItems: state.availableTypesAsDropdownItems,
        templatesAsDropdownItems: state.templatesAsDropdownItems,
        templatesMap: state.templatesMap,
    }),
    ({
        saveGroupCard,
        loadTemplates,
    }),
)(PaymentGroupCard);

const tableHeadings = [
    { caption: "Type", sortable: false, className: "has-text-centered width--is-15rem is-vertical-align--center" },
    { caption: "Amount", sortable: false, className: "has-text-centered width--is-15rem is-vertical-align--center" },
    { caption: "Description", sortable: false, className: "has-text-centered is-vertical-align--center width--is-25rem" },
    { caption: "", sortable: false, className: "has-text-centered is-vertical-align--center width--is-5rem" },
];
