import React from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaUsers, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Welcome = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerChildren = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 pt-20 relative overflow-hidden">
            {/* Background animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-gradient-x"></div>

            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <motion.div
                className="relative bg-gradient-to-r from-purple-600/90 to-blue-600/90 py-10 sm:py-14 md:py-16 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Discover Amazing Stories
                    </motion.h1>
                    <motion.p
                        className="text-base sm:text-lg text-gray-100 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Explore a world of inspiring stories and creative minds
                    </motion.p>
                </div>
            </motion.div>

            {/* Empty State Card */}
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14">
                <motion.div
                    className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl border border-gray-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="text-center">
                        {/* Glowing Create Button (like Profile page) */}
                        <motion.div
                            className="relative w-20 h-20 mx-auto mb-8 group"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            {/* Glowing background blur */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse" />

                            {/* Main glowing button */}
                            <Link to="/create">
                                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-purple-800 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                    <svg
                                        className="w-5 h-5 text-purple"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="0.5"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        </motion.div>

                        <motion.h2
                            className="text-2xl sm:text-3xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
                            {...fadeIn}
                        >
                            Be the First to Share
                        </motion.h2>
                        <motion.p
                            className="text-gray-300 mb-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
                            {...fadeIn}
                            transition={{ delay: 0.8 }}
                        >
                            Start something amazing. Share your story and inspire others.
                        </motion.p>

                        <motion.p
                            className="text-gray-400 mb-6 text-base sm:text-lg"
                            {...fadeIn}
                            transition={{ delay: 1 }}
                        >
                            Join our community to start sharing
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-10 sm:mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                        >
                            <Link to="/login" className="w-full sm:w-auto">
                                <motion.button
                                    className="w-full sm:w-auto px-8 py-3 bg-gray-700/50 backdrop-blur-sm text-white text-base rounded-lg shadow-md hover:bg-gray-600/50 transition-all duration-300 border border-purple-600/50 hover:border-gray-500/50"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Login
                                </motion.button>
                            </Link>
                            <Link to="/register" className="w-full sm:w-auto">
                                <motion.button
                                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-base rounded-lg shadow-md hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Join Now
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Features Grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
                            variants={staggerChildren}
                            initial="initial"
                            animate="animate"
                        >
                            {[
                                { icon: FaPencilAlt, title: "Share Stories", desc: "Express yourself through writing" },
                                { icon: FaUsers, title: "Connect", desc: "Engage with other writers" },
                                { icon: FaLightbulb, title: "Inspire", desc: "Make an impact" }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center p-6 bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-600/30 hover:border-purple-500/30 transition-all duration-300"
                                    variants={fadeIn}
                                    whileHover={{ y: -5 }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1.4 + (index * 0.2) }}
                                    >
                                        <feature.icon className="w-8 h-8 mx-auto text-purple-400 mb-3" />
                                    </motion.div>
                                    <h3 className="text-white font-semibold mb-2 text-lg">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Welcome;
