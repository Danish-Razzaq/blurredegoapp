import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import authSlice from '@/store/authSlice';
import usersSlice from '@/store/usersSlice';
import applicationSlice from '@/store/applicationSlice';
import membershipTypeSlice from '@/store/membershipTypeSlice';
const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    auth: authSlice,
    users: usersSlice,
    application: applicationSlice,
    membershipType: membershipTypeSlice,
});

export default configureStore({
    reducer: rootReducer,
});
