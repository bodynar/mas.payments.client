import { createSelector } from "@reduxjs/toolkit";

import { CompositeAppState } from "@app/redux";
import { sort } from "@app/utils";

import { filterPaymentList } from "./utils";

const selectPaymentsState = (state: CompositeAppState) => state.payments;

/** Select payments filtered by current filter */
export const selectFilteredPayments = createSelector(
    [selectPaymentsState],
    ({ payments, lastFilter }) => filterPaymentList(payments, lastFilter)
);

/** Select payments filtered and sorted by current config */
export const selectSortedFilteredPayments = createSelector(
    [selectFilteredPayments, (state: CompositeAppState) => state.payments.paymentSortColumn],
    (filtered, sortColumn) => sortColumn ? sort(filtered, sortColumn) : filtered
);

/** Select payment types filtered by caption and sorted */
export const selectFilteredPaymentTypes = createSelector(
    [selectPaymentsState],
    ({ typesMap, paymentTypeSortColumn, typeFilterCaption }) => {
        let types = [...typesMap.values()];

        if (paymentTypeSortColumn) {
            types = sort(types, paymentTypeSortColumn);
        }

        if (typeFilterCaption) {
            const lowered = typeFilterCaption.toLocaleLowerCase();
            types = types.filter(
                ({ caption }) => caption.toLocaleLowerCase().includes(lowered)
            );
        }

        return types;
    }
);
