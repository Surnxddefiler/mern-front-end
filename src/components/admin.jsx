import axios from "axios";
import { Field, Formik } from "formik"
// import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
export const Admin = () => {
    const handleSubmit=async(e)=>{
        if(e.type==="" || e.name==="" || e.nicotine==="" || e.mark===""){
            const notify = () => toast("не заполнены все строки");
            return notify()
        }
        else{
            try{
                await axios.post('https://mern-back-end-y33v.onrender.com/api/nicotine/postProduct', { e })
            }catch(e){
                const notify = () => toast("успешно не добавлено");
                return notify()
            }
        }
        
    }


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
        ammount: 1 
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
                            <option value="" disabled hidden key="">что добавить</option>
                            <option className="p-5" value="жидкости" key="">жидкости</option>
                            <option className="p-5" value="картриджи" key="">картриджи</option>
                            <option className="p-5" value="одноразки" key="">одноразки</option>
                        </Field>
                        <Field className="bg-fifth placeholder:text-white p-5" type="number" placeholder={"количество"} name={"ammount"} />
                        <Field className="bg-fifth placeholder:text-white p-5" placeholder={"название"} name={"name"} />
                        <Field className="bg-fifth placeholder:text-white p-5" placeholder={"никотин-тяги/сопротивление/никотин-объем"} name={"nicotine"} />
                        <Field className="bg-fifth placeholder:text-white p-5" placeholder={"марка"} name={"mark"} />
                        <Field className="bg-fifth placeholder:text-white p-5" type="number" placeholder={"цена"} name={"cost"} />
                        <div>
                            <button type="submit"  className=" bg-fifth placeholder:text-white p-5 text-2xl text-white mt-5">
                                добавить
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