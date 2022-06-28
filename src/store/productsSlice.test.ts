import productsReducer, { allProducts } from './productsSlice';
import products from '../../public/products.json';

describe('Products Slice', () => {
  it('Should return the initial state when passed an empty action', () => {
    const initialState = undefined;
    const action = { type: '' };
    const result = productsReducer(initialState, action);
    expect(result).toEqual({ products: {} });
  });
  it('Should convert the products recieved to an object', () => {
    const initialState = undefined;
    const action = allProducts(products);
    const result = productsReducer(initialState, action);
    expect(Object.keys(result.products).length).toEqual(products.length);
    products.forEach((product) => {
      expect(result.products[product.id]).toEqual(product);
    });
  });
  it('Should not allow the same product to be added more than once', () => {
    const initialState = undefined;
    const action = allProducts(products);
    let result = productsReducer(initialState, action);
    expect(Object.keys(result.products).length).toEqual(products.length);
    products.forEach((product) => {
      expect(result.products[product.id]).toEqual(product);
    });

    result = productsReducer(result, action);
    expect(Object.keys(result.products).length).toEqual(products.length);
  });

  it('Should allow multiple products to be recieved at different times', () => {
    const initialState = undefined;
    const action = allProducts(products.slice(0, 2));
    let result = productsReducer(initialState, action);

    expect(Object.keys(result.products).length).toEqual(2);

    const secondAction = allProducts(products.slice(2, 4));
    result = productsReducer(result, secondAction);
    expect(Object.keys(result.products).length).toEqual(4);
  });
});
