import "./App.css";
import openWeather from "./images/OpenWeather.png";

import WeatherList from "./components/WeatherList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavigationBar from "./components/NavigationBar";
import AddLocation from "./components/AddLocation";
import Modal from "./components/Modal";
import Backdrop from "./components/Backdrop";

import { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import { auth, fb_url } from "./firebase";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

function App() {
  const [message, setMessage] = useState(null);
  const [locations, setLocations] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const history = useHistory();

  /*
   *******First render only: set auth state listener
   */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (user) {
      // login
      fetchLocations(user);
      history.push("/");
    }
    if (!user) {
      // logout
      history.push("/login");
    }
  }, [history, user]);

  /*
   *********Adds location to database and calls fetchLocations()
   *********Returns: http status code.
   */
  async function addLocationHandler(location, user) {
    try {
      const response = await fetch(
        `${fb_url}/${user.uid}/locations.json?auth=${user.accessToken}`,
        {
          method: "POST",
          body: JSON.stringify(location),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchLocations(user);
      }
      return response.status;
    } catch (error) {
      setMessage(error.message);
    }
  }

  /*
   ***********Deletes location from database and locations array
   ***********Returns http status code.
   */

  async function deleteLocationHandler(id, user) {
    try {
      const response = await fetch(
        `${fb_url}/${user.uid}/locations/${id}.json?auth=${user.accessToken}`,
        {
          method: "Delete",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setLocations((current) =>
          current.filter((location) => location.id !== id)
        );
      }
      return response.status;
    } catch (error) {
      setMessage(error.message);
    }
  }
  /* 

***********Fetches locations from Firebase database.

*/
  async function fetchLocations(user) {
    try {
      const response = await fetch(
        `${fb_url}/${user.uid}/locations.json?auth=${user.accessToken}`
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
  }

  /*
   ************Adds default location to database
   */

  async function addDefaultLocation(user) {
    const tampere = {
      id: "--default",
      name: "Tampere",
      countryCode: "FI",
      lat: 61.4980214,
      lon: 23.7603118,
    };
    try {
      await fetch(
        `${fb_url}/${user.uid}/locations/--default.json?auth=${user.accessToken}`,
        {
          method: "PUT",
          body: JSON.stringify(tampere),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLocations((current) => [...current, tampere]);
    } catch (error) {
      setMessage(error.message);
    }
  }

  /*
   **************Links anonymous account to emai account
   */

  async function linkAnonymousToEmail(email, password, auth) {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(auth.currentUser, credential);
      history.push("/");
      setMessage("Anonymous account successfully upgraded.");
    } catch (error) {
      setMessage(error.message);
    }
  }
  /* 
  
  ************Registers anonymous and email+password user and calls addDefaultLocation().
  */

  async function registrationHandler(email, password, auth) {
    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        await linkAnonymousToEmail(email, password, auth);
      } else if (email && password) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await addDefaultLocation(credential.user);
      } else {
        const credential = await signInAnonymously(auth);
        await addDefaultLocation(credential.user);
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  /*
   ***************Logout and clear locations array.
   */

  function logOutHandler(auth) {
    signOut(auth);
    setLocations([]);
    setMessage("Logged out succesfully.");
  }

  /*
   **************Login using email and password
   */

  async function emailLoginHandler(email, password, auth) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setMessage(error.message);
    }
  }

  /*
   **************Login with Google.
   **************If new user, add default location.
   **************If logged in as anonymous, link with google account.
   */

  async function googleLoginHandler(auth) {
    const provider = new GoogleAuthProvider();
    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        await linkWithPopup(auth.currentUser, provider);
        history.push("/");
        setMessage("Anonymous account successfully upgraded.");
      } else {
        const response = await signInWithPopup(auth, provider);
        if (getAdditionalUserInfo(response).isNewUser) {
          await addDefaultLocation(response.user);
        }
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  /*
   ****************Reset Password
   */

  async function resetPasswordHandler(email, auth) {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Password reset email sent to: ${email}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  const loggedInAs = () => {
    if (user.isAnonymous) {
      return "anonymous";
    } else {
      return user.email;
    }
  };

  return (
    <>
      <NavigationBar onLogout={logOutHandler} auth={auth} />
      <section>
        <div className="logged">{user && `Logged in as ${loggedInAs()}`}</div>
        {message && (
          <>
            <Modal message={message} onConfirm={() => setMessage(null)} />
            <Backdrop onClick={() => setMessage(null)} />
          </>
        )}
        <Switch>
          <Route path="/" exact>
            {user ? (
              <div>
                <WeatherList
                  locations={locations}
                  onDeleteLocation={deleteLocationHandler}
                  user={user}
                />
                <AddLocation
                  onAddLocation={addLocationHandler}
                  setMessage={setMessage}
                  user={user}
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
              auth={auth}
            />
          </Route>
          <Route path="/Login">
            <Login
              onEmailLogin={emailLoginHandler}
              onPasswordReset={resetPasswordHandler}
              onRegister={registrationHandler}
              onGoogleLogin={googleLoginHandler}
              auth={auth}
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
      <div className="license">
        <a href="https://openweathermap.org/">
          <img
            src={openWeather}
            alt="openweathermap.org"
            width={120}
            height={68}
          />
        </a>
        <br></br>
        <a href="https://openweathermap.org/">
          Weather data provided by OpenWeather
        </a>
      </div>
    </>
  );
}

export default App;
