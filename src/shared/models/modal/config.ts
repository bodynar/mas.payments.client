import { ModalFormItem } from "./";

/** Modal form configuration */
export interface ModalFormConfiguration {
    /** Form fields configuration */
    fields: Array<ModalFormItem>;

    /** Optional caption. Will be shown if provided */
    caption?: string;
}
