import { SelectableItem } from "@bodynarf/react.components/components/dropdown";

import { EntityFilter, Lookup, SortColumn } from "@app/models";

import { AppState } from "@app/redux/app";
import { NotificatorState } from "@app/redux/notificator";
import { ModalState } from "@app/redux/modal";
import { UserModuleState } from "@app/redux/user";
import { PaymentModuleState } from "@app/redux/payments";
import { MeasurementModuleState } from "@app/redux/measurements";
import { StatisticsModuleState } from "@app/redux/stats";

/** Global application state */
export interface CompositeAppState {
    /** Modal box state */
    modal: ModalState;

    /** Notifications module state */
    notificator: NotificatorState;

    /** Application misc state */
    app: AppState;

    /** User module state */
    user: UserModuleState;

    /** Payments module state */
    payments: PaymentModuleState;

    /** Measurements module state */
    measurements: MeasurementModuleState;

    /** Statistics charts module */
    stats: StatisticsModuleState;
}

/**
 * Generic base state shared by all entity module slices.
 *
 * @template TRecord Domain record type (e.g. `Payment`, `Measurement`).
 *   Must carry all fields required by {@link EntityFilter}.
 * @template TType   Domain type/category model (e.g. `PaymentType`, `MeasurementType`).
 *   Must have `id: string` and `caption: string`.
 * @template TFilter Filter model for the record list. Must extend {@link EntityFilter}.
 */
export interface EntityModuleState<
    TRecord extends Required<EntityFilter>,
    TType extends Pick<Lookup, "id" | "caption">,
    TFilter extends EntityFilter,
> {
    /** Whether the module state has been loaded at least once */
    initialized: boolean;

    /** All records */
    records: Array<TRecord>;

    /** Records satisfying the last applied filter */
    filteredItems: Array<TRecord>;

    /** Types indexed by id */
    typesMap: Map<string, TType>;

    /** Types filtered by caption */
    filteredTypes: Array<TType>;

    /** Types mapped to dropdown items */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /**
     * Display records grouped by year.
     * @default false
     */
    useGroupedView: boolean;

    /** Last applied filter value */
    lastFilter?: TFilter;

    /** Current sort column config for records */
    sortColumn?: SortColumn<TRecord>;

    /** Current sort column config for types */
    typeSortColumn?: SortColumn<TType>;

    /** Active caption filter text for the type list */
    typeFilterCaption?: string;

    /** Zero-based index of the last visited pagination page */
    lastPage?: number;
}
