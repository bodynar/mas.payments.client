import { get, post } from "@app/utils";
import {
    AddPaymentGroupTemplate,
    PaymentGroupTemplate,
    UpdatePaymentGroupTemplate,
} from "@app/models/payments";

/**
 * Load all payment group templates
 * @returns Promise with array of templates
 */
export const getTemplates = async (): Promise<Array<PaymentGroupTemplate>> => {
    return get<Array<PaymentGroupTemplate>>("api/paymentGroupTemplate/GetAll");
};

/**
 * Load a single payment group template by id
 * @param id Template identifier
 * @returns Promise with template
 */
export const getTemplate = async (id: string): Promise<PaymentGroupTemplate> => {
    return get<PaymentGroupTemplate>(`api/paymentGroupTemplate/Get?id=${encodeURIComponent(id)}`);
};

/**
 * Create a new payment group template
 * @param model Template data
 * @returns Promise of sending request to API
 */
export const addTemplate = (model: AddPaymentGroupTemplate): Promise<void> => {
    return post("api/paymentGroupTemplate/Add", model);
};

/**
 * Update an existing payment group template
 * @param model Template data with id
 * @returns Promise of sending request to API
 */
export const updateTemplate = (model: UpdatePaymentGroupTemplate): Promise<void> => {
    return post("api/paymentGroupTemplate/Update", model);
};

/**
 * Delete a payment group template
 * @param id Template identifier
 * @returns Promise of sending request to API
 */
export const deleteTemplate = (id: string): Promise<void> => {
    return post("api/paymentGroupTemplate/Delete", { id });
};
