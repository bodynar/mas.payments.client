import { useCallback, useEffect, useRef, useState } from "react";

import { getClassName, isNullOrUndefined } from "@bodynarf/utils";

import { ElementColor, ElementSize } from "@bodynarf/react.components";
import Icon from "@bodynarf/react.components/components/icon";

import "./style.scss";

interface AccordionProps {
    /** Content that should be collapsed inside */
    children: React.ReactNode;

    /** Collapsible panel caption */
    caption: string;

    /** Panel size */
    size?: ElementSize;

    /** Color */
    style?: ElementColor;
}

/** Accordion panel */
const Accordion = ({
    children, caption,
    style, size,
}: AccordionProps): JSX.Element => {
    const expandablePanelRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [maxHeight, setMaxHeight] = useState<string | undefined>(undefined);

    const toggleCollapse = useCallback(
        () => setMaxHeight(isExpanded ? undefined : `${expandablePanelRef.current!.scrollHeight}px`),
        [isExpanded]
    );

    useEffect(() => setIsExpanded(!isNullOrUndefined(maxHeight)), [maxHeight]);

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
                <Icon name="arrow-down" size={ElementSize.Medium} />
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
