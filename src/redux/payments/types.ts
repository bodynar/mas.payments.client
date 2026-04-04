import { SelectableItem } from "@bodynarf/react.components";

import { PaymentType, Payment, PaymentFilter, PaymentGroupTemplate } from "@app/models/payments";

import { EntityModuleState } from "../types";

/** Payment module state */
export interface PaymentModuleState extends EntityModuleState<Payment, PaymentType, PaymentFilter> {
    /** Payment group templates indexed by id */
    templatesMap: Map<string, PaymentGroupTemplate>;

    /** Templates mapped to dropdown items, keyed by template id */
    templatesAsDropdownItems: Map<string, SelectableItem>;

    /** Whether templates have been loaded from the server at least once */
    templatesLoaded: boolean;
}
