import { Color, isNullOrUndefined, rgbToHex } from "@bodynarf/utils";

import { FieldValue } from "@bodynarf/react.components.form";

import { AddPaymentType, PaymentType, UpdatePaymentType } from "@app/models/payments";
import { get, post } from "@app/utils/delayedApi";

/**
 * Save payment type card with data
 * @param values Form values
 * @param id Possible payment type identifier
 * @returns Promise of sending request to API
 */
export const saveTypeCard = (values: Array<FieldValue>, id?: string): Promise<void> => {
    let apiRequestModel: AddPaymentType | UpdatePaymentType = {
        name: values.find(({ key }) => key === "caption")!.value,
        company: values.find(({ key }) => key === "provider")?.value,
        description: values.find(({ key }) => key === "description")?.value,
    };

    const color = values.find(({ key }) => key === "color");

    if (!isNullOrUndefined(color)) {
        apiRequestModel.color = rgbToHex(color!.value as Color);
    }

    const isNewRecord = isNullOrUndefined(id);

    if (!isNewRecord) {
        apiRequestModel = {
            ...apiRequestModel,
            id: +id!
        };
    }

    const url = isNewRecord
        ? "/api/payment/addPaymentType"
        : "/api/payment/updatePaymentType";

    return post(url, apiRequestModel);
};

/**
 * Delete specified payment type
 * @param id Payment type identifier
 * @returns Promise of sending request to API
 */
export const deleteTypeRecord = (id: number): Promise<void> => {
    return post("/api/payment/deletePaymentType", { id });
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
