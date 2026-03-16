import { FC, useCallback, useMemo } from "react";
import { connect } from "react-redux";

import { isNullish } from "@bodynarf/utils";
import { SelectableItem, usePagination } from "@bodynarf/react.components";
import Paginator from "@bodynarf/react.components/components/paginator";

import { flatListTableHeadings } from "@app/static/measurement";
import { Measurement, MeasurementFilter, MeasurementType } from "@app/models/measurements";
import { SortColumn } from "@app/models";

import { CompositeAppState } from "@app/redux/types";
import { deleteRecord, setFilterValue, setSortColumn, setCurrentPage } from "@app/redux/measurements";

import { getDropdownItem } from "@app/core";
import { useSortColumn } from "@app/hooks";
import Table from "@bodynarf/react.components/components/table";

import MeasurementListItem from "./listItem";

/** Measurement flat list props type */
interface MeasurementFlatListProps {
    /** Is module state initialized */
    initialized: boolean;

    /** Items that was filtered by last filter */
    filteredItems: Array<Measurement>;

    /** Measurement types map */
    typesMap: Map<number, MeasurementType>;

    /** Measurement types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Last applied filter */
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

    /** Last visited page number */
    lastPage?: number;

    /** Save current page to Redux */
    setCurrentPage: (page: number) => void;
}

const MeasurementFlatList: FC<MeasurementFlatListProps> = ({
    filteredItems, sortColumn, initialized, typesMap,
    lastFilter, availableTypesAsDropdownItems, setType, setFilterValue,
    setSortColumn, deleteMeasurement, lastPage, setCurrentPage,
}) => {
    const onHeaderCellClick = useSortColumn(setSortColumn, sortColumn);

    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(filteredItems.length, 20, lastPage ?? 1, [filteredItems]);
    const pageItems: Array<Measurement> = useMemo(() => paginate(filteredItems) as Array<Measurement>, [paginate, filteredItems]);

    const handlePageChange = useCallback((page: number) => {
        onPageChange(page);
        setCurrentPage(page);
    }, [onPageChange, setCurrentPage]);

    const onTypeClick = useCallback((typeId: number) => {
        const dropdownItem = getDropdownItem(availableTypesAsDropdownItems, typeId);

        if (isNullish(dropdownItem)) {
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
                            <MeasurementListItem
                                key={x.id}
                                item={x}
                                typesMap={typesMap}
                                deleteMeasurement={deleteMeasurement}
                                onTypeClick={onTypeClick}
                            />
                        )}
                    </Table>
                    <Paginator
                        count={pagesCount}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </section>
            }
            {initialized && pageItems.length === 0
                &&
                <p className="subtitle has-text-centered is-italic mt-4 has-text-grey-dark has-wrap-text">
                    {isNullish(lastFilter)
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
        typesMap: measurements.typesMap,
        availableTypesAsDropdownItems: measurements.availableTypesAsDropdownItems,
        lastFilter: measurements.lastFilter,
        sortColumn: measurements.measurementSortColumn,
        lastPage: measurements.lastPage,
    }),
    ({
        setSortColumn: setSortColumn,
        deleteMeasurement: deleteRecord,
        setFilterValue: setFilterValue,
        setCurrentPage: setCurrentPage,
    })
)(MeasurementFlatList);
