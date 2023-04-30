import { useCallback, useMemo } from "react";
import { connect } from "react-redux";

import { isNullOrUndefined } from "@bodynarf/utils";
import { SelectableItem, usePagination } from "@bodynarf/react.components";
import Paginator from "@bodynarf/react.components/components/paginator";

import { flatListTableHeadings } from "@app/static/measurement";
import { Measurement, MeasurementFilter } from "@app/models/measurements";
import { SortColumn } from "@app/models";

import { CompositeAppState } from "@app/redux/types";
import { deleteRecord, getSetFilterValueAction, getSetSortColumnAction } from "@app/redux/measurements";

import { getDropdownItem } from "@app/core";
import { useSortColumn } from "@app/hooks";
import Table from "@app/sharedComponents/table";

import MeasurementListItem from "./listItem";

/** Measurement flat list props type */
interface MeasurementFlatListProps {
    /** Is module state initialized */
    initialized: boolean;

    /** Items that was filtered by last filter */
    filteredItems: Array<Measurement>;

    /** Measurement types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Last applied fiter */
    lastFilter?: MeasurementFilter;

    /** Current sort column config */
    sortColumn?: SortColumn<Measurement>;

    /** Save sort column config */
    setSortColumn: (sortColumn: SortColumn<Measurement>) => void;

    /** Delete specified measurement */
    deleteMeasurement: (id: number) => void;

    /** Update current filter value */
    setFilterValue: (filterValue: MeasurementFilter, applyFilter: boolean) => void;

    /** Save current measurement type filter value */
    setType: (selectedType: SelectableItem) => void;
}

const MeasurementFlatList = ({
    filteredItems, sortColumn, initialized,
    lastFilter, availableTypesAsDropdownItems, setType, setFilterValue,
    setSortColumn, deleteMeasurement,
}: MeasurementFlatListProps): JSX.Element => {
    const onHeaderCellClick = useSortColumn(setSortColumn, sortColumn);

    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(filteredItems.length, 20, 1, [filteredItems]);
    const pageItems: Array<Measurement> = useMemo(() => paginate(filteredItems), [paginate, filteredItems]);

    const onTypeClick = useCallback((typeId: number) => {
        const dropdownItem = getDropdownItem(availableTypesAsDropdownItems, typeId);

        if (isNullOrUndefined(dropdownItem)) {
            return;
        }

        setType(dropdownItem!);
        setFilterValue({
            ...lastFilter,
            typeId: typeId,
        }, true);
    }, [availableTypesAsDropdownItems, lastFilter, setFilterValue, setType]);

    return (
        <section>
            {pageItems.length > 0
                &&
                <section>
                    <Table
                        headings={flatListTableHeadings}
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
                            <MeasurementListItem
                                key={x.id}
                                item={x}
                                deleteMeasurement={deleteMeasurement}
                                onTypeClick={onTypeClick}
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
                    {isNullOrUndefined(lastFilter)
                        ? `No measurements were loaded\r\nTry refreshing page`
                        : "No measurements were found by specified filter"
                    }
                </p>
            }
        </section>
    );
};

/** Measurements flat list */
export default connect(
    ({ measurements }: CompositeAppState) => ({
        initialized: measurements.initialized,
        filteredItems: measurements.filteredItems,
        availableTypesAsDropdownItems: measurements.availableTypesAsDropdownItems,
        lastFilter: measurements.lastFilter,
        sortColumn: measurements.measurementSortColumn,
    }),
    ({
        setSortColumn: getSetSortColumnAction,
        deleteMeasurement: deleteRecord,
        setFilterValue: getSetFilterValueAction,
    })
)(MeasurementFlatList);
