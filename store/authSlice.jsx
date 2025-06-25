import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        jwt: null,
    },
    reducers: {
        login(state, { payload }) {
            state.user = payload.user;
            state.jwt = payload.jwt;
        },
        logout(state) {
            state.user = null;
            state.jwt = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;