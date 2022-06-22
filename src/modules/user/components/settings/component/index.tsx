import { useCallback, useEffect, useState } from "react";

import { connect } from "react-redux";

import { UserSetting } from "@app/models/user";

import { CompositeAppState } from "@app/redux/rootReducer";
import { loadSettings } from "@app/redux/user/thunks/loadSettings";
import { UpdatedUserSetting, updateUserSettings } from "@app/redux/user/thunks/updateUserSettings";

import Setting from '../components/setting';
import Button from "@bodynarf/react.components/components/button";

type SettingsProps = {
    /** Custom settings */
    settings: Array<UserSetting>;

    /** Load user settings */
    loadSettings: () => Promise<void>;

    /** Save updated used settings */
    updateUserSettings: (updatedSettings: Array<UpdatedUserSetting>) => Promise<void>;
};

const Settings = ({ settings, loadSettings, updateUserSettings }: SettingsProps): JSX.Element => {
    const [loaded, setIsLoaded] = useState(false);
    const [updatedSettings, setUpdatedSettings] = useState<Map<string, string>>(new Map([]));

    useEffect(() => {
        if (!loaded && settings.length === 0) {
            loadSettings().then(() => setIsLoaded(true));
        }
    }, [settings, loadSettings, loaded]);

    const onSaveClick = useCallback(() => {
        updateUserSettings(
            settings
                .filter(({ name }) => updatedSettings.has(name))
                .map(({ id, name }) => ({
                    id,
                    rawValue: updatedSettings.get(name)!
                }))
        ).then(() => {
            loadSettings();
            setUpdatedSettings(new Map([]));
        });
    }, [updateUserSettings, settings, loadSettings, updatedSettings]);

    const onSettingUpdate = useCallback(
        ({ key, value }: { key: string, value: string }) => {
            if (updatedSettings.has(key)) {
                const setting = settings.find(({ name }) => name === key)!;

                if (setting.rawValue === value) {
                    updatedSettings.delete(key);
                    setUpdatedSettings(new Map(updatedSettings));
                }
                else {
                    updatedSettings.set(key, value);
                    setUpdatedSettings(updatedSettings);
                }
            } else {
                setUpdatedSettings(x => new Map([...x, [key, value]]));
            }
        }, [settings, updatedSettings]);

    return (
        <div className="box">
            {(loaded || settings.length > 0) &&
                <>
                    <div className="block columns is-align-items-center">
                        <div className="column is-2">
                            <span className="has-text-weight-bold">Settings</span>: {settings.length}
                        </div>
                    </div>
                    <div className="block">
                        {settings.map(x =>
                            <Setting
                                key={x.id}
                                setting={x}
                                onUpdate={onSettingUpdate}
                            />
                        )}
                    </div>
                    <div className="block">
                        <Button
                            type="primary"
                            caption="Save"
                            onClick={onSaveClick}
                            disabled={updatedSettings.size === 0}
                        />
                    </div>
                </>
            }
        </div>
    );
};

export default connect(
    ({ user }: CompositeAppState) => ({ ...user }),
    {
        loadSettings, updateUserSettings
    }
)(Settings);
