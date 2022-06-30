import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';

const reducer = {
  cart: cartReducer,
  products: productsReducer,
};

export const store = configureStore({
  reducer,
});

export function getStoreWithState(preloadedState?: RootState) {
  return configureStore({ reducer, preloadedState });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
