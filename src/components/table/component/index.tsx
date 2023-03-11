import { getClassName } from "@bodynarf/utils";

import SortColumn from "@app/models/sortColumn";

import { TableHeading } from "..";
import TableHeader from "../components/heading";

/** Table props type */
interface TableProps<TItem> {
    /** Header row */
    headings: Array<TableHeading<TItem>>;

    /** Table body */
    children?: React.ReactNode;

    /** Add border to all cells */
    hasBorder?: boolean;

    /** Is row hover effect active */
    hoverable?: boolean;

    /** Reduce space between cells */
    narrow?: boolean;

    /** Use all container width */
    fullWidth?: boolean;

    /** Is header sticks to page on scroll */
    hasStickyHeader?: boolean;

    /**
     * Header has border.
     * @description Applied only with `hasStickyHeader` sets as `true`. Adds border effect
    */
    headerWithBorder?: boolean;

    /**
     * Should rows be stripped.
     * @description Even rows will have gray background
    */
    zebra?: boolean;

    /** Additional table element class names */
    className?: string;

    /** Current sort column */
    currentSortColumn?: SortColumn<TItem>;

    /** Header click handler */
    onHeaderClick?: (columnName: TableHeading<TItem>) => void;
}

/**
 * Table component.
 * If no sorting is use - use `any` as generic param
 */
function Table<TItem>({
    headings,
    hasBorder, hoverable, narrow, fullWidth, zebra,
    hasStickyHeader, headerWithBorder, className,
    currentSortColumn, onHeaderClick,
    children,
}: TableProps<TItem>): JSX.Element {

    const elClassName = getClassName([
        "table",
        hasBorder ? "is-bordered" : "",
        hoverable ? "is-hoverable" : "",
        narrow ? "is-narrow" : "",
        fullWidth ? "is-fullwidth" : "",
        zebra ? "is-striped" : "",
        hasStickyHeader ? "has-sticky-header" : "",
        headerWithBorder ? "has-borderless-header has-shadow-bordered-header" : "",
        className,
    ]);

    return (
        <table className={elClassName}>
            <thead>
                <tr>
                    {headings.map((heading, i) =>
                        <TableHeader
                            key={i}
                            {...heading}
                            sortColumn={currentSortColumn}
                            onClick={onHeaderClick}
                        />
                    )}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    );
}

export default Table;
