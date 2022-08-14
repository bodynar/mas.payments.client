import moment from "moment";

/** User notification story model */
export type UserNotification = {
    /** Date of creation */
    createdAt: Date;

    /** Date of creation as instance of Momentjs object */
    createdAtMoment: moment.Moment;

    /** Date when notification was hidden */
    hiddenAt?: Date;

    /** Date when notification was hidden as instance of Momentjs object */
    hiddenAtMoment?: moment.Moment;

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
