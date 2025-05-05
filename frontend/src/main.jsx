import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserContextProvider } from './context/UserContext';
import { MessagesProvider } from './context/MessagesContext';
import { ThemeProvider } from "./context/ThemeContext";
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <UserContextProvider>
        <MessagesProvider>
          <App />
        </MessagesProvider>
      </UserContextProvider>
    </ThemeProvider>
  </BrowserRouter>
);