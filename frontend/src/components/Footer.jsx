import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";


const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                    <ul>
                        <li>
                            <Link to="/about" className="text-gray-400 hover:text-blue-400">About Us</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-gray-400 hover:text-blue-400">Contact</Link>
                        </li>
                        <li>
                            <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400">Terms of Service</Link>
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                    <div className="flex space-x-6">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                            <Facebook size={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500">
                            <Instagram size={24} />
                        </a>
                    </div>
                </div>

                {/* Contact Information */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                    <ul>
                        <li className="text-gray-400">Email: <span className="text-white">contact@blog.com</span></li>
                        <li className="text-gray-400">Phone: <span className="text-white">+123 456 789</span></li>
                    </ul>
                </div>

                {/* Quick Navigation */}
                <div className="flex flex-col items-start justify-center">
                    <h3 className="text-xl font-bold mb-4">Quick Navigation</h3>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Back to Top
                    </button>
                </div>
            </div>

            <div className="mt-12 border-t border-gray-700 pt-6">
                <p className="text-center text-gray-400">
                    &copy; 2025 Connectify. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
