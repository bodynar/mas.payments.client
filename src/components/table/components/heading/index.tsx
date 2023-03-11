import { useCallback } from "react";

import { getClassName, isNullOrUndefined } from "@bodynarf/utils";
import Icon from "@bodynarf/react.components/components/icon";

import SortColumn from "@app/models/sortColumn";

import { TableHeading } from "../../types";

/** Table heading cell component props */
interface TableHeaderProps<TItem> extends TableHeading<TItem> {
    /** Current sort column */
    sortColumn?: SortColumn<TItem>;

    /** Cell click handler */
    onClick?: (column: TableHeading<TItem>) => void;
}

/** Table heading cell */
function TableHeader<TItem>(props: TableHeaderProps<TItem>): JSX.Element {
    const { className, caption, name, sortable, sortColumn, onClick } = props;

    const onHeaderClick = useCallback(
        () => {
            if (sortable && !isNullOrUndefined(onClick)) {
                onClick!(props);
            }
        },
        [onClick, props, sortable]
    );

    const containerClassName = getClassName([
        className,
        sortable ? "is-clickable" : "",
    ]);

    return (
        <th
            className={containerClassName}
            onClick={onHeaderClick}
        >
            <div>
                <span>{caption}</span>
                {sortable && sortColumn?.columnName === name! &&
                    <Icon
                        className="has-margin-left-025r"
                        name={`sort-alpha-down${sortColumn!.ascending ? "" : "-alt"}`}
                    />
                }
            </div>
        </th>
    );
}

export default TableHeader;
