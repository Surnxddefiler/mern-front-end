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
    }, [setLoading])
    return (
        <>
        
        {loading ? <img className='absolute translate-x-2/4' style={{top: "150px", right: "50%"}} src="/load.gif" alt="" /> : 
        <div className='flex justify-center flex-wrap gap-8 mt-6'>
            {data.map((obj) => {
                return (
                    <NavLink className="border font-bold rounded-3xl w-96 flex flex-col items-center bg-black text-2xl" to={'/product/'+ obj._id}>
                            <button className='rounded-3xl button py-10'><span unselectable='on' className='rounded-3xl select-none'>{obj.type}</span><i></i> </button>
                    </NavLink>
                )
            })}
        </div>
        }
        </>
    )
}

