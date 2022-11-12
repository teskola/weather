import "./App.css";

import WeatherList from "./components/WeatherList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavigationBar from "./components/NavigationBar";
import Message from "./components/Message";

import { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, fb_url } from "./firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
} from "firebase/auth";
import AddLocation from "./components/AddLocation";

function App() {
  const [message, setMessage] = useState(null);
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
   *********Adds location to database
   *********Returns: http status code.
   */
  async function addLocationHandler(location) {
    try {
      const response = await fetch(
        `${fb_url}/${user.uid}/locations.json?auth=${auth.currentUser.accessToken}`,
        {
          method: "POST",
          body: JSON.stringify(location),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchLocations(user.uid);
      }
      return response.status;
    } catch (error) {
      setMessage(error.message);
    }
  }

  /*
   ***********Deletes location and calls fetchLocations.
   ***********Returns http status code.
   */

  async function deleteLocationHandler(id) {
    try {
      const response = await fetch(
        `${fb_url}/${user.uid}/locations/${id}.json?auth=${auth.currentUser.accessToken}`,
        {
          method: "Delete",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchLocations(user.uid);
      }
      return response.status;
    } catch (error) {
      setMessage(error.message);
    }
  }
  /* 

***********Fetches locations from Firebase database.
***********Returns http status code

*/
  const fetchLocations = async (id) => {
    try {
      const response = await fetch(
        `${fb_url}/${id}/locations.json?auth=${auth.currentUser.accessToken}`
      );
      const data = await response.json();
      if (response.ok) {
        const fetchedLocations = [];
        for (const key in data) {
          fetchedLocations.push({
            id: key,
            name: data[key].name,
            countryCode: data[key].countryCode,
            lat: data[key].lat,
            lon: data[key].lon,
          });
        }
        setLocations(fetchedLocations);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  /* ********Updates token */

  const resetToken = async () => {
    await auth.currentUser.getIdToken();
  };

  /* 
  
  ************Registers new user and adds default location to database.
  */

  async function registrationHandler(email, password) {
    let newUser;
    try {
      if (email && password) {
        newUser = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        newUser = await signInAnonymously(auth);
      }
      await fetch(
        `${fb_url}/${newUser.user.uid}/locations.json?auth=${newUser.user.accessToken}`,
        {
          method: "POST",
          body: JSON.stringify({
            lat: 61.5,
            lon: 23.79,
            name: "Tampere",
            countryCode: "FI",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      fetchLocations(newUser.user.uid);
    } catch (error) {
      setMessage(error.message);
    }
  }

  /*
   **************Login using email and password
   */

  async function emailLoginHandler(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setMessage(error.message);
    }
  }

  /*
   ****************Reset Password
   */

  const resetPasswordHandler = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Password reset email sent to: ${email}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loggedInAs = () => {
    if (user.isAnonymous) {
      return "anonymous";
    } else {
      return user.email;
    }
  };

  return (
    <>
      <NavigationBar
        userLoggedIn={user ? true : false}
        anonymousLogin={user ? user.isAnonymous : false}
      />
      <section>
        <div className="logged">{user && `Logged in as ${loggedInAs()}`}</div>
        {message && (
          <Message message={message} onConfirm={() => setMessage(null)} />
        )}
        <Switch>
          <Route path="/" exact>
            {user ? (
              <div>
                <WeatherList
                  locations={locations}
                  onDeleteLocation={deleteLocationHandler}
                  resetToken={resetToken}
                />
                <AddLocation
                  onAddLocation={addLocationHandler}
                  resetToken={resetToken}
                  setMessage={setMessage}
                />
              </div>
            ) : (
              <p>Login to see weather data.</p>
            )}
          </Route>
          <Route path="/Register">
            <Register
              onRegister={registrationHandler}
              addLocation={addLocationHandler}
            />
          </Route>
          <Route path="/Login">
            <Login
              onEmailLogin={emailLoginHandler}
              onPasswordReset={resetPasswordHandler}
              onRegister={registrationHandler}
            />
          </Route>
        </Switch>
      </section>
      <div className="license">
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
