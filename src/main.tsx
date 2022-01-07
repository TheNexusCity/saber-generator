import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Editor, { SaberEditor } from '@editor/editor'
//const gen = new SaberGenerator()

ReactDOM.render
(
  <React.StrictMode>
    <Editor />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

const editor = new SaberEditor()

console.log("editor initialized")

  