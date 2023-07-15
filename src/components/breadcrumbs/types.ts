import { ElementIcon } from "@bodynarf/react.components";

/** Breadcrumb item */
export interface BreadCrumb {
    /** Displayed text */
    title: string;

    /** Page address */
    path: string;

    /** Is current page. Will be not clickable */
    active: boolean;

    /** Bootstrap icon class name */
    icon?: ElementIcon;
}
