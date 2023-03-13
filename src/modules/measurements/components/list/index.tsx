import { useCallback, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ElementSize, SelectableItem } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import CheckBox from "@bodynarf/react.components/components/primitives/checkbox";

import { MeasurementFilter as MeasurementFilterModel } from "@app/models/measurements";

import { CompositeAppState } from "@app/redux";
import { getToggleGroupViewAction } from "@app/redux/measurements";

import { getDropdownItem } from "@app/core";

import MeasurementFilter from "../filter";
import MeasurementFlatList from "./components/flatList";
import MeasurementGroupedView from "./components/grouped";

/** Measurement list props type */
interface MeasurementListProps {
    /** Display measurements grouped by year */
    useGroupedView: boolean;

    /** Measurement types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Last applied fiter */
    lastFilter?: MeasurementFilterModel;

    /** Toggle grouping view */
    toggleUseGrouping: () => void;
}

const MeasurementList = ({
    lastFilter, useGroupedView,
    availableTypesAsDropdownItems,
    toggleUseGrouping,
}: MeasurementListProps): JSX.Element => {
    const navigate = useNavigate();

    const onCreateClick = useCallback(() => navigate("/measurement/create", { replace: true }), [navigate]);
    const onTypeManageClick = useCallback(() => navigate("/measurement/types", { replace: true }), [navigate]);
    const [selectedType, setType] = useState<SelectableItem | undefined>(getDropdownItem(availableTypesAsDropdownItems, lastFilter?.typeId));
    const [ascSortGroups, setAscSortGroups] = useState(false);

    const toggleGroupSort = useCallback(() => setAscSortGroups(oldValue => !oldValue), []);

    return (
        <section>
            <nav className="field is-grouped">
                <p className="control">
                    <Button
                        type="primary"
                        caption="Create"
                        onClick={onCreateClick}
                        title="Create new measurement record"
                    />
                </p>
                <p className="control">
                    <Button
                        type="info"
                        caption="Manage types"
                        outlined={true}
                        onClick={onTypeManageClick}
                        title="Open measurement types list"
                    />
                </p>
            </nav>
            <MeasurementFilter
                onTypeChange={setType}
                currentType={selectedType}
            />
            <div className="block columns">
                <div className="column is-3">
                    <CheckBox
                        onValueChange={toggleUseGrouping}
                        defaultValue={useGroupedView}
                        label={{
                            horizontal: true,
                            caption: "Use grouping by month"
                        }}
                    />
                </div>
                {useGroupedView
                    &&
                    <div className="column is-3">
                        <Button
                            type="ghost"
                            caption="Order by Date"
                            size={ElementSize.Small}
                            icon={{
                                position: "left",
                                name: ascSortGroups ? "sort-down" : "sort-up",
                                size: ElementSize.Medium,
                            }}
                            onClick={toggleGroupSort}
                        />
                    </div>
                }
            </div>
            {!useGroupedView
                &&
                <MeasurementFlatList setType={setType} />
            }
            {useGroupedView
                &&
                <MeasurementGroupedView isAscOrder={ascSortGroups} />
            }
        </section>
    );
};

/** Measurement list */
export default connect(
    ({ measurements }: CompositeAppState) => ({ ...measurements, }),
    ({ toggleUseGrouping: getToggleGroupViewAction })
)(MeasurementList);
