import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import './home.scss'


function Home() {
  const [wdata, setWdata] = useState({
    celcious: 15,
    cityname: 'Osaka',
    description: '陰,多雲',
    humidity: 56,
    wind: 4.6,
    icon: '04n'
  })

  const [cname, setCname] = useState('');
  const [errmsg, setErrmsg] = useState('');
  const aniRef = useRef(null);


  useEffect(()=> {
    const apiurl = 'https://api.openweathermap.org/data/2.5/weather?q=Tainan&appid=3061cf4b95de4b2220a95d50f06c0b64&units=metric&lang=zh_tw'
    axios.get(apiurl)
    .then(response => {
      //console.log(response.data)
      setWdata({...wdata, 
        celcious: Math.round(response.data.main.temp * 10) / 10, 
        cityname: response.data.name.toUpperCase(), 
        description:response.data.weather[0].description,
        humidity: Math.round(response.data.main.humidity * 10) / 10,
        wind: Math.round(response.data.wind.speed * 10) / 10,
        icon: response.data.weather[0].icon
      })
    })
    .catch(error => console.log(error))
  }, [])


  const handleKeydown = (event) =>{
    if (event.key === 'Enter'){
      weatherHandle();
    }
  }

  const weatherHandle = () =>{
    aniRef.current.classList.toggle('animate')

    setTimeout(() => {
      if(cname !== ""){
        const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${cname}&appid=3061cf4b95de4b2220a95d50f06c0b64&units=metric&lang=zh_tw`
        axios.get(apiurl)
        .then(response => {
          //console.log(response.data)
          aniRef.current.classList.toggle('animate')
          setErrmsg('');
          setWdata({...wdata, 
            celcious: Math.round(response.data.main.temp * 10) / 10, 
            cityname: response.data.name.toUpperCase(), 
            description:response.data.weather[0].description,
            humidity: Math.round(response.data.main.humidity * 10) / 10,
            wind: Math.round(response.data.wind.speed * 10) / 10,
            icon: response.data.weather[0].icon
          })
        })
        .catch(error => {
          console.log(error)
          if(error.response.status = 404 ){
            setErrmsg("請輸入有效的城市名稱 (建議使用英文名稱)")
          }else{
            setErrmsg('some error');
          }
        });
      }
    }, 1500);
  }


  return (
    <div className="wrap">

      <div className="weather">

        <section className="weather__searchBar">
          <span className="weather__searchBar-con">
            <input className="searchField" type="text" placeholder="Enter City Name" onChange={e => setCname(e.target.value)} onKeyDown={handleKeydown}/>
            <button className="searchBtn" onClick={weatherHandle}><img src="./public/img/search.svg" /></button>
          </span>
        </section>

        <section className="weather__searchErr">{errmsg}</section>

        <section className="weather__extraInfo">

          <div className="infoPanel infoWind">
            <img className="infoPanel__pic" src="./public/img/wind.svg" />
            <p className="infoPanel__content">{wdata.wind}<b>km/h</b></p>
            <p className="infoPanel__name">風速</p>
          </div>

          <div className="infoPanel infoHumidity">
          <img className="infoPanel__pic" src="./public/img/humidity.svg" />
            <p className="infoPanel__content">{wdata.humidity}<b>%</b></p>
            <p className="infoPanel__name">濕度</p>
          </div>

        </section>

        <section className="weather__mainInfo minInfo">

            <span className="minInfo__cityName">{wdata.cityname}</span>
            <span className="minInfo__picGallery animate" ref={aniRef}><img src={`./public/img/${wdata.icon}.png`} /></span>
            <span className="minInfo__forecast">{wdata.description}</span>
            <span className="minInfo__temperature">{wdata.celcious}<b>°C</b></span>

        </section>

      </div>
      

    </div>
  )
}

export default Home