import { useCallback, useEffect, useState } from "react";

import { connect } from "react-redux";

import { emptyFn, isNullOrUndefined } from "@bodynarf/utils";

import Button from "@bodynarf/react.components/components/button";
import Text from "@bodynarf/react.components/components/primitives/text";

import { UserSetting } from "@app/models/user";

import { CompositeAppState } from "@app/redux/rootReducer";
import { loadSettings } from "@app/redux/user/thunks/loadSettings";
import { UpdatedUserSetting, updateUserSettings } from "@app/redux/user/thunks/updateUserSettings";
import { getMeasurementsWithoutDiff } from '@app/redux/user/thunks/loadMeasurementsWithoutDiff';
import { recalculateDiff } from "@app/redux/user/thunks/recalculateDiff";

import Setting from '../components/setting';

type SettingsProps = {
    /** Custom settings */
    settings: Array<UserSetting>;

    /** Load user settings */
    loadSettings: () => Promise<void>;

    /** Save updated used settings */
    updateUserSettings: (updatedSettings: Array<UpdatedUserSetting>) => Promise<void>;

    /** Load measurements without diff count */
    getMeasurementsWithoutDiff: () => void;

    /** Incorrect data */
    options?: {
        /** Amount of measurements without diff */
        measurementsWithoutDiff: number;
    };

    /** Recalculate measurements diff */
    recalculateDiff: () => Promise<boolean>;
};

const Settings = ({
    settings, loadSettings, updateUserSettings,
    getMeasurementsWithoutDiff, options, recalculateDiff
}: SettingsProps): JSX.Element => {
    const [loaded, setIsLoaded] = useState(false);
    const [updatedSettings, setUpdatedSettings] = useState<Map<string, string>>(new Map([]));

    useEffect(() => {
        if (!loaded && settings.length === 0) {
            loadSettings().then(() => setIsLoaded(true));
        }
        if (isNullOrUndefined(options)) {
            getMeasurementsWithoutDiff();
        }
    }, [settings, loadSettings, loaded, options, getMeasurementsWithoutDiff]);

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

    const onRecalcClick = useCallback(() => {
        recalculateDiff()
            .then((result: boolean) => {
                if (result) {
                    getMeasurementsWithoutDiff();
                }
            });
    }, [getMeasurementsWithoutDiff, recalculateDiff]);

    return (
        <div className="box">
            <div className="block">
                <div className="block columns is-align-items-center">
                    <div className="column is-2">
                        <span className="has-text-weight-bold">Options</span>:
                    </div>
                </div>
                <div className="block columns">
                    {options &&
                        <>
                            <div className="column is-10">
                                <Text
                                    disabled={true}
                                    onValueChange={emptyFn}
                                    defaultValue={options.measurementsWithoutDiff.toString()}
                                    label={{
                                        horizontal: true,
                                        caption: "Without diff"
                                    }}
                                    title="Measurements without diff"
                                />
                            </div>
                            <div className="column">
                                <Button
                                    caption="Recalculate"
                                    type="success"
                                    onClick={onRecalcClick}
                                />
                            </div>
                        </>
                    }
                </div>
            </div>
            {(loaded || settings.length > 0) &&
                <div className="block">
                    <hr />
                    <div className="block columns is-align-items-center">
                        <div className="column is-2">
                            <span className="has-text-weight-bold">Settings</span>: {settings.length}
                        </div>
                    </div>
                    <div className="block">
                        {settings.map(x =>
                            <div key={x.id} className="column">
                                <Setting
                                    key={x.id}
                                    setting={x}
                                    onUpdate={onSettingUpdate}
                                />
                            </div>
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
                </div>
            }
        </div>
    );
};

/**
 * User settings component
 */
export default connect(
    ({ user }: CompositeAppState) => ({ ...user }),
    {
        loadSettings, updateUserSettings,
        getMeasurementsWithoutDiff, recalculateDiff
    }
)(Settings);
