import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Products } from "./features/products/Products";
import { Cart } from "./features/cart/Cart";
import { Navbar } from "./features/navbar/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/products">
          <Products />
        </Route>
        <Route path="/cart">
          <Cart />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

function Home() {
  return (
    <main className="page">
      <h1>Welcome to the Store</h1>
      <figure>
        <img src="/store.jpg" alt="A large old storefront" width="800" />
        <figcaption>Gary Houston, CC0, via Wikimedia Commons</figcaption>
      </figure>
    </main>
  );
}
