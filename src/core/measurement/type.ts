import { Color, isNullOrUndefined, rgbToHex } from "@bodynarf/utils";

import { SelectableItem } from "@bodynarf/react.components";
import { FieldValue } from "@bodynarf/react.components.form";

import { get, post } from "@app/utils/delayedApi";
import { AddMeasurementType, MeasurementType, UpdateMeasurementType } from "@app/models/measurements";

/**
 * Save measurement type card with data
 * @param values Form values
 * @param id Possible measurement type identifier
 * @returns Promise of sending request to API
 */
export const saveTypeCard = (values: Array<FieldValue>, id?: string): Promise<void> => {
    let apiRequestModel: AddMeasurementType | UpdateMeasurementType = {
        name: values.find(({ key }) => key === "caption")!.value,
        paymentTypeId: +(values.find(({ key }) => key === "paymentType")!.value as SelectableItem).value,
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
        ? "/api/measurement/addMeasurementType"
        : "/api/measurement/updateMeasurementType";

    return post(url, apiRequestModel);
};

/**
 * Delete specified measurement type
 * @param id Measurement type identifier
 * @returns Promise of sending request to API
 */
export const deleteTypeRecord = (id: number): Promise<void> => {
    return post("/api/measurement/deleteMeasurementType", { id }); // TODO: update API
};

/**
 * Load all available measurement types
 * @returns Promise with array of loaded measurement types
 */
export const getMeasurementTypes = async (): Promise<Array<MeasurementType>> => {
    const items = await get<Array<any>>("api/measurement/getMeasurementTypes");

    return items.map(x => ({
        id: x["id"],
        name: x["systemName"],
        caption: x["name"],
        hasRelatedMeasurements: x["hasRelatedMeasurements"],
        paymentTypeId: x["paymentTypeId"],
        paymentTypeCaption: x["paymentTypeName"],
        paymentTypeColor: x["paymentTypeColor"],

        color: x["color"],
        description: x["description"],
    }) as MeasurementType);
};
