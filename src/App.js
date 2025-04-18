import './App.css';
import {Route, Routes, useLocation } from 'react-router-dom';
import { Product } from './components/product';
import { Main } from './components/main';
import { Header } from './components/header';

import { useCart } from './hooks/useCart';
import { useEffect, useState } from 'react';
import { Admin } from './components/admin';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {ToastContainer} from "react-toastify"

function App() {
  const { cart, setCart } = useCart()
  const [loading, setLoading] = useState(true);
  const [restoredOrder, setRestoredOrder]=useState(null)

  const [ammountInCart, setAmountsInCart] = useState(0);

  const location = useLocation();
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const encodedOrder = params.get("order");
    if(encodedOrder){
      try{

        setLoading(true)
        fetch('https://mernnode-production-873d.up.railway.app/api/nicotine/').then(res => res.json()).then(apiData => {

          
        const jsonOrder = decodeURIComponent(encodedOrder);
        const order = JSON.parse(jsonOrder);

          const allProducts = apiData.data.flatMap(group => group.product);
          const filteredCart = order.cart.filter((itemFromOrder) => {
            return allProducts.some((product) =>
              product.stock &&
              product.name === itemFromOrder.name &&
              product.nicotine === itemFromOrder.nicotine &&
              product.mark === itemFromOrder.mark
            );
          });
  
          // Создаём новый заказ с обновлённой корзиной
          const filteredOrder = { ...order, cart: filteredCart };
            setLoading(false)
            setRestoredOrder(order);
            setCart(filteredOrder.cart)
            console.log("Полученный заказ:", order);
        })

        
    
      }catch(error){
        console.log(error)
      }
    }
  }, [setCart])

  const tg=window.Telegram.WebApp
  return (
    tg.platform && (
       <TransitionGroup component={null}>
        <Header  cart={cart} loading={loading} setLoading={setLoading} setCart={setCart} setAmountsInCart={setAmountsInCart} restoredOrder={restoredOrder} />
        {tg.initData}
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Routes location={location}>
          
          <Route path='/' exact element={<Main loading={loading} setLoading={setLoading} />} />
          <Route path='/product/:id' element={<Product loading={loading} setLoading={setLoading} setCart={setCart} cart={cart} ammountInCart={ammountInCart} setAmountsInCart={setAmountsInCart} />} />
          <Route path='/admin' exact element={<Admin />} />
        </Routes>
        </CSSTransition>
          <ToastContainer />
        </TransitionGroup>
    )
  );
}

export default App;
