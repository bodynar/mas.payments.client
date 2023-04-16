import { useEffect, useMemo, useState } from "react";

import { connect } from "react-redux";

import { TabItem } from "@bodynarf/react.components";
import Tabs from "@bodynarf/react.components/components/tabs";

/** */
interface StatsModuleProps {
    /** */
    configuration: Map<TabItem, JSX.Element>;

    /** */
    firstItem?: TabItem;
}

const tabsConfig: Array<TabItem> = [
    {
        caption: "Payments",
        id: "pmt",
    },
    {
        caption: "Measurements",
        id: "mrm",
    }
];

const StatsModule = ({
    firstItem, configuration,
}: StatsModuleProps): JSX.Element => {
    const firstTab: TabItem = useMemo(
        () => firstItem ?? configuration.keys().next().value,
        [configuration, firstItem]
    );

    const [tab, setTab] = useState<TabItem>(firstTab);

    useEffect(() => {
        if (!configuration.has(tab)) {
            throw new Error("Unrecognized tab selection");
        }
    }, [configuration, tab]);

    return (
        <>
            <Tabs
                defaultActive={tabsConfig[0]}
                items={tabsConfig}
                onActiveItemChange={setTab}
            />
            <section>
                {configuration.has(tab)
                    &&
                    configuration.get(tab)!
                }
            </section>
        </>
    );
};

export default
    connect(
        () => { },
        {

        }
    )(
        StatsModule
    )
    ;
