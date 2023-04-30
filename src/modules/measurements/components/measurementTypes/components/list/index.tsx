import { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { isNullOrEmpty } from "@bodynarf/utils";
import { usePagination } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Paginator from "@bodynarf/react.components/components/paginator";
import Search from "@bodynarf/react.components/components/search";

import { MeasurementType } from "@app/models/measurements";
import { SortColumn } from "@app/models";

import { CompositeAppState } from "@app/redux";
import { getSetTypeSortColumnAction, deleteTypeRecord, getFilterMeasurementTypesAction } from "@app/redux/measurements";
import { useSortColumn } from "@app/hooks";

import Table, { TableHeading } from "@app/sharedComponents/table";

import MeasurementTypeListItem from "../listItem";

/** Measurement list props type */
interface MeasurementTypeListProps {
    /** Is module state initialized */
    initialized: boolean;

    /** Items that was filtered by last filter */
    filteredTypes: Array<MeasurementType>;

    /** Current sort column config */
    sortColumn?: SortColumn<MeasurementType>;

    /** Current filterValue */
    typeFilterCaption?: string;

    /** Save sort column config */
    setSortColumn: (sortColumn: SortColumn<MeasurementType>) => void;

    /** Delete specified measurement type */
    deleteMeasurementType: (id: number) => void;

    /** Filter types list by specified caption value */
    filterTypes: (value?: string) => void;
}

const MeasurementTypeList = ({
    filteredTypes, sortColumn, initialized,
    filterTypes, typeFilterCaption,
    setSortColumn, deleteMeasurementType,
}: MeasurementTypeListProps): JSX.Element => {
    const navigate = useNavigate();

    const onCreateClick = useCallback(() => navigate("/measurement/types/create", { replace: true }), [navigate]);
    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(filteredTypes.length, 20, 1, [filteredTypes]);
    const pageItems: Array<MeasurementType> = useMemo(() => paginate(filteredTypes), [paginate, filteredTypes]);
    const onHeaderCellClick = useSortColumn(setSortColumn, sortColumn);

    return (
        <section>
            <nav className="field is-grouped">
                <p className="control">
                    <Button
                        type="primary"
                        caption="Create"
                        title="Create new measurement type"
                        onClick={onCreateClick}
                    />
                </p>
            </nav>
            <div className="columns">
                <div className="column is-3">
                    <Search
                        searchType="byTyping"
                        caption="Start typing name to filter"
                        onSearch={filterTypes}
                        defaultValue={typeFilterCaption}
                    />
                </div>
            </div>
            {pageItems.length > 0
                &&
                <section>
                    <Table
                        headings={headings}
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
                            <MeasurementTypeListItem
                                key={x.id}
                                item={x}
                                deleteMeasurementType={deleteMeasurementType}
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
                    {isNullOrEmpty(typeFilterCaption)
                        ? `No measurement types were loaded\r\nTry refreshing page`
                        : "No measurement types were found by specified filter"
                    }
                </p>
            }
        </section>
    );
};

/** Measurements list */
export default connect(
    ({ measurements }: CompositeAppState) => ({
        ...measurements,
        sortColumn: measurements.measurementTypeSortColumn,
        typeFilterCaption: measurements.typeFilterCaption
    }),
    ({
        setSortColumn: getSetTypeSortColumnAction,
        deleteMeasurementType: deleteTypeRecord,
        filterTypes: getFilterMeasurementTypesAction,
    })
)(MeasurementTypeList);


/** Pre-defined measurement type table headings */
const headings: Array<TableHeading<MeasurementType>> = [
    { name: "color", caption: "Color", sortable: false, className: "has-text-centered th-color--light-blue width--is-725rem is-vertical-align--center" },
    { name: "caption", caption: "Name", sortable: true, className: "has-text-centered th-color--light-blue width--is-725rem is-vertical-align--center" },
    { name: "paymentTypeId", caption: "Payment type", sortable: true, className: "has-text-centered th-color--light-blue width--is-10rem is-vertical-align--center" },
    { caption: "Description", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center" },
    { caption: "Actions", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center width--is-15rem" },
];
