import { useCallback, useMemo } from "react";
import { connect } from "react-redux";

import { isNullOrUndefined } from "@bodynarf/utils";
import { SelectableItem, usePagination } from "@bodynarf/react.components";
import Paginator from "@bodynarf/react.components/components/paginator";

import { Payment, PaymentFilter } from "@app/models/payments";
import SortColumn from "@app/models/sortColumn";

import { CompositeAppState } from "@app/redux/types";
import { deleteRecord, getSetFilterValueAction, getSetSortColumnAction } from "@app/redux/payments";

import { getDropdownItem } from "@app/core";
import { useSortColumn } from "@app/hooks";
import Table, { TableHeading } from "@app/sharedComponents/table";

import PaymentListItem from "../../../listItem";

/** Payment flat list props type */
interface PaymentFlatListProps {
    /** Is module state initialized */
    initialized: boolean;

    /** Items that was filtered by last filter */
    filteredItems: Array<Payment>;

    /** Payment types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Last applied fiter */
    lastFilter?: PaymentFilter;

    /** Current sort column config */
    sortColumn?: SortColumn<Payment>;

    /** Save sort column config */
    setSortColumn: (sortColumn: SortColumn<Payment>) => void;

    /** Delete specified payment */
    deletePayment: (id: number) => void;

    /** Update current filter value */
    setFilterValue: (filterValue: PaymentFilter, applyFilter: boolean) => void;

    /** Save current payment type filter value */
    setType: (selectedType: SelectableItem) => void;
}

const PaymentFlatList = ({
    filteredItems, sortColumn, initialized,
    lastFilter, availableTypesAsDropdownItems, setType, setFilterValue,
    setSortColumn, deletePayment,
}: PaymentFlatListProps): JSX.Element => {

    const onHeaderCellClick = useSortColumn(setSortColumn, sortColumn);

    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(filteredItems.length, 20, 1, [filteredItems]);
    const pageItems: Array<Payment> = useMemo(() => paginate(filteredItems), [paginate, filteredItems]);

    const onPaymentTypeClick = useCallback((paymentTypeId: number) => {
        const dropdownItem = getDropdownItem(availableTypesAsDropdownItems, paymentTypeId);

        if (isNullOrUndefined(dropdownItem)) {
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
                        headings={headings}
                        hasBorder={true}
                        narrow={true}
                        hoverable={true}
                        fullWidth={true}
                        hasStickyHeader={true}
                        headerWithBorder={true}
                        currentSortColumn={sortColumn}
                        onHeaderClick={onHeaderCellClick}
                    >
                        {pageItems.map(x =>
                            <PaymentListItem
                                key={x.id}
                                item={x}
                                deletePayment={deletePayment}
                                onPaymentTypeClick={onPaymentTypeClick}
                            />
                        )}
                    </Table>
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

/** Payments flat list */
export default connect(
    ({ payments }: CompositeAppState) => ({
        initialized: payments.initialized,
        filteredItems: payments.filteredItems,
        availableTypesAsDropdownItems: payments.availableTypesAsDropdownItems,
        lastFilter: payments.lastFilter,
        sortColumn: payments.paymentSortColumn,
    }),
    ({
        setSortColumn: getSetSortColumnAction,
        deletePayment: deleteRecord,
        setFilterValue: getSetFilterValueAction,
    })
)(PaymentFlatList);

/** Pre-defined payment table headings */
const headings: Array<TableHeading<Payment>> = [
    { name: "month", caption: "Month", sortable: true, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { name: "year", caption: "Year", sortable: true, className: "has-text-centered th-color--light-blue width-is-5rem is-vertical-align--center" },
    { name: "typeId", caption: "Type", sortable: true, className: "has-text-centered th-color--light-blue width-is-10rem is-vertical-align--center" },
    { name: "price", caption: "Price", sortable: true, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { caption: "Description", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center" },
    { caption: "Actions", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center width-is-15rem" },
];
