/** Base interface for component props */
export type BaseElementProps = {
    /** Additional class names */
    className?: string;

    /** Title */
    title?: string;

    /** Extra data-* attributes */
    data?: {
        /**Will add data-{key} attribute to element */
        [key: string]: any;
    };
};

export type IconSize =
    | 'small'
    | 'medium' /** default size */
    | 'large';

export type IconPosition =
    | 'left'
    | 'right';

/** Icon for component configuration */
export type ElementIcon = {
    /**
     * Class name for icon.
     * Used to display icon from bootstrap-icons
    */
    className: string;

    /** Icon size */
    size?: IconSize;

    /**
     * Position
     * Works only with other content
    */
    position?: IconPosition;
};
