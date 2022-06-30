import React from 'React';
import { renderWithContext } from '../../utils-test';
import { Products } from './Products';
import * as api from '../../app/api';
import mockProducts from '../../../public/products.json';
import { getByRole, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const getProductsSpy = jest.spyOn(api, 'getProducts');
getProductsSpy.mockResolvedValue(mockProducts);

test('Should be list of products', async () => {
  const { debug } = renderWithContext(<Products />);

  await waitFor(() => expect(getProductsSpy).toHaveBeenCalledTimes(1));
  const articles = screen.getAllByRole('article');
  expect(articles.length).toEqual(mockProducts.length);
});

test('Should contain a heading for an individual product', async () => {
  renderWithContext(<Products />);
  for (let product of mockProducts) {
    await screen.findByRole('heading', { name: product.name });
  }
});

test('Should be able to add a banana to your cart', async () => {
  const { store } = renderWithContext(<Products />);
  const button = await screen.findByLabelText(/Add Bananas/i);
  await userEvent.click(button);
  expect(store.getState().cart.items['207']).toEqual(1);
  await userEvent.click(button);
  await userEvent.click(button);
  expect(store.getState().cart.items['207']).toEqual(3);
});
