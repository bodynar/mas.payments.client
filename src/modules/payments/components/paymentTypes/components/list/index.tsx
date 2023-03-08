import { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { isNullOrUndefined } from "@bodynarf/utils";

import { usePagination } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Paginator from "@bodynarf/react.components/components/paginator";
import Icon from "@bodynarf/react.components/components/icon";

import { PaymentType } from "@app/models/payments";
import SortColumn from "@app/models/sortColumn";

import { CompositeAppState } from "@app/redux";
import { getSetTypeSortColumnAction, deleteTypeRecord } from "@app/redux/payments";

import PaymentTypeListItem from "../listItem";

/** Payment list props type */
interface PaymentTypeListProps {
    /** Is module state initialized */
    initialized: boolean;

    /** Items that was filtered by last filter */
    availableTypes: Array<PaymentType>;

    /** Current sort column config */
    sortColumn?: SortColumn<PaymentType>;

    /** Save sort column config */
    setSortColumn: (sortColumn: SortColumn<PaymentType>) => void;

    /** Delete specified payment type */
    deletePaymentType: (id: number) => void;
}

const PaymentTypeList = ({
    availableTypes, sortColumn, initialized,

    setSortColumn, deletePaymentType,
}: PaymentTypeListProps): JSX.Element => {
    const navigate = useNavigate();

    const onCreateClick = useCallback(() => navigate("/payment/types/create", { replace: true }), [navigate]);
    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(availableTypes.length, 20, 1, [availableTypes]);
    const pageItems: Array<PaymentType> = useMemo(() => paginate(availableTypes), [paginate, availableTypes]);

    const onHeaderCellClick = useCallback(
        (column: keyof PaymentType) =>
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
                        title="Create new payment type"
                    />
                </p>
            </nav>
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
                                <PaymentTypeListItem
                                    key={x.id}
                                    item={x}
                                    deletePaymentType={deletePaymentType}
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
            {initialized && pageItems.length === 0
                &&
                <p className="subtitle has-text-centered is-italic mt-4 has-text-grey-dark has-wrap-text">
                    {`No payments were loaded\r\nTry refreshing page`}
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
    }),
    ({
        setSortColumn: getSetTypeSortColumnAction,
        deletePaymentType: deleteTypeRecord,
    })
)(PaymentTypeList);

/** Table column heading model  */
interface TableHeader {
    /** Name of model column*/
    name?: keyof PaymentType;

    /** Heading caption */
    caption: string;

    /** Is column sortable  */
    sortable: boolean;

    /** Class names */
    className: string;
}

/** Pre-defined payment type table headings */
const headings: Array<TableHeader> = [
    { name: "color", caption: "Color", sortable: false, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { name: "caption", caption: "Name", sortable: true, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { name: "company", caption: "Provider", sortable: true, className: "has-text-centered th-color--light-blue width-is-725rem is-vertical-align--center" },
    { caption: "Description", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center" },
    { caption: "Actions", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center width-is-15rem" },
];

/** Table heading cell component props */
interface TableListHeaderProps extends TableHeader {
    /** Current sort column */
    sortColumn?: SortColumn<PaymentType>;

    /** Cell click handler */
    onClick: (column: keyof PaymentType) => void;
}

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
