import { createSlice } from "@reduxjs/toolkit";
import cartAPI from "../../mocks/Cart";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    shippingAddress: {},
    paymentMethod: null,
  },
  reducers: {
    setCartItems(state, action) {
      state.cartItems = action.payload;
      localStorage.setItem("cartItems", JSON.stringify(action.payload));
    },
    removeCartItem(state, action) {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item._id !== id);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    setShippingAddress(state, action) {
      state.shippingAddress = action.payload;
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
      localStorage.setItem("paymentMethod", JSON.stringify(action.payload));
    },
  },
});


export const {
  setCartItems,
  removeCartItem,
  setShippingAddress,
  setPaymentMethod,
} = cartSlice.actions;

export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    const { cartItems } = getState().cart;
    const product = await cartAPI.fetchProduct(id);

    const existingItem = cartItems.find((item) => item._id === id);

    if (existingItem) {
      const updatedCartItems = cartItems.map((item) =>
        item._id === id ? { ...item, qty: item.qty + qty } : item
      );
      dispatch(setCartItems(updatedCartItems));
    } else {
      dispatch(setCartItems([...cartItems, { ...product, qty }]));
    }
  } catch (error) {
    console.log("Erro ao adicionar item ao carrinho:", error);
  }
};


export const removeFromCart = (id) => (dispatch) => {
  try {
    dispatch(removeCartItem(id));
  } catch (error) {
    console.log("Erro ao remover item do carrinho:", error);
  }
};


export const saveShippingAddress = (data) => (dispatch) => {
  dispatch(setShippingAddress(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch(setPaymentMethod(data));
};

export default cartSlice.reducer;
