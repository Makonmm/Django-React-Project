import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";
import productSlice from "../slices/productSlice";
import orderSlice from "../slices/orderSlice";
import cartReducer from "../slices/cartSlice";

export const rootReducer = combineReducers({
  user: userSlice.reducer,    // userSlice.reducer é o reducer padrão exportado por createSlice
  product: productSlice.reducer,  // productSlice.reducer é o reducer padrão exportado por createSlice
  order: orderSlice.reducer,   // orderSlice.reducer é o reducer padrão exportado por createSlice
  cart: cartReducer,    // cartSlice.reducer é o reducer padrão exportado por createSlice
});
