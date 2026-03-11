import { isNullish, isNotNullish } from "@bodynarf/utils";

import { Payment, PaymentFilter } from "@app/models/payments";

import { filter, FilterValue } from "@app/utils/array";

/**
 * Filter payments by specified filter values
 * @param payments All payments
 * @param filterValue Applied filter
 * @returns Filtered payments
 */
export const filterPaymentList = (payments: Array<Payment>, filterValue?: PaymentFilter): Array<Payment> => {
    if (isNullish(filterValue)) {
        return payments;
    }

    const { month, year, typeId } = filterValue;

    const filters: Array<FilterValue<Payment>> = [];

    if (isNotNullish(month) && !isNaN(month!)) {
        filters.push({
            key: "month",
            value: month
        });
    }

    if (isNotNullish(year) && !isNaN(year!)) {
        filters.push({
            key: "year",
            value: year
        });
    }

    if (isNotNullish(typeId) && !isNaN(typeId!)) {
        filters.push({
            key: "typeId",
            value: typeId
        });
    }

    return filter([...payments], filters);
};
