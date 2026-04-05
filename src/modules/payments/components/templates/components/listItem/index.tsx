import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getFontColorFromString, isNullish } from "@bodynarf/utils";
import { ButtonStyle, ElementSize } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Tag from "@bodynarf/react.components/components/tag";

import { PaymentGroupTemplate } from "@app/models/payments";

interface TemplateListItemProps {
    /** Template information */
    item: PaymentGroupTemplate;

    /** Delete specified template */
    deleteTemplate: (id: string) => void;
}

/** Template list item */
const TemplateListItem: FC<TemplateListItemProps> = ({
    item,
    deleteTemplate,
}) => {
    const navigate = useNavigate();

    const onEditClick = useCallback(() => navigate(`edit/${item.id}`), [item.id, navigate]);
    const onDeleteClick = useCallback(() => deleteTemplate(item.id), [deleteTemplate, item]);

    return (
        <tr>
            <td className="has-text-centered is-vertical-align--center">{item.name}</td>
            <td>{item.description}</td>
            <td className="has-text-centered is-vertical-align--center">{item.paymentTypesCount}</td>
            <td className="is-vertical-align--center">
                <div className="is-flex is-flex-wrap-wrap gap-1">
                    {item.paymentTypes.map(pt =>
                        <Tag
                            key={pt.paymentTypeId}
                            content={pt.paymentTypeName}
                            customColor={isNullish(pt.paymentTypeColor) ? undefined : {
                                color: getFontColorFromString(pt.paymentTypeColor),
                                backgroundColor: pt.paymentTypeColor,
                            }}
                        />
                    )}
                </div>
            </td>
            <td className="is-vertical-align--center">
                <div className="field is-grouped is-justify-content-space-evenly">
                    <div className="control">
                        <Button
                            style={ButtonStyle.Warning}
                            icon={{ name: "pencil", size: ElementSize.Medium }}
                            onClick={onEditClick}
                            title="Edit template"
                        />
                    </div>
                    <div className="control">
                        <Button
                            style={ButtonStyle.Danger}
                            icon={{ name: "trash", size: ElementSize.Medium }}
                            onClick={onDeleteClick}
                            title="Delete template"
                        />
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default TemplateListItem;
