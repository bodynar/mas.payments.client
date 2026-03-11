import { FC } from "react";
import { ModalParams, ModalType } from "@app/redux/modal";

import ModalForm from "@app/modules/modalBox/components/modalForm";

/** Modal body prop types */
interface ModalBodyProps extends ModalParams {
    /** Change save modal button availability */
    setSaveButtonDisabled: (isValid: boolean) => void;
}

/** 
 * Modal body component
 */
const ModalBody: FC<ModalBodyProps> = ({
    modalType,
    formData, message,
    setSaveButtonDisabled,
}) => {
    if (modalType === ModalType.Form) {
        return (
            <ModalForm
                formConfig={formData!}
                setSaveButtonDisabled={setSaveButtonDisabled}
            />
        );
    }

    return (
        <p>{message}</p>
    );
};

export default ModalBody;
