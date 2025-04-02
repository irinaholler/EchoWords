import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? "dark:bg-gray-800" : "bg-gray-100"} flex flex-col`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/create" element={<CreatePost darkMode={darkMode} />} />
        <Route path="/post/:slug" element={<PostDetails darkMode={darkMode} />} />
        <Route path="/edit/:id" element={<EditPost darkMode={darkMode} />} />
        <Route path="/profile/:username" element={<Profile darkMode={darkMode} />} />
        <Route path="/about" element={<About darkMode={darkMode} />} />
        <Route path="/contact" element={<Contact darkMode={darkMode} />} />
        <Route path="/login" element={<Login darkMode={darkMode} />} />
        <Route path="/register" element={<Register darkMode={darkMode} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;
