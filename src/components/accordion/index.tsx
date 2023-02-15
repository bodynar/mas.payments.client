import { useCallback, useRef, useState } from "react";

import { getClassName, isNullOrUndefined } from "@bodynarf/utils";

import { ElementSize } from "@bodynarf/react.components";

import "./style.scss";
import Icon from "@bodynarf/react.components/components/icon";

type AccordionProps = {
    /** Content that should be collapsed inside */
    children: React.ReactNode;

    /** Collapsible panel caption */
    caption: string;

    /** Panel size */
    size?: ElementSize;

    /** Color */
    style?:
    | "primary" /** color: seawave green */
    | "link" /** color: blue-violet */
    | "info" /** color: sky-blue */
    | "success" /** color: green */
    | "warning" /** color: yellow */
    | "danger" /** color: red */
    | "dark" /** color: dark-gray */
    ;
};

/** Accordion panel */
const Accordion = ({
    children, caption,
    style, size,
}: AccordionProps): JSX.Element => {
    const expandablePanelRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [maxHeight, setMaxHeight] = useState<string | undefined>(undefined);

    const toggleCollapse = useCallback(() => {
        const newValue = !isExpanded;

        setIsExpanded(newValue);
        setMaxHeight(newValue ? `${expandablePanelRef.current!.scrollHeight}px` : undefined);
    }, [isExpanded]);

    const className = getClassName([
        "app-accordion",
        "message",
        isNullOrUndefined(style) ? "" : `is-${style}`,
        isNullOrUndefined(size) ? "" : `is-${size}`,
    ]);

    return (
        <article
            className={className}
            aria-expanded={isExpanded}
        >
            <div
                className="message-header is-unselectable"
                onClick={toggleCollapse}
            >
                <span>
                    {caption}
                </span>
                <Icon name="arrow-down" />
            </div>
            <div
                className="message-body"
                ref={expandablePanelRef}
                style={{ maxHeight: maxHeight }}
            >
                <div className="message-body__content">
                    {children}
                </div>
            </div>
        </article>
    );
};

export default Accordion;
