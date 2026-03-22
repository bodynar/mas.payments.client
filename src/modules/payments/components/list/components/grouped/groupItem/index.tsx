import { FC, useCallback, useMemo, useState } from "react";

import { ElementColor, ElementSize, usePagination } from "@bodynarf/react.components";
import Paginator from "@bodynarf/react.components/components/paginator";
import Accordion from "@bodynarf/react.components/components/accordion";

import { groupedViewTableHeadings } from "@app/static/payment";
import { Payment, PaymentGroup, PaymentType } from "@app/models/payments";
import { SortColumn } from "@app/models";
import { sort } from "@app/utils";

import { useSortColumn } from "@app/hooks";
import Table from "@bodynarf/react.components/components/table";

import PaymentListItem from "../../flatList/listItem";

/** Payment group item props type */
interface PaymentGroupItemProps {
    /** Payment information */
    item: PaymentGroup;

    /** Payment types map */
    typesMap: Map<string, PaymentType>;

    /** Delete specified payment */
    deletePayment: (id: string) => void;
}

/** Payment group item */
const PaymentGroupItem: FC<PaymentGroupItemProps> = ({
    item: group,
    typesMap,
    deletePayment,
}) => {
    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(group.items.length, 20, 1, [group.items]);
    const pageItems: Array<Payment> = useMemo(() => paginate(group.items) as Array<Payment>, [paginate, group.items]);

    const [sortColumn, setSortColumn] = useState<SortColumn<Payment> | undefined>(undefined);

    const onSortColumnChange = useCallback(
        (column: SortColumn<Payment>) => {
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
                        <PaymentListItem
                            key={x.id}
                            item={x}
                            typesMap={typesMap}
                            deletePayment={deletePayment}
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

export default PaymentGroupItem;
