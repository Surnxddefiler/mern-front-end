import axios from "axios";
import { Field, Formik } from "formik"
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify"

export const Admin = () => {
    const handleSubmit=async(e)=>{
        try{
            const notify = () => toast("успешно изменено");
            await axios.post('https://mern-back-end-y33v.onrender.com/api/nicotine/postProduct', { e });
            return notify()
        }catch(e){

        }
    }


    const [data, setData] = useState([])


    useEffect(() => {
        fetch('https://mern-back-end-y33v.onrender.com/api/nicotine/').then(res => res.json()).then(data => {
            setData(data.data)
        })
    }, [])


    const onHandleChange=async(e)=>{
        try {
            await axios.put('https://mern-back-end-y33v.onrender.com/api/nicotine/changecost', { e });
            console.log('Значение amount успешно обновлено');
        } catch (error) {
            const notify = () => toast("не нашло вкус");
            return notify
        }
    }
    const initialValue = {
        type: "",
        name: "",
        nicotine: "",
        cost: 1,
        mark: "",
        ammount: 1 
    }
    const initialChange={
        type: "",
        name: "",
        cost: ""
    }
    return (
        <div>
            <Formik initialValues={initialValue} onSubmit={handleSubmit}>
                {({ handleSubmit }) => (
                    <form className="flex flex-col justify-center gap-4 items-center" onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit()
                    }}>
                        <h1 className="text-white">ДОБАВИТЬ НОВЫЙ ПРОДУКТ</h1>
                        <Field className="" as="select" name={"type"}>
                            <option value="" disabled hidden key="">что добавить</option>
                            <option className="p-5" value="жидкости" key="">жидкости</option>
                            <option className="p-5" value="картриджи" key="">картриджи</option>
                            <option className="p-5" value="одноразки" key="">одноразки</option>
                        </Field>
                        <Field className="" type="number" placeholder={"количество"} name={"ammount"} />
                        <Field className="" placeholder={"название"} name={"name"} />
                        <Field className="" placeholder={"никотин-тяги/сопротивление/никотин-объем"} name={"nicotine"} />
                        <Field className="" placeholder={"марка"} name={"mark"} />
                        <Field className="" type="number" placeholder={"цена"} name={"cost"} />
                        <div>
                            <button type="submit"  className="text-2xl text-white mt-5">
                                добавить
                            </button>
                            <ToastContainer />
                        </div>
                    </form>

                )}
            </Formik>
            
            <div>
                
                <Formik initialValues={initialChange} onSubmit={onHandleChange}>
                {({ handleSubmit }) => (
                    <form className="flex flex-col justify-center gap-4 items-center" onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit()
                    }}>
                        <h1>изменить цену</h1>
                        <Field as="select" name="type">
                            <option value="" disabled hidden>что изменить</option>
                            {data.map(obj=>{
                                return <option value={obj.type} key="">{obj.type}</option>
                            })}
                        </Field>
                        <Field placeholder="название продукта" name="name"/>
                        <Field placeholder="новая цена" type="number" name="cost"/>

                        <div>
                            <button type="submit"  className="text-2xl text-white mt-5">
                                добавить
                            </button>
                            <ToastContainer />
                        </div>
                    </form>

                )}
                </Formik>
            </div>
        </div>
    )
}