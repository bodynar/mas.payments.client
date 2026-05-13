import { FC, useCallback, useEffect, useId, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { isNullish, isNotNullish } from "@bodynarf/utils";

import { ButtonStyle, SelectableItem } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Dropdown from "@bodynarf/react.components/components/dropdown";
import FileUpload from "@bodynarf/react.components/components/file";
import Number from "@bodynarf/react.components/components/primitives/number";
import Multiline from "@bodynarf/react.components/components/primitives/multiline";

import { getDropdownItem } from "@app/core";
import { Payment, SavePaymentData } from "@app/models/payments";
import { getDateOrPreviousMonthLookup, getMonthName, monthsAsDropdownItems, yearsAsDropdownItems } from "@app/utils";

import { CompositeAppState } from "@app/redux";
import { deletePaymentFile, saveCard } from "@app/redux/payments";

import { useValidation } from "@app/hooks";
import ModuleLoader from "@app/sharedComponents/moduleLoader";

/** Payment card props types */
interface PaymentCardProps {
    /** All payments */
    payments: Array<Payment>;

    /** Is payment module state initialized */
    initialized: boolean;

    /** Payment types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Save current card values */
    saveCard: (data: SavePaymentData, id?: string, file?: File) => Promise<boolean | undefined>;

    /** Delete the attached payment file by its id */
    deletePaymentFile: (fileId: string, fileName: string) => void;
}

const PaymentCard: FC<PaymentCardProps> = ({
    payments, initialized, availableTypesAsDropdownItems,
    saveCard, deletePaymentFile,
}) => {
    const { id } = useParams();

    const formId = useId();
    const navigate = useNavigate();

    const months = useMemo(() => monthsAsDropdownItems(), []);
    const years = useMemo(() => yearsAsDropdownItems(), []);

    const payment = useMemo(() => payments.find(x => x.id === id), [payments, id]);

    const defaultType = useMemo(
        () => getDropdownItem(availableTypesAsDropdownItems, payment?.typeId),
        [payment?.typeId, availableTypesAsDropdownItems],
    );
    const { year: defaultYear, month: defaultMonth } = useMemo(
        () => getDateOrPreviousMonthLookup(payment),
        [payment],
    );

    const [selectedType, setSelectedType] = useState<SelectableItem | undefined>(defaultType);
    const [selectedMonth, setSelectedMonth] = useState<SelectableItem | undefined>(defaultMonth);
    const [selectedYear, setSelectedYear] = useState<SelectableItem | undefined>(defaultYear);
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | undefined>();

    const { validation, setValidation, invalid, clearField } = useValidation<"amount" | "type" | "month" | "year">();

    // Sync controlled dropdown values once module data becomes available
    useEffect(() => {
        if (!initialized) return;
        setSelectedType(defaultType);
        setSelectedMonth(defaultMonth);
        setSelectedYear(defaultYear);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time sync from Redux after module initializes
    }, [initialized]);

    const onAmountChange = useCallback((value?: number) => {
        setAmount(value);
        clearField("amount");
    }, [clearField]);

    const onTypeSelect = useCallback((value?: SelectableItem) => {
        setSelectedType(value);
        clearField("type");
    }, [clearField]);

    const onMonthSelect = useCallback((value?: SelectableItem) => {
        setSelectedMonth(value);
        clearField("month");
    }, [clearField]);

    const onYearSelect = useCallback((value?: SelectableItem) => {
        setSelectedYear(value);
        clearField("year");
    }, [clearField]);

    const onDescriptionChange = useCallback((value: string) => setDescription(value), []);

    const onSubmit = useCallback(() => {
        // For uncontrolled inputs: fall back to original payment value if user hasn't changed them
        const submitAmount = amount ?? payment?.price;

        const nextValidation: typeof validation = {};

        if (isNullish(submitAmount) || submitAmount <= 0) {
            nextValidation.amount = invalid("Amount is required and must be greater than 0");
        }
        if (isNullish(selectedType)) {
            nextValidation.type = invalid("Payment type is required");
        }
        if (isNullish(selectedMonth)) {
            nextValidation.month = invalid("Month is required");
        }
        if (isNullish(selectedYear)) {
            nextValidation.year = invalid("Year is required");
        }

        if (Object.keys(nextValidation).length > 0) {
            setValidation(nextValidation);
            return;
        }

        setIsSubmitting(true);

        saveCard(
            {
                amount: submitAmount!,
                month: +selectedMonth!.value,
                year: +selectedYear!.value,
                paymentTypeId: selectedType!.value,
                description: description ?? payment?.description,
            },
            id,
            selectedFile,
        ).then((result) => {
            if (result) {
                navigate("/payment");
            } else {
                setIsSubmitting(false);
            }
        });
    }, [amount, selectedType, selectedMonth, selectedYear, description, selectedFile, payment, id, saveCard, navigate, invalid, setValidation]);

    if (!initialized) {
        return <ModuleLoader />;
    }
    if (isNotNullish(id) && isNullish(payment)) {
        return <>ERROR: Payment not found</>;
    }

    const caption = isNullish(payment)
        ? `Payment for ${selectedMonth?.displayValue ?? "?"} ${selectedYear?.displayValue ?? "?"}`
        : `Edit payment for ${getMonthName(payment!.month)} ${payment!.year}`;

    return (
        <section>
            <h4 className="title is-4">{caption}</h4>
            <div className="columns m-0">
                <div className="bbr-form__field column is-12">
                    <Number
                        step={0.01}
                        disabled={isSubmitting}
                        name={`${formId}-amount`}
                        defaultValue={payment?.price}
                        onValueChange={onAmountChange}
                        validationState={validation.amount}
                        label={{ caption: "Amount", horizontal: true, className: "is-required" }}
                    />
                </div>
            </div>
            <div className="columns m-0">
                <div className="bbr-form__field column is-12">
                    <Dropdown
                        hideOnOuterClick
                        value={selectedType}
                        onSelect={onTypeSelect}
                        disabled={isSubmitting}
                        placeholder="Select type"
                        validationState={validation.type}
                        items={availableTypesAsDropdownItems}
                        label={{ caption: "Type", horizontal: true, className: "is-required" }}
                    />
                </div>
            </div>
            <div className="columns m-0">
                <div className="bbr-form__field column is-6">
                    <Dropdown
                        items={months}
                        hideOnOuterClick
                        placeholder="Month"
                        value={selectedMonth}
                        disabled={isSubmitting}
                        onSelect={onMonthSelect}
                        validationState={validation.month}
                        label={{ caption: "Month", horizontal: true, className: "is-required" }}
                    />
                </div>
                <div className="bbr-form__field column is-6">
                    <Dropdown
                        items={years}
                        hideOnOuterClick
                        placeholder="Year"
                        value={selectedYear}
                        onSelect={onYearSelect}
                        disabled={isSubmitting}
                        validationState={validation.year}
                        label={{ caption: "Year", horizontal: true, className: "is-required" }}
                    />
                </div>
            </div>
            <div className="columns m-0">
                <div className="bbr-form__field column is-12">
                    <Multiline
                        fixed
                        rows={3}
                        disabled={isSubmitting}
                        name={`${formId}-description`}
                        onValueChange={onDescriptionChange}
                        defaultValue={payment?.description ?? ""}
                        label={{ caption: "Description", horizontal: true }}
                    />
                </div>
            </div>
            <div className="box mt-4">
                <p className="subtitle is-6 mb-3">Attached file</p>
                {isNotNullish(payment?.paymentFile) &&
                    <div className="field is-grouped is-align-items-center mb-3">
                        <span className="icon-text mr-3">
                            <span className="icon"><i className="bi bi-file-earmark-pdf" /></span>
                            <span>{payment!.paymentFile!.fileName}</span>
                        </span>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            className="button is-small is-info is-light mr-2"
                            href={`/api/paymentFile/ViewFile?id=${payment!.paymentFile!.id}`}
                        >
                            View
                        </a>
                        <a
                            className="button is-small is-light mr-2"
                            href={`/api/paymentFile/GetFile?id=${payment!.paymentFile!.id}`}
                        >
                            Download
                        </a>
                        <button
                            className="button is-small is-danger is-light"
                            disabled={isSubmitting}
                            onClick={() => deletePaymentFile(payment!.paymentFile!.id, payment!.paymentFile!.fileName)}
                        >
                            Delete
                        </button>
                    </div>
                }
                <FileUpload
                    displayFileName
                    name="paymentFile"
                    disabled={isSubmitting}
                    accept=".pdf,application/pdf"
                    onValueChange={setSelectedFile}
                    clearSelectionTitle="Clear selection"
                    placeholder={isNotNullish(payment?.paymentFile) ? "Replace file…" : "Attach file…"}
                />
            </div>

            <div className="field is-grouped mt-4">
                <p className="control">
                    <Button
                        caption="Save"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        style={ButtonStyle.Success}
                    />
                </p>
            </div>
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
    ({ saveCard, deletePaymentFile })
)(PaymentCard);

