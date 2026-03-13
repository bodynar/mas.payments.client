import { FC, useCallback, useMemo, useState } from "react";

import { ElementColor, ElementSize, usePagination } from "@bodynarf/react.components";
import Paginator from "@bodynarf/react.components/components/paginator";
import Accordion from "@bodynarf/react.components/components/accordion";

import { groupedViewTableHeadings } from "@app/static/measurement";
import { Measurement, MeasurementGroup, MeasurementType } from "@app/models/measurements";
import { SortColumn } from "@app/models";
import { sort } from "@app/utils/array";

import { useSortColumn } from "@app/hooks";
import Table from "@bodynarf/react.components/components/table";

import ListItem from "../../flatList/listItem";

/** Measurement group item props type */
interface MeasurementGroupItemProps {
    /** Group information */
    item: MeasurementGroup;

    /** Measurement types map */
    typesMap: Map<number, MeasurementType>;

    /** Delete specified item */
    deleteItem: (id: number) => void;
}

/** Payment group item */
const MeasurementGroupItem: FC<MeasurementGroupItemProps> = ({
    item: group,
    typesMap,
    deleteItem,
}) => {
    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(group.items.length, 20, 1, [group.items]);
    const pageItems: Array<Measurement> = useMemo(() => paginate(group.items) as Array<Measurement>, [paginate, group.items]);

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
                        <ListItem
                            key={x.id}
                            item={x}
                            typesMap={typesMap}
                            deleteMeasurement={deleteItem}
                            useInGroupView
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
