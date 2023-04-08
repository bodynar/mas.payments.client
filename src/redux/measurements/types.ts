import { SelectableItem } from "@bodynarf/react.components";

import { MeasurementType, Measurement, MeasurementFilter, MeasurementGroupedByType } from "@app/models/measurements";
import SortColumn from "@app/models/sortColumn";

/** Measurement module state */
export interface MeasurementModuleState {
    /** Is module state initialized */
    initialized: boolean;

    /** All measurements */
    measurements: Array<Measurement>;

    /** Measurements thats satisfy last filter */
    filteredItems: Array<Measurement>;

    /** All measurement types */
    availableTypes: Array<MeasurementType>;

    /** Measurement types filtered by caption */
    filteredTypes: Array<MeasurementType>;

    /** Measurement types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /**
     * Display measurements grouped by year.
     * @default false
    */
    useGroupedView: boolean;

    /** Last measurements applied filter */
    lastFilter?: MeasurementFilter;

    /** Current measurement sort column config */
    measurementSortColumn?: SortColumn<Measurement>;

    /** Current measurement type sort column config */
    measurementTypeSortColumn?: SortColumn<MeasurementType>;

    /** Last measurement type list caption filter */
    typeFilterCaption?: string;

    /** All measurements grouped by type */
    groupedByType?: Array<MeasurementGroupedByType>;
}
