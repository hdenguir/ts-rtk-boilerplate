import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { getStoreWithState, RootState } from './store';
import { Product } from './app/api';

export function renderWithContext(element: React.ReactElement, state?: RootState) {
  const store = getStoreWithState(state);
  const utils = render(
    <Provider store={store}>
      <Router>
        <>{element}</>
      </Router>
    </Provider>,
  );
  return { store, ...utils };
}

export function getStateWithItems(
  items: Record<string, number>,
  products: Record<string, Product> = {},
): RootState {
  const state: RootState = {
    cart: { items, checkoutState: 'READY', errorMessage: '' },
    products: { products },
  };
  return state;
}
