import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
    },
    reducers: {
        setUsers(state, { payload }) {
            state.users = payload;
        },
    },
});

export const { setUsers } = usersSlice.actions;

export default usersSlice.reducer;
