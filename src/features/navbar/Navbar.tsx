import React from "react";
import { Link } from "react-router-dom";
import { CartLink } from "../cart/CartLink";
import styles from "../../App.module.css";


export function Navbar() {
  return (
      <div className={styles.app}>
      <header className={styles.header}>
        <nav>
          <Link className={styles.navLink} to="/">
            Home
          </Link>
          <Link className={styles.navLink} to="/products">
            Products
          </Link>
          <CartLink />
        </nav>
      </header>
    </div>)
}