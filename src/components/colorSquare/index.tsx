import "./style.scss";

/** Color preview component props type */
interface ColorSquareProps {
    /** Color in hex */
    color?: string;
}

/** Color preview in square */
export const ColorSquare = ({
    color
}: ColorSquareProps): JSX.Element => {
    return (
        <span
            className="app-color-preview-square"
            style={{ backgroundColor: color }}
            title={color ?? "Color isn't set"}
        />
    );
};
