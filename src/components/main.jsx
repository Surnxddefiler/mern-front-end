import { useEffect, useState } from 'react'
import {NavLink } from 'react-router-dom'

import '../App.css'
export const Main = ({loading, setLoading}) => {
    const [data, setData] = useState([])
    useEffect(() => {
        setLoading(true)
        fetch('https://mernnode-production-873d.up.railway.app/api/nicotine/').then(res => res.json()).then(data => {
            setData(data.data)
            setLoading(false)
        })
        //  fetch('https://primary-production-23e2.up.railway.app/wp-json/wp/v2/odnorazka?_embed').then(res => res.json()).then(data => {
        //   console.log(data)
        // })
    }, [setLoading])
    return (
        <>
        
        {loading ? <img className='absolute translate-x-2/4 loading__animation' style={{top: "150px", right: "50%"}} src="/load.gif" alt="" /> : 
        <div className='flex justify-center flex-wrap gap-8 pt-6'>
            {/* {data.map((obj) => {
                return (
                    <NavLink className="border font-bold rounded-3xl w-96 flex flex-col items-center bg-black text-2xl" to={'/product/'+ obj._id}>
                            <button className='rounded-3xl button py-10'><span unselectable='on' className='rounded-3xl select-none'>{obj.type}</span><i></i> </button>
                    </NavLink>
                )
            })} */}
              <NavLink className="border font-bold rounded-3xl w-96 flex flex-col items-center bg-black text-2xl" to={'/product/'+ 'odnorazka'}>
                            <button className='rounded-3xl button py-10'><span unselectable='on' className='rounded-3xl select-none'>Одноразки</span><i></i> </button>
                    </NavLink>
                      <NavLink className="border font-bold rounded-3xl w-96 flex flex-col items-center bg-black text-2xl" to={'/product/'+ 'vape'}>
                            <button className='rounded-3xl button py-10'><span unselectable='on' className='rounded-3xl select-none'>МНОГОРАЗКИ</span><i></i> </button>
                    </NavLink>
                     <NavLink className="border font-bold rounded-3xl w-96 flex flex-col items-center bg-black text-2xl" to={'/product/'+ 'cartridge'}>
                            <button className='rounded-3xl button py-10'><span unselectable='on' className='rounded-3xl select-none'>КАРТРИДЖИ</span><i></i> </button>
                    </NavLink>
                    <NavLink className="border font-bold rounded-3xl w-96 flex flex-col items-center bg-black text-2xl" to={'/product/'+ 'liquid'}>
                            <button className='rounded-3xl button py-10'><span unselectable='on' className='rounded-3xl select-none'>жидкости</span><i></i> </button>
                    </NavLink>
                    <NavLink className="border font-bold rounded-3xl w-96 flex flex-col items-center bg-black text-2xl" to={'/product/'+ 'snus'}>
                            <button className='rounded-3xl button py-10'><span unselectable='on' className='rounded-3xl select-none'>снюс</span><i></i> </button>
                    </NavLink>
                    <NavLink className="border font-bold rounded-3xl w-96 flex flex-col items-center bg-black text-2xl" to={'/product/'+ 'hookah'}>
                            <button className='rounded-3xl button py-10'><span unselectable='on' className='rounded-3xl select-none'>ВСЁ ДЛЯ КАЛЬЯНА</span><i></i> </button>
                    </NavLink>
        </div>
        }
        </>
    )
}

