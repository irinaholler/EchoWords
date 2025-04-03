import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Lightbulb, Heart } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const About = () => {
    const { darkMode } = useContext(ThemeContext);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    const features = [
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "For Writers",
            description:
                "Share your stories and connect with a like-minded audience who value your voice.",
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "For Readers",
            description:
                "Dive into thought-provoking content and discover writers you'll love.",
        },
        {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "For Creators",
            description:
                "Express yourself, inspire others, and build a personal brand through writing.",
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "For Community",
            description:
                "Belong to a warm, respectful, and inspiring environment of creators and learners.",
        },
    ];

    return (
        <div
            className={`min-h-screen pt-24 pb-20 ${darkMode
                ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
                : 'bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-900'
                }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={fadeInUp}
                    className="text-center mb-20"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Welcome to <span className="text-purple-500">Connectify</span>
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                        The place where creativity meets connection. Share your voice,
                        inspire minds, and discover ideas that move you.
                    </p>
                </motion.div>

                {/* Features */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial="initial"
                            animate="animate"
                            variants={fadeInUp}
                            transition={{ delay: i * 0.1 }}
                            className={`group p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${darkMode
                                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                                : 'bg-white hover:bg-purple-50 text-gray-800'
                                }`}
                        >
                            <div
                                className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 ${darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'
                                    }`}
                            >
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Mission */}
                <motion.div
                    {...fadeInUp}
                    className={`mb-20 p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 to-blue-400/10 rounded-2xl pointer-events-none"></div>
                    <div className="relative">
                        <h2 className="text-3xl font-extrabold mb-6">Our Mission</h2>
                        <p className="text-lg max-w-3xl">
                            To provide a digital home where creativity thrives, curiosity is celebrated,
                            and everyone feels empowered to share their voice with the world.
                        </p>
                    </div>
                </motion.div>

                {/* Values */}
                <motion.div
                    {...fadeInUp}
                    className={`p-8 md:p-12 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                >
                    <h2 className="text-3xl font-bold mb-8">What We Value</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-purple-500 mb-2">Authenticity</h3>
                            <p>
                                We celebrate real stories, raw emotions, and honest creativity that comes from within.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-purple-500 mb-2">Connection</h3>
                            <p>
                                We believe the most meaningful growth happens when minds meet. Every story shared is a bridge to someone new.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mt-24 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                        Ready to share your story?
                    </h2>
                    <p className="mb-6 text-lg">
                        Join Connectify and become part of a community where every voice matters.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-8 py-3 text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-xl shadow-lg hover:shadow-2xl transition-all text-lg font-semibold"
                    >
                        Join Now
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
