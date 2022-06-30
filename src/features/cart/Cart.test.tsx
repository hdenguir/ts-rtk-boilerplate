import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'React';
import userEvent from '@testing-library/user-event';
import * as api from '../../app/api';
import { getStateWithItems, renderWithContext } from '../../utils-test';
import { Cart } from './Cart';

type Product = api.Product;

const checkoutSpy = jest.spyOn(api, 'checkout');

describe('Cart Component', () => {
  it('Should not have any items', async () => {
    renderWithContext(<Cart />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2);
    screen.getByText('$0.00', { selector: '.total' });
  });

  it('Should display correct total', async () => {
    const state = getStateWithItems(
      { testProduct: 3 },
      {
        testProduct: {
          name: 'testProduct',
          price: 11.11,
        } as Product,
      },
    );
    renderWithContext(<Cart />, state);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
    screen.getByText('$33.33', { selector: '.total' });
  });

  it('Should update total when product quantity updated', async () => {
    const state = getStateWithItems(
      { testItem: 3 },
      {
        testItem: {
          name: 'Testttt',
          price: 11.11,
        } as Product,
      },
    );
    renderWithContext(<Cart />, state);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
    screen.getByText('$33.33', { selector: '.total' });

    const input = screen.getByLabelText(/Testttt quantity/i);
    fireEvent.change(input, { target: { value: '0' } });
    screen.getByText('$0.00', { selector: '.total' });
    await userEvent.type(input, '4');
    userEvent.tab();
    screen.getByText('$44.44', { selector: '.total' });
  });

  it('Removing items should update total', async () => {
    const state = getStateWithItems(
      { tomatoes: 2, potatoes: 3 },
      {
        tomatoes: {
          name: 'tomatoes',
          price: 11.11,
        } as Product,
        potatoes: {
          name: 'potatoes',
          price: 22.22,
        } as Product,
      },
    );
    renderWithContext(<Cart />, state);
    screen.getByText('$88.88', { selector: '.total' });
    const removeTomatoes = screen.getByTitle(/remove tomatoes/i);
    await userEvent.click(removeTomatoes);
    screen.getByText('$66.66', { selector: '.total' });

    const removePotatoes = screen.getByTitle(/remove potatoes/i);
    await userEvent.click(removePotatoes);
    screen.getByText('$0.00', { selector: '.total' });
  });

  it('Cannot checkout with an empty cart', async () => {
    checkoutSpy.mockRejectedValueOnce(new Error('Cart must not be empty'));
    renderWithContext(<Cart />);
    const checkout = screen.getByRole('button', { name: 'Checkout' });
    const table = screen.getByRole('table');
    expect(table).not.toHaveClass('checkoutLoading');
    await userEvent.click(checkout);
    await screen.findByText('Cart must not be empty', { selector: '.errorBox' });
    expect(table).toHaveClass('checkoutError');
  });

  it('Should clear items after checkout', async () => {
    checkoutSpy.mockResolvedValueOnce({ success: true });
    const state = getStateWithItems(
      { tomatoes: 2, potatoes: 3 },
      {
        tomatoes: {
          name: 'tomatoes',
          price: 11.11,
        } as Product,
        potatoes: {
          name: 'potatoes',
          price: 22.22,
        } as Product,
      },
    );
    renderWithContext(<Cart />, state);
    screen.getByText('$88.88', { selector: '.total' });
    expect(screen.getAllByRole('row')).toHaveLength(4);
    const checkout = screen.getByRole('button', { name: /Checkout/i });
    await userEvent.click(checkout);
    //console.log({ res });

    await waitFor(() => {
      screen.getByText('$0.00', { selector: '.total' });
      expect(screen.getAllByRole('row')).toHaveLength(2);
    });
  });
});
