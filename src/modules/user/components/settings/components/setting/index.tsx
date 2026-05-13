import { FC, useCallback, useState } from "react";

import Text from "@bodynarf/react.components/components/primitives/text";
import CheckBox from "@bodynarf/react.components/components/primitives/checkbox";

import { UserSetting } from "@app/models/user";

interface SettingProps {
    /** Custom setting */
    setting: UserSetting;

    /** Setting update function */
    onUpdate: (updatedValue: { key: string, value: string }) => void;
}

/**
 * Single setting editor component.
 * Displays as different editor components based on setting type
*/
const SettingComponent: FC<SettingProps> = ({ setting, onUpdate }) => {
    const [value, setValue] = useState(setting.rawValue);

    const onValueChange = useCallback(
        (value: any) => {
            onUpdate({ key: setting.name, value: value.toString() });
            setValue(value.toString());
        }, [onUpdate, setting.name]);

    if (setting.type === "string") {
        return (
            <Text
                onValueChange={onValueChange}
                defaultValue={value}
                label={{ caption: setting.displayName, horizontal: true }}
            />
        );
    }

    if (setting.type === "boolean") {
        return (
            <CheckBox
                onValueChange={onValueChange}
                defaultValue={value.toLocaleLowerCase() === "true"}
                label={{ caption: setting.displayName, horizontal: true }}
                isFormLabel
            />
        );
    }

    if (setting.type === "color") {
        return (
            <div className="field is-horizontal">
                <div className="field-label is-normal">
                    <label className="label">{setting.displayName}</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <div className="control">
                            <input
                                type="color"
                                value={value}
                                onChange={({ target }) => onValueChange(target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <h4> COMPONENT FOR TYPE &quot;{setting.type}&quot; NOT IMPLEMENTED </h4>
    );
};

export default SettingComponent;
