import { useCallback, useMemo, useState } from "react";

import { ElementColor, ElementSize, usePagination } from "@bodynarf/react.components";
import Paginator from "@bodynarf/react.components/components/paginator";
import Accordion from "@bodynarf/react.components/components/accordion";

import { groupedViewTableHeadings } from "@app/static/measurement";
import { Measurement, MeasurementGroup } from "@app/models/measurements";
import { SortColumn } from "@app/models";
import { sort } from "@app/utils/array";

import { useSortColumn } from "@app/hooks";
import Table from "@app/sharedComponents/table";

import ListItem from "../../flatList/listItem";

/** Measurement group item props type */
interface MeasurementGroupItemProps {
    /** Group information */
    item: MeasurementGroup;

    /** Delete specified item */
    deleteItem: (id: number) => void;
}

/** Payment group item */
const MeasurementGroupItem = ({
    item: group,
    deleteItem,
}: MeasurementGroupItemProps): JSX.Element => {
    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(group.items.length, 20, 1, [group.items]);
    const pageItems: Array<Measurement> = useMemo(() => paginate(group.items), [paginate, group.items]);

    const [sortColumn, setSortColumn] = useState<SortColumn<Measurement> | undefined>(undefined);

    const onSortColumnChange = useCallback(
        (column: SortColumn<Measurement>) => {
            group.items = sort(group.items, column);
            setSortColumn(column);
        }, [group]);

    const onHeaderCellClick = useSortColumn(onSortColumnChange, sortColumn);

    return (
        <Accordion
            caption={group.caption}
            size={ElementSize.Small}
            style={ElementColor.Info}
        >
            <section>
                <Table
                    headings={groupedViewTableHeadings}
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
                        <ListItem
                            key={x.id}
                            item={x}
                            deleteMeasurement={deleteItem}
                            useInGroupView={true}
                        />
                    )}
                </Table>
                <Paginator
                    count={pagesCount}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            </section>
        </Accordion>
    );
};

export default MeasurementGroupItem;
