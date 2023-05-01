import { useCallback, useEffect, useRef, useState } from "react";

import { isNullOrUndefined } from "@bodynarf/utils";
import { SelectableItem } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Dropdown from "@bodynarf/react.components/components/dropdown";

import { monthsAsDropdownItems, yearsAsDropdownItems, getNowDate } from "@app/utils";
import { LookupDate } from "@app/models";

/** Chart date options component props type */
interface ChartDateOptionsProps {
    /** Row date captiom */
    caption: string;

    /** Default selected values */
    defaultValue?: LookupDate;

    /** Value change handler */
    onValueChage: (date: LookupDate) => void;
}

/** Chart date range border select component */
const ChartDateOptions = ({
    caption, onValueChage,
    defaultValue,
}: ChartDateOptionsProps): JSX.Element => {
    const isFirstRun = useRef(true);
    const [todayIsActive, setTodayIsActive] = useState(getDateIsToday(defaultValue));

    const [date, setDate] = useState<LookupDate>(defaultValue ?? {});

    useEffect(
        () => {
            if (isFirstRun.current) {
                isFirstRun.current = false;
                return;
            }

            onValueChage(date);

            setTodayIsActive(
                getDateIsToday(date)
            );
        },
        [date, onValueChage, setTodayIsActive]
    );

    const onMonthSelect = useCallback((item?: SelectableItem) => setDate(x => ({ ...x, month: item })), []);
    const onYearSelect = useCallback((item?: SelectableItem) => setDate(x => ({ ...x, year: item })), []);

    const onTodayClick = useCallback(
        () => {
            const { month, year } = getNowDate();

            setDate({
                month: monthsAsDropdownItems().find(({ value }) => +value === month),
                year: yearsAsDropdownItems().find(({ value }) => +value === year),
            });
        },
        []
    );

    const onClearButtonClick = useCallback(
        () => setDate({}),
        []
    );

    return (
        <div className="columns">
            <div className="column is-4">
                <Dropdown
                    placeholder="Month"
                    value={date.month}
                    deselectable={true}
                    hideOnOuterClick={true}
                    onSelect={onMonthSelect}
                    items={monthsAsDropdownItems()}
                    label={{
                        caption: caption,
                        horizontal: true,
                    }}
                />
            </div>
            <div className="column is-3">
                <Dropdown
                    placeholder="Year"
                    value={date.year}
                    deselectable={true}
                    onSelect={onYearSelect}
                    hideOnOuterClick={true}
                    items={yearsAsDropdownItems()}
                />
            </div>
            <div className="column is-1">
                <Button
                    type="success"
                    caption="Today"
                    outlined={true}
                    onClick={onTodayClick}
                    disabled={!todayIsActive}
                    title="Select current date"
                />
            </div>
            <div className="column">
                <Button
                    type="danger"
                    caption="Clear"
                    className="is-inverted"
                    onClick={onClearButtonClick}
                    title="Delete selected date"
                    disabled={isNullOrUndefined(date.month) || isNullOrUndefined(date.year)}
                />
            </div>
        </div>
    );
};

export default ChartDateOptions;

/**
 * Get is specified date describes current date (today)
 * @param date Selected date by lookups
 * @returns `true` if selected date is current date; otherwise - `false`
 */
const getDateIsToday = (date?: LookupDate): boolean => {
    const { month, year } = getNowDate();

    return isNullOrUndefined(date?.month) || isNullOrUndefined(date?.year)
        ? true
        : +date!.month!.value! !== month
        || +date!.year!.value! !== year;
};
