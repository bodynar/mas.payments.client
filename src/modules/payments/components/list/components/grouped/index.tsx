import { useMemo } from "react";
import { connect } from "react-redux";

import { isNullOrUndefined } from "@bodynarf/utils";
import { usePagination } from "@bodynarf/react.components";
import Paginator from "@bodynarf/react.components/components/paginator";

import { deleteRecord, groupPayments } from "@app/core/payment";
import { Payment, PaymentFilter, PaymentGroup } from "@app/models/payments";

import { CompositeAppState } from "@app/redux/types";

import PaymentGroupItem from "./groupItem";

/** Payment list props type */
interface PaymentGroupedViewProps {
    /** Is groups sorted ascendingly */
    isAscOrder: boolean;

    /** Is module state initialized */
    initialized: boolean;

    /** Items that was filtered by last filter */
    filteredItems: Array<Payment>;

    /** Last applied filter */
    lastFilter?: PaymentFilter;

    /** Delete specified payment */
    deletePayment: (id: number) => void;
}

const PaymentGroupedView = ({
    isAscOrder, filteredItems, initialized,
    lastFilter,
    deletePayment,
}: PaymentGroupedViewProps): JSX.Element => {
    const groupedItems = useMemo(() => groupPayments(filteredItems, isAscOrder), [filteredItems, isAscOrder]);

    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(groupedItems.length, 10, 1, [groupedItems]);
    const pageItems: Array<PaymentGroup> = useMemo(() => paginate(groupedItems), [paginate, groupedItems]);

    return (
        <section>
            {pageItems.length > 0
                &&
                <section>
                    {pageItems.map(x =>
                        <PaymentGroupItem
                            key={x.caption}
                            item={x}
                            deletePayment={deletePayment}
                        />
                    )}
                    <Paginator
                        count={pagesCount}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                    />
                </section>
            }
            {initialized && pageItems.length === 0
                &&
                <p className="subtitle has-text-centered is-italic mt-4 has-text-grey-dark has-wrap-text">
                    {isNullOrUndefined(lastFilter)
                        ? `No payments were loaded\r\nTry refreshing page`
                        : "No payments were found by specified filter"
                    }
                </p>
            }
        </section>
    );
};

/** Payments grouped list */
export default connect(
    ({ payments }: CompositeAppState) => ({
        initialized: payments.initialized,
        filteredItems: payments.filteredItems,
        lastFilter: payments.lastFilter,
    }),
    ({
        deletePayment: deleteRecord,
    })
)(PaymentGroupedView);
