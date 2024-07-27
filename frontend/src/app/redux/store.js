import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import cartSlice from "../redux/slices/cartSlices";


const persistConfig = {
  key: "root",
  storage,
};


const rootReducer = combineReducers({
  cart: cartSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});


export const persistor = persistStore(store);