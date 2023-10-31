import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank';
import Logo from './components/Logo/Logo';
import './App.css';
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground';

class App extends Component { 
  render() {
    return (
      <div className="App">
        <ParticlesBackground />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm />
        {/* <FaceRecognition /> */}
      </div>
    );
  }
}

  

export default App;