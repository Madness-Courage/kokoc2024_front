import userSlice from './slices/userSlice'
import dataSlice from './slices/dataSlice'
import storage from 'redux-persist/lib/storage'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist'
import productsSlice from './slices/productsSlice'

const reducers = combineReducers({
    products: productsSlice.reducer,
    user: userSlice.reducer,
    data: dataSlice.reducer,
})

const store = configureStore({
    reducer: persistReducer(
        {
            key: 'root',
            whitelist: ['data'],
            storage,
        },
        reducers
    ),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
})

export type RootState = ReturnType<typeof reducers>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
