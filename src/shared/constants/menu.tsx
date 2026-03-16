import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

import { isStringEmpty } from "@bodynarf/utils";

import { MenuItem } from "@app/models";

import Payments from "@app/modules/payments";
import Measurements from "@app/modules/measurements";
import User from "@app/modules/user";

import { routes as userRoutes } from "@app/modules/user/components";
import { routes as paymentRoutes } from "@app/modules/payments/components";
import { routes as measurementRoutes } from "@app/modules/measurements/components";

import { tabsConfig } from "./charts";

const Stats = lazy(() => import("@app/modules/stats"));
const PaymentsChart = lazy(() => import("@app/modules/stats/components/payments"));
const MeasurementsChart = lazy(() => import("@app/modules/stats/components/measurements"));

/** Stats chart tab config to component map */
const statsTabsConfig = new Map([
	[tabsConfig[0], <Suspense fallback={<div className="has-text-centered p-6">Loading chart...</div>} key={tabsConfig[0].id}><PaymentsChart /></Suspense>],
	[tabsConfig[1], <Suspense fallback={<div className="has-text-centered p-6">Loading chart...</div>} key={tabsConfig[1].id}><MeasurementsChart /></Suspense>],
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
		component: (
			<Suspense fallback={<div className="has-text-centered p-6">Loading statistics...</div>}>
				<Stats firstItem={tabsConfig[0]} configuration={statsTabsConfig} />
			</Suspense>
		),
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
