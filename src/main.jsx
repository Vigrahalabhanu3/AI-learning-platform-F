import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LearningProvider } from './context/LearningContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LearningProvider>
        <App />
      </LearningProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
