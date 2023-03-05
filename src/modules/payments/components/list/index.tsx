import { useCallback, useMemo } from "react";

import { connect } from "react-redux";

import { useNavigate } from "react-router-dom";

import { isNullOrUndefined } from "@bodynarf/utils";

import { usePagination } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Paginator from "@bodynarf/react.components/components/paginator";
import Icon from "@bodynarf/react.components/components/icon";

import { Payment } from "@app/models/payments";
import SortColumn from "@app/models/sortColumn";

import { CompositeAppState } from "@app/redux";
import { getSetSortColumnAction } from "@app/redux/payments";

import PaymentFilter from "../filter";
import PaymentListItem from "../listItem";

/** Payment list props type */
type PaymentListProps = {
    /** Items that was filtered by last filter */
    filteredItems: Array<Payment>;

    /** Current sort column config */
    sortColumn?: SortColumn<Payment>;

    /** Save sort column config */
    setSortColumn: (sortColumn: SortColumn<Payment>) => void;
};

const PaymentList = ({ filteredItems, sortColumn, setSortColumn }: PaymentListProps): JSX.Element => {
    const navigate = useNavigate();

    const onCreateClick = useCallback(() => navigate("/payment/create", { replace: true }), [navigate]);
    const onTypeManageClick = useCallback(() => navigate("/payment/types", { replace: true }), [navigate]);

    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(filteredItems.length, 20);
    const pageItems: Array<Payment> = useMemo(() => paginate(filteredItems), [paginate, filteredItems]);

    const onHeaderCellClick = useCallback(
        (column: keyof Payment) =>
            setSortColumn({
                ascending: !isNullOrUndefined(sortColumn) && sortColumn!.columnName === column
                    ? !sortColumn!.ascending
                    : true,
                columnName: column
            }),
        [setSortColumn, sortColumn]
    );

    return (
        <section>
            <nav className="field is-grouped">
                <p className="control">
                    <Button
                        type="primary"
                        caption="Create"
                        onClick={onCreateClick}
                    />
                </p>
                <p className="control">
                    <Button
                        type="info"
                        caption="Manage types"
                        outlined={true}
                        onClick={onTypeManageClick}
                    />
                </p>
            </nav>
            <PaymentFilter />
            {pageItems.length > 0
                &&
                <section>
                    <table className="table is-bordered is-narrow is-hoverable is-fullwidth has-sticky-header has-borderless-header has-shadow-bordered-header">
                        <thead>
                            <tr>
                                {headings.map((heading, i) =>
                                    <TableListHeader
                                        key={i}
                                        {...heading}
                                        sortColumn={sortColumn}
                                        onClick={onHeaderCellClick}
                                    />
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(x =>
                                <PaymentListItem
                                    key={x.id}
                                    item={x}
                                />
                            )}
                        </tbody>
                    </table>
                    <Paginator
                        count={pagesCount}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                    />
                </section>
            }
        </section>
    );
};

/** Payments list */
export default connect(
    ({ payments }: CompositeAppState) => ({
        filteredItems: payments.filteredItems,
        sortColumn: payments.sortColumn
    }),
    ({ setSortColumn: getSetSortColumnAction })
)(PaymentList);

/** Table column heading model  */
interface TableHeader {
    /** Name of model column*/
    name?: keyof Payment;

    /** Heading caption */
    caption: string;

    /** Is column sortable  */
    sortable: boolean;

    /** Class names */
    className: string;
}

/** Pre-defined payment table headings */
const headings: Array<TableHeader> = [
    { name: "month", caption: "Month", sortable: true, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { name: "year", caption: "Year", sortable: true, className: "has-text-centered th-color--light-blue width-is-5rem is-vertical-align--center" },
    { name: "typeId", caption: "Type", sortable: true, className: "has-text-centered th-color--light-blue width-is-10rem is-vertical-align--center" },
    { name: "price", caption: "Price", sortable: true, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { caption: "Description", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center" },
    { caption: "Actions", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center width-is-15rem" },
];

/** Table heading cell component props */
type TableListHeaderProps = TableHeader & {
    /** Current sort column */
    sortColumn?: SortColumn<Payment>;

    /** Cell click handler */
    onClick: (column: keyof Payment) => void;
};

/** Payment list header cell */
const TableListHeader = ({ className, caption, name, sortable, sortColumn, onClick }: TableListHeaderProps): JSX.Element => {
    const onHeaderClick = useCallback(() => onClick(name!), [name, onClick]);

    if (sortable) {
        if (sortColumn?.columnName === name!) {
            return (
                <th
                    className={`${className} is-clickable`}
                    onClick={onHeaderClick}
                >
                    <div className="is-flex is-align-items-center is-justify-content-center">
                        <span>{caption}</span>
                        <Icon className="has-margin-left-025r" name={`sort-alpha-down${sortColumn!.ascending ? "" : "-alt"}`} />
                    </div>
                </th>
            );
        }

        return (
            <th
                className={`${className} is-clickable`}
                onClick={onHeaderClick}
            >
                <div className="is-flex is-align-items-center is-justify-content-center">
                    <span>{caption}</span>
                </div>
            </th>
        );
    }

    return (
        <th
            className={className}
        >
            <div className="is-flex is-align-items-center is-justify-content-center">
                <span>{caption}</span>
            </div>
        </th>
    );
};
