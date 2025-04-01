import React from 'react';

const Contact = ({ darkMode }) => {
    return (
        <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                        <p className="mb-6">
                            Have questions or suggestions? We'd love to hear from you.
                            Fill out the form below and we'll get back to you as soon as possible.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Email</h3>
                                <p className="text-purple-600 dark:text-purple-400">
                                    contact@connectify.com
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Follow Us</h3>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-700">
                                        Twitter
                                    </a>
                                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-700">
                                        LinkedIn
                                    </a>
                                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-700">
                                        Instagram
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label className="block mb-2">Name</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                    ? "bg-gray-800 border-gray-700 text-gray-100"
                                    : "bg-gray-50 border-gray-200 text-gray-900"
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Email</label>
                            <input
                                type="email"
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                    ? "bg-gray-800 border-gray-700 text-gray-100"
                                    : "bg-gray-50 border-gray-200 text-gray-900"
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Message</label>
                            <textarea
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                    ? "bg-gray-800 border-gray-700 text-gray-100"
                                    : "bg-gray-50 border-gray-200 text-gray-900"
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                rows="5"
                                placeholder="Your message"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact; 