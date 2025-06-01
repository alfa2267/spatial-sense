import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

// Import reducers from the slices index
import { clientsReducer } from './slices';
// Import other reducers as they are created
// import { projectsReducer } from './slices';
// import { devicesReducer } from './slices';
// import { strategiesReducer } from './slices';

const rootReducer = combineReducers({
  clients: clientsReducer,
  // Add other reducers here
  // projects: projectsReducer,
  // devices: devicesReducer,
  // strategies: strategiesReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  // Add any reducers you want to persist
  whitelist: ['clients'],
  // Add any reducers you want to blacklist
  // blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['clients.clients'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export hooks with proper types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
