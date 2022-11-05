import Weather from "./Weather";
import "./Weather.css";

const WeatherList = (props) => {
  return (
    <ul className="weather-list">
      {props.locations.map((location) => (
        <Weather key={location.id} lat={location.lat} lon={location.lon} />
      ))}
    </ul>
  );
};

export default WeatherList;
