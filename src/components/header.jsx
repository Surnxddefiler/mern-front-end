import { useEffect, useRef, useState } from "react"

// import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink } from "react-router-dom";
import { Field, Formik } from 'formik';




export const Header = ({ cart, setCart, setAmountsInCart }) => {
    

    const [modal, setModal] = useState(false)
    return (
        <header className={`${modal ? 'pb-96 h-screen sticky top-0' : 'sticky top-0'} py-3 px-5 w-s  overflow-scroll bg-primary`}>
            <div className="justify-between flex items-center">
                <NavLink to="/" onClick={()=>{
                    setModal(false)
                }}>
                    <img className={"w-12 rounded-2xl"} src="/logo2.jpg" alt="" />
                </NavLink>
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
                        class={`fa-solid ${cart.length > 0 ? "fa-beat-fade" : ""} fa-cart-shopping fa-2xl text-white`}></i>}
                    {modal ? "" : <div

                        className="-top-4 -right-3  bg-white px-1.5 rounded-full absolute text-black" >{cart.length}</div>}
                </div>
            </div>
            {modal ? <ModalWindow cart={cart} setCart={setCart} setAmountsInCart={setAmountsInCart} /> : ""}
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


    const selectRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            selectRef.current.focus();
        }
    };


    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Подтвердить заказ',
            color: 'rgba(254,56,117,255)'
        })
    })


    const onSubmitForm = (val) => {
        if (val.phone === "" || val.time === "00:00" || place === "") {
            const notify = () => toast("Заполните все поля");
            return notify()
        }

        if (cart.length === 0) {
            const notify = () => toast("Корзина пустая");
            return notify()
        }
        console.log(val)
        console.log(cart)
        tg.MainButton.show();
        tg.onEvent('mainButtonClicked', (() => {
                tg.sendData(JSON.stringify({ val, cart, place }))

        }))

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
            <div className="text-2xl border-t-4 border-white">Стоимость заказа - {pay} ₴</div>
            <Formik onSubmit={onSubmitForm} initialValues={initialValue}>
                {({ handleSubmit }) => (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit()
                    }}>
                        <div className="flex justify-center flex-col gap-5">
                            <Field className="bg-fifth placeholder:text-white p-5" placeholder={"Номер телефона"} name={"phone"} onKeyDown={handleKeyDown} />
                            {!deliv && <select ref={selectRef} value={place} className="bg-fifth placeholder:text-white p-5" onChange={onChangePlace}>
                                <option value="" disabled hidden key="">Точка выдачи -</option>
                                <option className="p-5" value="• Дэмитекс" key="">• Дэмитекс</option>
                                <option className="p-5" value="• Институт связи" key="">• Институт связи</option>
                                <option className="p-5" value="• ТРЦ киев" key="">• ТРЦ киев</option>
                                <option className="p-5" value="• Зыгина" key="">• Зыгина</option>
                                <option className="p-5" value="• 5-я школа" key="">• 5-я школа</option>
                                <option className="p-5" value="• Сенная" key="">• Сенная</option>
                                <option className="p-5" value="• Центр" key="">• Центр</option>
                                <option className="p-5" value="другое" key="">Доставка от 10-ти ₴ до 80-ти ₴</option>
                            </select>
                            }
                            {deliv && <div>
                                <input placeholder="Адрес / место доставки" value={place} className="bg-fifth placeholder:text-white p-5" type="text" onChange={onChangePlace} />
                                <button className="ml-5" onClick={() => { setDeliv(false) }}>Выбрать из существующих -</button>
                            </div>}
                            <Field className="p-5 bg-fifth placeholder:text-white" type="time" placeholder={"время"} name={"time"} />

                        </div>
                        <div>
                            <button type="submit" className="text-2xl mt-5">
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