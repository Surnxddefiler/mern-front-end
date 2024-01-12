import './App.css';
import {Route, Routes, useLocation } from 'react-router-dom';
import { Product } from './components/product';
import { Main } from './components/main';
import { Header } from './components/header';

import { useCart } from './hooks/useCart';
import { useState } from 'react';
import { Admin } from './components/admin';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';


function App() {
  const { cart, setCart } = useCart()
  const [loading, setLoading] = useState(true)


  const [ammountInCart, setAmountsInCart] = useState(0);

  const location = useLocation();

  const tg=window.Telegram.WebApp
  return (
    tg.platform && (
      <>
        <Header  cart={cart} loading={loading} setLoading={setLoading} setCart={setCart} setAmountsInCart={setAmountsInCart} />
              <Routes location={location}>
          <Route path='/' exact element={<Main loading={loading} setLoading={setLoading} />} />
          <Route path='/product/:id' element={<Product loading={loading} setLoading={setLoading} setCart={setCart} cart={cart} ammountInCart={ammountInCart} setAmountsInCart={setAmountsInCart} />} />
          <Route path='/admin' exact element={<Admin />} />
        </Routes>
        </> 
    )
  );
}

export default App;
