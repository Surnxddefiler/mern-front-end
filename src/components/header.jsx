import { useEffect, useRef, useState } from "react"

// import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink, useLocation } from "react-router-dom";
import { Field, Formik } from 'formik';
import { CSSTransition } from "react-transition-group";
import '../App.css'

export const Header = ({ cart, setCart, setAmountsInCart }) => {
    


    //проверка на локацию, если локация не мейн страница то будет стрелка возле лого
    const [isHome, setHome]=useState(true)
    const location = useLocation();

    useEffect(()=>{
        if(location.pathname!=='/'){
            setHome(false)
        }
    },[location])

    const [modal, setModal] = useState(false)
    return (
        <header className={`${modal ? 'pb-52 h-screen sticky top-0 overflow-y-scroll' : 'sticky top-0'} py-3 px-5 w-s bg-primary`}>
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
            {modal ? <CSSTransition in={modal} classNames={'fade'} timeout={300} unmountOnExit><ModalWindow cart={cart} setCart={setCart} setAmountsInCart={setAmountsInCart} /></CSSTransition> : ""}
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




const ModalWindow = ({ cart, setCart, setAmountsInCart }) => {

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
        console.log(val)
        if (!novaPoshta) {
            if (val.phone === "" || val.time === "00:00" || place === "") {
                const notify = () => toast("Заполните все поля");
                return notify()
            }
            tg.MainButton.show();
            tg.onEvent('mainButtonClicked', (() => {
            
                tg.sendData(JSON.stringify({ val, cart, place }))
            }))
        }
        else{
            if (!val.compartment || !val.name || val.phone === "" || !val.town) {
                const notify = () => toast("Заполните все поля");
                return notify()
            }
            tg.MainButton.show();
            tg.onEvent('mainButtonClicked', (() => {
            setNovaPoshta(true)
                tg.sendData(JSON.stringify({ val, cart, novaPoshta }))
            }))
        }
       

        if (cart.length === 0) {
            const notify = () => toast("Корзина пустая");
            return notify()
        }
   

        tg.MainButton.show();
        // tg.sendData(JSON.stringify({ val, cart, place }))
        // tg.onEvent('mainButtonClicked', (() => {
            
        //     tg.sendData(JSON.stringify({ val, cart, place }))
        // }))

    }

    const initialValue = {
        phone: "",
        time: "00:00"
    }

    //общее количевство денег
    const [pay, setPayment] = useState(0)
    useEffect(() => {
        let totalPayment = 0;
        cart.forEach((obj) => {
            totalPayment += obj.cost;
        });
        setPayment(totalPayment);
    }, [cart]);

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
            console.log('okidoki')
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
                    <div className="w-1/3" > <span>{obj.mark}</span> <span>{obj.name}</span></div>
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
                {({ handleSubmit }) => (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit()
                    }}>
                        <div className="flex justify-center flex-col gap-5">
                            <Field className="placeholder:opacity-70 bg-fifth placeholder:text-white p-5" placeholder={"Номер телефона"}  inputMode="numeric" type="number" name={"phone"} onKeyDown={handleKeyDown} />
                            {!deliv && !novaPoshta && <select ref={selectRef} value={place} className="bg-fifth placeholder:text-white text-input p-5" onChange={onChangePlace}>
                                <option value="" disabled hidden key="">Точка выдачи -</option>
                                <option className="p-5" value="• Дэмитекс" key="">• Дэмитекс</option>
                                <option className="p-5" value="• Институт связи" key="">• Институт связи</option>
                                <option className="p-5" value="• ТРЦ киев" key="">• ТРЦ киев</option>
                                <option className="p-5" value="• Зыгина" key="">• Зыгина</option>
                                <option className="p-5" value="• 5-я школа" key="">• 5-я школа</option>
                                <option className="p-5" value="• Сенная" key="">• Сенная</option>
                                <option className="p-5" value="• Центр" key="">• Центр</option>
                                <option className="p-5" value="другое" key="">Доставка от 10-ти ₴ до 80-ти ₴</option>
                                <option className="p-5" value="нп" key="">Доставка через Новую Почту</option>
                            </select>
                            }
                            {deliv && <div>
                                <input onKeyDown={handleKeyDown} placeholder="Адрес / место доставки" value={place} className="w-full placeholder:opacity-70 bg-fifth placeholder:text-white p-5" type="text" onChange={onChangePlace} />
                                <div className="mt-5 rounded-2xl bg-secondary duration-200 px-4 py-1 w-fit" onClick={() => { setDeliv(false) }}>Выбрать из существующих -</div>
                            </div>}
                            {!novaPoshta && <Field  innerRef={(ref) => {setTimeFieldRef.current = ref;}} className="p-5 bg-fifth placeholder:text-white placeholder:opacity-70 text-input" type="time" placeholder={"время"} name={"time"} />}
                            {novaPoshta  &&  
                            <div className="flex justify-center flex-col gap-5">
                            <Field className="placeholder:opacity-70 w-full bg-fifth placeholder:text-white p-5" placeholder={"ФИО:"}  type="text" name={"name"} />
                            <Field className="placeholder:opacity-70 w-full bg-fifth placeholder:text-white p-5" placeholder={"Город / другое :"}  type="text" name={"town"}/>
                            <Field className="placeholder:opacity-70 w-full bg-fifth placeholder:text-white p-5" placeholder={"Отделение :"}  type="text" name={"compartment"}/>
                            <div className="mt-5 rounded-2xl bg-secondary duration-200 px-4 py-1 w-fit" onClick={() => { setNovaPoshta(false) }}>Выбрать другой вид доставки</div>
                            </div>
                            }

                        </div>
                        <div className="flex justify-center mt-4">
                            <button type="submit" className=" hover:bg-fourth  text-2xl mt-5 shadow__btn">
                                Оформить заказ
                            </button>
                            <ToastContainer />
                        </div>
                    </form>

                )}
            </Formik>



        </div>
    )
}