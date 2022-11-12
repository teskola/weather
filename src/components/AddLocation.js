import { useRef, useState } from "react";
import country_codes from "../country_codes.json";
import "./Weather.css";

const AddLocation = (props) => {
  const API_KEY = "db665b34ad76791b17f190401a72755f";
  const cityRef = useRef("");
  const countryRef = useRef("any");
  const [isLoading, setLoadingState] = useState(false);

  const addLocation = async (location) => {
    if ((await props.onAddLocation(location)) === 401) {
      await props.resetToken();
      await props.onAddLocation(location);
    }
    setLoadingState(false);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    let url = "https://api.openweathermap.org/geo/1.0/direct?q=";
    let locationName;
    const city = cityRef.current.value;
    if (city) {
      setLoadingState(true);

      locationName = city;
      if (countryRef.current.value !== "any") {
        locationName += "," + countryRef.current.value;
      }
      url += locationName + "&appid=" + API_KEY;
      const [lat, lon, countryCode] = await findGeoCode(url);
      if (lat && lon) {
        const location = {
          name: city,
          countryCode: countryCode,
          lat: lat,
          lon: lon,
        };
        addLocation(location);
      } else {
        props.setMessage(`${locationName} not found.`);
        setLoadingState(false);
      }
    }
  };

  const findGeoCode = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        return [data[0].lat, data[0].lon, data[0].country];
      } else {
        return [null, null, null];
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.code === 13) {
      submitHandler();
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Please wait.</p>
      ) : (
        <form onSubmit={submitHandler}>
          <div className="addlocation">
            <input
              type="text"
              ref={cityRef}
              size={10}
              placeholder="City name"
              onKeyDown={handleKeyPress}
            ></input>

            <select ref={countryRef} className="select">
              <option value="any">Country</option>
              <option value="any">any</option>
              {country_codes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>

            <button className="btn">Add</button>
          </div>
        </form>
      )}
    </div>
  );
};
export default AddLocation;
