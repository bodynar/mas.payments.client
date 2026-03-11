import { FC, useCallback, useState } from "react";

import { isNullish } from "@bodynarf/utils";
import { ButtonStyle, SelectableItem, useUpdateEffect } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Dropdown from "@bodynarf/react.components/components/dropdown";

import { monthsAsDropdownItems, yearsAsDropdownItems, getNowDate } from "@app/utils";
import { LookupDate } from "@app/models";

/** Chart date options component props type */
interface ChartDateOptionsProps {
    /** Row date caption */
    caption: string;

    /** Default selected values */
    defaultValue?: LookupDate;

    /** Value change handler */
    onValueChange: (date: LookupDate) => void;
}

/** Chart date range border select component */
const ChartDateOptions: FC<ChartDateOptionsProps> = ({
    caption, onValueChange,
    defaultValue,
}) => {
    const [todayIsActive, setTodayIsActive] = useState(getDateIsToday(defaultValue));

    const [date, setDate] = useState<LookupDate>(defaultValue ?? {});

    useUpdateEffect(
        () => {
            onValueChange(date);

            setTodayIsActive(
                getDateIsToday(date)
            );
        },
        [date, onValueChange, setTodayIsActive]
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
                    style={ButtonStyle.Success}
                    caption="Today"
                    outlined={true}
                    onClick={onTodayClick}
                    disabled={!todayIsActive}
                    title="Select current date"
                />
            </div>
            <div className="column">
                <Button
                    style={ButtonStyle.Danger}
                    caption="Clear"
                    className="is-inverted"
                    onClick={onClearButtonClick}
                    title="Clear selected date"
                    disabled={isNullish(date.month) && isNullish(date.year)}
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

    return isNullish(date?.month) || isNullish(date?.year)
        ? true
        : +date!.month!.value! !== month
        || +date!.year!.value! !== year;
};
