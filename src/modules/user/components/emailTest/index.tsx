import { useCallback, useState } from "react";

import { connect } from "react-redux";

import { isStringEmpty } from "@bodynarf/utils";

import Button from "@bodynarf/react.components/components/button";
import Text from "@bodynarf/react.components/components/primitives/text";

import { sendTestEmail } from "@app/redux/user/thunks/sendTestEmail";

/**
 * Email match regex
 * Provided by https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
 */
const emailPattern = /^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

type EmailTestProps = {
    /** Send test email via api */
    sendTestEmail: (recipient: string) => void;
};

/** Component providing small form to test email integration */
const EmailTest = ({ sendTestEmail }: EmailTestProps): JSX.Element => {
    const [value, setValue] = useState("");
    const [isValid, setIsValid] = useState(false);

    const onValueChange = useCallback(
        (value?: string) => {
            const newValue = value ?? "";
            setValue(newValue);
            setIsValid(true);

            if (isStringEmpty(newValue)) {
                return;
            }
        }, []);

    const onSendClick = useCallback(() => {
        if (isStringEmpty(value)) {
            return;
        }

        const isEmail = emailPattern.test(value);

        setIsValid(isEmail);

        if (!isEmail) {
            return;
        }

        sendTestEmail(value);
    }, [value, sendTestEmail]);

    return (
        <div className="box">
            <div className="mb-2">
                <Text
                    onValueChange={onValueChange}
                    defaultValue={value}
                    label={{ caption: "Recipient", horizontal: true }}
                    placeholder="Enter valid email of recipient"
                />
                {!isValid && value.length > 0 &&
                    <p className="help is-danger">Recipient email must be filled by template email@example.com</p>
                }
            </div>

            <Button
                type="primary"
                caption="Send"
                onClick={onSendClick}
                disabled={!isValid}
            />
        </div>
    );
};

export default connect(
    _ => ({}),
    {
        sendTestEmail
    }
)(EmailTest);
