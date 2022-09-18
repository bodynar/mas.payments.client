import { isNullOrUndefined } from "@bodynarf/utils";

import { Payment, PaymentFilter } from "@app/models/payments";

/**
 * Filter payments by specified filter values
 * @param payments All payments
 * @param filterValue Applied filter
 * @returns Filtered payments
 */
export const filter = (payments: Array<Payment>, filterValue?: PaymentFilter): Array<Payment> => {
    let result = [...payments];

    if (isNullOrUndefined(filterValue)) {
        return result;
    }

    const { month, year, typeId } = filterValue!;

    if (!isNullOrUndefined(month) && !isNaN(month!)) {
        result = result.filter(p => p.month === month!);
    }

    if (!isNullOrUndefined(year) && !isNaN(year!)) {
        result = result.filter(p => p.year === year!);
    }

    if (!isNullOrUndefined(typeId) && !isNaN(typeId!)) {
        result = result.filter(p => p.typeId === typeId!);
    }

    return result;
};
