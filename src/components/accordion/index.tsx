import { useCallback, useEffect, useRef, useState } from "react";

import { getClassName, isNullOrUndefined } from "@bodynarf/utils";

import { BaseElementProps, ElementColor, ElementSize } from "@bodynarf/react.components";
import Icon from "@bodynarf/react.components/components/icon";

import "./style.scss";

/** Accordion panel props type */
export interface AccordionProps extends BaseElementProps {
    /** Content that should be collapsed inside */
    children: React.ReactNode;

    /** Collapsible panel caption */
    caption: string;

    /** Default expandned state */
    defaultExpanded?: boolean;

    /** Panel size */
    size?: ElementSize;

    /** Color */
    style?: ElementColor;

    /** Extra handler for toggling visibility. Doesn't affect component logic */
    onToggle?: (collapsed: boolean) => void;
}

/** Accordion panel */
const Accordion = ({
    children, caption,
    style, size, defaultExpanded,
    onToggle,
    className, data, title,
}: AccordionProps): JSX.Element => {
    const expandablePanelRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(defaultExpanded ?? false);
    const [maxHeight, setMaxHeight] = useState<number | undefined>(defaultExpanded === true ? undefined : 0);

    const toggleCollapse = useCallback(
        () => setMaxHeight(isExpanded ? 0 : expandablePanelRef.current!.scrollHeight),
        [isExpanded]
    );

    useEffect(() => {
        if (defaultExpanded === true && !isNullOrUndefined(expandablePanelRef.current)) {
            setMaxHeight(expandablePanelRef.current!.scrollHeight);
        }
    }, [defaultExpanded]);

    useEffect(() => setIsExpanded(maxHeight !== 0), [maxHeight]);
    useEffect(() => {
        onToggle?.call(undefined, !isExpanded);
    }, [isExpanded, onToggle]);

    const elClassName = getClassName([
        "app-accordion",
        "message",
        isNullOrUndefined(style) ? "" : `is-${style}`,
        isNullOrUndefined(size) ? "" : `is-${size}`,
        className,
    ]);

    // const dataAttributes = isNullOrUndefined(data)
    //     ? undefined
    //     : mapDataAttributes(data!);

    return (
        <article
            className={elClassName}
            aria-expanded={isExpanded}
        >
            <div
                className="message-header is-unselectable"
                onClick={toggleCollapse}
            >
                <span title={title}>
                    {caption}
                </span>
                <Icon
                    name="arrow-down"
                    size={size ?? ElementSize.Medium}
                />
            </div>
            <div
                className="message-body"
                ref={expandablePanelRef}
                style={{ maxHeight: `${maxHeight}px` }}
            >
                <div className="message-body__content">
                    {children}
                </div>
            </div>
        </article>
    );
};

export default Accordion;
