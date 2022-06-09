import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";

import './modalBox.scss';
import './modalBox.dark.scss';

import { isNullOrUndefined } from "@bodynarf/utils/common";

import { CompositeAppState } from "@app/redux/rootReducer";
import { closeModal } from "@app/redux/modal/utils";
import { ModalCallback, ModalCloseData, ModalParams } from "@app/redux/modal/types";

import Button from "@app/sharedComponents/button";

import { getButtonCaptions, getInitIsSaveButtonDisabled, validateModalParams } from "../utils";

import { ModalForm, ModalFormConfiguration } from "../components/modalForm";

type ModalBoxProps = {
    /** Is modal currently shown */
    isOpen: boolean;

    /** Modal window configuration */
    params: ModalParams;

    /** Close modal handler */
    closeModal: (closeModalData: ModalCloseData, modalCallback?: ModalCallback) => void;
};

/** 
 * Modal window component
 * @throws Modal params is invalid
 */
function ModalBox({ isOpen, params, closeModal }: ModalBoxProps): JSX.Element {
    const validationError =
        isOpen
            ? validateModalParams(params)
            : undefined;

    if (!isNullOrUndefined(validationError)) {
        throw new Error(validationError);
    }

    const [isSaveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            const initIsSaveButtonDisabled: boolean = getInitIsSaveButtonDisabled(params);
            setSaveButtonDisabled(initIsSaveButtonDisabled);
        }
    }, [isOpen, params]);

    const onCloseClick = useCallback(() => {
        closeModal({ closeCode: 'cancel' }, params.callback);
    }, [closeModal, params]);

    const onSaveClick = useCallback(() => {
        if (!isSaveButtonDisabled) {
            const closeConfig: ModalCloseData = {
                closeCode: 'save'
            };

            if (params.modalType === 'form') {
                const modalFormData: ModalFormConfiguration =
                    params.formData as ModalFormConfiguration;

                closeConfig.formData = {
                    fields: modalFormData.fields.map(x => ({ name: x.name, value: x.value }))
                };
            }

            closeModal(closeConfig, params.callback);
        }
    }, [closeModal, isSaveButtonDisabled, params]);

    useEffect(() => {
        const htmlElement: HTMLElement | null =
            document.body.parentElement;

        if (!isNullOrUndefined(htmlElement)) {
            if (isOpen) {
                htmlElement?.classList.add('is-clipped');
            } else {
                htmlElement?.classList.remove('is-clipped');
            }
        }
    }, [isOpen]);

    if (!isOpen) {
        return <></>;
    }

    const { saveBtnCaption, cancelBtnCaption } = getButtonCaptions(params);

    return (
        <div className='app-modal modal is-active'>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{params.title}</p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={onCloseClick}
                    ></button>
                </header>
                <section className="modal-card-body">
                    {params.modalType === 'form'
                        ? <ModalForm
                            formConfig={params.formData as ModalFormConfiguration}
                            setSaveButtonDisabled={setSaveButtonDisabled}
                        />
                        : <p>{params.message}</p>}
                </section>
                <footer className="modal-card-foot">
                    {params.modalType !== 'info'
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
}

/** 
 * Modal window component
 * @throws Modal params is invalid
 */
export default connect(
    ({ modal }: CompositeAppState) => ({
        isOpen: modal.isOpen,
        params: modal.modalParams as ModalParams
    }),
    { closeModal: closeModal }
)(ModalBox);
