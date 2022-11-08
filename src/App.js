import "./App.css";
import WeatherList from "./components/WeatherList";
import { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import AddLocationPage from "./pages/AddLocationPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Modal from "./components/Modal";
import Backdrop from "./components/Backdrop";
import NavigationBar from "./components/NavigationBar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { firebaseConfig } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function App() {
  const API_KEY = "db665b34ad76791b17f190401a72755f";
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [user, loading] = useAuthState(auth);
  const history = useHistory();

  useEffect(() => {
    if (loading) return;
    if (user) {
      fetchLocations(user.uid);
    } else {
      history.push("/Login");
    }
  }, [user, loading, history]);

  async function deleteLocationHandler(id) {
    await fetch(
      `${firebaseConfig.databaseURL}/${user.uid}/locations/${id}.json`,
      {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    fetchLocations(user.uid);
  }

  async function registrationHandler(auth, email, password) {
    history.push("/");
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // POST default location

      const tampere = {
        lat: 61.5,
        lon: 23.79,
      };

      await fetch(
        `${firebaseConfig.databaseURL}/${response.user.uid}/locations.json`,
        {
          method: "POST",
          body: JSON.stringify(tampere),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      fetchLocations(response.user.uid);
    } catch (error) {
      setError(error.message);
    }
  }

  async function addLocationHandler(location) {
    history.push("/");
    // test fetching weather data before adding to database

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Adding location failed.");
      } else {
        await fetch(
          `${firebaseConfig.databaseURL}/${user.uid}/locations.json`,
          {
            method: "POST",
            body: JSON.stringify(location),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        fetchLocations(user.uid);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  const fetchLocations = async (id) => {
    console.log(auth);
    const response = await fetch(
      `${firebaseConfig.databaseURL}/${id}/locations.json`
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

  let errorMessage;
  errorMessage = (
    <div>
      <Modal message={error} onConfirm={() => setError(null)}></Modal>
      <Backdrop onClick={() => setError(null)}></Backdrop>
    </div>
  );

  return (
    <>
      <NavigationBar userLoggedIn={user ? true : false} />
      <section>
        {error && errorMessage}
        <Switch>
          <Route path="/" exact>
            {user ? (
              <WeatherList
                locations={locations}
                onDeleteLocation={deleteLocationHandler}
              />
            ) : (
              <p>Login to see weather data.</p>
            )}
          </Route>
          <Route path="/AddLocationPage">
            <AddLocationPage
              onAddLocation={addLocationHandler}
              userLoggedIn={user ? true : false}
            />
          </Route>
          <Route path="/Register">
            <Register onRegister={registrationHandler} />
          </Route>
          <Route path="/Login">
            <Login />
          </Route>
        </Switch>
        {user && `Logged in as ${user.email}`}
      </section>
    </>
  );
}

export default App;
