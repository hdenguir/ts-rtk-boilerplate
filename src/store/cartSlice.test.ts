import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { RootState, getStoreWithState } from '.';
import CartReducer, {
  addToCart,
  CartState,
  removeFromCart,
  updateQuantity,
  getTotalItems,
  getTotalPrice,
  checkoutCart,
} from './cartSlice';

import products from '../../public/products.json';

import * as api from '../app/api';
import { getStateWithItems } from '../utils-test';

const mockStore = configureStore([thunk]);

jest.mock('../app/api', () => {
  return {
    async getProducts() {
      return [];
    },
    async checkout(items: api.CartItems = {}) {
      const isEmpty = Object.keys(items).length === 0;
      if (isEmpty) throw new Error('Must include cart items');

      if (items.evilItem > 0) throw new Error();

      if (items.badItem > 0) return { success: false };

      return { success: true };
    },
  };
});
test('Checkout Should work', async () => {
  await api.checkout({ fakeItem: 4 });
});

describe('Cart Slice', () => {
  it('Should return the initial state when passed an empty action', () => {
    const initialState = undefined;
    const action = { type: '' };
    const state = CartReducer(initialState, action);
    expect(state).toEqual({ items: {}, checkoutState: 'READY', errorMessage: '' });
  });

  it('Should addToCart return an object with the abc key and  quantity 1', () => {
    const initialState = undefined;
    const action = addToCart('abc');
    const state = CartReducer(initialState, action);
    expect(state).toEqual({ items: { abc: 1 }, checkoutState: 'READY', errorMessage: '' });
  });
  it('Should addToCart return an object with the abc key and  quantity 3', () => {
    const initialState = undefined;
    const action = addToCart('abc');
    let state = CartReducer(initialState, action);
    expect(state).toEqual({ items: { abc: 1 }, checkoutState: 'READY', errorMessage: '' });
    state = CartReducer(state, action);
    state = CartReducer(state, action);
    expect(state).toEqual({ items: { abc: 3 }, checkoutState: 'READY', errorMessage: '' });
  });

  it('Should removeFromCart item (abc) from the cart', () => {
    const initialState: CartState = {
      items: { abc: 1, efd: 4 },
      checkoutState: 'READY',
      errorMessage: '',
    };
    const action = removeFromCart('abc');
    const state = CartReducer(initialState, action);
    expect(state).toEqual({ items: { efd: 4 }, checkoutState: 'READY', errorMessage: '' });
  });

  it('Should updateQuantity of an item (abc) from the cart', () => {
    const initialState: CartState = {
      items: { abc: 1 },
      checkoutState: 'READY',
      errorMessage: '',
    };
    const action = updateQuantity({ id: 'abc', quantity: 4 });
    const state = CartReducer(initialState, action);
    expect(state).toEqual({ items: { abc: 4 }, checkoutState: 'READY', errorMessage: '' });
  });
});

describe('Cart Slice Selectors', () => {
  describe('Total Items function ', () => {
    it('Should return 0 with ne items', () => {
      const cart: CartState = {
        checkoutState: 'READY',
        errorMessage: '',
        items: {},
      };
      const result = getTotalItems({ cart } as RootState);
      expect(result).toEqual(0);
    });

    it('Should add up the total', () => {
      const cart: CartState = {
        checkoutState: 'READY',
        errorMessage: '',
        items: { efd: 4, dfg: 3 },
      };
      const result = getTotalItems({ cart } as RootState);
      expect(result).toEqual(7);
    });

    it('Should not compute again with the same state', () => {
      const cart: CartState = {
        checkoutState: 'READY',
        errorMessage: '',
        items: { efd: 3, dfg: 3 },
      };
      getTotalItems.resetRecomputations();
      getTotalItems({ cart } as RootState);
      expect(getTotalItems.recomputations()).toEqual(1);
      getTotalItems({ cart } as RootState);
      expect(getTotalItems.recomputations()).toEqual(1);
      getTotalItems({ cart } as RootState);
      getTotalItems({ cart } as RootState);
      getTotalItems({ cart } as RootState);
      expect(getTotalItems.recomputations()).toEqual(1);
    });

    it('Should  recompute  with new state', () => {
      const cart: CartState = {
        checkoutState: 'READY',
        errorMessage: '',
        items: { efd: 3, dfg: 3 },
      };
      getTotalItems.resetRecomputations();
      getTotalItems({ cart } as RootState);
      expect(getTotalItems.recomputations()).toEqual(1);
      cart.items = { abs: 2 };
      getTotalItems({ cart } as RootState);
      expect(getTotalItems.recomputations()).toEqual(2);
    });
  });

  describe('Total Price function ', () => {
    it('Should return 0 with an empty cart', () => {
      const state: RootState = {
        cart: {
          items: {},
          checkoutState: 'READY',
          errorMessage: '',
        },
        products: { products: {} },
      };
      const result = getTotalPrice(state);

      expect(result).toEqual('0.00');
    });
    it('Should add up the total', () => {
      const state: RootState = {
        cart: {
          items: {
            [products[0].id]: 3,
            [products[1].id]: 2,
          },
          checkoutState: 'READY',
          errorMessage: '',
        },
        products: {
          products: {
            [products[0].id]: products[0],
            [products[1].id]: products[1],
          },
        },
      };

      const result = getTotalPrice(state);

      expect(result).toEqual('23.25');
    });
    it('Should not compute again with the same state', () => {
      const state: RootState = {
        cart: {
          items: {
            [products[0].id]: 3,
            [products[1].id]: 4,
          },
          checkoutState: 'READY',
          errorMessage: '',
        },
        products: {
          products: {
            [products[0].id]: products[0],
            [products[1].id]: products[1],
          },
        },
      };

      getTotalPrice.resetRecomputations();
      const result = getTotalPrice(state);
      expect(result).toEqual('43.23');
      expect(getTotalPrice.recomputations()).toEqual(1);
      getTotalPrice(state);
      expect(getTotalPrice.recomputations()).toEqual(1);
    });
    it('Should recompute with new products', () => {
      const state: RootState = {
        cart: {
          items: {
            [products[0].id]: 3,
            [products[1].id]: 2,
          },
          checkoutState: 'READY',
          errorMessage: '',
        },
        products: {
          products: {
            [products[0].id]: products[0],
            [products[1].id]: products[1],
          },
        },
      };
      getTotalPrice.resetRecomputations();
      let result = getTotalPrice(state);
      expect(result).toEqual('23.25');
      expect(getTotalPrice.recomputations()).toEqual(1);
      state.products.products = {
        [products[0].id]: products[0],
        [products[1].id]: products[1],
        [products[2].id]: products[2],
      };
      result = getTotalPrice({ ...state });
      expect(result).toEqual('23.25');
      expect(getTotalPrice.recomputations()).toEqual(2);
    });
    it('Should recompute when cart changes', () => {
      const state: RootState = {
        cart: {
          items: {
            [products[0].id]: 3,
            [products[1].id]: 2,
          },
          checkoutState: 'READY',
          errorMessage: '',
        },
        products: {
          products: {
            [products[0].id]: products[0],
            [products[1].id]: products[1],
          },
        },
      };
      getTotalPrice.resetRecomputations();
      let result = getTotalPrice(state);
      expect(result).toEqual('23.25');
      expect(getTotalPrice.recomputations()).toEqual(1);
      state.cart.items = {};
      result = getTotalPrice({ ...state });
      expect(result).toEqual('0.00');
      expect(getTotalPrice.recomputations()).toEqual(2);
    });
  });
});

describe('CheckoutCart', () => {
  describe('w/mocked dispatch ', () => {
    it('Should checkout', async () => {
      const dispatch = jest.fn();
      const state: RootState = {
        products: { products: {} },
        cart: { checkoutState: 'READY', errorMessage: '', items: { abc: 3 } },
      };

      const thunk = checkoutCart();
      await thunk(dispatch, () => state, undefined);
      const { calls } = dispatch.mock;
      expect(calls).toHaveLength(2);
      expect(calls[0][0].type).toEqual('cart/checkout/pending');
      expect(calls[1][0].type).toEqual('cart/checkout/fulfilled');
      expect(calls[1][0].payload).toEqual({ success: true });
    });
    it('Should fail with no items', async () => {
      const dispatch = jest.fn();
      const state: RootState = {
        products: { products: {} },
        cart: { checkoutState: 'READY', errorMessage: '', items: {} },
      };

      const thunk = checkoutCart();
      await thunk(dispatch, () => state, undefined);
      const { calls } = dispatch.mock;
      expect(calls).toHaveLength(2);
      expect(calls[0][0].type).toEqual('cart/checkout/pending');
      expect(calls[1][0].type).toEqual('cart/checkout/rejected');
      expect(calls[1][0].payload).toEqual(undefined);
      expect(calls[1][0].error.message).toEqual('Must include cart items');
    });
  });

  describe('w/mock redux store', () => {
    it('Should checkout', async () => {
      const store = mockStore({ cart: { items: { test: 4 } } });
      await store.dispatch(checkoutCart() as any);
      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toEqual('cart/checkout/pending');
      expect(actions[1].type).toEqual('cart/checkout/fulfilled');
      expect(actions[1].payload).toEqual({ success: true });
    });
    it('Should fail with no items', async () => {
      const store = mockStore({ cart: { items: {} } });
      await store.dispatch(checkoutCart() as any);
      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toEqual('cart/checkout/pending');
      expect(actions[1].type).toEqual('cart/checkout/rejected');
      expect(actions[1].payload).toEqual(undefined);
      expect(actions[1].error.message).toEqual('Must include cart items');
    });
  });
  describe(' w/full redux store', () => {
    it('Should checkout with items', async () => {
      const state = getStateWithItems({ test: 3 });
      const store = getStoreWithState(state);
      await store.dispatch(checkoutCart());
      expect(store.getState().cart).toEqual({
        items: {},
        errorMessage: '',
        checkoutState: 'READY',
      });
    });

    it('Should fail with no items', async () => {
      const state = getStateWithItems({});
      const store = getStoreWithState(state);
      await store.dispatch(checkoutCart());
      expect(store.getState().cart).toEqual({
        items: {},
        errorMessage: 'Must include cart items',
        checkoutState: 'ERROR',
      });
    });

    it('Should handle an error', async () => {
      const state = getStateWithItems({ badItem: 4 });
      const store = getStoreWithState(state);
      await store.dispatch(checkoutCart());
      expect(store.getState().cart).toEqual({
        items: { badItem: 4 },
        errorMessage: '',
        checkoutState: 'ERROR',
      });
    });
    it('Should handle an empty error message', async () => {
      const state = getStateWithItems({ evilItem: 4 });
      const store = getStoreWithState(state);
      await store.dispatch(checkoutCart());
      expect(store.getState().cart).toEqual({
        items: { evilItem: 4 },
        errorMessage: '',
        checkoutState: 'ERROR',
      });
    });
    it('Should be pending before checking out', async () => {
      const state = getStateWithItems({ goodItem: 4 });
      const store = getStoreWithState(state);
      expect(store.getState().cart.checkoutState).toEqual('READY');

      const action = store.dispatch(checkoutCart());
      expect(store.getState().cart.checkoutState).toEqual('LOADING');

      await action;
      expect(store.getState().cart.checkoutState).toEqual('READY');
    });
  });
});
