import { createAppAsyncThunk } from "@app/redux";
import { setPayments } from "@app/redux/payments";
import { createPaymentGroup, getPaymentRecords } from "@app/core/payment";
import { AddPaymentGroup } from "@app/models/payments";

export const saveGroupCard = createAppAsyncThunk(
    async ({ dispatch, showSuccess }, groupData: AddPaymentGroup) => {
        await createPaymentGroup(groupData);
        showSuccess("Payment group successfully created", false);
        const payments = await getPaymentRecords();
        dispatch(setPayments(payments));
    }
);
