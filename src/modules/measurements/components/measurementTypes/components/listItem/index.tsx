import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getFontColorFromString, isNullOrUndefined } from "@bodynarf/utils";
import { ElementSize } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Tag from "@bodynarf/react.components/components/tag";

import { MeasurementType } from "@app/models/measurements";
import { ColorSquare } from "@app/sharedComponents/colorSquare";

/** Measurement type list item props type */
interface MeasurementTypeListItemProps {
    /** Measurement type information */
    item: MeasurementType;

    /** Delete specified measurement type */
    deleteMeasurementType: (id: number) => void;
}

/** Measurement type list item */
const MeasurementTypeListItem = ({
    item,
    deleteMeasurementType,
}: MeasurementTypeListItemProps): JSX.Element => {
    const navigate = useNavigate();

    const onEditClick = useCallback(() => navigate(`edit/${item.id}`, { replace: true }), [item.id, navigate]);
    const onDeleteClick = useCallback(() => deleteMeasurementType(item.id), [deleteMeasurementType, item]);

    return (
        <tr key={item.id}>
            <td className="has-text-centered is-vertical-align--center">
                <ColorSquare color={item.color} />
            </td>
            <td className="has-text-centered is-vertical-align--center">{item.caption}</td>
            <td className="has-text-centered is-vertical-align--center">
                <Tag
                    content={item.paymentTypeCaption}
                    customColor={isNullOrUndefined(item.paymentTypeColor) ? undefined : {
                        color: getFontColorFromString(item.paymentTypeColor!),
                        backgroundColor: item.paymentTypeColor!
                    }}
                />
            </td>
            <td>{item.description}</td>
            <td className="is-vertical-align--center">
                <div className="field is-grouped is-justify-content-space-evenly">
                    <div className="control">
                        <Button
                            type="warning"
                            icon={{ name: "pencil", size: ElementSize.Medium }}
                            onClick={onEditClick}
                            title="Edit record"
                        />
                    </div>
                    <div className="control">
                        <Button
                            type="danger"
                            icon={{ name: "trash", size: ElementSize.Medium }}
                            onClick={onDeleteClick}
                            title="Delete record"
                        />
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default MeasurementTypeListItem;
