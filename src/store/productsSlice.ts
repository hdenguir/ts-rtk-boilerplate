import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../app/api';

export interface ProductsState {
   products: { [id: string]: Product };
}

const initialState: ProductsState = {
   products: {},
};

const productsSlice = createSlice({
   name: 'products',
   initialState,
   reducers: {
      allProducts(state, action: PayloadAction<Product[]>) {
         const products = action.payload;
         products.forEach((product) => {
            state.products[product.id] = product;
         });
      },
   },
});

export const { allProducts } = productsSlice.actions;
export default productsSlice.reducer;
