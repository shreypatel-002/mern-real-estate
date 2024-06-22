import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { resetState } from './user/userSlice.js';

const rootReducer = combineReducers(
  {
  user: userReducer
});
const appReducer = (state, action) => {
  if (action.type === resetState.type) {
    state = undefined;
  }
  return rootReducer(state, action);
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // Disabling serializable check
    })
});

export const persistor = persistStore(store);
