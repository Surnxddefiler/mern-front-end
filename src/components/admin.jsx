import axios from "axios";
import { Field, Formik, useFormikContext } from "formik"
import { useEffect, useRef, useState } from "react";
// import { useEffect, useState } from "react";
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
export const Admin = () => {

    useEffect(()=>{
        fetch("https://mernnode-production-873d.up.railway.app/api/nicotine/status")
        .then(res => res.json())
        .then(data =>{
            setDiscount(data.discount)
            setNp(data.np)
        })
        .catch(err => console.error("Ошибка при получении:", err));
    },[])



//для блокировки инпута
const [tip, setTip]=useState(false)
    const [taste, setTaste]=useState(false)
    const [color, setColor]=useState(false)
    const [additional, setAdditional]=useState(false)
    const [marka, setMarka]=useState(false)
    const [cena, setCena]=useState(false)
    const [position, setPosition]=useState(false)

    const handleSubmit = async (e) => {
        console.log(e)
        if (e.type === "" || e.name === "" || e.nicotine === "" || e.mark === "" || e.color === "") {
            const notify = () => toast("не заполнены все строки");
            return notify()
        }
        else {
          try{
            
  const formData = new FormData();

    // Добавим все текстовые поля
    formData.append("type", e.type);
    formData.append("name", e.name);
    formData.append("nicotine", e.nicotine);
    formData.append("cost", e.cost);
    formData.append("mark", e.mark);
    // formData.append("ammount", e.ammount);
    formData.append("color", e.color);
    formData.append("place", e.place);

    // Файлы: добавляем каждую картинку как отдельный файл с одним и тем же ключом `gallery`
    e.gallery.forEach((file) => {
      formData.append("gallery", file);
    });

    console.log(formData)
    await axios.post(
      "https://mernnode-production-873d.up.railway.app/api/nicotine/postProduct",
      formData,
      
    );

          } catch(e){
 console.error(e);
    toast("успешно не добавлено");
          }
        }

    }

    const nameRef = useRef(null);
    const nicotineRef = useRef(null);
    const markRef = useRef(null);
    const costRef = useRef(null);
    const colorRef=useRef(null);
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
        place: Number,
        gallery: [],
    }
    // const initialChange={
    //     type: "",
    //     name: "",
    //     cost: ""
    // }
    //discount
    const [discount, setDiscount]=useState(0);
        const [np, setNp]=useState(false);

    const dicsountHandler=async ()=>{
           const response = await fetch("https://mernnode-production-873d.up.railway.app/api/nicotine/toggle-status", {
          method: "POST",
         headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ arr: discount })
        });
      
        const data = await response.json();
        setDiscount(data.discount);
    }

      const npHandler=async ()=>{
           const response = await fetch("https://mernnode-production-873d.up.railway.app/api/nicotine/changenp", {
          method: "POST",
         headers: {
      "Content-Type": "application/json"
    },
        });
      
        const data = await response.json();
        setNp(data.np);
    }


    return (
        <div>

      <div className="flex flex-col content-center items-center gap-4">
                            <h1 className="text-white text-xl mt-5" >Акция</h1>
                            <input className="bg-fifth placeholder:text-white p-5" type="number" value={discount} onChange={e=>setDiscount(e.target.value)}  />
                            <button className="bg-fifth placeholder:text-white p-5 text-2xl text-white mt-5 mb-5" onClick={dicsountHandler}>Активировать акцию</button>
                            <button onClick={npHandler} className=" bg-fifth placeholder:text-white p-5 text-2xl text-white mb-5">
                                {np ? "акция для всего": "акция только локально"}
                            </button>
                        </div>

            <Formik initialValues={initialValue} onSubmit={(values, { setFieldValue }) => {
                handleSubmit(values);
                // resetForm({ values: '' }); // Reset the form fields
console.log(values)
                if(taste){
                    setFieldValue('name', values.name);
                }
                else{
                    setFieldValue('name', '');
                }


                if(additional){
                    setFieldValue('nicotine', values.nicotine);
                }
                else{
                    setFieldValue('nicotine', '');
                }


                if(marka){
                    setFieldValue('mark', values.mark);
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
                    setFieldValue('color', values.color);
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

                if(position){
                    setFieldValue('place', values.place);
                }
                else{
                    setFieldValue('place', '');
                }

            }}>
                {({ handleSubmit }) => (
                    <form className="admin__form flex flex-col justify-center gap-4 items-center" onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit()
                    }}>
                  
                        <h1 className="text-white">ДОБАВИТЬ НОВЫЙ ПРОДУКТ</h1>
                        <div>
                        </div>
                        <div>
                        <Field className="bg-fifth placeholder:text-white p-5" as="select" name={"type"}>
                            <option value="" disabled hidden key="">Что добавить ?</option>
                            <option className="p-5" value="одноразки" key="">Одноразки</option>
                            <option className="p-5" value="МНОГОРАЗКИ" key="">Многоразки</option>
                            <option className="p-5" value="КАРТРИДЖИ" key="">Картриджи</option>
                            <option className="p-5" value="жидкости" key="">Жидкости</option>
                            <option className="p-5" value="снюс" key="">Снюс</option>
                            <option className="p-5" value="ВСЁ ДЛЯ КАЛЬЯНА" key="">ВСЁ ДЛЯ КАЛЬЯНА</option>
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
                        <Field className="bg-fifth placeholder:text-white p-5"  type="number" placeholder={"Позиция"} name={"place"} />
                        {position ?   <i onClick={()=>setPosition(!position)} className="text-2xl ml-2 fa-solid fa-lock"></i> :  <i onClick={()=>setPosition(!position)} className="text-2xl ml-2 fa-solid fa-lock-open"></i>}
                        </div>

<div>
     <GalleryUpload name="gallery" />
</div>

                        <div>
                            <button type="submit" className=" bg-fifth placeholder:text-white p-5 text-2xl text-white mt-5">
                                Добавить
                            </button>
                        </div>
                    </form>

                )}
            </Formik>
           
            <div>
                <Delete/>
                <Stock/>
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
                    <option value="659edb2cc2e0e16384df4422" key="">Картриджи</option>
                    <option value="646a7d448834fb372c5a751e" key="">Жидкости</option>
                    <option value="661ac4766ed64e73620364ab" key="">Снюс</option>
                    <option value="67af9abb55046b0894a517c1" key="">Все Для Кальяна</option>
        </select>
        <div className="mt-16 flex justify-center items-center flex-wrap gap-11">
        {data.length!==0 &&
        data.map((obj, i)=>{
            return <div onDoubleClick={()=>{
                deleteOnClick({mark: obj.mark, name: obj.name, nicotine: obj.nicotine })
            }} className="bg-black p-6 rounded-xl text-white">{i+1}. {obj.mark} {obj.name} {obj.nicotine}</div>
        })
        }
        </div>
        </div>
    )
}

// форма изменения в наличии
const Stock=()=>{
    const [data, setData]=useState([])
    const onChangeValue=(e)=>{
            fetch('https://mernnode-production-873d.up.railway.app/api/nicotine/' + e.target.value).then(res=>res.json()).then((data)=>{
                setData(data.data.product)
            })
        
    }
    const stockOnClick=async(arr)=>{
       
        const updatedData = data.map((obj) =>
            obj.mark === arr.mark && obj.name === arr.name && obj.nicotine === arr.nicotine
              ? { ...obj, stock: !obj.stock }
              : obj
          );
          setData(updatedData);

        try{
            await axios.put('https://mernnode-production-873d.up.railway.app/api/nicotine/stock', { arr });
        }
        catch(e){
            console.log(e)
        }
    }
    return(
        <div className="flex justify-center flex-col items-center">
        <select className="bg-fifth placeholder:text-white p-5 mt-5"  onChange={onChangeValue} name="" id="">
                    <option value="" key="" hidden >Что в наличии ?</option>
                    <option value="646886eb11e5b1bd7d4c57bb" key="">Одноразки</option>
                    <option value="646894d611e5b1bd7d4c57bd" key="">Многоразки</option>
                    <option value="659edb2cc2e0e16384df4422" key="">Картриджи</option>
                    <option value="646a7d448834fb372c5a751e" key="">Жидкости</option>
                    <option value="661ac4766ed64e73620364ab" key="">Снюс</option>
                    <option value="67af9abb55046b0894a517c1" key="">Все Для Кальяна</option>

        </select>
        <div className="mt-16 flex justify-center items-center flex-wrap gap-11">
        {data.length!==0 &&
        data.map((obj, i)=>{
            let stock=obj.stock
            if(stock){
                stock=true
            }
            else{
                stock=false
            }
            return <div onDoubleClick={()=>{
                stockOnClick({mark: obj.mark, name: obj.name, nicotine: obj.nicotine, stock: !stock })
            }} className="bg-black p-6 rounded-xl text-white">{i+1}. {obj.mark} {obj.name} {obj.nicotine} {stock ? '✅' : '❌'}</div>
        })
        }
        </div>
        </div>
    )
}

const GalleryUpload = ({ name }) => {
//   const [, , helpers] = useField(name);
  const { setFieldValue } = useFormikContext();

  const handleChange = (e) => {
    const files = e.currentTarget.files;
    if (files) {
      const fileArray = Array.from(files);
      setFieldValue(name, fileArray);
    }
  };

  return (
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleChange}
      className="bg-fifth text-white p-5"
    />
  );
};