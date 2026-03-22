/** User notification story model */
export interface UserNotification {
    /** Date of creation */
    createdAt: Date | null;

    /** Date when notification was hidden */
    hiddenAt?: Date;

    /** Unique identifier */
    id: string | null;

    /** Was notification hidden */
    isHidden: boolean | null;

    /** Key. Can be used in grouping */
    key: string;

    /** Description */
    text: string;

    /** Title */
    title: string;

    /** Type */
    type: string;
}
