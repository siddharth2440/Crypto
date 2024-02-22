import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './Coins'
import axios from 'axios'
import { server } from '../main'
import Loader from './Loader'
import Chart from './Chart'

const Item = ({title,value}) =>{
  return(
    <div className='flex items-center justify-between'>
      <h1 className='font-[600] text-[1rem] opacity-80'>{title}</h1>
      <p>{value}</p>
    </div>
  )
}

const CoinDetails = () => {
  const [currency,setCurrency] = useState(`inr`);
  const [currencies,setCurrencies] = useState(new Array());
  const [coin,setCoin] = useState(new Object());
  const [loading,setLoading] = useState(true)
  const [days,setDays] = useState("24h");
  const [chartDet,setChartDetails] = useState(new Array())
  const {id} = useParams();

  const currSymbol = currency=="inr"?"₹":currency=="usd"?"$":"€";

  const btns = ["24h","7d","14d","30d","60d","200d","1y","max"]
  //switch-to-get-the-grpah-according-to-the-times

  const switchChartStats = (key) =>{
    switch (key) {
      case "24h":
        setDays("24h");
        setLoading(false);
        break;
      case "7d":
        setDays("7d");
        setLoading(false);
        break;
      case "14d":
        setDays("14d");
        setLoading(false);
        break;
      case "30d":
        setDays("30d");
        setLoading(false);
        break;
      case "60d":
        setDays("60d");
        setLoading(false);
        break;
      case "200d":
        setDays("200d");
        setLoading(false);
        break;
      case "1y":
        setDays("365d");
        setLoading(false);
        break;
      case "max":
        setDays("max");
        setLoading(false);
        break;

      default:
        setDays("24h");
        setLoading(false);
        break;
    }
  }

  useEffect(()=>{
    // try-catch

    try {
      const fetchCoin = async () =>{
        const {data} = await axios.get(`${server}/coins/${id}`);
        const {data:graphData} = await axios.get(`${server}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`)
        setCoin(data);
        setChartDetails(graphData.prices)
        const temp = ["inr","usd","eur"];
        setCurrencies(temp);
        console.log(data);
        setLoading(false);
      }
      fetchCoin();
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    } 

    // console.log(id);
  },[id,currency])
  return (
    <div>
      {
        loading?(<Loader/>):(
          <div className='border p-3 w-full m-auto'>
            <div className="currencies flex items-center justify-start gap-2 uppercase">{
              currencies.map((el,idx)=>(
                <div className="curr">
                  <label htmlFor={el}>{el}</label>
                  <input type="radio" name="currency" value={el} key={idx+1} onClick={(e)=>setCurrency(e.target.value)} />
                </div>
              ))
            }
            </div>

            <div className='h-[70vh] w-[80%] m-auto px-2 py-1'>
              <Chart arr={chartDet} currency={currSymbol} days={days} />
            </div>


            <div className='flex items-center justify-center gap-2'>
              {
                btns.map((ele,idx)=>(
                  <button className='border px-2 py-1 rounded-md' key={idx} onClick={()=>switchChartStats(idx)}>{ele}</button>
                ))
              }
            </div>

            <div className=' flex flex-col items-center justify-center gap-1 w-[50%] px-2 py-1 pt-5 m-auto'>
              <p className='opacity-60 text-[0.9rem] font-[400] text-center'>Last updated on {Date(coin.market_data.last_updated).split("G")[0]}</p>
              <img className='self-start h-[100px] w-[100px] m-auto' src={coin.image.large} alt={coin.name} />
              <p className='self-start w-[80%] m-auto text-center'>{coin.name}</p>
              <p className='flex items-center justify-start m-auto'>
                {
                  coin.market_data.price_change_percentage_24h>0?(<i class="ri-arrow-drop-up-fill text-green-400 text-[2rem]"></i>):(<i class="ri-arrow-drop-down-fill text-red-400 text-[2rem]"></i>)
                }
                <p>{coin.market_data.price_change_percentage_24h}%</p>
              </p>
              <h3 className='bg-black text-1.2rem text-[#ffffff] p-2 inline-block text-center'>#{coin.market_data.market_cap_rank}</h3>
              <progress className='w-[90%] m-auto mt-4' max={`${currSymbol}${coin.market_data.high_24h[currency]}`} value={`${currSymbol}${coin.market_data.low_24h[currency]}`}></progress>
            </div>

            <div className="coinDetails py-3 px-5 w-[40%] m-auto flex flex-col items-between justify-normal mt-3">
              <Item title={"Max Supply"} value={coin.market_data.max_supply}/>
              <Item title={"Circulating Supply"} value={coin.market_data.circulating_supply}/>
              <Item title={"Market Cap"} value={`${currSymbol}${coin.market_data.market_cap[currency]}`}/>
              <Item title={"All Time Low"} value={`${currSymbol}${coin.market_data.atl[currency]}`}/>
              <Item title={"All Time High"} value={`${currSymbol}${coin.market_data.ath[currency]}`}/>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default CoinDetails;