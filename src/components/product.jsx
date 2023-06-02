import { useParams } from "react-router-dom"
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from "react-toastify"
export const Product = ({ setCart, cart, ammountInCart, setAmountsInCart, loading, setLoading }) => {

    const linkId = useParams().id

    const [data, setData] = useState([])
    const [filterName, setFilterName] = useState([])






    useEffect(() => {
        setLoading(true)
        fetch('https://fuzzy-jay-drawers.cyclic.app/api/nicotine/' + linkId).then(res => res.json()).then(data => {
            setData(data.data.product)
            setFilterName([data.data.firstFilter, data.data.secondFilter])
            setLoading(false)
        })
    }, [linkId, setLoading])
    //фильтр
    const [mark, setMark] = useState('')
    const [tyagi, setTyagi] = useState('')
    //
    return (
        <>
            {loading ? "" :
                <div className=" text-white mt-5">
                    <div className="bg-primary py-5  flex justify-between w-full px-5 rounded-3xl">
                        <select onChange={(e) => { setMark(e.target.value) }} className="p-2 bg-fifth rounded-2xl" name="" id="">
                            <option value="" className="bg-fifth text-black" hidden key={"mark-hidden"} >{filterName[0]}</option>
                            <option value="" className="bg-fifth text-black" key={"mark-none"} >-</option>
                            {[...new Set(data.map((obj) => obj.mark))].map((mark, i) => (
                                <option className="bg-fifth text-black" key={`mark-${i}`} value={mark}>
                                    {mark}
                                </option>
                            ))}
                        </select>
                        <select onChange={(e) => { setTyagi(e.target.value) }} className="bg-fifth p-2 rounded-2xl" name="" id="">
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
                            return filter.includes(mark.toLowerCase()) && secondFilter.includes(tyagi.toLowerCase())
                        }).map((obj) => {
                            //обаботчик для колечества в складе
                            const handleAddToCart = (ammountInCart) => {
                                if (ammountInCart >= 50) {
                                    const notify = () => toast("корзина полная");
                                    return notify()
                                }
                                setCart([...cart, { mark: obj.mark, name: obj.name, nicotine: obj.nicotine, cost: obj.cost }]);
                                setAmountsInCart(prev => prev + 1)
                            };



                            return (
                                <div className="bg-primary my-5 flex flex-col justify-center px-5 py-5 rounded-3xl" >

                                    <div className="flex justify-between items-center">
                                        <div className="text-2xl font-bold">{obj.name}</div>
                                        <div>
                                            <i className="fa-solid fa-plus fa-2xl text-white active:text-red-500" onClick={() => { handleAddToCart(ammountInCart) }}></i>
                                            <ToastContainer />
                                        </div>
                                    </div>
                                    <div className="text-secondary">{filterName[1]} - {obj.nicotine}</div>
                                    <div className="text-fourth">{filterName[1]==="Сопротивление" ? "" : `${filterName[0]} - ${obj.mark}`}</div>
                                    <div className="text-fifth" >Стоимость - {obj.cost} ₴</div>

                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </>
    )
}