import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import { isNullOrEmpty, isUndefined } from "@bodynarf/utils";
import { SelectableItem } from "@bodynarf/react.components";

import { EntityFilter, SortColumn } from "@app/models";
import { Lookup } from "@app/models/lookup";
import { sort } from "@app/utils";

/** Base entity with date fields required for CRUD modules */
interface DateBasedEntity {
    /** Unique entity identifier */
    id: number;

    /** Month number (1–12) */
    month: number;

    /** Full year (e.g. 2026) */
    year: number;

    /** Related type identifier */
    typeId: number;
}

/** Base state shape for entity modules */
export interface BaseEntityModuleState<TItem extends DateBasedEntity, TType extends Lookup> {
    /** Whether the module has been initialized (data loaded) */
    initialized: boolean;

    /** Full list of entity items */
    items: Array<TItem>;

    /** Items after applying current filter */
    filteredItems: Array<TItem>;

    /** Map of type id to type object for quick lookup */
    typesMap: Map<number, TType>;

    /** Types after filtering/sorting */
    filteredTypes: Array<TType>;

    /** Types formatted as dropdown items */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Whether items are displayed grouped by type */
    useGroupedView: boolean;

    /** Last applied filter configuration */
    lastFilter?: EntityFilter;

    /** Current sort column for entity items */
    itemSortColumn?: SortColumn<TItem>;

    /** Current sort column for types */
    typeSortColumn?: SortColumn<TType>;

    /** Current type filter search string */
    typeFilterCaption?: string;

    /** Last visited page number (for pagination) */
    lastPage?: number;
}

interface CreateEntityModuleConfig<TItem extends DateBasedEntity> {
    /** Redux slice name */
    name: string;

    /** Filter function for entity items */
    filterFn: (items: Array<TItem>, filter?: EntityFilter) => Array<TItem>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Immer Draft<T> is incompatible with generics; cast via `any` is the standard workaround
type AnyState = any;

/**
 * Create a generic CRUD module with standard reducers and memoized selectors.
 * Eliminates duplication between payments and measurements modules.
 *
 * @example
 * const paymentsModule = createEntityModule<Payment, PaymentType>({
 *     name: "mas.payments/payment",
 *     filterFn: (items, filter) => filterEntities(items, filter),
 * });
 */
export const createEntityModule = <
    TItem extends DateBasedEntity,
    TType extends Lookup,
>(config: CreateEntityModuleConfig<TItem>) => {
    type State = BaseEntityModuleState<TItem, TType>;

    const initialState: State = {
        initialized: false,
        items: [],
        filteredItems: [],
        typesMap: new Map(),
        availableTypesAsDropdownItems: [],
        filteredTypes: [],
        useGroupedView: false,
    };

    const slice = createSlice({
        name: config.name,
        initialState: initialState as AnyState,
        reducers: {
            setItems(state: AnyState, action: PayloadAction<TItem[]>) {
                const items = action.payload;
                state.items = items;
                state.filteredItems = state.lastFilter
                    ? config.filterFn(items, state.lastFilter)
                    : items;
            },
            setTypes(state: AnyState, action: PayloadAction<TType[]>) {
                const types = action.payload;
                state.typesMap = new Map(types.map(t => [t.id, t]));
                state.availableTypesAsDropdownItems = types.map(({ id, caption }) => ({
                    id: id.toString(),
                    displayValue: caption,
                    value: id.toString(),
                }) as SelectableItem);
                state.filteredTypes = types;
            },
            setInitialized(state: AnyState, action: PayloadAction<boolean>) {
                if (!isUndefined(action.payload)) {
                    state.initialized = action.payload;
                }
            },
            setFilterValue: {
                reducer(state: AnyState, action: PayloadAction<{ filter?: EntityFilter; applyFilter: boolean }>) {
                    const { filter, applyFilter } = action.payload;

                    if (isUndefined(filter)) {
                        state.lastFilter = filter;
                        state.filteredItems = state.items;
                    } else {
                        state.lastFilter = filter;
                        if (applyFilter) {
                            state.filteredItems = config.filterFn(state.items, filter);
                        }
                    }
                },
                prepare(filter?: EntityFilter, applyFilter: boolean = false) {
                    return { payload: { filter, applyFilter } };
                },
            },
            applyFilter(state: AnyState) {
                state.filteredItems = config.filterFn(state.items, state.lastFilter);
            },
            setItemSortColumn(state: AnyState, action: PayloadAction<SortColumn<TItem>>) {
                state.itemSortColumn = action.payload;
                state.filteredItems = sort(state.filteredItems, action.payload);
            },
            setTypeSortColumn(state: AnyState, action: PayloadAction<SortColumn<TType>>) {
                const sortColumn = action.payload;
                state.typeSortColumn = sortColumn;
                const allTypes = sort([...state.typesMap.values()], sortColumn);
                state.filteredTypes = allTypes.filter(
                    ({ caption }: TType) => caption.toLocaleLowerCase().includes(
                        (state.typeFilterCaption ?? "").toLocaleLowerCase()
                    )
                );
            },
            filterTypes(state: AnyState, action: PayloadAction<string | undefined>) {
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
                    ({ caption }: TType) => caption.toLocaleLowerCase().includes(lowered)
                );
                state.typeFilterCaption = filterValue!;
            },
            toggleGroupView(state: AnyState) {
                state.useGroupedView = !state.useGroupedView;
            },
            setCurrentPage(state: AnyState, action: PayloadAction<number>) {
                state.lastPage = action.payload;
            },
        },
    });

    /**
     * Create memoized selectors bound to a specific state slice.
     * @param stateSelector - Function that extracts the entity module state from the root state
     * @returns Object with `selectFilteredItems`, `selectSortedFilteredItems`, and `selectFilteredTypes` selectors
     */
    const createSelectors = (stateSelector: (root: unknown) => State) => ({
        selectFilteredItems: createSelector(
            [stateSelector],
            (state) => config.filterFn(state.items, state.lastFilter)
        ),
        selectSortedFilteredItems: createSelector(
            [
                (root: unknown) => config.filterFn(
                    stateSelector(root).items,
                    stateSelector(root).lastFilter
                ),
                (root: unknown) => stateSelector(root).itemSortColumn,
            ],
            (filtered, sortColumn) => sortColumn ? sort(filtered, sortColumn) : filtered
        ),
        selectFilteredTypes: createSelector(
            [stateSelector],
            ({ typesMap, typeSortColumn, typeFilterCaption }) => {
                let types = [...typesMap.values()];
                if (typeSortColumn) {
                    types = sort(types, typeSortColumn);
                }
                if (typeFilterCaption) {
                    const lowered = typeFilterCaption.toLocaleLowerCase();
                    types = types.filter(({ caption }) =>
                        caption.toLocaleLowerCase().includes(lowered)
                    );
                }
                return types;
            }
        ),
    });

    return {
        /** Generated Redux Toolkit slice */
        slice,
        /** Slice action creators */
        actions: slice.actions,
        /** Slice reducer */
        reducer: slice.reducer,
        /** Initial state for the module */
        initialState,
        /** Factory for creating memoized selectors */
        createSelectors,
    };
};
