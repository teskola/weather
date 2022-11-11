import { useRef, useState } from "react";
import country_codes from "../country_codes.json";

const Search = (props) => {
  const API_KEY = "db665b34ad76791b17f190401a72755f";
  const cityRef = useRef("");
  const countryRef = useRef("any");
  const [badInput, badInputState] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    let url = "http://api.openweathermap.org/geo/1.0/direct?q=";
    const city = cityRef.current.value;
    const countryCode = countryRef.current.value;
    if (city) {
      url += city;
      if (countryCode !== "any") {
        url += "," + countryCode;
      }
      url += "&appid=" + API_KEY;
      const [lat, lon] = await findLatLon(url);
      if (!badInput) {
        props.setLatLon(lat, lon);
      }
    }
  };

  const findLatLon = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      if (data.length > 0) {
        return [data[0].lat, data[0].lon];
      } else {
        badInputState(true);
        return [null, null];
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.code === 13) {
      findLatLon();
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          ref={cityRef}
          size={10}
          placeholder="City name"
          onKeyDown={handleKeyPress}
          className={badInput ? "input-red" : "input"}
          onChange={() => badInputState(false)}
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
        <button className="btn">Find</button>
      </form>
    </div>
  );
};

export default Search;
