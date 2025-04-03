import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Contact = () => {
    const { darkMode } = useContext(ThemeContext);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className={`min-h-screen pt-24 pb-20 ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" : "bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-900"}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div {...fadeInUp} className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get in Touch</h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto">
                        Whether you have a question, a suggestion, or just want to say hello — we’d love to hear from you.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <motion.div {...fadeInUp}>
                        <div className={`rounded-2xl shadow-xl p-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                            <h2 className="text-2xl font-semibold mb-6">Reach Us Directly</h2>
                            <div className="space-y-4 text-base">
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-purple-500">contact@connectify.com</p>
                                </div>
                                <div>
                                    <p className="font-medium">Follow Us</p>
                                    <div className="flex space-x-4 mt-2">
                                        <a href="#" className="text-purple-500 hover:text-purple-600">Twitter</a>
                                        <a href="#" className="text-purple-500 hover:text-purple-600">LinkedIn</a>
                                        <a href="#" className="text-purple-500 hover:text-purple-600">Instagram</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.form
                        {...fadeInUp}
                        className={`rounded-2xl shadow-xl p-8 space-y-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
                    >
                        <div>
                            <label className="block mb-2 font-medium">Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Message</label>
                            <textarea
                                rows="5"
                                placeholder="Your message..."
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:from-purple-700 hover:to-purple-600 transition-all"
                        >
                            Send Message
                        </button>
                    </motion.form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
