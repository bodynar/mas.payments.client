import { Navigate } from "react-router-dom";

import { isStringEmpty } from "@bodynarf/utils";

import { MenuItem } from "@app/models/routeItem";

import Payments from "@app/modules/payments";
import Measurements from "@app/modules/measurements";
import Stats from "@app/modules/stats";
import User from "@app/modules/user";

import { routes as userRoutes } from "@app/modules/user/components";
import { routes as paymentRoutes } from "@app/modules/payments/components";
import { routes as measurementRoutes } from "@app/modules/measurements/components";

import PaymentsChart from "@app/modules/stats/components/payments";
import MeasurementsChart from "@app/modules/stats/components/measurements";

import { tabsConfig } from "./charts";

/** Stats chart tab config to component map */
const statsTabsConfig = new Map([
	[tabsConfig[0], <PaymentsChart key={tabsConfig[0].id} />],
	[tabsConfig[1], <MeasurementsChart key={tabsConfig[1].id} />],
]);

/** Static navbar menu */
export const menuItems: Array<MenuItem> = [
	{
		name: "root",
		caption: "",
		link: "/",
		component: <Navigate to="/user/appInfo" replace />,
		display: false,
	},
	{
		name: "Payments",
		caption: "Payments",
		link: "/payment",
		component: <Payments />,
		children: paymentRoutes
	},
	{
		name: "Measurements",
		caption: "Measurements",
		link: "/measurement",
		component: <Measurements />,
		children: measurementRoutes,
	},
	{
		name: "Stats",
		caption: "Statistics",
		link: "/stats",
		component: <Stats firstItem={tabsConfig[0]} configuration={statsTabsConfig} />,
	},
	{
		name: "User",
		caption: "User",
		link: "/user",
		component: <User />,
		display: false,
		children: userRoutes
	},
]
	.filter(x => !isStringEmpty(x.name) && !isStringEmpty(x.link));
