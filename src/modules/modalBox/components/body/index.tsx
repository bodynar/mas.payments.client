import { FC } from "react";
import { ModalParams } from "@app/redux/modal";

/** Modal body prop types */
type ModalBodyProps = Pick<ModalParams, "message">;

/**
 * Modal body component
 */
const ModalBody: FC<ModalBodyProps> = ({ message }) => (
    <p>{message}</p>
);

export default ModalBody;
