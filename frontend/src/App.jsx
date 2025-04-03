import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Welcome from './pages/Welcome';
import "./index.css";

function App() {

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen ${darkMode ? "dark:bg-gray-800" : "bg-gray-100"} flex flex-col`}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:slug" element={<PostDetails />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;
