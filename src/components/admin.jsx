import axios from "axios";
import { Field, Formik } from "formik"
import { useRef, useState } from "react";
// import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
export const Admin = () => {


//для блокировки инпута
const [tip, setTip]=useState(false)
    const [taste, setTaste]=useState(false)
    const [color, setColor]=useState(false)
    const [additional, setAdditional]=useState(false)
    const [marka, setMarka]=useState(false)
    const [cena, setCena]=useState(false)


    const handleSubmit = async (e) => {
        console.log(e)
        if (e.type === "" || e.name === "" || e.nicotine === "" || e.mark === "" || e.color === "") {
            const notify = () => toast("не заполнены все строки");
            return notify()
        }
        else {
            try {
                await axios.post('https://mernnode-production-873d.up.railway.app/api/nicotine/postProduct', { e })
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
    const colorRef=useRef(null)
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
        cost: Number,
        mark: "",
        color: "",
    }
    // const initialChange={
    //     type: "",
    //     name: "",
    //     cost: ""
    // }
    return (
        <div>
            <Formik initialValues={initialValue} onSubmit={(values, { setFieldValue }) => {
                handleSubmit(values);
                // resetForm({ values: '' }); // Reset the form fields

                if(taste){
                    setFieldValue('name', values.name);
                }
                else{
                    setFieldValue('name', '');
                }


                if(additional){
                    setFieldValue('nicotine', values.name);
                }
                else{
                    setFieldValue('nicotine', '');
                }


                if(marka){
                    setFieldValue('mark', values.name);
                }
                else{
                    setFieldValue('mark', '');
                }


                if(cena){
                    setFieldValue('cost', values.cost);
                }
                else{
                    setFieldValue('cost', '');
                }


                if(color){
                    setFieldValue('color', values.name);
                }
                else{
                    setFieldValue('color', '');
                }


                if(tip){
                    setFieldValue('type', values.type);
                }
                else{
                    setFieldValue('type', '');
                }
                
            }}>
                {({ handleSubmit }) => (
                    <form className="flex flex-col justify-center gap-4 items-center" onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit()
                    }}>
                        <h1 className="text-white">ДОБАВИТЬ НОВЫЙ ПРОДУКТ</h1>
                        <div>
                        <Field className="bg-fifth placeholder:text-white p-5" as="select" name={"type"}>
                            <option value="" disabled hidden key="">Что добавить ?</option>
                            <option className="p-5" value="одноразки" key="">Одноразки</option>
                            <option className="p-5" value="МНОГОРАЗКИ" key="">МНОГОРАЗКИ</option>
                            <option className="p-5" value="КАРТРИДЖИ" key="">КАРТРИДЖИ</option>
                            <option className="p-5" value="жидкости" key="">Жидкости</option>
                        </Field>
                        {tip ?   <i onClick={()=>setTip(!tip)} className="text-2xl ml-2 fa-solid fa-lock"></i> :  <i onClick={()=>setTip(!tip)} className="text-2xl ml-2 fa-solid fa-lock-open"></i>}
                        </div>
                        <div>
                        <Field className="bg-fifth placeholder:text-white p-5" innerRef={nameRef} placeholder={"Вкус"} name={"name"} onKeyDown={(e) => handleKeyDown(e, nicotineRef)} />
                        {taste ?   <i onClick={()=>setTaste(!taste)} className="text-2xl ml-2 fa-solid fa-lock"></i> :  <i onClick={()=>setTaste(!taste)} className="text-2xl ml-2 fa-solid fa-lock-open"></i>}
                        </div>
                        <div>
                        <Field className="bg-fifth placeholder:text-white p-5" innerRef={nicotineRef} placeholder={"Дополнение"} name={"nicotine"} onKeyDown={(e) => handleKeyDown(e, markRef)} />
                        {additional ?   <i onClick={()=>setAdditional(!additional)} className="text-2xl ml-2 fa-solid fa-lock"></i> :  <i onClick={()=>setAdditional(!additional)} className="text-2xl ml-2 fa-solid fa-lock-open"></i>}
                        </div>
                        <div>
                        <Field className="bg-fifth placeholder:text-white p-5" innerRef={markRef} placeholder={"Марка"} name={"mark"} onKeyDown={(e) => handleKeyDown(e, costRef)} />
                        {marka ?   <i onClick={()=>setMarka(!marka)} className="text-2xl ml-2 fa-solid fa-lock"></i> :  <i onClick={()=>setMarka(!marka)} className="text-2xl ml-2 fa-solid fa-lock-open"></i>}
                        </div>

<div>
                        <Field className="bg-fifth placeholder:text-white p-5" innerRef={costRef} type="number" placeholder={"Цена"} name={"cost"} onKeyDown={(e) => handleKeyDown(e, colorRef)} />
                        {cena ?   <i onClick={()=>setCena(!cena)} className="text-2xl ml-2 fa-solid fa-lock"></i> :  <i onClick={()=>setCena(!cena)} className="text-2xl ml-2 fa-solid fa-lock-open"></i>}
                        </div>

                        <div>
                        <Field className="bg-fifth placeholder:text-white p-5" innerRef={colorRef} placeholder={"Цвет"} name={"color"} />
                        {color ?   <i onClick={()=>setColor(!color)} className="text-2xl ml-2 fa-solid fa-lock"></i> :  <i onClick={()=>setColor(!color)} className="text-2xl ml-2 fa-solid fa-lock-open"></i>}
                        </div>
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
                <Delete/>
            </div>
        </div>
    )
}
// форма удаления
const Delete=()=>{
    const [data, setData]=useState([])
    const onChangeValue=(e)=>{
            fetch('https://mernnode-production-873d.up.railway.app/api/nicotine/' + e.target.value).then(res=>res.json()).then((data)=>{
                setData(data.data.product)
            })
        
    }
    const deleteOnClick=async(arr)=>{
       
        const newData = data.filter(
            (obj) =>
              obj.mark !== arr.mark ||
              obj.name !== arr.name ||
              obj.nicotine !== arr.nicotine
          );          
          setData(newData);

        try{
            await axios.put('https://mernnode-production-873d.up.railway.app/api/nicotine/updateamount', { arr });
        }
        catch(e){
            console.log(e)
        }
    }
    return(
        <div className="flex justify-center flex-col items-center">
        <select className="bg-fifth placeholder:text-white p-5 mt-5"  onChange={onChangeValue} name="" id="">
                    <option value="" key="" hidden >Что удалить ?</option>
                    <option value="646886eb11e5b1bd7d4c57bb" key="">Одноразки</option>
                    <option value="646894d611e5b1bd7d4c57bd" key="">Многоразки</option>
                    <option value="646a7d448834fb372c5a751e" key="">Жидкости</option>
                    <option value="659edb2cc2e0e16384df4422" key="">Картриджи</option>
             

        </select>
        <div className="mt-16 flex justify-center items-center flex-wrap gap-11">
        {data.length!==0 &&
        data.map((obj)=>{
            return <div onDoubleClick={()=>{
                deleteOnClick({mark: obj.mark, name: obj.name, nicotine: obj.nicotine })
            }} className="bg-black p-6 rounded-xl text-white">{obj.mark} {obj.name} {obj.nicotine}</div>
        })
        }
        </div>
        </div>
    )
}