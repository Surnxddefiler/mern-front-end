import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import {toast } from "react-toastify"
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
export const Product = ({ setCart, cart, ammountInCart, setAmountsInCart, loading, setLoading }) => {

    const linkId = useParams().id

    const [data, setData] = useState([])
    const [filterName, setFilterName] = useState([])
    //проверка на многоразки
    const [isPod, setIsPod]=useState('');
    //
    const [pay, setPayment] = useState(0)
    useEffect(() => {
        setLoading(true)
        fetch('https://mernnode-production-873d.up.railway.app/api/nicotine/' + linkId).then(res => res.json()).then(data => {
            if (data.data.type==='МНОГОРАЗКИ' || data.data.type==="КАРТРИДЖИ") {
                setIsPod(`${data.data.type}`)
            }
            setData(data.data.product)
            setFilterName([data.data.firstFilter, data.data.secondFilter])
            setLoading(false)
        })
        
    }, [linkId, setLoading])
    const [discount,setDiscount]=useState(0)
    
    //логика бесплатной доставки
      useEffect(()=>{
        fetch("https://mernnode-production-873d.up.railway.app/api/nicotine/status")
        .then(res => res.json())
        .then(data =>setDiscount(Number(data.discount)))
        .catch(err => console.error("Ошибка при получении:", err));
    },[])
    const hasShownFreeDelivery = useRef(false);
    useEffect(() => {
        if (discount !== 0) {
        const freeKey = `freeDeliveryShown_${discount}`;
        const almostKey = `freeDeliveryAlmostShown_${discount}`;

        const hasShownFree = sessionStorage.getItem(freeKey);
        const hasShownAlmost = sessionStorage.getItem(almostKey);

        // Бесплатная доставка достигнута
        if (pay >= discount && !hasShownFree) {
            toast(`Вы составили заказ на ${pay} ₴ — доставка будет бесплатной!`);
            hasShownFreeDelivery.current = true;
            sessionStorage.setItem(freeKey, "true");
        }

        // Почти бесплатная доставка
        if (pay < discount && !hasShownAlmost && pay !== 0) {
            toast(`Хочешь бесплатную доставку? Добавь к заказу позиций ещё на ${discount - pay} ₴ — и доставка будет бесплатно!`);
            sessionStorage.setItem(almostKey, "true");
        }
    }
      
    }, [pay, discount]);
    useEffect(() => {
        let totalPayment = 0;
        cart.forEach((obj) => {
            totalPayment += obj.cost;
        });
        setPayment(totalPayment);
    }, [cart]);
    
    //фильтр
    const [mark, setMark] = useState('')
    const [tyagi, setTyagi] = useState('')
    const markArray=[...new Set(data.map((obj) => obj.mark))];
    //
    const [open, setOpen]=useState(false)
    const [slides, setSlides]=useState({})
    const [index, setIndex]=useState(1)
    return (
        <>
            {loading ? <img className='loading__animation absolute translate-x-2/4 duration-300' style={{top: "150px", right: "50%"}} src="/load.gif" alt="" /> :
                <div className=" text-white mt-5">
                    <div className="bg-primary py-5  flex justify-between w-full gap-4  rounded-3x flex-wrap px-4">
                        <select onChange={(e) => { setMark(e.target.value) }} className={`${mark ? '' : 'unused-filter'} w-full p-2 bg-fifth rounded-2xl`} name="" id="">
                            <option value="" className="bg-fifth text-black" hidden key={"mark-hidden"} >{filterName[0]}</option>
                            <option value="" className="bg-fifth text-black" key={"mark-none"} >-</option>
                            {
                            markArray.map((mark, i) => (
                                <option className="bg-fifth text-black" key={`mark-${i}`} value={mark}>
                                    {mark}
                                </option>
                            ))}
                        </select>
                        <select onChange={(e) => { setTyagi(e.target.value) }} className={`${tyagi ? '' : 'unused-filter'} w-full bg-fifth p-2 rounded-2xl`} name="" id="">
                            <option value="" className="bg-fifth text-black" hidden>{filterName[1]}</option>
                            <option value="" className="bg-fifth text-black" >-</option>
                            {[...new Set(data.map((obj) => obj.nicotine))].map((nicotine, i) => (
                                <option className="bg-fifth text-black" key={`nicotine-${i}`} value={nicotine}>
                                    {nicotine}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="last:pb-2">
                        {data.filter((obj) => {
                            const filter = obj.mark.toLowerCase()
                            const secondFilter = obj.nicotine.toLowerCase()
                            if(mark && tyagi){
                                return filter===mark.toLowerCase() && secondFilter===tyagi.toLowerCase()
                            }
                            else if(mark){
                                return filter===mark.toLowerCase();
                            }
                            else if(tyagi){
                               return secondFilter===tyagi.toLowerCase()
                            }
                            else{
                                return data
                            }
                        }).map((obj, i) => {
                            //обаботчик для колечества в складе
                            const handleAddToCart = (ammountInCart) => {
                                if (ammountInCart >= 50) {
                                    const notify = () => toast("корзина полная");
                                    return notify()
                                }
                                setCart([...cart, { mark: obj.mark, name: obj.name, nicotine: obj.nicotine, cost: obj.cost, isPod: isPod }]);
                                setAmountsInCart(prev => prev + 1)
                            };
                            const productObject={ mark: obj.mark, name: obj.name, nicotine: obj.nicotine, cost: obj.cost}
                            const isProductInCart = cart.some(item => (
                                item.mark === productObject.mark &&
                                item.name === productObject.name &&
                                item.nicotine === productObject.nicotine &&
                                item.cost === productObject.cost
                              ));
                    
                              const gallery=[]
                           obj.gallery.forEach((image) => {
  const src = image.url;
  console.log(image);
  gallery.push({ src });
});

                            return (
                                <div className="bg-primary my-5 flex flex-col justify-center px-5 py-5 rounded-3xl" >
                                    <div className="flex gap-3 mb-4">
                                        {gallery.map((image,index)=>{
                           

  return <img onClick={()=>{
    setOpen(true)
    setSlides(gallery);
    setIndex(index);
    document.body.style.backdropFilter="none"
    document.body.style.webkitBackdropFilter = "none";

}
  } src={image.src} alt={`product-${index}`} style={{ maxWidth: "100px", borderRadius: '0.5rem', width:'100%', maxHeight: "100px", objectFit: "cover" }} />
;
                                        })}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div style={{color: obj.color}} className={`${isProductInCart ? 'text-red-500 active-product' : ''} text-2xl font-bold`}>{obj.name}</div>
                                        {obj.stock ?
                                        <div>
                                            <i className="fa-solid fa-plus fa-2xl text-white active:text-red-500 focus:text-red-500" onClick={() => {handleAddToCart(ammountInCart) }}></i>
                                        </div>
                                        :
                                        ''
                        }
                                    </div>
                                    <div className="text-secondary">{filterName[1]} - {obj.nicotine}</div>
                                    <div className="text-fourth">{filterName[1]==="Сопротивление" ? "" : `${filterName[0]} - ${obj.mark}`}</div>
                                    <div className="text-fifth" >Стоимость - {obj.cost} ₴</div>
                                    <div className="flex justify-end">Наличие - {obj.stock ? '✅' : '❌'}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
            <Lightbox
        open={open}
        close={() => {
            //    document.body.style.backdropFilter="blur(30px)"
            //    document.body.style.webkitBackdropFilter = "blur(30px)";
            setOpen(false)
        }}
        slides={slides}
         index={index}
      />
        </>
    )
}