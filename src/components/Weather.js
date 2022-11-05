import "./Weather.css";
import { useState, useEffect } from "react";

import day_clear from "../images/day_clear.png";
import cloudy from "../images/cloudy.png";
import day_partial_cloud from "../images/day_partial_cloud.png";
import fog from "../images/fog.png";
import night_half_moon_clear from "../images/night_half_moon_clear.png";
import night_half_moon_partial_cloud from "../images/night_half_moon_partial_cloud.png";
import overcast from "../images/overcast.png";
import rain_thunder from "../images/rain_thunder.png";
import rain from "../images/rain.png";
import sleet from "../images/sleet.png";
import snow from "../images/snow.png";

import windarrow from "../images/windarrow.png";

const Weather = (props) => {
  const unixTime = Date.now() / 1000;
  const API_KEY = "db665b34ad76791b17f190401a72755f";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${props.lat}&lon=${props.lon}&appid=${API_KEY}&units=metric`;

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const [name, setName] = useState("");
  const [temp, setTemp] = useState(0);
  const [feelsLike, setFeelsLike] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [windDirection, setWindDirection] = useState(0);
  const [weatherIconId, setWeatherIconId] = useState(802);
  const [description, setDescription] = useState("");
  const [sunIsSet, setSunIsSet] = useState(false);
  const [isLoading, setLoadingState] = useState(false);
  const [error, setError] = useState(null);

  function selectWeatherIcon(weatherId, sunIsSet) {
    if (weatherId < 300) {
      return rain_thunder;
    } else if (weatherId < 600) {
      return rain;
    } else if (weatherId > 610 && weatherId < 614) {
      return sleet;
    } else if (weatherId < 700) {
      return snow;
    } else if (weatherId < 800) {
      return fog;
    } else if (weatherId < 801) {
      if (sunIsSet) {
        return night_half_moon_clear;
      } else {
        return day_clear;
      }
    } else if (weatherId < 803) {
      if (sunIsSet) {
        return night_half_moon_partial_cloud;
      } else {
        return day_partial_cloud;
      }
    } else if (weatherId < 804) {
      return cloudy;
    } else if (weatherId < 805) {
      return overcast;
    }
  }

  async function fetchWeatherData() {
    setLoadingState(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      setName(data.name);
      setTemp(data.main.temp);
      setFeelsLike(data.main.feels_like);
      setWindSpeed(data.wind.speed);
      setWindDirection(data.wind.deg);
      setSunIsSet(unixTime <= data.sys.sunrise || unixTime >= data.sys.sunset);
      setWeatherIconId(data.weather[0].id);
      setDescription(data.weather[0].description);
    } catch (error) {
      setError(error.message);
    }
    setLoadingState(false);
  }

  let content;
  if (error) {
    content = <p>{error}</p>;
  } else if (isLoading) {
    content = <p>Fetching weather data...</p>;
  } else {
    const rotation = {
      transform: `rotate(${windDirection}deg)`,
    };
    content = (
      <section className="weather">
        <h2>{name}</h2>
        <div className="top">
          {`${Math.round(temp)} °C`}
          <span className="bottom">{`${Math.round(feelsLike)} °C`}</span>
        </div>
        <div className="top">
          <img
            src={windarrow}
            alt={windDirection}
            title={`${windDirection}°`}
            style={rotation}
            width={50}
            height={50}
          />
          <span className="bottom">{`${Math.round(windSpeed)} m/s`}</span>
        </div>
        <img
          src={selectWeatherIcon(weatherIconId, sunIsSet)}
          alt={description}
          title={description}
          width={75}
          height={75}
        />
      </section>
    );
  }

  return <div>{content}</div>;
};

export default Weather;
