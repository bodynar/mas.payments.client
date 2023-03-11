import { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { isNullOrUndefined } from "@bodynarf/utils";

import { SelectableItem, usePagination } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Paginator from "@bodynarf/react.components/components/paginator";

import { Payment, PaymentFilter as PaymentFilterModel } from "@app/models/payments";
import SortColumn from "@app/models/sortColumn";

import { CompositeAppState } from "@app/redux";
import { deleteRecord, getSetFilterValueAction, getSetSortColumnAction } from "@app/redux/payments";

import { getDropdownItem } from "@app/core";
import { useSortColumn } from "@app/hooks";

import Table, { TableHeading } from "@app/sharedComponents/table";

import PaymentFilter from "../filter";
import PaymentListItem from "../listItem";

/** Payment list props type */
interface PaymentListProps {
    /** Is module state initialized */
    initialized: boolean;

    /** Items that was filtered by last filter */
    filteredItems: Array<Payment>;

    /** Payment types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Last applied fiter */
    lastFilter?: PaymentFilterModel;

    /** Current sort column config */
    sortColumn?: SortColumn<Payment>;

    /** Store filter value */
    setFilterValue: (filterValue?: PaymentFilterModel, applyFilter?: boolean) => void;

    /** Save sort column config */
    setSortColumn: (sortColumn: SortColumn<Payment>) => void;

    /** Delete specified payment */
    deletePayment: (id: number) => void;
}

const PaymentList = ({
    filteredItems, sortColumn, lastFilter, initialized,
    availableTypesAsDropdownItems,
    setSortColumn, deletePayment, setFilterValue,
}: PaymentListProps): JSX.Element => {
    const navigate = useNavigate();
    const isFilterApplied = !isNullOrUndefined(lastFilter);

    const onCreateClick = useCallback(() => navigate("/payment/create", { replace: true }), [navigate]);
    const onTypeManageClick = useCallback(() => navigate("/payment/types", { replace: true }), [navigate]);
    const [selectedType, setType] = useState<SelectableItem | undefined>(getDropdownItem(availableTypesAsDropdownItems, lastFilter?.typeId));
    const onHeaderCellClick = useSortColumn(setSortColumn, sortColumn);

    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(filteredItems.length, 20, 1, [filteredItems]);
    const pageItems: Array<Payment> = useMemo(() => paginate(filteredItems), [paginate, filteredItems]);

    const onPaymentTypeClick = useCallback((paymentTypeId: number) => {
        const dropdownItem = getDropdownItem(availableTypesAsDropdownItems, paymentTypeId);

        if (isNullOrUndefined(dropdownItem)) {
            return;
        }

        setType(dropdownItem);
        setFilterValue({
            ...lastFilter,
            typeId: paymentTypeId,
        }, true);
    }, [availableTypesAsDropdownItems, lastFilter, setFilterValue]);

    return (
        <section>
            <nav className="field is-grouped">
                <p className="control">
                    <Button
                        type="primary"
                        caption="Create"
                        onClick={onCreateClick}
                        title="Create new payment record"
                    />
                </p>
                <p className="control">
                    <Button
                        type="info"
                        caption="Manage types"
                        outlined={true}
                        onClick={onTypeManageClick}
                        title="Open payment types list"
                    />
                </p>
            </nav>
            <PaymentFilter
                onTypeChange={setType}
                currentType={selectedType}
            />
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
                    {isFilterApplied ? "No payments were found by specified filter" : `No payments were loaded\r\nTry refreshing page`}
                </p>
            }
        </section>
    );
};

/** Payments list */
export default connect(
    ({ payments }: CompositeAppState) => ({
        filteredItems: payments.filteredItems,
        sortColumn: payments.paymentSortColumn,
        lastFilter: payments.lastFilter,
        initialized: payments.initialized,
        availableTypesAsDropdownItems: payments.availableTypesAsDropdownItems,
    }),
    ({
        setSortColumn: getSetSortColumnAction,
        deletePayment: deleteRecord,
        setFilterValue: getSetFilterValueAction,
    })
)(PaymentList);

/** Pre-defined payment table headings */
const headings: Array<TableHeading<Payment>> = [
    { name: "month", caption: "Month", sortable: true, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { name: "year", caption: "Year", sortable: true, className: "has-text-centered th-color--light-blue width-is-5rem is-vertical-align--center" },
    { name: "typeId", caption: "Type", sortable: true, className: "has-text-centered th-color--light-blue width-is-10rem is-vertical-align--center" },
    { name: "price", caption: "Price", sortable: true, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { caption: "Description", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center" },
    { caption: "Actions", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center width-is-15rem" },
];
