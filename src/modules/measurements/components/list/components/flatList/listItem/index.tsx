import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getFontColorFromString, isNullOrUndefined } from "@bodynarf/utils";

import { ElementSize } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Tag from "@bodynarf/react.components/components/tag";

import { Measurement } from "@app/models/measurements";

import { getMonthName } from "@app/static";

/** Measurement list item props type */
interface MeasurementListItemProps {
    /** Measurement information */
    item: Measurement;

    /** Delete specified item */
    deleteMeasurement: (id: number) => void;

    /** On type click handler */
    onTypeClick?: (typeId: number) => void;

    /**
     * Is component used in group view.
     * Removes month & year columns from display
     */
    useInGroupView?: boolean;
}

/** Measurement list item */
const MeasurementListItem = ({
    item, useInGroupView,
    deleteMeasurement, onTypeClick,
}: MeasurementListItemProps): JSX.Element => {
    const navigate = useNavigate();

    const onEditClick = useCallback(() => navigate(`edit/${item.id}`, { replace: true }), [item.id, navigate]);
    const onDeleteClick = useCallback(() => deleteMeasurement(item.id), [deleteMeasurement, item]);
    const onTypeBadgeClick = useCallback(() => onTypeClick!(item.typeId), [item.typeId, onTypeClick]);

    return (
        <tr key={item.id}>
            {useInGroupView !== true
                &&
                <>
                    <td className="has-text-centered is-vertical-align--center">{getMonthName(item.month)}</td>
                    <td className="has-text-centered is-vertical-align--center">{item.year}</td>
                </>
            }
            <td className="has-text-centered is-vertical-align--center">
                <Tag
                    content={item.typeCaption}
                    customColor={isNullOrUndefined(item.typeColor) ? undefined : {
                        color: getFontColorFromString(item.typeColor!),
                        backgroundColor: item.typeColor!
                    }}
                    onClick={
                        isNullOrUndefined(onTypeClick)
                            ? undefined
                            : onTypeBadgeClick
                    }
                    title={
                        isNullOrUndefined(onTypeClick)
                            ? undefined
                            : `Filter by type "${item.typeCaption}" additionaly`
                    }
                />
            </td>
            <td className="has-text-centered is-vertical-align--center">{item.value}</td>
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

export default MeasurementListItem;
