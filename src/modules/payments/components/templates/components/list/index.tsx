import { FC, useCallback, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ButtonStyle, usePagination } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Paginator from "@bodynarf/react.components/components/paginator";
import Table from "@bodynarf/react.components/components/table";
import { TableHeading } from "@bodynarf/react.components/components/table";

import { PaymentGroupTemplate } from "@app/models/payments";

import { CompositeAppState } from "@app/redux";
import { loadTemplates, deleteTemplate } from "@app/redux/payments";

import TemplateListItem from "../listItem";

interface TemplateListProps {
    /** Is module state initialized */
    initialized: boolean;

    /** All templates indexed by id */
    templatesMap: Map<string, PaymentGroupTemplate>;

    /** Load templates from server */
    loadTemplates: () => void;

    /** Delete specified template */
    deleteTemplate: (id: string) => void;
}

const headings: Array<TableHeading> = [
    { caption: "Name", sortable: false, className: "has-text-centered th-color--light-blue width--is-15rem is-vertical-align--center" },
    { caption: "Description", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center" },
    { caption: "Types count", sortable: false, className: "has-text-centered th-color--light-blue width--is-725rem is-vertical-align--center" },
    { caption: "Payment types", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center" },
    { caption: "Actions", sortable: false, className: "has-text-centered th-color--light-blue is-vertical-align--center width--is-15rem" },
];

const TemplateList: FC<TemplateListProps> = ({
    initialized, templatesMap,
    loadTemplates, deleteTemplate,
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (initialized && templatesMap.size === 0) {
            loadTemplates();
        }
    }, [initialized, templatesMap.size, loadTemplates]);

    const onCreateClick = useCallback(() => navigate("/payment/templates/create"), [navigate]);

    const templates = useMemo(() => [...templatesMap.values()], [templatesMap]);

    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(templates.length, 20, 1, [templates]);
    const pageItems: Array<PaymentGroupTemplate> = useMemo(() => paginate(templates) as Array<PaymentGroupTemplate>, [paginate, templates]);

    return (
        <section>
            <nav className="field is-grouped">
                <p className="control">
                    <Button
                        style={ButtonStyle.Primary}
                        caption="Create"
                        title="Create new template"
                        onClick={onCreateClick}
                    />
                </p>
            </nav>
            {pageItems.length > 0
                &&
                <section>
                    <Table
                        headings={headings}
                        hasBorder
                        narrow
                        hoverable
                        fullWidth
                        hasStickyHeader
                        headerWithBorder
                    >
                        {pageItems.map(x =>
                            <TemplateListItem
                                key={x.id}
                                item={x}
                                deleteTemplate={deleteTemplate}
                            />
                        )}
                    </Table>
                    <Paginator
                        count={pagesCount}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                    />
                </section>
            }
            {initialized && pageItems.length === 0
                &&
                <p className="subtitle has-text-centered is-italic mt-4 has-text-grey-dark has-wrap-text">
                    No templates found. Create one to get started.
                </p>
            }
        </section>
    );
};

/** Templates list */
export default connect(
    ({ payments }: CompositeAppState) => ({
        initialized: payments.initialized,
        templatesMap: payments.templatesMap,
    }),
    ({
        loadTemplates,
        deleteTemplate,
    })
)(TemplateList);

