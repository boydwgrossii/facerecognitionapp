import React, { Component } from 'react';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation'
import Signin from './components/SignIn/SignIn';
import Register from './components/Register/Register.js'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank';
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground'
import './App.css';

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
 apiKey: '48a6e567ad9440e890005d74aba1a671'
});

// Your PAT (Personal Access Token) can be found in the portal under Authentification
8const PAT = 'e6d40c13b96640aeaf443dbf45b50419';

11const USER_ID = 'l45kbs34os7l';       
12const APP_ID = 'test';
13// Change these to whatever model and image URL you want to use
14const MODEL_ID = 'face-detection';
15const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
16const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
17
18///////////////////////////////////////////////////////////////////////////////////
19// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
20///////////////////////////////////////////////////////////////////////////////////
21
22const raw = JSON.stringify({
23    "user_app_id": {
24        "user_id": USER_ID,
25        "app_id": APP_ID
26    },
27    "inputs": [
28        {
29            "data": {
30                "image": {
31                    "url": IMAGE_URL
32                }
33            }
34        }
35    ]
36});
37
38const requestOptions = {
39    method: 'POST',
40    headers: {
41        'Accept': 'application/json',
42        'Authorization': 'Key ' + PAT
43    },
44    body: raw
45};
46
47// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
48// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
49// this will default to the latest version_id
50
51fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
52    .then(response => response.text())
53    .then(result => console.log(result))
54    .catch(error => console.log('error', error));

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
   
    // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
    // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
    // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
    // If that isn't working, then that means you will have to wait until their servers are back up. 

    app.models.predict('face-detection', this.state.input)
      .then(response => {
        console.log('hi', response)
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        {/* <ParticlesBg type="fountain" bg={true} /> */}
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;