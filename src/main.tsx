import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {SaberGenerator} from "./saber-generator"
import {WebGLRenderer, PerspectiveCamera, DirectionalLight} from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
//const gen = new SaberGenerator()

ReactDOM.render
(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

const generator = new SaberGenerator()

const renderer = new WebGLRenderer()

const scene = generator.scene

const container = document.querySelector('.App')
if(container != undefined)
{
  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 100;

  const camera = new PerspectiveCamera(fov, aspect, near, far)
  

  camera.position.set(0,0,0.5) 
  

  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.append(renderer.domElement)
  const controls = new OrbitControls(camera, renderer.domElement)

  const animate = () => 
  {
    controls.update()
    requestAnimationFrame( animate )
    renderer.render(scene, camera)
  }
  animate()
}
  