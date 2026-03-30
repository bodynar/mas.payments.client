import { FC, useCallback, useMemo } from "react";
import { connect } from "react-redux";

import { isNullish } from "@bodynarf/utils";
import { SelectableItem, usePagination } from "@bodynarf/react.components";
import Paginator from "@bodynarf/react.components/components/paginator";

import { flatListTableHeadings } from "@app/static/payment";
import { Payment, PaymentFilter, PaymentType } from "@app/models/payments";
import { SortColumn } from "@app/models";

import { CompositeAppState } from "@app/redux/types";
import { deleteRecord, setFilterValue, setSortColumn, setCurrentPage } from "@app/redux/payments";

import { getDropdownItem } from "@app/core";
import { useSortColumn } from "@app/hooks";
import Table from "@bodynarf/react.components/components/table";

import PaymentListItem from "./listItem";

/** Payment flat list props type */
interface PaymentFlatListProps {
    /** Is module state initialized */
    initialized: boolean;

    /** Items that was filtered by last filter */
    filteredItems: Array<Payment>;

    /** Payment types map */
    typesMap: Map<string, PaymentType>;

    /** Payment types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Last applied filter */
    lastFilter?: PaymentFilter;

    /** Current sort column config */
    sortColumn?: SortColumn<Payment>;

    /** Save sort column config */
    setSortColumn: (sortColumn: SortColumn<Payment>) => void;

    /** Delete specified payment */
    deletePayment: (id: string) => void;

    /** Update current filter value */
    setFilterValue: (filterValue: PaymentFilter, applyFilter: boolean) => void;

    /** Save current payment type filter value */
    setType: (selectedType: SelectableItem) => void;

    /** Last visited page number */
    lastPage?: number;

    /** Save current page to Redux */
    setCurrentPage: (page: number) => void;
}

const PaymentFlatList: FC<PaymentFlatListProps> = ({
    filteredItems, sortColumn, initialized, typesMap,
    lastFilter, availableTypesAsDropdownItems, setType, setFilterValue,
    setSortColumn, deletePayment, lastPage, setCurrentPage,
}) => {
    const onHeaderCellClick = useSortColumn(setSortColumn, sortColumn);

    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(filteredItems.length, 20, lastPage ?? 1, [filteredItems]);
    const pageItems: Array<Payment> = useMemo(() => paginate(filteredItems) as Array<Payment>, [paginate, filteredItems]);

    const handlePageChange = useCallback((page: number) => {
        onPageChange(page);
        setCurrentPage(page);
    }, [onPageChange, setCurrentPage]);

    const onPaymentTypeClick = useCallback((paymentTypeId: string) => {
        const dropdownItem = getDropdownItem(availableTypesAsDropdownItems, paymentTypeId);

        if (isNullish(dropdownItem)) {
            return;
        }

        setType(dropdownItem!);
        setFilterValue({
            ...lastFilter,
            typeId: paymentTypeId,
        }, true);
    }, [availableTypesAsDropdownItems, lastFilter, setFilterValue, setType]);

    return (
        <section>
            {pageItems.length > 0
                &&
                <section>
                    <Table
                        headings={flatListTableHeadings}
                        hasBorder
                        narrow
                        hoverable
                        fullWidth
                        hasStickyHeader
                        headerWithBorder
                        currentSortColumn={sortColumn}
                        onHeaderClick={onHeaderCellClick}
                    >
                        {pageItems.map(x =>
                            <PaymentListItem
                                key={x.id}
                                item={x}
                                typesMap={typesMap}
                                deletePayment={deletePayment}
                                onPaymentTypeClick={onPaymentTypeClick}
                            />
                        )}
                    </Table>
                    <Paginator
                        count={pagesCount}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </section>
            }
            {initialized && pageItems.length === 0
                &&
                <p className="subtitle has-text-centered is-italic mt-4 has-text-grey-dark has-wrap-text">
                    {isNullish(lastFilter)
                        ? `No payments were loaded\r\nTry refreshing page`
                        : "No payments were found by specified filter"
                    }
                </p>
            }
        </section>
    );
};

/** Payments flat list */
export default connect(
    ({ payments }: CompositeAppState) => ({
        initialized: payments.initialized,
        filteredItems: payments.filteredItems,
        typesMap: payments.typesMap,
        availableTypesAsDropdownItems: payments.availableTypesAsDropdownItems,
        lastFilter: payments.lastFilter,
        sortColumn: payments.paymentSortColumn,
        lastPage: payments.lastPage,
    }),
    ({
        setSortColumn: setSortColumn,
        deletePayment: deleteRecord,
        setFilterValue: setFilterValue,
        setCurrentPage: setCurrentPage,
    })
)(PaymentFlatList);
