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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const country = country_codes.find(
    (element) => element.code === props.countryCode
  );
  const [temp, setTemp] = useState(0);
  const [feelsLike, setFeelsLike] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [windDirection, setWindDirection] = useState(0);
  const [weatherIconId, setWeatherIconId] = useState(802);
  const [description, setDescription] = useState("");
  const [sunIsSet, setSunIsSet] = useState(false);
  const [isLoading, setLoadingState] = useState(false);
  const [isDeleting, setDeletingState] = useState(false);
  const [error, setError] = useState(null);

  const deleteHandler = async () => {
    setDeletingState(true);
    if ((await props.onDeleteLocation(props.id, props.user)) === 401) {
      await props.user.getIdToken();
      props.onDeleteLocation(props.id, props.user);
    }
    setDeletingState(false);
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
  } else if (isDeleting) {
    content = <p>Deleting...</p>;
  } else {
    const rotation = {
      transform: `rotate(${windDirection}deg)`,
    };
    content = (
      <>
        <div className="container">
          <div className="location">
            <h3 title={country ? country.name : ""}>{props.name}</h3>
          </div>
          <div className="parent">
            <div title="current temp" className="top">
              <span>{`${Math.round(temp)} °C`}</span>
            </div>
            <div className="top">
              <img
                src={windarrow}
                alt={`${windDirection}°`}
                title={`${windDirection}°`}
                style={rotation}
                width={25}
                height={25}
              />
            </div>
            <div className="bottom">
              <span title="feels like">{`${Math.round(feelsLike)} °C`}</span>
            </div>
            <div className="bottom">
              <span title="wind speed">{`${Math.round(windSpeed)} m/s`}</span>
            </div>
          </div>

          <div>
            <div className="weather-icon">
              <WeatherIcon
                weatherId={weatherIconId}
                sunIsSet={sunIsSet}
                description={description}
                width={50}
                height={50}
              />
            </div>
          </div>
        </div>

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
      </>
    );
  }

  return (
    <section className="weather">
      <img
        className="img-button"
        src={refresh}
        alt=""
        onClick={fetchWeatherData}
        width={10}
        height={10}
      />
      {content}
    </section>
  );
};

export default Weather;
