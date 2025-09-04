import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'flowbite/dist/flowbite.css'; // ← add this
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'flowbite';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
