import "./App.css";

import WeatherList from "./components/WeatherList";
import AddLocationPage from "./pages/AddLocationPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavigationBar from "./components/NavigationBar";
import Message from "./components/Message";

import { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { firebaseConfig } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function App() {
  const API_KEY = "db665b34ad76791b17f190401a72755f";
  const [error, setError] = useState(null);

  const [locations, setLocations] = useState([]);
  const [user] = useAuthState(auth);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      fetchLocations(user.uid);
    } else {
      history.push("/Login");
    }
  }, [user, history]);

  /*
   *********Tests fetching weather data for location before adding the location to database
   */
  async function addLocationHandler(location) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Adding location failed.");
      } else {
        await fetch(
          `${firebaseConfig.databaseURL}/${user.uid}/locations.json?auth=${auth.currentUser.accessToken}`,
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

  /*
   ***********Deletes location
   */

  async function deleteLocationHandler(id) {
    await fetch(
      `${firebaseConfig.databaseURL}/${user.uid}/locations/${id}.json?auth=${auth.currentUser.accessToken}`,
      {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    fetchLocations(user.uid);
  }
  /* 

***********Fetches locations from Firebase database.

*/
  const fetchLocations = async (id) => {
    const response = await fetch(
      `${firebaseConfig.databaseURL}/${id}/locations.json?auth=${auth.currentUser.accessToken}`
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

  /* 
  
  ************Registers new user and adds default location to database.
  */

  async function registrationHandler(auth, email, password) {
    let newUser;
    try {
      newUser = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }

    await fetch(
      `${firebaseConfig.databaseURL}/${newUser.user.uid}/locations.json?auth=${newUser.user.accessToken}`,
      {
        method: "POST",
        body: JSON.stringify({ lat: 61.5, lon: 23.79 }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    fetchLocations(newUser.user.uid);
  }

  /*
   **************Login using email and password
   */

  async function emailLoginHandler(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <NavigationBar userLoggedIn={user ? true : false} />
      <section>
        <div className="logged">{user && `Logged in as ${user.email}`}</div>
        {error && <Message message={error} onConfirm={() => setError(null)} />}
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
            <Register
              onRegister={registrationHandler}
              addLocation={addLocationHandler}
            />
          </Route>
          <Route path="/Login">
            <Login onEmailLogin={emailLoginHandler} />
          </Route>
        </Switch>
      </section>
      <div className="attribution">
        Weather Icons by{" "}
        <a
          target={"_blank"}
          href="https://dovora.com"
          property="cc:attributionName"
          rel="noreferrer"
        >
          Dovora Interactive
        </a>{" "}
        is licensed under a{" "}
        <a
          rel="noreferrer"
          target={"_blank"}
          href="http://creativecommons.org/licenses/by/4.0/"
        >
          Creative Commons Attribution 4.0 International License
        </a>
        .<br />
        Based on a work at{" "}
        <a
          href="https://dovora.com/resources/weather-icons/"
          rel="noreferrer"
          target={"_blank"}
        >
          https://dovora.com/resources/weather-icons/
        </a>
        .
      </div>
    </>
  );
}

export default App;
