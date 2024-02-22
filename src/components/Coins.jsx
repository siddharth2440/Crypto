import React, { useEffect, useState, useSyncExternalStore } from 'react'
import Loader from './Loader'
import { server } from '../main'
import { Link } from 'react-router-dom'
import axios from 'axios'

const CoinCard = ({currency,name,key,id,symbol,price,img}) =>{
  return(
    <Link to={`/coin/${id}`} className='flex flex-col items-center justify-center gap-2 p-3 border shadow-lg' key={id}>
      <img src={img} alt={name} className='h-[5rem] w-auto bg-contain'/>
      <h1 className='font-[600] text-[1.2rem] tracking-tight'>{name}</h1>
      <p className='opacity-80'>{symbol}</p>
      <h5>{currency}{price}</h5>
    </Link>
  )
}

const Coins = () => {
  const [coins,setCoins] = useState(new Array());
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(false);
  const [currency,setCurrency] = useState("inr");
  const [currencies,setCurrencies] = useState(new Array());
  const [page,setPage] = useState(1);

  const pages = new Array(10).fill(1);
  const currencySymbol = currency=="inr"?"₹":currency=="usd"?"$":"€";
  // console.log(currencySymbol);
  useEffect(()=>{
    try {
      const fetchCoins = async () =>{
        const perPage = 100;
        const {data} =await axios.get(`${server}/coins/markets?vs_currency=${currency}&per_page=${perPage}&page=${page}`);

        // https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&per_page=100&page=1
        setCoins(data);
        const temp = ["inr","usd","eur"];
        setCurrencies(temp);
        setLoading(false);
      }
      fetchCoins();
    } catch (error) {
      setError(true);
      setLoading(false) 
    }
  },[currency,page]);

  return (
    <>
      <div className='country__symbol flex items-center justify-start gap-3 px-4 py-1'>
        <div className="inr">
          <label htmlFor="inr">{currencies[0]}</label>
          <input type="radio" name="curr" value={currencies[0]} onClick={(e)=>setCurrency(e.target.value)} />
        </div>
        <div className="usd">
          <label htmlFor="usd">{currencies[1]}</label>
          <input type="radio" name="curr" value={currencies[1]} onClick={(e)=>setCurrency(e.target.value)} />
        </div>
        <div className="eur">
          <label htmlFor="">{currencies[2]}</label>
          <input type="radio" name="curr" value={currencies[2]} onClick={(e)=>setCurrency(e.target.value)} />
        </div>
      </div>  
      {
        loading?(<Loader/>):(
          <div>
            <div className='grid grid-cols-6 gap-4 shadow-lg p-5'>
            {coins.map(el=>(
                <CoinCard currency={currencySymbol} name={el.name} key={el.id} id={el.id} symbol={el.symbol} price={el.current_price} img={el.image}/>
            ))}
          </div>
          <div className="pageTransitions flex items-center justify-center gap-2">
          {pages.map((el,idx)=>(
            <button type="submit" key={idx+1} value={idx+1} onClick={()=>setPage(idx+1)} className='text-black px-2 py-1'>{idx+1}</button>
          ))}
        </div>
          </div>
        )
      }
    </>
  )
}
export default Coins;