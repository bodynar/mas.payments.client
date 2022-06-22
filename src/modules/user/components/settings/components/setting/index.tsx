import { useCallback, useState } from "react";

import { UserSetting } from "@app/models/user";

import Text from "@bodynarf/react.components/components/primitives/text";
import CheckBox from "@bodynarf/react.components/components/primitives/checkbox";

type SettingProps = {
    /** Custom setting */
    setting: UserSetting;

    /** Setting update function */
    onUpdate: (updatedValue: { key: string, value: string }) => void;
};

/**
 * Single setting editor component.
 * Displays as different editor components based on setting type
*/
const SettingComponent = ({ setting, onUpdate }: SettingProps): JSX.Element => {
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
                label={{ caption: setting.displayName }}
            />
        );
    }

    if (setting.type === "boolean") {
        return (
            <CheckBox
                onValueChange={onValueChange}
                defaultValue={value.toLocaleLowerCase() === 'true'}
                label={{ caption: setting.displayName }}
            />
        );
    }

    return (
        <h4> COMPONENT FOR TYPE &quot;{setting.type}&quot; NOT IMPLEMENTED </h4>
    );
};

export default SettingComponent;