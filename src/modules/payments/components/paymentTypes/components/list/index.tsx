import { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { isNullOrEmpty } from "@bodynarf/utils";
import { usePagination } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Paginator from "@bodynarf/react.components/components/paginator";
import Search from "@bodynarf/react.components/components/search";

import { PaymentType } from "@app/models/payments";
import SortColumn from "@app/models/sortColumn";

import { CompositeAppState } from "@app/redux";
import { getSetTypeSortColumnAction, deleteTypeRecord, getFilterPaymentTypesAction } from "@app/redux/payments";
import { useSortColumn } from "@app/hooks";

import Table, { TableHeading } from "@app/sharedComponents/table";

import PaymentTypeListItem from "../listItem";

/** Payment list props type */
interface PaymentTypeListProps {
    /** Is module state initialized */
    initialized: boolean;

    /** Items that was filtered by last filter */
    filteredTypes: Array<PaymentType>;

    /** Current sort column config */
    sortColumn?: SortColumn<PaymentType>;

    /** Current filterValue */
    typeFilterCaption?: string;

    /** Save sort column config */
    setSortColumn: (sortColumn: SortColumn<PaymentType>) => void;

    /** Delete specified payment type */
    deletePaymentType: (id: number) => void;

    /** Filter types list by specified caption value */
    filterTypes: (value?: string) => void;
}

const PaymentTypeList = ({
    filteredTypes, sortColumn, initialized,
    filterTypes, typeFilterCaption,
    setSortColumn, deletePaymentType,
}: PaymentTypeListProps): JSX.Element => {
    const navigate = useNavigate();

    const onCreateClick = useCallback(() => navigate("/payment/types/create", { replace: true }), [navigate]);
    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(filteredTypes.length, 20, 1, [filteredTypes]);
    const pageItems: Array<PaymentType> = useMemo(() => paginate(filteredTypes), [paginate, filteredTypes]);
    const onHeaderCellClick = useSortColumn(setSortColumn, sortColumn);

    return (
        <section>
            <nav className="field is-grouped">
                <p className="control">
                    <Button
                        type="primary"
                        caption="Create"
                        title="Create new payment type"
                        onClick={onCreateClick}
                    />
                </p>
            </nav>
            <div className="columns">
                <div className="column is-3">
                    <Search
                        searchType="byTyping"
                        caption="Start typing name to filter"
                        onSearch={filterTypes}
                        defaultValue={typeFilterCaption}
                    />
                </div>
            </div>
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
                            <PaymentTypeListItem
                                key={x.id}
                                item={x}
                                deletePaymentType={deletePaymentType}
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
                    {isNullOrEmpty(typeFilterCaption)
                        ? "No payment types were found by specified filter"
                        : `No payment types were loaded\r\nTry refreshing page`
                    }
                </p>
            }
        </section>
    );
};

/** Payments list */
export default connect(
    ({ payments }: CompositeAppState) => ({
        ...payments,
        sortColumn: payments.paymentTypeSortColumn,
        typeFilterCaption: payments.typeFilterCaption
    }),
    ({
        setSortColumn: getSetTypeSortColumnAction,
        deletePaymentType: deleteTypeRecord,
        filterTypes: getFilterPaymentTypesAction,
    })
)(PaymentTypeList);


/** Pre-defined payment type table headings */
const headings: Array<TableHeading<PaymentType>> = [
    { name: "color", caption: "Color", sortable: false, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { name: "caption", caption: "Name", sortable: true, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { name: "company", caption: "Provider", sortable: true, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { caption: "Description", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center" },
    { caption: "Actions", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center width-is-15rem" },
];
