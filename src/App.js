import { useEffect, useState, useCallback } from 'react';
import './App.css';
import Icons from './components/Icons';


function App() {
  const [search, setSearch] = useState('escuque')
  const [values, setValues] = useState('')
  const [icon, setIcon] = useState('');
  const [unit, setUnit] = useState('C');


  const initialUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&lang=es&units=metric&appid=4aaa951b493bffaa18279c0b51d98025`

  const getData = useCallback(() => {
      fetch(initialUrl)
      .then(response => response.json())
      .then(data => {
        if (data.cod >= 400) {
          setValues(false);
        } else {
          console.log(data)
          console.log(data.weather[0].main)
          setIcon(data.weather[0].main)
          const temperature = unit === 'C' ? data.main.temp : Math.round(data.main.temp * 9 / 5 + 32);
          setValues({
            cityName: data.name,
            temperature: temperature,
            icon: data.weather[0].main,
            windSpeed: data.wind.speed,
            cloudCover: data.clouds.all,
            pressure: data.main.pressure,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [initialUrl, unit]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearch(e.target.value);
    }
  };

  useEffect(() => {
    getData();
  }, [search, unit, getData]);

  const handleUnitChange = () => {
    setUnit(unit === 'F' ? 'C' : 'F');
  };

  return (
    <>
      <div className="container">
        <h2>React Weather App</h2>
        <div className='row'>
          <input
            onKeyDown={handleSearch}
            type="text"
            autoFocus
          />
        </div>
        <button onClick={handleUnitChange}>
          {unit === 'C' ? 'Cambiar a Fahrenheit' : 'Cambiar a Celsius'}
        </button>
      </div>

      <div className='card'>
        {(values) ? (
          <div className='card-container'>
            <h1 className='city-name'>{values.cityName}</h1>
            <p className='temp'>
              {values.temperature}
              {unit === 'C' ? '°C' : '°F'}
            </p>
            <img className='icon' src={Icons(icon)} alt="icon-weather" />
            <div className='card-details'>
              <p className='detail'>Velocidad del viento: {values.windSpeed} m/s</p>
              <p className='detail'>Porcentaje de nubes: {values.cloudCover}%</p>
              <p className='detail'>Presión atmosférica: {values.pressure} hPa</p>
            </div>
          </div>
        ) : (
          <h1>{"City not found"}</h1>
        )}
      </div>
    </>
  );
}

export default App;