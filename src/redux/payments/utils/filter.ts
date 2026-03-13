import { Payment, PaymentFilter } from "@app/models/payments";

import { filterEntities } from "@app/core";

/**
 * Filter payments by specified filter values
 * @param payments All payments
 * @param filterValue Applied filter
 * @returns Filtered payments
 */
export const filterPaymentList = (payments: Array<Payment>, filterValue?: PaymentFilter): Array<Payment> =>
    filterEntities(payments, filterValue);
