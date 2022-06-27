import classNames from 'classnames';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { checkoutCart, getTotalPrice, removeFromCart, updateQuantity } from '../../store/cartSlice';
import styles from './Cart.module.css';

export function Cart() {
   const items = useAppSelector((state) => state.cart.items);
   const products = useAppSelector((state) => state.products.products);
   const totalPrice = useAppSelector(getTotalPrice);
   const dispatch = useAppDispatch();
   const checkoutState = useAppSelector((state) => state.cart.checkoutState);
   const errorMessage = useAppSelector((state) => state.cart.errorMessage);

   const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      e.preventDefault();
      if (e.target.value) {
         const quantity = Number(e.target.value);

         dispatch(updateQuantity({ id, quantity }));
      }
   };

   const onCheckout = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      dispatch(checkoutCart());
   };

   const tableClasses = classNames({
      [styles.table]: true,
      [styles.checkoutError]: checkoutState === 'ERROR',
      [styles.checkoutLoading]: checkoutState === 'LOADING',
   });

   return (
      <main className="page">
         <h1>Shopping Cart</h1>
         <table className={tableClasses}>
            <thead>
               <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Remove</th>
               </tr>
            </thead>
            <tbody>
               {Object.entries(items).map(([id, quantity]) => (
                  <tr key={id}>
                     <td>{products[id].name}</td>
                     <td>
                        <input
                           type="text"
                           className={styles.input}
                           defaultValue={quantity}
                           onChange={(e) => onQuantityChange(e, id)}
                        />
                     </td>
                     <td>{products[id].price}</td>
                     <td>
                        <button
                           aria-label={`Remove ${products[id].name} from Shopping Cart`}
                           onClick={() => dispatch(removeFromCart(id))}
                        >
                           X
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
            <tfoot>
               <tr>
                  <td>Total</td>
                  <td></td>
                  <td className={styles.total}>${totalPrice}</td>
                  <td></td>
               </tr>
            </tfoot>
         </table>
         <form onSubmit={onCheckout}>
            {checkoutState === 'ERROR' && errorMessage ? (
               <p className={styles.errorBox}>{errorMessage}</p>
            ) : null}
            <button className={styles.button} type="submit">
               Checkout
            </button>
         </form>
      </main>
   );
}
