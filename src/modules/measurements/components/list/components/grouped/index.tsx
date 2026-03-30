import { FC, useMemo } from "react";
import { connect } from "react-redux";

import { isNullish } from "@bodynarf/utils";
import { usePagination } from "@bodynarf/react.components";
import Paginator from "@bodynarf/react.components/components/paginator";

import { groupMeasurements } from "@app/core/measurement";
import { Measurement, MeasurementFilter, MeasurementGroup, MeasurementType } from "@app/models/measurements";

import { deleteRecord } from "@app/redux/measurements";
import { CompositeAppState } from "@app/redux/types";

import MeasurementGroupItem from "./groupItem";

/** Measurement grouped list props type */
interface MeasurementGroupedViewProps {
    /** Is groups sorted ascending */
    isAscOrder: boolean;

    /** Is module state initialized */
    initialized: boolean;

    /** Items that was filtered by last filter */
    filteredItems: Array<Measurement>;

    /** Last applied filter */
    lastFilter?: MeasurementFilter;

    /** Measurement types map */
    typesMap: Map<string, MeasurementType>;

    /** Delete specified measurement */
    deleteMeasurement: (id: string) => void;
}

const MeasurementGroupedView: FC<MeasurementGroupedViewProps> = ({
    isAscOrder, filteredItems, initialized,
    lastFilter, typesMap,
    deleteMeasurement,
}) => {
    const groupedItems = useMemo(() => groupMeasurements(filteredItems, isAscOrder), [filteredItems, isAscOrder]);

    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(groupedItems.length, 10, 1, [groupedItems]);
    const pageItems: Array<MeasurementGroup> = useMemo(() => paginate(groupedItems) as Array<MeasurementGroup>, [paginate, groupedItems]);

    return (
        <section>
            {pageItems.length > 0
                &&
                <section>
                    {pageItems.map(x =>
                        <MeasurementGroupItem
                            key={x.caption}
                            item={x}
                            typesMap={typesMap}
                            deleteItem={deleteMeasurement}
                        />
                    )}
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
                    {isNullish(lastFilter)
                        ? `No measurements were loaded\r\nTry refreshing page`
                        : "No measurements were found by specified filter"
                    }
                </p>
            }
        </section>
    );
};

/** Measurement grouped list */
export default connect(
    ({ measurements }: CompositeAppState) => ({
        initialized: measurements.initialized,
        filteredItems: measurements.filteredItems,
        lastFilter: measurements.lastFilter,
        typesMap: measurements.typesMap,
    }),
    ({
        deleteMeasurement: deleteRecord,
    })
)(MeasurementGroupedView);
