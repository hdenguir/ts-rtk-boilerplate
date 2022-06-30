import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { getTotalItems } from '../../store/cartSlice';
import styles from './CartLink.module.css';

export function CartLink() {
  const totalItems = useAppSelector(getTotalItems);

  return (
    <Link to="/cart" className={styles.link}>
      <span className={styles.text}>🛒&nbsp;&nbsp;{totalItems ? totalItems : 'Cart'}</span>
    </Link>
  );
}
