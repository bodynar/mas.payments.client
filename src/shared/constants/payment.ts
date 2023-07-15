import { Payment } from "@app/models/payments";

import { TableHeading } from "@app/sharedComponents/table";

/**
 * Pre-defined group view list table headings
 */
export const groupedViewTableHeadings: Array<TableHeading<Payment>> = [
    { name: "typeId", caption: "Type", sortable: true, className: "has-text-centered th-color--light-blue width--is-10rem is-vertical-align--center" },
    { name: "price", caption: "Price", sortable: true, className: "has-text-centered th-color--light-blue width--is-725rem is-vertical-align--center" },
    { caption: "Description", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center" },
    { caption: "Actions", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center width--is-15rem" },
];

/**
 * Pre-defined flat list table headings
 */
export const flatListTableHeadings: Array<TableHeading<Payment>> = [
    { name: "month", caption: "Month", sortable: true, className: "has-text-centered th-color--light-blue width--is-725rem is-vertical-align--center" },
    { name: "year", caption: "Year", sortable: true, className: "has-text-centered th-color--light-blue width--is-5rem is-vertical-align--center" },
    ...groupedViewTableHeadings,
];
