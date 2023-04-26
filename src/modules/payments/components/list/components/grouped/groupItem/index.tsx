import { useCallback, useMemo, useState } from "react";

import { ElementColor, ElementSize, usePagination } from "@bodynarf/react.components";
import Paginator from "@bodynarf/react.components/components/paginator";
import Accordion from "@bodynarf/react.components/components/accordion";

import { groupedViewTableHeadings } from "@app/static/payment";
import { Payment, PaymentGroup } from "@app/models/payments";
import SortColumn from "@app/models/sortColumn";
import { sort } from "@app/utils";

import { useSortColumn } from "@app/hooks";
import Table from "@app/sharedComponents/table";

import PaymentListItem from "../../flatList/listItem";

/** Payment group item props type */
interface PaymentGroupItemProps {
    /** Payment information */
    item: PaymentGroup;

    /** Delete specified payment */
    deletePayment: (id: number) => void;
}

/** Payment group item */
const PaymentGroupItem = ({
    item: group,
    deletePayment,
}: PaymentGroupItemProps): JSX.Element => {
    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(group.items.length, 20, 1, [group.items]);
    const pageItems: Array<Payment> = useMemo(() => paginate(group.items), [paginate, group.items]);

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

export default PaymentGroupItem;
