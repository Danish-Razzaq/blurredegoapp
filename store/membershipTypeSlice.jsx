import { createSlice } from "@reduxjs/toolkit";

const membershipTypeSlice = createSlice({
    name: "membershipType",
    initialState: {
        membershipTypeData: []
    },

    reducers: {
        setMembershipTypeData(state, { payload }) {
            //id new vale come then remove previous value
            if (state.membershipTypeData.length > 0) {
                state.membershipTypeData = [];
            }
            state.membershipTypeData.push(payload);
            
            
        }
    }
});

export const { setMembershipTypeData } = membershipTypeSlice.actions;

export default membershipTypeSlice.reducer;