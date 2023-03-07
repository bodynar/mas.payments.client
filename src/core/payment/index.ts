import { isNullOrUndefined } from "@bodynarf/utils";

import { SelectableItem } from "@bodynarf/react.components";

import { FieldValue } from "@bodynarf/react.components.form";

import { AddPayment, Payment, PaymentType, UpdatePayment } from "@app/models/payments";
import { get, post } from "@app/utils/delayedApi";

/**
 * Save payment card with data
 * @param values Form values
 * @param id Possible payment identifier
 * @returns Promise of sending request to API
 */
export const saveCard = (values: Array<FieldValue>, id?: string): Promise<void> => {
    let paymentApiModel: AddPayment | UpdatePayment = {
        amount: +values.find(({ key }) => key === "amount")!.value,
        description: values.find(({ key }) => key === "description")!.value,
        month: +(values.find(({ key }) => key === "month")!.value as SelectableItem).value,
        year: +(values.find(({ key }) => key === "year")!.value as SelectableItem).value,
        paymentTypeId: +(values.find(({ key }) => key === "type")!.value as SelectableItem).value,
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
 * Load all available payment types
 * @returns Promise with array of loaded payment types
 */
export const getPaymentTypes = async (): Promise<Array<PaymentType>> => {
    const types = await get<Array<any>>(`api/payment/getPaymentTypes`);

    return types.map(x => ({
        id: x["id"],
        name: x["systemName"],
        caption: x["name"],
        hasRelatedMeasurementTypes: x["hasRelatedMeasurementTypes"],
        hasRelatedPayments: x["hasRelatedPayments"],

        color: x["color"],
        company: x["company"],
        description: x["description"],
    }) as PaymentType);
};
