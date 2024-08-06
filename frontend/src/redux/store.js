import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import cartSlice from "../redux/slices/cartSlices";
import authSlice from "../redux/slices/authSlice";
import filterSlice from "../redux/slices/filterSlice";
import sortSlice from "./slices/sortSlice";


const persistConfig = {
  key: "root",
  storage,
};


const rootReducer = combineReducers({
  cart: cartSlice,
  auth: authSlice,
  filter: filterSlice,
  sort: sortSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});


export const persistor = persistStore(store);