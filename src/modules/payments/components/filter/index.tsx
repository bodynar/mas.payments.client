import { useCallback, useMemo, useState } from "react";

import { connect } from "react-redux";

import { isNullOrUndefined } from "@bodynarf/utils";

import Dropdown from "@bodynarf/react.components/components/dropdown";
import { SelectableItem } from "@bodynarf/react.components/components/dropdown/types";
import Button from "@bodynarf/react.components/components/button";

import { CompositeAppState } from "@app/redux/rootReducer";

import Accordion from "@app/sharedComponents/accordion";

import { monthsAsDropdownItems } from "@app/static/months";
import { yearsAsDropdownItems } from "@app/static/years";

import { PaymentFilter } from "@app/models/payments";

import { getSetFilterValueAction } from "@app/redux/payments/actions/setFilterValue";
import { getFilterPaymentsAction } from "@app/redux/payments/actions/filterPayments";

/** Payment filter props types */
type PaymentFiltersProps = {
    /** Payment filter value */
    filterValue?: PaymentFilter;

    /** Available payment types as dropdown items*/
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Store filter value */
    setFilterValue: (filterValue?: PaymentFilter) => void;

    /** Apply current filter */
    filter: () => void;
};

/**
 * @private
 * Find dropdown item by value
 * @param dropdownItems Dropdown items
 * @param item Item value
 * @returns Found dropdown item; otherwise `undefined`
 */
const getDropdownItem = (dropdownItems: Array<SelectableItem>, item?: number): SelectableItem | undefined => {
    if (isNullOrUndefined(item)) {
        return undefined;
    }

    const foundItem = dropdownItems.find(({ value }) => item === +value);

    return foundItem;
};

/** Payments module filter */
const PaymentFilters = ({
    filterValue,
    setFilterValue, filter,
    availableTypesAsDropdownItems,
}: PaymentFiltersProps): JSX.Element => {
    const selectableMonths = useMemo(() => monthsAsDropdownItems(), []);
    const selectableYears = useMemo(() => yearsAsDropdownItems(), []);

    const [selectedMonth, setMonth] = useState<SelectableItem | undefined>(getDropdownItem(selectableMonths, filterValue?.month));
    const [selectedYear, setYear] = useState<SelectableItem | undefined>(getDropdownItem(selectableYears, filterValue?.year));
    const [selectedType, setType] = useState<SelectableItem | undefined>(getDropdownItem(availableTypesAsDropdownItems, filterValue?.typeId));

    const onItemSelect = useCallback(
        (propertyName: keyof PaymentFilter,
            setter: (item?: SelectableItem) => void,
            item?: SelectableItem
        ) => {
            setter(item);

            setFilterValue({
                ...filterValue,
                [propertyName]: isNullOrUndefined(item) ? undefined : +item!.value,
            });
        }, [filterValue, setFilterValue]);

    const onMonthSelect = useCallback((item?: SelectableItem) => onItemSelect("month", setMonth, item), [onItemSelect]);
    const onYearSelect = useCallback((item?: SelectableItem) => onItemSelect("year", setYear, item), [onItemSelect]);
    const onTypeSelect = useCallback((item?: SelectableItem) => onItemSelect("typeId", setType, item), [onItemSelect]);

    const onClearClick = useCallback(() => [setFilterValue, setMonth, setYear, setType].forEach(x => x(undefined)), [setFilterValue]);

    return (
        <Accordion
            caption="Filters"
            style="info"
        >
            <div className="field is-horizontal">
                <div className="field-label is-normal is-flex-grow-035 has-text-left">
                    <label className="label">
                        Year
                    </label>
                </div>
                <div className="field-body">
                    <div className="control">
                        <Dropdown
                            placeholder="Year"
                            hideOnOuterClick={true}
                            deselectable={true}
                            items={selectableYears}
                            value={selectedYear}
                            onSelect={onYearSelect}
                        />
                    </div>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label is-normal is-flex-grow-035 has-text-left">
                    <label className="label">
                        Month
                    </label>
                </div>
                <div className="field-body">
                    <div className="control">
                        <Dropdown
                            placeholder="Month"
                            hideOnOuterClick={true}
                            deselectable={true}
                            items={selectableMonths}
                            value={selectedMonth}
                            onSelect={onMonthSelect}
                        />
                    </div>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label is-normal is-flex-grow-035 has-text-left">
                    <label className="label">
                        Type
                    </label>
                </div>
                <div className="field-body">
                    <div className="control">
                        <Dropdown
                            placeholder="Type"
                            hideOnOuterClick={true}
                            deselectable={true}
                            items={availableTypesAsDropdownItems}
                            value={selectedType}
                            onSelect={onTypeSelect}
                        />
                    </div>
                </div>
            </div>

            <div className="field is-grouped mt-4">
                <p className="control">
                    <Button
                        type="success"
                        caption="Filter"
                        onClick={filter}
                    />
                </p>
                <p className="control">
                    <Button
                        type="info"
                        caption="Clear"
                        outlined={true}
                        onClick={onClearClick}
                        disabled={isNullOrUndefined(filterValue)}
                    />
                </p>
            </div>
        </Accordion>
    );
};

/** Payments module filter */
export default connect(
    ({ payments }: CompositeAppState) => ({
        filterValue: payments.lastFilter,
        availableTypesAsDropdownItems: payments.availableTypesAsDropdownItems,
    }),
    ({
        setFilterValue: getSetFilterValueAction,
        filter: getFilterPaymentsAction
    })
)(PaymentFilters);
