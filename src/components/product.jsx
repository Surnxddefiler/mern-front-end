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


    //all categories
    const [selectedMarkTax, setSelectedMarkTax] = useState('');
const [selectedNicotineTax, setSelectedNicotineTax] = useState('');
   


    //getting all tax
const [markArray, setMarkArray]=useState([])
const [nicotineArray, setNicotineArray]=useState([])
const [selectedMark, setSelectedMark] = useState('');
const [selectedNicotine, setSelectedNicotine] = useState('');

const fetchAllTerms = async (taxonomy) => {
  let page = 1;
  let allTerms = [];
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`https://primary-production-66e2f.up.railway.app/wp-json/wp/v2/${taxonomy}?per_page=100&page=${page}&hide_empty=true`);
    const data = await res.json();
    allTerms = [...allTerms, ...data];
    hasMore = data.length === 100;
    page++;
  }

  return allTerms;
};

useEffect(() => {
  if (linkId==="vape") {
   setIsPod('МНОГОРАЗКИ')
  }
 if (linkId==="cartridge") {
   setIsPod('КАРТРИДЖИ')
  }
}, [linkId]);


//additinal loading
const [wasLoaded, setWasLoaded]=useState(false)
const [additinalLoading, setAdditionalLoading]=useState(false)
    //pagination
      const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

useEffect(() => {


  //laberls
   const taxonomyLabels = {
  'mark': 'Марка',
  'puffs-nicotine': 'Затяжки / % Никотина',
  'information': 'Информация',
  'strength-quantity':'Крепость / Количество',
  'liquid-mark': 'Марка',
  'snus-mark': 'Марка',
  'vape-mark': 'Марка',
  'hookah-mark': 'Марка',
'cartridge-mark': 'Марка',
'amount-nicotine': 'Объём / % Никотина',
'resistance': 'Сопротивление',
'resistance-ammount': 'Сопротивление / Объём'
};



  if(!wasLoaded){
  setLoading(true);
  }
  else{
    setAdditionalLoading(true)
  }
let url = `https://primary-production-66e2f.up.railway.app/wp-json/wp/v2/${linkId}?_embed&per_page=10&page=${page}&orderby=menu_order&order=asc`;

  if (selectedMark) url += `&${selectedMarkTax}=${selectedMark}`;
  if (selectedNicotine) url += `&${selectedNicotineTax}=${selectedNicotine}`;

  fetch(url)
    .then(res => {
      const total = res.headers.get('X-WP-TotalPages');
      if (total) setTotalPages(parseInt(total));
      return res.json();
    })
    .then(data => {
      if (!data || data.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      setData(data);

      // Получаем таксономии из результата
      const terms = data[0]?._embedded?.['wp:term'] || [];
      const tax1 = terms[0]?.[0]?.taxonomy;
      const tax2 = terms[1]?.[0]?.taxonomy;

      setSelectedMarkTax(tax1);
      setSelectedNicotineTax(tax2);
      setFilterName([taxonomyLabels[tax1], taxonomyLabels[tax2]]);

      Promise.all([
        fetchAllTerms(tax1),
        fetchAllTerms(tax2),
      ]).then(([marks, nicotines]) => {
        setMarkArray(marks);
        setNicotineArray(nicotines);
      });

      setLoading(false);
      setWasLoaded(true)
      setAdditionalLoading(false)
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
      setWasLoaded(true)
        setAdditionalLoading(false)
    });
}, [linkId, page, selectedMark, selectedNicotine, selectedMarkTax, setLoading, selectedNicotineTax, wasLoaded]);


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

        if (pay >= discount && !hasShownFree) {
            toast(`Вы составили заказ на ${pay} ₴ — доставка будет бесплатной!`);
            hasShownFreeDelivery.current = true;
            sessionStorage.setItem(freeKey, "true");
        }

        if (pay < discount && pay !== 0 && !hasShownAlmost) {
            toast(`Хочешь бесплатную доставку? Добавь к заказу позиций ещё на ${discount - pay} ₴ — и доставка будет бесплатно!`);
            sessionStorage.setItem(almostKey, "true");
        }

        // Сброс при сбросе суммы
        if (pay === 0) {
            sessionStorage.removeItem(freeKey);
            sessionStorage.removeItem(almostKey);
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
    


    //
    const [open, setOpen]=useState(false)
    const [slides, setSlides]=useState({})
    const [index, setIndex]=useState(1)
    return (
        <>
            {loading ? <img className='loading__animation absolute translate-x-2/4 duration-300' style={{top: "150px", right: "50%"}} src="/load.gif" alt="" /> :
                <div className=" text-white mt-5">
                    <div className="flex gap-4 flex-wrap px-4 py-5 bg-primary rounded-3xl">
  <select
    value={selectedMark}
    onChange={(e) => { setSelectedMark(e.target.value); setPage(1); }}
    className="w-full p-2 bg-fifth rounded-2xl"
  >
    <option value="">{filterName[0]}</option>
    {markArray.map((term) => (
      <option key={term.id} value={term.id}>{term.name}</option>
    ))}
  </select>

  <select
    value={selectedNicotine}
    onChange={(e) => { setSelectedNicotine(e.target.value); setPage(1); }}
    className="w-full p-2 bg-fifth rounded-2xl"
  >
    <option value="">{filterName[1]}</option>
    {nicotineArray.map((term) => (
      <option key={term.id} value={term.id}>{term.name}</option>
    ))}
  </select>
</div>

                    <div className={`last:pb-2 ${additinalLoading ? "additional__loading" : ""}`}>
                        {data.map((obj, i) => {
                            //обаботчик для колечества в складе
                            const handleAddToCart = (ammountInCart) => {
                                if (ammountInCart >= 50) {
                                    const notify = () => toast("корзина полная");
                                    return notify()
                                }
                                setCart([...cart, { mark: obj._embedded['wp:term'][1][0].name, name: obj.acf.name, nicotine: obj._embedded['wp:term'][0][0].name, cost: Number(obj.acf.cost), isPod: isPod }]);
                                setAmountsInCart(prev => prev + 1)
                            };
                            const productObject={ mark:  obj._embedded['wp:term'][1][0].name, name: obj.acf.name, nicotine: obj._embedded['wp:term'][0][0].name, cost: Number(obj.acf.cost)}
                            const isProductInCart = cart.some(item => (
                                item.mark === productObject.mark &&
                                item.name === productObject.name &&
                                item.nicotine === productObject.nicotine &&
                                item.cost === productObject.cost
                              ));
                    
                              const gallery = [];

// Проверка на наличие wp:featuredmedia и source_url
const featuredMedia = obj?._embedded?.["wp:featuredmedia"];
if (Array.isArray(featuredMedia) && featuredMedia[0]?.source_url) {
  gallery.push({src:featuredMedia[0].source_url});
}

// Проверка на наличие дополнительной фотографии
if (obj?.acf?.extra_photo?.link) {
  gallery.push({src:obj.acf.extra_photo.link}); // не надо повторно пушить featured
}
if (obj?.acf?.extra_photo_copy?.link) {
  gallery.push({src:obj.acf.extra_photo_copy.link}); // не надо повторно пушить featured
}

                            
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
                                        <div style={{color: obj.acf.color}} className={`${isProductInCart ? 'text-red-500 active-product' : ''} text-2xl font-bold`}>{obj.acf.product_name}</div>
                                        {obj.acf.stock ?
                                        <div>
                                            <i className="fa-solid fa-plus fa-2xl text-white active:text-red-500 focus:text-red-500" onClick={() => {handleAddToCart(ammountInCart) }}></i>
                                        </div>
                                        :
                                        ''
                        }
                                    </div>
                                    <div className="text-secondary">{filterName[1]} - {obj._embedded['wp:term'][0][0].name}</div>
                                    <div className="text-fourth">{filterName[1]==="Сопротивление" ? "" : `${filterName[0]} - ${obj._embedded['wp:term'][1][0].name}`}</div>
                                    <div className="text-fifth" >Стоимость - {obj.acf.cost} ₴</div>
                                    <div className="flex justify-end">Наличие - {obj.acf.stock ? '✅' : '❌'}</div>
                                </div>
                            )
                        })}
                    </div>
                    
                      <div className="pagination__wrapper" style={{ marginTop: "20px" }}>
        <button className="py-2 px-4 bg-slate-900" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}><i class="fa-solid fa-angle-left"></i></button>
        <span style={{ margin: "0 10px" }}>{page} из {totalPages}</span>
        <button className="p-2" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}><i class="fa-solid fa-angle-right"></i></button>
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
