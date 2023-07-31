import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
// import ApplicationLayout from './Layouts/ApplicationLayout'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <ApplicationLayout> */}
      <App />
    {/* </ApplicationLayout> */}
  </React.StrictMode>
);

reportWebVitals();
