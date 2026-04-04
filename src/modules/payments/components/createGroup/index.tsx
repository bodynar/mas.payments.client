import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { generateGuid, isNullOrEmpty, isNullish } from "@bodynarf/utils";
import { ButtonStyle, ElementSize, SelectableItem } from "@bodynarf/react.components";
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
    saveGroupCard: (values: AddPaymentGroup) => Promise<boolean | undefined>;

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
    const [validationError, setValidationError] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<SelectableItem | undefined>();

    const changeItems = useCallback(
        (newArray: Array<AddPaymentGroupItemExtended>) => setItems(newArray),
        [],
    );

    const onRemoveAllClick = useCallback(() => changeItems([]), [changeItems]);

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
        () => changeItems([...items, { id: generateGuid() }]),
        [changeItems, items],
    );

    const onAddForAllTypesClick = useCallback(
        () => {
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
        (itemId: string) => changeItems([...items.filter(({ id }) => id !== itemId)]),
        [items, changeItems],
    );

    const onYearSelect = useCallback(
        (year?: SelectableItem) => {
            setDate(date => ({ ...date, year }));
            setModel(x => ({
                ...x,
                year: isNullish(year) ? undefined : +year!.value,
            }));
        },
        [],
    );

    const onMonthSelect = useCallback(
        (month?: SelectableItem) => {
            setDate(date => ({ ...date, month }));
            setModel(x => ({
                ...x,
                month: isNullish(month) ? undefined : +month!.value,
            }));
        },
        [],
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
            setValidationError("Payment items contain errors. See description below");
            return;
        }

        if (isNullish(date) || isNullish(date!.year) || isNullish(date!.month)) {
            setValidationError("Date is not set");
            return;
        }

        if (validatedItems.length === 0) {
            setValidationError("At least one payment is required");
            return;
        }

        setValidationError("");
        setIsSubmitAvailable(false);

        saveGroupCard({
            ...model,
            comment,
            paymentDate: new Date(Date.UTC(model.year!, model.month! - 1, 1)).toISOString(),
            payments: validatedItems,
        })
            .then((result) => {
                if (result) {
                    navigate("/payment", { replace: true });
                } else {
                    setIsSubmitAvailable(true);
                }
            });
    }, [items, date, saveGroupCard, model, comment, changeItems, navigate]);

    if (!initialized) {
        return <></>;
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
                        value={date?.year}
                        placeholder="Year"
                        hideOnOuterClick
                        onSelect={onYearSelect}
                        items={years}
                        label={{
                            caption: "Year",
                            horizontal: true,
                            className: "is-required",
                        }}
                    />
                </div>
                <div className="bbr-form__field column is-6">
                    <Dropdown
                        value={date?.month}
                        placeholder="Month"
                        hideOnOuterClick
                        onSelect={onMonthSelect}
                        items={months}
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
                        onValueChange={onCommentChange}
                        defaultValue={comment}
                        label={{
                            caption: "Comment",
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
            {templateDropdownItems.length > 0
                &&
                <div className="columns m-0 mb-4">
                    <div className="bbr-form__field column is-6">
                        <Dropdown
                            placeholder="Select template to pre-fill types"
                            hideOnOuterClick
                            deselectable
                            value={selectedTemplate}
                            onSelect={onTemplateSelect}
                            items={templateDropdownItems}
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
                            style={ButtonStyle.Danger}
                            outlined
                            size={ElementSize.Small}
                            caption="Remove all"
                            onClick={onRemoveAllClick}
                            title="Remove all lines"
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
                                style={ButtonStyle.Primary}
                                caption="Create"
                                onClick={onSubmit}
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
