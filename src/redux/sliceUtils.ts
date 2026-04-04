import { isUndefined, isNullOrEmpty } from "@bodynarf/utils";
import { PayloadAction } from "@reduxjs/toolkit";
import { SelectableItem } from "@bodynarf/react.components";

import { EntityFilter, SortColumn } from "@app/models";
import { sort } from "@app/utils";
import { filterEntities } from "@app/core";

/** Slice state that tracks module initialization */
interface WithInitialized {
    /** Whether the module state has been loaded at least once */
    initialized: boolean;
}

/** Slice state that supports toggling a grouped view */
interface WithGroupedView {
    /** Whether records are displayed in a grouped layout */
    useGroupedView: boolean;
}

/** Slice state that persists the last visited page number */
interface WithLastPage {
    /** Zero-based index of the last visited pagination page */
    lastPage?: number;
}

/**
 * Shared reducer: initialise the module state.
 * Accepted by any slice state that contains `initialized`.
 */
export const setModuleInitializedStateReducer = (
    state: WithInitialized,
    action: PayloadAction<boolean>,
): void => {
    if (!isUndefined(action.payload)) {
        state.initialized = action.payload;
    }
};

/**
 * Shared reducer: toggle grouped view flag.
 * Accepted by any slice state that contains `useGroupedView`.
 */
export const toggleGroupViewReducer = (state: WithGroupedView): void => {
    state.useGroupedView = !state.useGroupedView;
};

/**
 * Shared reducer: persist the last visited page number.
 * Accepted by any slice state that contains `lastPage`.
 */
export const setCurrentPageReducer = (
    state: WithLastPage,
    action: PayloadAction<number>,
): void => {
    state.lastPage = action.payload;
};

// ---------------------------------------------------------------------------
// Shared interfaces for record + type list state
// ---------------------------------------------------------------------------

/** Slice state with a filterable list of records */
interface WithRecords<TRecord extends Required<EntityFilter>, TFilter extends EntityFilter> {
    /** All records */
    records: Array<TRecord>;

    /** Records satisfying the last applied filter */
    filteredItems: Array<TRecord>;

    /** Last applied filter value */
    lastFilter?: TFilter;
}

/** Slice state holding a type map and its projected views */
interface WithTypeMap<TType extends { id: string; caption: string; }> {
    /** Types indexed by id */
    typesMap: Map<string, TType>;

    /** Types mapped to dropdown items */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Types visible in the list */
    filteredTypes: Array<TType>;
}

/** Slice state with a sort column for the record list */
interface WithSortColumn<TRecord> {
    /** Current sort config for records */
    sortColumn?: SortColumn<TRecord>;

    /** Records visible in the list */
    filteredItems: Array<TRecord>;
}

/** Slice state with a sort column and caption filter for the type list */
interface WithTypeSortColumn<TType extends { caption: string; }> {
    /** Types indexed by id */
    typesMap: Map<string, TType>;

    /** Current sort config for types */
    typeSortColumn?: SortColumn<TType>;

    /** Types visible in the list */
    filteredTypes: Array<TType>;

    /** Active caption filter text */
    typeFilterCaption?: string;
}

// ---------------------------------------------------------------------------
// Shared reducers for record + type list state
// ---------------------------------------------------------------------------

/**
 * Shared factory: create a `setFilterValue` reducer + prepare pair.
 * Usage: `setFilterValue: createSetFilterValueReducer<MyRecord, MyFilter>()`
 */
export const createSetFilterValueReducer = <
    TRecord extends Required<EntityFilter>,
    TFilter extends EntityFilter,
>() => ({
    reducer(
        state: WithRecords<TRecord, TFilter>,
        action: PayloadAction<{ filter?: TFilter; applyFilter: boolean; }>,
    ): void {
        const { filter, applyFilter } = action.payload;
        if (isUndefined(filter)) {
            state.lastFilter = filter;
            state.filteredItems = state.records;
        } else {
            state.lastFilter = filter;
            if (applyFilter) {
                state.filteredItems = filterEntities(state.records, filter);
            }
        }
    },
    prepare(filter?: TFilter, applyFilter: boolean = false) {
        return { payload: { filter, applyFilter } };
    },
});

/**
 * Shared reducer: populate the type map, dropdown list, and filtered types
 * from a new types array. Call via a domain-named one-liner:
 * `setPaymentTypes(state, action) { setTypesReducer(state, action); }`
 */
export const setTypesReducer = <TType extends { id: string; caption: string; }>(
    state: WithTypeMap<TType>,
    action: PayloadAction<Array<TType>>,
): void => {
    const types = action.payload;

    state.typesMap = new Map(types.map(t => [t.id, t]));
    state.availableTypesAsDropdownItems = types.map(({ id, caption }) => ({
        id: id.toString(),
        displayValue: caption,
        value: id.toString(),
    }) as SelectableItem);

    state.filteredTypes = types;
};

/**
 * Shared reducer: reapply the last filter to the record list.
 * Call via a domain-named one-liner:
 * `filterPayments(state) { filterItemsReducer(state); }`
 */
export const filterItemsReducer = <
    TRecord extends Required<EntityFilter>,
    TFilter extends EntityFilter,
>(state: WithRecords<TRecord, TFilter>): void => {
    state.filteredItems = filterEntities(state.records, state.lastFilter);
};

/**
 * Shared reducer: apply a sort column to the record list view.
 * Call via a domain-named one-liner:
 * `setSortColumn(state, action) { setSortColumnReducer(state, action); }`
 */
export const setSortColumnReducer = <TRecord>(
    state: WithSortColumn<TRecord>,
    action: PayloadAction<SortColumn<TRecord>>,
): void => {
    state.sortColumn = action.payload;
    state.filteredItems = sort(state.filteredItems, action.payload);
};

/**
 * Shared reducer: apply a sort column to the type list and re-filter by caption.
 * Call via a domain-named one-liner:
 * `setTypeSortColumn(state, action) { setTypeSortColumnReducer(state, action); }`
 */
export const setTypeSortColumnReducer = <TType extends { caption: string; }>(
    state: WithTypeSortColumn<TType>,
    action: PayloadAction<SortColumn<TType>>,
): void => {
    const sortColumn = action.payload;
    state.typeSortColumn = sortColumn;
    const allTypes = sort([...state.typesMap.values()], sortColumn);

    state.filteredTypes = allTypes.filter(
        ({ caption }) => caption.toLocaleLowerCase().includes(state.typeFilterCaption?.toLocaleLowerCase() ?? "")
    );
};

/**
 * Shared reducer: filter the type list by a caption substring.
 * Call via a domain-named one-liner:
 * `filterPaymentTypes(state, action) { filterTypesReducer(state, action); }`
 */
export const filterTypesReducer = <TType extends { caption: string; }>(
    state: WithTypeSortColumn<TType>,
    action: PayloadAction<string | undefined>,
): void => {
    const filterValue = action.payload;
    const allTypes = state.typeSortColumn
        ? sort([...state.typesMap.values()], state.typeSortColumn)
        : [...state.typesMap.values()];

    if (isNullOrEmpty(filterValue)) {
        state.filteredTypes = allTypes;
        return;
    }

    const lowered = filterValue!.toLocaleLowerCase();
    state.filteredTypes = allTypes.filter(
        ({ caption }) => caption.toLocaleLowerCase().includes(lowered)
    );

    state.typeFilterCaption = filterValue!;
};
