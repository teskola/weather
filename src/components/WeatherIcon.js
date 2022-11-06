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

const WeatherIcon = (props) => {
  const selectWeatherIcon = () => {
    if (props.weatherId < 300) {
      return rain_thunder;
    } else if (props.weatherId < 600) {
      return rain;
    } else if (props.weatherId > 610 && props.weatherId < 614) {
      return sleet;
    } else if (props.weatherId < 700) {
      return snow;
    } else if (props.weatherId < 800) {
      return fog;
    } else if (props.weatherId < 801) {
      if (props.sunIsSet) {
        return night_half_moon_clear;
      } else {
        return day_clear;
      }
    } else if (props.weatherId < 803) {
      if (props.sunIsSet) {
        return night_half_moon_partial_cloud;
      } else {
        return day_partial_cloud;
      }
    } else if (props.weatherId < 804) {
      return cloudy;
    } else if (props.weatherId < 805) {
      return overcast;
    }
  };

  return (
    <img
      src={selectWeatherIcon()}
      alt={props.description}
      title={props.description}
      width={props.width}
      height={props.height}
    />
  );
};

export default WeatherIcon;
