import { useEffect, useMemo, useState } from "react";

import { TabItem } from "@bodynarf/react.components";
import Tabs from "@bodynarf/react.components/components/tabs";

/** Stats module container props type */
interface StatsModuleProps {
    /** Available charts */
    configuration: Map<TabItem, JSX.Element>;

    /** Chart that should be presented first */
    firstItem?: TabItem;
}

/** Stats module container component */
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
                defaultActive={firstTab}
                items={Array.from(configuration.keys())}
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

export default StatsModule;
