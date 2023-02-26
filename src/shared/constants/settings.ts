import config from "../../../app.settings.json";

/** Delay before notification will be hidden */
export const NotificationHideDelay: number = config.Notification.HideDelay * 1000;

/** Amount of notification to show "Dismiss all" button */
export const NotificationCountToShowHideAll = config.Notification.ItemsRequiredToShowDismissAllBtn;

/** Delay before loading state gif will be hidden */
export const LoadingStateHideDelay: number = config.Request.LoaderMinSecondsLife * 1000;

/** Max lenght of performing request before aborting (in seconds) */
export const RequestTimeout: number = config.Request.Timeout * 1000;
