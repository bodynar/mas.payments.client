import { RouteItem } from "@app/models/routeItem";

import MeasurementList from "./list";
// import MeasurementCard from "./edit";

// import { routes as typeRoutes } from "./measurementTypes/routes";
// import MeasurementTypeSubModule from "./measurementTypes/component";

/** Measurements module sub-routes */
export const routes: Array<RouteItem> = [
    {
        link: "/measurement",
        name: "Measurement list",
        component: <MeasurementList/>,
    },
    {
        link: "/measurement/create",
        name: "Create new measurement",
        component: <>Card</>,
        // component: <MeasurementCard/>,
    },
    {
        link: "/measurement/edit/:id",
        name: "Edit measurement",
        component: <>Card</>,
        // component: <MeasurementCard/>,
    },
    {
        link: "/measurement/types",
        name: "Measurement types",
        component: <>Types</>
        // component: <MeasurementTypeSubModule/>,
        // children: typeRoutes
    },
];
