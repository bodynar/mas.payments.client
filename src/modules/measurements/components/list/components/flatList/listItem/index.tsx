import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getFontColorFromString, isNullish } from "@bodynarf/utils";

import { ButtonStyle, ElementSize } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Tag from "@bodynarf/react.components/components/tag";

import { Measurement, MeasurementType } from "@app/models/measurements";

import { getMonthName } from "@app/utils";

/** Measurement list item props type */
interface MeasurementListItemProps {
    /** Measurement information */
    item: Measurement;

    /** Measurement types map */
    typesMap: Map<string, MeasurementType>;

    /** Delete specified item */
    deleteMeasurement: (id: string) => void;

    /** On type click handler */
    onTypeClick?: (typeId: string) => void;

    /**
     * Is component used in group view.
     * Removes month & year columns from display
     */
    useInGroupView?: boolean;
}

/** Measurement list item */
const MeasurementListItem: FC<MeasurementListItemProps> = ({
    item, typesMap, useInGroupView,
    deleteMeasurement, onTypeClick,
}) => {
    const navigate = useNavigate();

    const measurementType = typesMap.get(item.typeId);
    const typeCaption = measurementType?.caption ?? "";
    const typeColor = measurementType?.color;

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
                    content={typeCaption}
                    customColor={isNullish(typeColor) ? undefined : {
                        color: getFontColorFromString(typeColor!),
                        backgroundColor: typeColor!
                    }}
                    onClick={
                        isNullish(onTypeClick)
                            ? undefined
                            : onTypeBadgeClick
                    }
                    title={
                        isNullish(onTypeClick)
                            ? undefined
                            : `Filter by type "${typeCaption}" additionally`
                    }
                />
            </td>
            <td className="has-text-centered is-vertical-align--center">{item.value}</td>
            <td className="has-text-centered is-vertical-align--center">{item.diff}</td>
            <td>{item.description}</td>
            <td className="is-vertical-align--center">
                <div className="field is-grouped is-justify-content-space-evenly">
                    <div className="control">
                        <Button
                            style={ButtonStyle.Warning}
                            icon={{ name: "pencil", size: ElementSize.Medium }}
                            onClick={onEditClick}
                            title="Edit record"
                        />
                    </div>
                    <div className="control">
                        <Button
                            style={ButtonStyle.Danger}
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
