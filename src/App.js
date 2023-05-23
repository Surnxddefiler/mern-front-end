import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Product } from './components/product';
import { Main } from './components/main';
import { Header } from './components/header';

import { useCart } from './hooks/useCart';
import { useState } from 'react';
import { Admin } from './components/admin';


function App() {
  const { cart, setCart } = useCart()
  const [loading, setLoading] = useState(true)

  const [ammountInCart, setAmountsInCart] = useState(0);

  const [isTg, setTg] = useState(false)


  const tg = window.Telegram.WebApp

  if (tg.platform !== "unknown") {
      setTg(true)
  }

  return (
    isTg && (
      <BrowserRouter>
        <Header cart={cart} setCart={setCart} setAmountsInCart={setAmountsInCart} />
        <div className='bg-black text-white'>{tg.platform}</div>
        <Routes>
          <Route path='/' exact element={<Main loading={loading} setLoading={setLoading} />} />
          <Route path='/product/:id' element={<Product loading={loading} setLoading={setLoading} setCart={setCart} cart={cart} ammountInCart={ammountInCart} setAmountsInCart={setAmountsInCart} />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </BrowserRouter>
    )
  );
}

export default App;
