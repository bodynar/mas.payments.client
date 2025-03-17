import cfg from "public/app.settings.json";

/** Delay before notification will be hidden */
export const NotificationHideDelay: number = cfg.Notification.HideDelay * 1000;

/** Amount of notification to show "Dismiss all" button */
export const NotificationCountToShowHideAll = cfg.Notification.ItemsRequiredToShowDismissAllBtn;

/** Delay before loading state gif will be hidden */
export const LoadingStateHideDelay: number = cfg.Request.LoaderMinSecondsLife * 1000;

/** Max length of performing request before aborting (in seconds) */
export const RequestTimeout: number = cfg.Request.Timeout * 1000;
