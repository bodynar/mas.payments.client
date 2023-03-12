import { isNullOrUndefined } from "@bodynarf/utils";
import { SelectableItem } from "@bodynarf/react.components";
import { FieldValue } from "@bodynarf/react.components.form";

import { getMonthName } from "@app/constants";
import { get, post } from "@app/utils";
import { AddPayment, Payment, PaymentGroup, UpdatePayment } from "@app/models/payments";

/**
 * Save payment card with data
 * @param values Form values
 * @param id Possible payment identifier
 * @returns Promise of sending request to API
 */
export const saveCard = (values: Array<FieldValue>, id?: string): Promise<void> => {
    let paymentApiModel: AddPayment | UpdatePayment = {
        amount: +values.find(({ key }) => key === "amount")!.value,
        month: +(values.find(({ key }) => key === "month")!.value as SelectableItem).value,
        year: +(values.find(({ key }) => key === "year")!.value as SelectableItem).value,
        paymentTypeId: +(values.find(({ key }) => key === "type")!.value as SelectableItem).value,
        description: values.find(({ key }) => key === "description")?.value,
    };

    const isNewRecord = isNullOrUndefined(id);

    if (!isNewRecord) {
        paymentApiModel = {
            ...paymentApiModel,
            id: +id!
        };
    }

    const url = isNewRecord
        ? "/api/payment/addPayment"
        : "/api/payment/updatePayment";

    return post(url, paymentApiModel);
};

/**
 * Delete specified payment record
 * @param id Payment identifier
 * @returns Promise of sending request to API
 */
export const deleteRecord = (id: number): Promise<void> => {
    return post("/api/payment/deletePayment", { id });
};

/**
 * Load all available payment records
 * @returns Promise with array of loaded payments
 */
export const getPaymentRecords = async (): Promise<Array<Payment>> => {
    const payments = await get<Array<any>>(`api/payment/getPayments`);

    return payments.map(x => ({
        id: x["id"],
        month: x["dateMonth"],
        year: x["dateYear"],
        price: x["amount"],
        typeId: x["paymentTypeId"],
        typeCaption: x["paymentTypeName"],
        typeColor: x["paymentTypeColor"],
        description: x["description"],
    }) as Payment);
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
): Array<PaymentGroup> => {
    let result: Array<PaymentGroup> = [];

    payments.forEach(payment => {
        const group = result.find(({ year, month }) => year === payment.year && month === payment.month);

        if (isNullOrUndefined(group)) {
            result.push({
                caption: `${payment.year} ${getMonthName(payment.month)}`,
                month: payment.month,
                year: payment.year,
                items: [payment],
            });
        } else {
            group!.items = [...group!.items, payment].sort((left, right) => left.month - right.month);
        }
    });

    result = result.sort((left, right) => {
        if (left.year === right.year) {
            return (left.month - right.month) * (isAscOrder ? -1 : 1);
        }

        return (left.year - right.year) * (isAscOrder ? -1 : 1);
    });

    return result;
};
