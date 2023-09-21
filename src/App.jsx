import { useEffect, useState } from "react"
import { Search } from "@mui/icons-material"
import { LocationOn } from "@mui/icons-material"
import { WaterDrop } from "@mui/icons-material"
import { Air } from "@mui/icons-material"
import axios from "axios"
import './App.css'

function App() {
  const [weather, setWeather] = useState('')
  const API_KEY_1 = '02f15d7d943c547b401971e975e7c6e4'
  const API_KEY_2 = 'OWIhNlaNHT20WEkR1oJMusUzP36nEfx-VkHUNJsJevo'

  const getWeatherData = async (city, key)=>{  
    document.getElementById('loading').style.display = 'flex'

    await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${key}`)
    .then((res)=>{setWeather(res)})
    .catch((error)=>{setWeather(error.response)})

    document.getElementById('loading').style.display = 'none'
  }

  const toHide = () => {
    document.getElementById('grid-container').style.display = 'none'
    document.getElementById('weather-data').style.display = 'none'
    document.getElementById('error-message').style.display = 'none'
  }

  const setBackground = async (query, key)=>{
    await axios.get(`https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${key}`)
    .then((res)=>{
      const url = res.data.results[0].urls.regular
      applyBackground(url)
    })
    .catch(()=>{
      resetBackground()
    })    
  }

  const applyBackground = (imageURL)=>{
    document.body.style.backgroundImage = `url(${imageURL})`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center bottom'
  }

  const resetBackground = ()=>{
    document.body.style.removeProperty('background-image')
    document.body.style.removeProperty('background-size')
    document.body.style.removeProperty('background-position')
  }

  useEffect(()=>{
    const btnSearch = document.getElementById('btn-search')
    btnSearch.addEventListener('click', ()=>{
      const input = document.getElementById('input-form')
      const data = input.value
      toHide()
      getWeatherData(data, API_KEY_1)
      input.value = ''
    })

    const gridContainer = document.getElementById('grid-container')
    const gridItems = gridContainer.querySelectorAll('button')
    gridItems.forEach((button)=>{
      button.addEventListener('click', ()=>{
        const data = button.value
        toHide()
        getWeatherData(data, API_KEY_1)
      })
    })
  }, [])

  useEffect(()=>{
    if(weather.status == 200){
      document.getElementById('city').innerText = `${weather.data.name}`
      document.getElementById('flag').src = `https://flagsapi.com/${weather.data.sys.country}/flat/64.png`
      document.querySelector('#temperature > span').innerText = `${parseInt(weather.data.main.temp)}`
      document.getElementById('description').innerText = `${weather.data.weather[0].description}`
      document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${weather.data.weather[0].icon}.png`
      document.querySelector('#humidity > span').innerText = `${weather.data.main.humidity}`
      document.querySelector('#wind > span').innerText = `${weather.data.wind.speed}`
      
      document.getElementById('weather-data').style.display = 'block'
      const query = weather.data.name
      setBackground(query, API_KEY_2)
    }else{
      if(weather.status == 404){  
        document.getElementById('error-message').style.display = 'block'
        resetBackground()
      }
    }
  }, [weather])

  return(
    <div className="Container">
      <div className="Form">
        <h3>Confira o clima de uma cidade:</h3>
        <div>
          <input type="text" name="" id="input-form" placeholder="Pesquise uma cidade:" />
          <button type="button" id="btn-search">
            <Search/>
          </button>
        </div>
      </div>
      <div id="grid-container">
        <button value="Brasília">Brasília</button>
        <button value="Nova York">Nova York</button>
        <button value="Rio de Janeiro">Rio de Janeiro</button>
        <button value="Vancouver">Vancouver</button>
        <button value="Tokyo">Tokyo</button>
        <button value="Frankfurt">Frankfurt</button>
        <button value="Oslo">Oslo</button>
        <button value="São Paulo">São Paulo</button>
      </div>
      <div id="weather-data">
        <h2>
          <LocationOn/>
          <span id="city"></span>
          <img src="" alt="Bandeira indicando o país" id="flag"/>
        </h2>
        <p id="temperature"><span></span>°C</p>
        <div id="description-container">
          <p id="description"></p>
          <img src="" alt="Icone ilustrando o clima" id="weather-icon" />
        </div>
        <div id="details-container">
          <p id="humidity">
            <WaterDrop/>
            <span></span>%
          </p>
          <p id="wind">
            <Air/>
            <span></span>km/h
          </p>
        </div>
      </div>
      <div id="error-message">
        <p>Não foi possível encontrar o clima de uma cidade com este nome.</p>
      </div>
      <div id="loading">
        <img src="https://img1.picmix.com/output/stamp/normal/8/5/2/9/509258_fb107.gif" height={50} alt="Loading Icon" />
      </div>
    </div>
  )
}

export default App