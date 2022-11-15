import Weather from "./Weather";
import "./Weather.css";

const WeatherList = (props) => {
  return (
    <ul className="weather-list">
      {props.locations.map((location) => (
        <Weather
          id={location.id}
          key={location.id}
          countryCode={location.countryCode}
          name={location.name}
          lat={location.lat}
          lon={location.lon}
          onDeleteLocation={props.onDeleteLocation}
          user={props.user}
        />
      ))}
    </ul>
  );
};

export default WeatherList;
