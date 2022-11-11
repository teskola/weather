import Weather from "./Weather";
import "./Weather.css";

const WeatherList = (props) => {
  return (
    <ul className="weather-list">
      {props.locations.map((location) => (
        <Weather
          id={location.id}
          key={location.id}
          lat={location.lat}
          lon={location.lon}
          onDeleteLocation={props.onDeleteLocation}
          resetToken={props.resetToken}
        />
      ))}
    </ul>
  );
};

export default WeatherList;
