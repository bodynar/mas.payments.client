import { isNullish } from "@bodynarf/utils";
import { SelectableItem } from "@bodynarf/react.components";
import { FieldValue } from "@bodynarf/react.components.form";

import { get, post } from "@app/utils";
import { getRequiredFieldValue, groupByYearMonth } from "@app/core";
import { AddPayment, AddPaymentGroup, Payment, PaymentGroup, PaymentResponse, UpdatePayment } from "@app/models/payments";

/**
 * Save payment card with data
 * @param values Form values
 * @param id Possible payment identifier
 * @returns Promise of sending request to API
 */
export const saveCard = (values: Array<FieldValue>, id?: string): Promise<void> => {
    let paymentApiModel: AddPayment | UpdatePayment = {
        amount: +getRequiredFieldValue(values, "amount").value,
        month: +(getRequiredFieldValue(values, "month").value as SelectableItem).value,
        year: +(getRequiredFieldValue(values, "year").value as SelectableItem).value,
        paymentTypeId: (getRequiredFieldValue(values, "type").value as SelectableItem).value,
        description: values.find(({ key }) => key === "description")?.value,
    };

    const isNewRecord = isNullish(id);

    if (!isNewRecord) {
        paymentApiModel = {
            ...paymentApiModel,
            id: id!
        };
    }

    const url = isNewRecord
        ? "api/payment/addPayment"
        : "api/payment/updatePayment";

    return post(url, paymentApiModel);
};

/**
 * Delete specified payment record
 * @param id Payment identifier
 * @returns Promise of sending request to API
 */
export const deleteRecord = (id: string): Promise<void> => {
    return post("api/payment/deletePayment", { id });
};

/**
 * Load all available payment records
 * @returns Promise with array of loaded payments
 */
export const getPaymentRecords = async (): Promise<Array<Payment>> => {
    const payments = await get<Array<PaymentResponse>>(`api/payment/getPayments`);

    return payments.map(x => ({
        id: x.id,
        month: x.dateMonth,
        year: x.dateYear,
        price: x.amount,
        typeId: x.paymentTypeId,
        description: x.description,
        paymentGroupId: x.paymentGroupId ?? undefined,
        paymentFile: x.paymentFile ?? undefined,
    }));
};

/**
 * Group payments by year and month
 * @param payments Payment records
 * @param isAscOrder Sort groups ascendingly by month&year
 * @returns Array of grouped payments
 */
export const groupPayments = (
    payments: Array<Payment>,
    isAscOrder: boolean,
): Array<PaymentGroup> => groupByYearMonth(payments, isAscOrder);

/**
 * Create a payment group
 * @param groupData Payment group data
 * @returns Promise of sending request to API
 */
export const createPaymentGroup = (groupData: AddPaymentGroup): Promise<void> => {
    return post("api/payment/AddGroup", {
        paymentDate: groupData.paymentDate,
        month: groupData.month,
        year: groupData.year,
        comment: groupData.comment,
        payments: groupData.payments.map(({ amount, description, paymentTypeId }) => ({
            amount,
            description,
            paymentTypeId,
        })),
    });
};

/**
 * Validate single payment group item
 * @param item Payment group item to validate
 * @returns Validation error or undefined
 */
export const validatePaymentGroupItem = (
    { paymentTypeId, amount }: { paymentTypeId?: string; amount?: number },
): string | undefined => {
    if (isNullish(paymentTypeId)) {
        return "Type is not selected";
    }
    if (isNullish(amount)) {
        return "Amount is not valid";
    }
    if (amount! <= 0) {
        return "Amount cannot be less or equal to 0";
    }
    return undefined;
};
