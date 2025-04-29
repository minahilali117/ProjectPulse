// src/utils/test-utils.js
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";

import authReducer from "../redux/slices/authSlice";
import { apiSlice } from "../redux/slices/apiSlice";

export function renderWithProviders(ui, { preloadedState = {} } = {}) {
    const store = configureStore({
        reducer: {
            auth: authReducer,
            [apiSlice.reducerPath]: apiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(apiSlice.middleware),
        preloadedState,
    });

    return render(
        <Provider store={store}>
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        </Provider>
    );
}
