import { FC, useCallback, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ButtonStyle, ElementPosition, ElementSize, SelectableItem } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import CheckBox from "@bodynarf/react.components/components/primitives/checkbox";

import { MeasurementFilter as MeasurementFilterModel } from "@app/models/measurements";

import { CompositeAppState } from "@app/redux";
import { toggleGroupView, loadMeasurements } from "@app/redux/measurements";

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

    /** Last applied filter */
    lastFilter?: MeasurementFilterModel;

    /** Toggle grouping view */
    toggleUseGrouping: () => void;

    /** Reload measurements from server */
    reloadMeasurements: () => void;
}

const MeasurementList: FC<MeasurementListProps> = ({
    lastFilter, useGroupedView,
    availableTypesAsDropdownItems,
    toggleUseGrouping,
    reloadMeasurements,
}) => {
    const navigate = useNavigate();

    const onCreateClick = useCallback(() => navigate("/measurement/create"), [navigate]);
    const onTypeManageClick = useCallback(() => navigate("/measurement/types"), [navigate]);
    const onReloadClick = useCallback(() => reloadMeasurements(), [reloadMeasurements]);
    const [selectedType, setType] = useState<SelectableItem | undefined>(getDropdownItem(availableTypesAsDropdownItems, lastFilter?.typeId));
    const [ascSortGroups, setAscSortGroups] = useState(false);

    const toggleGroupSort = useCallback(() => setAscSortGroups(oldValue => !oldValue), []);

    return (
        <section>
            <nav className="field is-grouped">
                <p className="control">
                    <Button
                        style={ButtonStyle.Primary}
                        caption="Create"
                        onClick={onCreateClick}
                        title="Create new measurement record"
                    />
                </p>
                <p className="control">
                    <Button
                        style={ButtonStyle.Info}
                        caption="Manage types"
                        outlined
                        onClick={onTypeManageClick}
                        title="Open measurement types list"
                    />
                </p>
                <p className="control">
                    <Button
                        style={ButtonStyle.Success}
                        outlined
                        icon={{ name: "arrow-clockwise", position: ElementPosition.Left, size: ElementSize.Medium }}
                        onClick={onReloadClick}
                        title="Reload measurements"
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
                            style={ButtonStyle.Ghost}
                            caption="Order by Date"
                            size={ElementSize.Small}
                            icon={{
                                position: ElementPosition.Left,
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
    ({ measurements }: CompositeAppState) => ({
        useGroupedView: measurements.useGroupedView,
        availableTypesAsDropdownItems: measurements.availableTypesAsDropdownItems,
        lastFilter: measurements.lastFilter,
    }),
    ({ toggleUseGrouping: toggleGroupView, reloadMeasurements: loadMeasurements })
)(MeasurementList);
