import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank';
import Logo from './components/Logo/Logo';
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground'
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area:800
      }
    }
  }
}

class App extends Component { 
  render() {
    return (
      <div className="App">
        <ParticlesBackground className="particles" />
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