import "./App.css";
import AddLocation from "./components/AddLocation";
import WeatherList from "./components/WeatherList";
import { useState, useEffect } from "react";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import AddLocationPage from "./pages/AddLocationPage";
import ErrorModal from "./components/ErrorModal";
import Backdrop from "./components/Backdrop";

function App() {
  /* const tampere = {
    key: 0,
    lat: 61.5,
    lon: 23.79,
  }; */
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const history = useHistory();
  async function addLocationHandler(location) {
    // test fetching weather data before adding to database

    try {
      const API_KEY = "db665b34ad76791b17f190401a72755f";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Adding location failed.");
      }

      await fetch(
        "https://weatherlocations-default-rtdb.europe-west1.firebasedatabase.app/locations.json",
        {
          method: "POST",
          body: JSON.stringify(location),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      setError(error.message);
    }
    history.push("/");
    fetchLocations();
  }

  const fetchLocations = async () => {
    const response = await fetch(
      "https://weatherlocations-default-rtdb.europe-west1.firebasedatabase.app/locations.json"
    );
    const data = await response.json();

    const fetchedLocations = [];
    for (const key in data) {
      fetchedLocations.push({
        id: key,
        lat: data[key].lat,
        lon: data[key].lon,
      });
    }

    setLocations(fetchedLocations);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const resetErrorState = () => {
    setError(null);
  };

  let errorMessage;

  errorMessage = (
    <div>
      <ErrorModal error={error} onConfirm={resetErrorState}></ErrorModal>
      <Backdrop onClick={resetErrorState}></Backdrop>
    </div>
  );

  return (
    <section>
      {error && errorMessage}
      <Switch>
        <Route path="/" exact>
          <WeatherList locations={locations} />
          <Link to="/AddLocationPage">
            <button>Add location</button>
          </Link>
        </Route>
        <Route path="/AddLocationPage">
          <AddLocationPage />
          <AddLocation onAddLocation={addLocationHandler} />
        </Route>
      </Switch>
    </section>
  );
}

export default App;
