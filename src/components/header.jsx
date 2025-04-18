import { useEffect, useRef, useState } from "react"

// import axios from 'axios';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink, useLocation } from "react-router-dom";
import { Field, Formik} from 'formik';
import { CSSTransition } from "react-transition-group";
import '../App.css'

export const Header = ({ cart, setCart, setAmountsInCart, restoredOrder }) => {
    


    //проверка на локацию, если локация не мейн страница то будет стрелка возле лого
    const [isHome, setHome]=useState(true)
    const location = useLocation();

    const [modal, setModal] = useState(false)
    useEffect(()=>{
       // если не главная — меняем флаг isHome
  if (location.pathname !== '/') {
    setHome(false);
  } else {
    setHome(true); // на всякий случай добавь возврат
  }

  // открываем модалку ТОЛЬКО если это главная и заказ восстановлен
  if (restoredOrder && location.pathname === '/') {
    setModal(true);
  }
    },[location, restoredOrder])

    return (
        <header className={`${modal ? 'z-40 pb-52 h-screen sticky top-0 overflow-y-scroll' : 'sticky top-0'} py-3 px-5 w-s bg-primary`}>
            <div className="justify-between flex items-center">
                {modal ? 
                <div className={'flex items-center logo__wrapper'} onClick={()=>{
                    document.body.style.overflow = modal ? 'auto' : 'hidden';
                    setModal(false)}
                    }>
                    <i className="text-white text-4xl fa-solid fa-caret-left"></i>
                    <img className={`${isHome ? 'home' : 'nehome'} w-12 rounded-2xl`} src="/logo2.jpg" alt="" /> 
                </div>
                 : 
                 <div>
                    <NavLink className={'flex items-center logo__wrapper'} to="/">
                    {isHome ? '' : <i className="text-white text-4xl fa-solid fa-caret-left"></i>}
                    <img className={`${isHome ? 'home' : 'nehome'} w-12 rounded-2xl`} src="/logo2.jpg" alt="" />
                </NavLink>
                    </div>}
                
                <div className="relative">{modal ?
                    <i
                        onClick={() => {
                            setModal(!modal);
                            document.body.style.overflow = modal ? 'auto' : 'hidden';
                        }}
                        class="fa-regular fa-circle-xmark text-white fa-2xl"></i>
                    : <i
                        onClick={() => {
                            setModal(!modal);
                            document.body.style.overflow = modal ? 'auto' : 'hidden';
                        }}
                        class={`fa-solid ${cart.length > 0 ? "fa-beat-fade" : "glowing-cart"} fa-cart-shopping fa-2xl text-white`}></i>}
                    {modal ? "" : <div

                        className="-top-4 -right-3  bg-white px-1.5 rounded-full absolute text-black" >{cart.length}</div>}
                </div>
            </div>
            <CSSTransition in={modal} classNames={'korzina'} timeout={300} unmountOnExit>
                <ModalWindow cart={cart} setCart={setCart} setAmountsInCart={setAmountsInCart} restoredOrder={restoredOrder} />
            </CSSTransition>
        </header>
    )
}



// const handleUpdateAmount = async (arr) => {
//     const mnogo = (p) => toast(`на складе недостаточно товара ${p}`)
//     const counts = {};

//     arr.forEach((obj) => {
//         counts[obj.name] = (counts[obj.name] || 0) + 1;
//     });
//     for (const obj of arr) {
//         if (counts[obj.name] > obj.ammount) {
//             return mnogo(obj.name)
//         }
//         else {
//             try {
//                 await axios.put('https://mern-back-end-y33v.onrender.com/api/nicotine/updateamount', { arr });
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//     }
// };




const ModalWindow = ({ cart, setCart, setAmountsInCart, restoredOrder }) => {

    const tg = window.Telegram.WebApp



    //зaменение полей в случае новой почты
    const [novaPoshta, setNovaPoshta]=useState(false)


    const selectRef = useRef(null);

    const setTimeFieldRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (deliv) {
                // Если фокус в поле ввода текста, предотвращаем стандартное поведение (отправку формы) и обрабатываем по необходимости
                e.preventDefault();
                // Добавьте вашу логику обработки клавиши Enter в поле ввода текста здесь
                // Например, можно переместить фокус на следующее поле ввода
                setTimeFieldRef.current.focus();
            } else {
                // Если фокус в выпадающем списке, фокусируемся на selectRef
                selectRef.current.focus();
            }
        }
    };
    


    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Подтвердить заказ',
            color: 'rgba(254,56,117,255)'
        })
    })


    const onSubmitForm = (val) => {
        if (cart.length === 0) {
            toast("Корзина пустая");
        
            return
        }

        if (!novaPoshta) {
            if (val.phone === "" || val.time === "00:00" || place === "" || val.poltavapayment==="") {
                const notify = () => toast("Заполните все поля");
                return notify()
            }
        }
        else{
            if (!val.compartment || !val.name || val.phone === "" || !val.town || !val.payment) {
                const notify = () => toast("Заполните все поля");
                return notify()
            }
            
        }
        tg.MainButton.show();
        tg.onEvent('mainButtonClicked', (() => {
            if (novaPoshta) {
                tg.sendData(JSON.stringify({ val, cart, novaPoshta, pay }))
            }
            else{
                tg.sendData(JSON.stringify({ val, cart, place, pay, deliv }))
            }
        }))

       
   

    }

    const initialValue = {
        phone: restoredOrder?.val?.phone || "",
        time:  restoredOrder?.val?.time || "00:00",
        name: restoredOrder?.val?.name || "",
        compartment: restoredOrder?.val?.compartment || "",
        town: restoredOrder?.val?.town || "",
        payment: restoredOrder?.val?.payment || "",
        poltavapayment: restoredOrder?.val?.poltavapayment || "",
        cashAmount: restoredOrder?.val?.cashAmount || ""
    }

    //общее количевство денег
    const [pay, setPayment] = useState(0)
    useEffect(() => {
        let totalPayment = 0;
        cart.forEach((obj) => {
            totalPayment += obj.cost;
        });
        setPayment(totalPayment);
        if(restoredOrder){
            
            const validPlaces = ["• ЖБИ","• Дэмитекс","• Институт связи","• ТРЦ киев","• Зыгина","• 5-я школа","• Сенная","• Центр","• 1-я гор. больница"];


            if(restoredOrder.place){
                if (validPlaces.includes(restoredOrder.place)) {
                    setPlace(restoredOrder.place);
                    console.log("ne nova");
                  } else {
                    setPlace(restoredOrder.place);
                    setDeliv(true);     // включаем ручной ввод адреса
                    console.log("custom delivery");
                  }
            }
            else if(restoredOrder.novaPoshta){
                setNovaPoshta(true)
                console.log('nova')
            }
            
        }
    }, [cart, restoredOrder]);

    //ончедж для доставки
    const [place, setPlace] = useState("")
    const [deliv, setDeliv] = useState(false)
    const onChangePlace = (e) => {
        setPlace(e.target.value)
    
        if (e.target.value === "другое") {
            setPlace("")
            setDeliv(true)
        }
        else if(e.target.value==="нп"){
            setPlace("")
            setNovaPoshta(true)
        }
        else {
            setPlace(e.target.value)
        }
    }
   
   
    return (
        <div className="text-white mt-5">
            <div className="">
            {cart.map((obj, index) => {
                return <div className="flex justify-between mb-5 items-center">
                    <div className="w-1/3" > <span>{obj.isPod ? '' : obj.mark}</span> <span>{obj.name}</span></div>
                    <div className="w-1/3">{obj.cost} ₴</div>
                    <div
                        onClick={() => {
                            setCart((prevCart) => prevCart.filter((_, i) => i !== index))
                            setAmountsInCart(prev => prev - 1)
                        }
                        }>
                        Удалить
                    </div>
                </div>
            })}
            </div>
            <div className=" border-t-4"></div>
            <div className="text-2xl my-5 border w-fit  border-secondary  p-2 ">Стоимость заказа - {pay} ₴</div>
            <Formik onSubmit={onSubmitForm} initialValues={initialValue}>
                {({ handleSubmit, values }) => (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit()
                    }}>
                        <div className="flex justify-center flex-col gap-5">
                            <Field className="placeholder:opacity-70 bg-fifth placeholder:text-white p-5" placeholder={"Номер телефона :"} name={"phone"} onKeyDown={handleKeyDown} />
                            {!deliv && !novaPoshta && <select ref={selectRef} value={place} className="bg-fifth placeholder:text-white text-input p-5" onChange={onChangePlace}>
                                <option value="" disabled hidden key="">Точка выдачи -</option>
                                <option className="p-5" value="• ЖБИ" key="">• ЖБИ</option>
                                <option className="p-5" value="• Дэмитекс" key="">• Дэмитекс</option>
                                <option className="p-5" value="• Институт связи" key="">• Институт связи</option>
                                <option className="p-5" value="• ТРЦ киев" key="">• ТРЦ киев</option>
                                <option className="p-5" value="• Зыгина" key="">• Зыгина</option>
                                <option className="p-5" value="• 5-я школа" key="">• 5-я школа</option>
                                <option className="p-5" value="• Сенная" key="">• Сенная</option>
                                <option className="p-5" value="• Центр" key="">• Центр</option>
                                <option className="p-5" value="• 1-я гор. больница" key="">• 1-я гор. больница</option>
                                <option className="p-5" value="другое" key="">Доставка по Полтавe</option>
                                <option className="p-5" value="нп" key="">Доставка Новой Почтой</option>
                            </select>
                            }
                            {deliv && <div>
                                <input onKeyDown={handleKeyDown} placeholder="Адрес / место доставки :" value={place} className="w-full placeholder:opacity-70 bg-fifth placeholder:text-white p-5" type="text" onChange={onChangePlace} />
                                <div className="mt-5 rounded-2xl bg-secondary duration-200 px-4 py-1 w-fit" onClick={() => { setDeliv(false) }}>Выбрать из существующих -</div>
                            </div>}
                            {!novaPoshta &&
                            <div className="flex flex-col gap-5">
                            <div>
                                <label className="mb-4 mr-4 text-xl">Удобное время получения -</label>
                             <Field  innerRef={(ref) => {setTimeFieldRef.current = ref;}} className="p-5 bg-fifth placeholder:text-white placeholder:opacity-70 text-input" type="time" placeholder={"время"} name={"time"} />
                             </div>
                             <Field name="poltavapayment" as="select" className="bg-fifth placeholder:text-white text-input p-5">
                            <option value="" disabled hidden>Выберите способ оплаты</option>
  <option value="Наличные">Наличные</option>
  <option value="Картой">Картой</option>
                            </Field>
                             {values.poltavapayment==="Наличные" && (
    <div>
        <Field
          name="cashAmount"
          type="phone"
          placeholder="Сумма для оплаты"
          className="w-full bg-fifth text-input p-5 placeholder:text-white placeholder:opacity-70"
        />
        </div>
      )}
                             </div>
                                }
                            {novaPoshta  &&  
                            <div className="flex justify-center flex-col gap-5">
                            <Field className="placeholder:opacity-70 w-full bg-fifth placeholder:text-white p-5" placeholder={"ФИО :"}  type="text" name={"name"} />
                            <Field className="placeholder:opacity-70 w-full bg-fifth placeholder:text-white p-5" placeholder={"Город / другое :"}  type="text" name={"town"}/>
                            <Field className="placeholder:opacity-70 w-full bg-fifth placeholder:text-white p-5" placeholder={"Отделение :"}  type="text" name={"compartment"}/>
                            <Field name="payment" as="select" className="bg-fifth placeholder:text-white text-input p-5">
                            <option value="" disabled hidden>Выберите способ оплаты</option>
  <option value="Наложенный платёж">Наложенный платёж</option>
  <option value="Предоплата">Предоплата</option>
  <option value="Полная оплата">Полная оплата</option>
                            </Field>
                            <div className="mt-5 rounded-2xl bg-secondary duration-200 px-4 py-1 w-fit" onClick={() => { setNovaPoshta(false) }}>Выбрать другой вид доставки -</div>
                            </div>
                            }

                        </div>
                        <div className="flex justify-center mt-4">
                            <button type="submit" className=" hover:bg-fourth  text-2xl mt-5 shadow__btn">
                                Оформить заказ
                            </button>
                            {/* <ToastContainer /> */}
                        </div>
                    </form>

                )}
            </Formik>



        </div>
    )
}