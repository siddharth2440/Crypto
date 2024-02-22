import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { server } from '../main'
import Loader from './Loader'

const ExchangeCard = ({url,name,imageURI,rank,key}) =>{
    return(
        <a href={url} className='text-[#000000] shadow-lg cursor-pointer transition-all hover:scale-2 flex flex-col items-center justify-center gap-2 p-3' key={key} target='blank'>
            <img src={imageURI} alt="" />
            <h1>#{rank}</h1>
            <h3>{name}</h3>
        </a>
    )
}

const Exchanges = () => {
    const [exchanges,setExchanges] = useState(new Array());
    const [loading,setLoading] = useState(true);
    const [page,setPage] = useState(1);
    const btns = new Array(5).fill(1);

    const changePage = (page) =>{
        setPage(page);
        setLoading(false);
    }
    useEffect(()=>{
        const fetchAllExchanges = async ()=>{
            const {data} = await axios.get(`${server}/exchanges?page=${page}`);
            setExchanges(data);
            setLoading(false);
        }
        fetchAllExchanges();
        console.log("Page :- "+page);
    },[page])
    return (
        <>
            {
                loading?(<Loader/>):
                    (<div className='grid grid-cols-5 autofill-auto gap-2 p-4 grid-wrap'>
                        {exchanges.map(el=>(
                            <ExchangeCard name={el.name} imageURI={el.image} rank={el.trust_score_rank} url={el.url}/>
                        ))}

                        <div className="flex items-center justify-center gap-4 w-full relative" >
                            {
                                btns.map((el,idx)=>{
                                    return(
                                        <button key={idx+1} onClick={()=>changePage(idx+1)} className=' px-2 py-1 rounded-lg border-2 focus:bg-[#000000] focus:text-white'>{idx+1}</button>
                                    )
                                })
                            }

                        </div>
                    </div>)
            }
        </>
    )
}
export default Exchanges;