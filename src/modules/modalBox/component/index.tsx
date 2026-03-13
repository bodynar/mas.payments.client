import { FC, useCallback, useMemo } from "react";
import { connect } from "react-redux";

import { isNotNullish } from "@bodynarf/utils";
import { ButtonStyle } from "@bodynarf/react.components";
import { ButtonProps } from "@bodynarf/react.components/components/button";
import ModalWrapper from "@bodynarf/react.components/components/modal";

import "./style.scss";

import { CompositeAppState } from "@app/redux";
import { closeModal, ModalCallback, ModalCloseData, ModalParams, ModalType } from "@app/redux/modal";

import { getButtonCaptions, validateModalParams } from "../utils";

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
const ModalBox: FC<ModalBoxProps> = ({
    isOpen, params,
    closeModal
}) => {
    if (!isOpen || !isNotNullish(params)) {
        return <></>;
    }

    const validationError = validateModalParams(params);

    if (isNotNullish(validationError)) {
        throw new Error(`Modal configuration error: ${validationError}`);
    }

    const onCloseClick = useCallback(() => closeModal({ closeCode: "cancel" }, params.callback), [closeModal, params]);

    const onSaveClick = useCallback(() => {
        closeModal({ closeCode: "save" }, params.callback);
    }, [closeModal, params]);

    const { saveBtnCaption, cancelBtnCaption } = getButtonCaptions(params);

    const actions = useMemo<Array<ButtonProps>>(() => {
        const result: Array<ButtonProps> = [];

        if (params.modalType !== ModalType.Info) {
            result.push({
                style: ButtonStyle.Success,
                caption: saveBtnCaption,
                onClick: onSaveClick,
            });
        }

        result.push({
            style: ButtonStyle.Default,
            caption: cancelBtnCaption,
            onClick: onCloseClick,
        });

        return result;
    }, [params, saveBtnCaption, cancelBtnCaption, onSaveClick, onCloseClick]);

    return (
        <ModalWrapper
            className="app-modal"
            title={params.title}
            actions={actions}
            onCloseClick={onCloseClick}
        >
            <ModalBody
                message={params.message}
            />
        </ModalWrapper>
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
