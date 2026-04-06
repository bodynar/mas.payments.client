import { isNotNullish } from "@bodynarf/utils";

import { createAppAsyncThunk } from "@app/redux";
import { setPayments } from "@app/redux/payments";
import {
    createPaymentGroup,
    getPaymentGroupIdsByMonthYear,
    getPaymentRecords,
    uploadPaymentFile,
} from "@app/core/payment";
import { AddPaymentGroup } from "@app/models/payments";

/**
 * Create a payment group.
 * If `file` is provided it is attached to the newly created group.
 * The new group is identified by comparing group ids for the selected
 * month/year before and after creation.
 */
export const saveGroupCard = createAppAsyncThunk(
    async ({ dispatch, showSuccess }, groupData: AddPaymentGroup, file?: File): Promise<boolean> => {
        // Snapshot existing group ids for this month/year before creation so we can
        // identify the newly created group's id afterwards.
        let existingGroupIds: Set<string> | undefined;
        if (isNotNullish(file) && isNotNullish(groupData.month) && isNotNullish(groupData.year)) {
            existingGroupIds = await getPaymentGroupIdsByMonthYear(groupData.month, groupData.year);
        }

        await createPaymentGroup(groupData);

        if (isNotNullish(file) && isNotNullish(existingGroupIds) && isNotNullish(groupData.month) && isNotNullish(groupData.year)) {
            const updatedGroupIds = await getPaymentGroupIdsByMonthYear(groupData.month, groupData.year);
            const newGroupId = [...updatedGroupIds].find(id => !existingGroupIds!.has(id));

            if (isNotNullish(newGroupId)) {
                await uploadPaymentFile(file, undefined, newGroupId);
            }
        }

        showSuccess("Payment group successfully created", false);
        const payments = await getPaymentRecords();
        dispatch(setPayments(payments));
        return true;
    }
);
