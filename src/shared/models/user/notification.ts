/** User notification story model */
export type UserNotification = {
    /** Date of creation */
    createdAt: Date;

    /** Date when notification was hidden */
    hiddenAt?: Date;

    /** Unique number */
    id: number;

    /** Was notification hidden */
    isHidden: boolean;

    /** Key. Can be used in grouping */
    key: string;

    /** Description */
    text: string;

    /** Title */
    title: string;

    /** Type */
    type: 'Info' | 'Warning';
};