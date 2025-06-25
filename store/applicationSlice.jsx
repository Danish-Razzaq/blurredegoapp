import { createSlice } from '@reduxjs/toolkit';

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
    applicationData: []
},

    reducers: {
        setApplicationData(state, { payload }) {
            state.applicationData = payload;
        },
    },
});

export const { setApplicationData } = applicationSlice.actions;

export default applicationSlice.reducer;