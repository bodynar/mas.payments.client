import { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";

import { isNullOrUndefined, isObjectEmpty } from "@bodynarf/utils";

import { ElementColor, SelectableItem } from "@bodynarf/react.components";
import Dropdown from "@bodynarf/react.components/components/dropdown";
import Button from "@bodynarf/react.components/components/button";

import { CompositeAppState } from "@app/redux";
import { getFilterPaymentsAction, getSetFilterValueAction } from "@app/redux/payments";

import Accordion from "@app/sharedComponents/accordion";

import { monthsAsDropdownItems, yearsAsDropdownItems } from "@app/static";
import { getDropdownItem } from "@app/core";
import { PaymentFilter } from "@app/models/payments";

/** Payment filter props types */
interface PaymentFiltersProps {
    /** Payment filter value */
    filterValue?: PaymentFilter;

    /** Available payment types as dropdown items*/
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Store filter value */
    setFilterValue: (filterValue?: PaymentFilter) => void;

    /** Apply current filter */
    filter: () => void;

    /** Current payment type selected as filter value */
    currentType?: SelectableItem,

    /** On payment type change */
    onTypeChange: (type?: SelectableItem) => void;
}

/** Payments module filter */
const PaymentFilters = ({
    filterValue,
    setFilterValue, filter,
    currentType, onTypeChange,
    availableTypesAsDropdownItems,
}: PaymentFiltersProps): JSX.Element => {
    const [selectedMonth, setMonth] = useState<SelectableItem | undefined>(getDropdownItem(monthsAsDropdownItems(), filterValue?.month));
    const [selectedYear, setYear] = useState<SelectableItem | undefined>(getDropdownItem(yearsAsDropdownItems(), filterValue?.year));

    const onItemSelect = useCallback(
        (propertyName: keyof PaymentFilter,
            setter: (item?: SelectableItem) => void,
            item?: SelectableItem
        ) => {
            setter(item);

            const newValue = {
                ...filterValue,
                [propertyName]: isNullOrUndefined(item) ? undefined : +item!.value,
            };

            setFilterValue(isObjectEmpty(newValue) ? undefined : newValue);
        }, [filterValue, setFilterValue]);

    const onMonthSelect = useCallback((item?: SelectableItem) => onItemSelect("month", setMonth, item), [onItemSelect]);
    const onYearSelect = useCallback((item?: SelectableItem) => onItemSelect("year", setYear, item), [onItemSelect]);
    const onTypeSelect = useCallback((item?: SelectableItem) => onItemSelect("typeId", onTypeChange, item), [onItemSelect, onTypeChange]);

    const onClearClick = useCallback(() => [setFilterValue, setMonth, setYear, onTypeChange].forEach(x => x(undefined)), [setFilterValue, onTypeChange]);

    const accordionCaption = useMemo(() => {
        const appliedFiltersCount =
            [selectedMonth, selectedYear, currentType]
                .filter(x => !isNullOrUndefined(x))
                .length;

        return appliedFiltersCount > 0 ? `Filters (${appliedFiltersCount})` : "Filters";
    }, [selectedMonth, selectedYear, currentType]);

    return (
        <Accordion
            caption={accordionCaption}
            style={ElementColor.Info}
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
                            items={yearsAsDropdownItems()}
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
                            items={monthsAsDropdownItems()}
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
                            value={currentType}
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
