import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";

import { isNullOrUndefined } from "@bodynarf/utils";
import Button from "@bodynarf/react.components/components/button";

import "./style.scss";

import { CompositeAppState } from "@app/redux";
import { closeModal, ModalCallback, ModalCloseData, ModalParams, ModalType } from "@app/redux/modal";

import { getButtonCaptions, getInitIsSaveButtonDisabled, validateModalParams } from "../utils";

import ModalBody from "../components/body";

interface ModalBoxProps {
    /** Is modal currently shown */
    isOpen: boolean;

    /** Modal window configuration */
    params?: ModalParams;

    /** Close modal handler */
    closeModal: (closeModalData: ModalCloseData, modalCallback?: ModalCallback) => void;
}

/** 
 * Modal window component
 * @throws Modal params is invalid
 */
const ModalBox = ({
    isOpen, params,
    closeModal
}: ModalBoxProps): JSX.Element => {
    const validationError =
        isOpen && !isNullOrUndefined(params)
            ? validateModalParams(params!)
            : undefined;

    if (!isNullOrUndefined(validationError)) {
        throw new Error(`Modal configuration error: ${validationError}`);
    }

    const [isSaveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            const initIsSaveButtonDisabled: boolean = getInitIsSaveButtonDisabled(params!);
            setSaveButtonDisabled(initIsSaveButtonDisabled);
        }
    }, [isOpen, params]);

    const onCloseClick = useCallback(() => closeModal({ closeCode: "cancel" }, params!.callback), [closeModal, params]);

    const onSaveClick = useCallback(() => {
        if (isSaveButtonDisabled) {
            return;
        }

        const closeConfig: ModalCloseData = { closeCode: "save" };

        if (params!.modalType === "form") {
            closeConfig.formData = {
                fields: params!.formData!.fields.map(x => ({ name: x.name, value: x.value }))
            };
        }

        closeModal(closeConfig, params!.callback);
    }, [closeModal, isSaveButtonDisabled, params]);

    if (!isOpen) {
        return <></>;
    }

    const { saveBtnCaption, cancelBtnCaption } = getButtonCaptions(params!);

    return (
        <div className="app-modal modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{params!.title}</p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={onCloseClick}
                    ></button>
                </header>
                <section className="modal-card-body">
                    <ModalBody
                        {...params!}
                        setSaveButtonDisabled={setSaveButtonDisabled}
                    />
                </section>
                <footer className="modal-card-foot">
                    {params!.modalType !== ModalType.Info
                        &&
                        <Button
                            key="modal-success-btn"
                            type="success"
                            caption={saveBtnCaption}
                            onClick={onSaveClick}
                            disabled={isSaveButtonDisabled}
                        />
                    }
                    <Button
                        type="default"
                        caption={cancelBtnCaption}
                        onClick={onCloseClick}
                    />
                </footer>
            </div>
        </div>
    );
};

/** 
 * Modal window component
 * @throws Modal params is invalid
 */
export default connect(
    ({ modal }: CompositeAppState) => ({
        isOpen: modal.isOpen,
        params: modal.modalParams
    }),
    { closeModal: closeModal }
)(ModalBox);
