import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '.';
import { CartItems, checkout } from '../app/api';

type CheckoutState = 'LOADING' | 'READY' | 'ERROR';

export interface CartState {
   items: { [produtID: string]: number };
   checkoutState: CheckoutState;
   errorMessage: string;
}

const initialState: CartState = {
   items: {},
   checkoutState: 'READY',
   errorMessage: '',
};

const cartSlice = createSlice({
   name: 'cart',
   initialState,
   reducers: {
      addToCart(state, action: PayloadAction<string>) {
         const id = action.payload;
         state.items[id] = state.items[id] ? ++state.items[id] : 1;
      },
      removeFromCart(state, action: PayloadAction<string>) {
         delete state.items[action.payload];
      },
      updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
         const { id, quantity } = action.payload;
         state.items[id] = quantity;
      },
   },
   extraReducers: function (builder) {
      builder.addCase(checkoutCart.pending, (state, action) => {
         state.checkoutState = 'LOADING';
      });
      builder.addCase(
         checkoutCart.fulfilled,
         (state, action: PayloadAction<{ success: boolean }>) => {
            const { success } = action.payload;
            if (success) {
               state.checkoutState = 'READY';
               state.items = {};
            } else {
               state.checkoutState = 'ERROR';
            }
         },
      );
      builder.addCase(checkoutCart.rejected, (state, action) => {
         state.checkoutState = 'ERROR';
         state.errorMessage = action.error.message || '';
      });
   },
});

export const checkoutCart = createAsyncThunk('cart/checkout', async (_, thunkAPI) => {
   const state = thunkAPI.getState() as RootState;
   const items = state.cart.items;
   const res = await checkout(items);
   return res;
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;

export const getTotalItems = createSelector(
   (state: RootState) => state.cart.items,
   (items) => {
      return Object.values(items).reduce((x, y) => x + y, 0);
   },
);

export const getTotalPrice = createSelector(
   (state: RootState) => state.products.products,
   (state: RootState) => state.cart.items,
   (products, items) => {
      return Object.entries(items)
         .reduce((x, [id, quantity]) => {
            console.log({ x, id, quantity });
            return x + products[id].price * quantity;
         }, 0)
         .toFixed(2);
   },
);
