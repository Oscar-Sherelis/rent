import React, { useRef, useState, useEffect } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import configuration from "./config";

firebase.initializeApp(configuration)

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

    function Logout() {
      return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.SignOut()}>Logout</button>
      )
    }

    function LogIn() {
      const sigInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
      }
      return (
        <>
        <button className="sign-in" onClick={sigInWithGoogle}>Login with Google</button>
        </>
      )
    }

function Apartments() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = firebase.firestore().collection('rooms');

  function getRooms() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach(doc => {
        items.push(doc.data());
      });

      setRooms(items);
      setLoading(false);
    })
  }

  useEffect(() => {
    getRooms();
  }, []);
  return (
  <>
    <main>
        {loading ? <h2>Loading...</h2> : null}
        {rooms.map(room => (
          <div className="room" key={room.id}>
            <div className="room__images">
              <div className="main_image">
                <img src={room.main_image} alt=""/>
              </div>
              <div className="other_images"></div>
            </div>
            <div className="room__information">
              <div className="name_and_cost">
                <span className="name">{room.room}</span>
                <span className="cost">{room.cost} &euro;</span>
              </div>
              <div className="description">
                {room.description}
              </div>
              <button className="rent">Rent</button>
            </div>
          </div>
        ))}
    </main>
  </>)
}

function LoadApartmentImages () {
  const images  = [{img: "https://upload.wikimedia.org/wikipedia/commons/5/50/Bodiam-castle-10My8-1197.jpg"},{img: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Balmoral_Castle.jpg"}];

  let [element, setValue] = useState(0);

    function getValue() {
    setValue(element)
    console.log(element)
  }

    useEffect(() => {
    getValue();
  }, []);
  let selectedImageUrl = images[element].img;
  function right() {
    if(element < images.length - 1){element++;}
    selectedImageUrl = images[element].img;
    getValue()
    console.log(element)
  };
  function left() {
    if(element > 0) {element--}
    selectedImageUrl = images[element].img;
    getValue()
    console.log(element)
  };
  return (
  <div className="container" id="container" data-index={element}>
    <h1>{element}</h1>
    <button onClick={getValue}>Get value</button>
    <img src={selectedImageUrl}></img>
    <button className="left"  onClick={left}>{'<'}</button>
    <button className="right" onClick={right}>{'>'}</button>
  </div>
  )
}

function App() {
    const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <Logout/>
        <LogIn></LogIn>
      </header>
      <Apartments></Apartments>
      <section>
        <LoadApartmentImages></LoadApartmentImages>
      </section>
    </div>
  );
}

export default App;
