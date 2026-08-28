import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth";

const reducers = combineReducers({
    auth: authReducer
});

export default reducers;