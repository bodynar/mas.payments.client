/** Application information */
export interface ApplicationInfo {
    /** Name of current database (used by server) */
    dataBaseName: string;

    /** Version of server application */
    serverAppVersion: string;

    /** Version of client application */
    clientAppVersion: string;
}
