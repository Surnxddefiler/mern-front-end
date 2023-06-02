import axios from "axios";
import { Field, Formik } from "formik"
import { useRef } from "react";
// import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
export const Admin = () => {
    const handleSubmit = async (e) => {
        if (e.type === "" || e.name === "" || e.nicotine === "" || e.mark === "") {
            const notify = () => toast("не заполнены все строки");
            return notify()
        }
        else {
            try {
                await axios.post('https://fuzzy-jay-drawers.cyclic.app/api/nicotine/postProduct', { e })
            } catch (e) {
                const notify = () => toast("успешно не добавлено");
                return notify()
            }
        }

    }

    const nameRef = useRef(null);
    const nicotineRef = useRef(null);
    const markRef = useRef(null);
    const costRef = useRef(null);
    const handleKeyDown = (e, inputRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputRef.current.focus();
        }
    };


    // const [data, setData] = useState([])


    // useEffect(() => {
    //     fetch('https://mern-back-end-y33v.onrender.com/api/nicotine/').then(res => res.json()).then(data => {
    //         setData(data.data)
    //     })
    // }, [])


    // const onHandleChange=async(e)=>{
    //     try {
    //         await axios.put('https://mern-back-end-y33v.onrender.com/api/nicotine/changecost', { e });
    //     } catch (error) {
    //         const notify = () => toast("не нашло вкус");
    //         return notify
    //     }
    // }
    const initialValue = {
        type: "",
        name: "",
        nicotine: "",
        cost: 1,
        mark: "",
    }
    // const initialChange={
    //     type: "",
    //     name: "",
    //     cost: ""
    // }
    return (
        <div>
            <Formik initialValues={initialValue} onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
                resetForm({ values: '' }); // Reset the form fields
            }}>
                {({ handleSubmit }) => (
                    <form className="flex flex-col justify-center gap-4 items-center" onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit()
                    }}>
                        <h1 className="text-white">ДОБАВИТЬ НОВЫЙ ПРОДУКТ</h1>
                        <Field className="bg-fifth placeholder:text-white p-5" as="select" name={"type"}>
                            <option value="" disabled hidden key="">Что добавить</option>
                            <option className="p-5" value="жидкости" key="">Жидкости</option>
                            <option className="p-5" value="картриджи" key="">Картриджи</option>
                            <option className="p-5" value="одноразки" key="">Одноразки</option>
                        </Field>
                        <Field className="bg-fifth placeholder:text-white p-5" innerRef={nameRef} placeholder={"Вкус"} name={"name"} onKeyDown={(e) => handleKeyDown(e, nicotineRef)} />
                        <Field className="bg-fifth placeholder:text-white p-5" innerRef={nicotineRef} placeholder={"Дополнение"} name={"nicotine"} onKeyDown={(e) => handleKeyDown(e, markRef)} />
                        <Field className="bg-fifth placeholder:text-white p-5" innerRef={markRef} placeholder={"Марка"} name={"mark"} onKeyDown={(e) => handleKeyDown(e, costRef)} />
                        <Field className="bg-fifth placeholder:text-white p-5" innerRef={costRef} type="number" placeholder={"цена"} name={"cost"} />
                        <div>
                            <button type="submit" className=" bg-fifth placeholder:text-white p-5 text-2xl text-white mt-5">
                                Добавить
                            </button>
                            <ToastContainer />
                        </div>
                    </form>

                )}
            </Formik>

            <div>

                {/* <Formik initialValues={initialChange} onSubmit={(values, { resetForm }) => {
    onHandleChange(values);
    resetForm({ values: '' }); // Reset the form fields
}}>
                {({ handleSubmit }) => (
                    <form className="mt-5 flex flex-col justify-center gap-4 items-center" onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit()
                    }}>
                        <h1 className="text-black text-2xl">изменить цену</h1>
                        <Field className="bg-fifth placeholder:text-white p-5" as="select" name="type">
                            <option value="" disabled hidden>что изменить</option>
                            {data.map(obj=>{
                                return <option value={obj.type} key="">{obj.type}</option>
                            })}
                        </Field>
                        <Field className="bg-fifth placeholder:text-white p-5" placeholder="название продукта" name="name"/>
                        <Field className="bg-fifth placeholder:text-white p-5" placeholder="новая цена" type="number" name="cost"/>

                        <div>
                            <button type="submit"  className="text-2xl text-white mt-5 bg-fifth placeholder:text-white p-5">
                                изменить
                            </button>
                            <ToastContainer />
                        </div>
                    </form>

                )}
                </Formik> */}
            </div>
        </div>
    )
}