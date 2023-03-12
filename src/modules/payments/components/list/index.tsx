import { useCallback, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ElementSize, SelectableItem } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import CheckBox from "@bodynarf/react.components/components/primitives/checkbox";

import { PaymentFilter as PaymentFilterModel } from "@app/models/payments";

import { CompositeAppState } from "@app/redux";
import { getToggleGroupViewAction } from "@app/redux/payments";

import { getDropdownItem } from "@app/core";

import PaymentFilter from "../filter";
import PaymentFlatList from "./components/flatList";
import PaymentGroupedView from "./components/grouped";

/** Payment list props type */
interface PaymentListProps {
    /** Display payments grouped by year */
    useGroupedView: boolean;

    /** Payment types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Last applied fiter */
    lastFilter?: PaymentFilterModel;

    /** Toggle grouping view */
    toggleUseGrouping: () => void;
}

const PaymentList = ({
    lastFilter, useGroupedView,
    availableTypesAsDropdownItems,
    toggleUseGrouping,
}: PaymentListProps): JSX.Element => {
    const navigate = useNavigate();

    const onCreateClick = useCallback(() => navigate("/payment/create", { replace: true }), [navigate]);
    const onTypeManageClick = useCallback(() => navigate("/payment/types", { replace: true }), [navigate]);
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
                        title="Create new payment record"
                    />
                </p>
                <p className="control">
                    <Button
                        type="info"
                        caption="Manage types"
                        outlined={true}
                        onClick={onTypeManageClick}
                        title="Open payment types list"
                    />
                </p>
            </nav>
            <PaymentFilter
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
                <PaymentFlatList setType={setType} />
            }
            {useGroupedView
                &&
                <PaymentGroupedView isAscOrder={ascSortGroups}/>
            }
        </section>
    );
};

/** Payments list */
export default connect(
    ({ payments }: CompositeAppState) => ({
        ...payments,
    }),
    ({
        toggleUseGrouping: getToggleGroupViewAction
    })
)(PaymentList);
