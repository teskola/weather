import "./Weather.css";
import WeatherIcon from "./WeatherIcon";
import { useState, useEffect } from "react";
import country_codes from "../country_codes.json";

import windarrow from "../images/windarrow.png";
import close_black from "../images/close_black.png";
import close_red from "../images/close_red.png";
import refresh from "../images/refresh.png";

const Weather = (props) => {
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
  const [country, setCountry] = useState(null);
  const [sunIsSet, setSunIsSet] = useState(false);
  const [isLoading, setLoadingState] = useState(false);
  const [error, setError] = useState(null);

  const deleteHandler = () => {
    props.onDeleteLocation(props.id);
  };

  async function fetchWeatherData() {
    const unixTime = Date.now() / 1000;
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
      setCountry(
        country_codes.find((element) => element.code === data.sys.country)
      );
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
        <img
          className="img-button"
          src={refresh}
          alt=""
          onClick={fetchWeatherData}
          width={10}
          height={10}
        />
        <h2 title={country ? country.name : ""}>{name}</h2>
        <div className="top" title="current temp">
          {`${Math.round(temp)} °C`}
          <span className="bottom" title="feels like">{`${Math.round(
            feelsLike
          )} °C`}</span>
        </div>
        <div className="top">
          <img
            src={windarrow}
            alt={`${windDirection}°`}
            title={`${windDirection}°`}
            style={rotation}
            width={50}
            height={50}
          />
          <span className="bottom" title="wind speed">{`${Math.round(
            windSpeed
          )} m/s`}</span>
        </div>
        <WeatherIcon
          weatherId={weatherIconId}
          sunIsSet={sunIsSet}
          description={description}
          width={75}
          height={75}
        />
        <img
          className="img-button"
          onClick={deleteHandler}
          onMouseOver={(event) => (event.currentTarget.src = close_red)}
          onMouseOut={(event) => (event.currentTarget.src = close_black)}
          src={close_black}
          alt=""
          width={10}
          height={10}
        />
      </section>
    );
  }

  return <div>{content}</div>;
};

export default Weather;
