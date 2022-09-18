import { Link } from "react-router-dom";

import { getClassName, isNullOrUndefined } from "@bodynarf/utils";

import { ElementSize } from "@bodynarf/react.components";
import Icon from "@bodynarf/react.components/components/icon";

import { BreadCrumb } from "./types";

type BreadcrumbsProps = {
    /** Breadcrumbs items */
    items: Array<BreadCrumb>;

    /** Panel size */
    size?: ElementSize;

    /** Items position */
    position?: "centered" | "right";

    /** Items separator. By default `arrow` */
    separator?: "arrow" | "bullet" | "dot" | "succeeds";
};

/** Breadcrumbs navigation panel */
const BreadCrumbs = ({
    items,
    size, position, separator,
}: BreadcrumbsProps): JSX.Element => {
    if (items.length <= 1) {
        return <></>;
    }

    const className = getClassName([
        "breadcrumb",
        isNullOrUndefined(position) ? undefined : `is-${size}`,
        `has-${separator || 'arrow'}-separator`,
        isNullOrUndefined(position) ? undefined : `is-${position}`
    ]);

    return (
        <nav
            className={className}
            aria-label="breadcrumbs"
        >
            <ul>
                {items.map(breadCrumb =>
                    <li
                        className={breadCrumb.active ? 'is-active' : undefined}
                        key={breadCrumb.path}
                        aria-current={breadCrumb.active ? 'page' : undefined}
                    >
                        <Link to={breadCrumb.path}>
                            {breadCrumb.icon &&
                                <span>
                                    <Icon {...breadCrumb.icon} />
                                </span>
                            }
                            <span>
                                {breadCrumb.title}
                            </span>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default BreadCrumbs;
