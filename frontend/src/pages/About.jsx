import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Lightbulb, Heart } from 'lucide-react';

const About = ({ darkMode }) => {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const features = [
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "For Writers",
            description: "Share your stories, get feedback from the community, and connect with readers who appreciate your work."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "For Readers",
            description: "Discover unique perspectives, engage with content creators, and be part of a growing community of curious minds."
        },
        {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "For Creators",
            description: "Express your creativity, share your knowledge, and inspire others with your unique insights."
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "For Community",
            description: "Join a supportive environment where ideas flourish and connections are made."
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-purple-50 to-white"} pt-24`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        About <span className="text-purple-500">Connectify</span>
                    </h1>
                    <p className={`text-lg md:text-xl max-w-3xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        A platform where creative minds come together to share their stories,
                        experiences, and insights with the world.
                    </p>
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    {...fadeInUp}
                    className={`relative mb-16 rounded-2xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
                    <div className="relative p-8 md:p-12">
                        <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Our Mission
                        </h2>
                        <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            To create a space where people can freely express themselves, connect with others,
                            and share knowledge through meaningful content.
                        </p>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            {...fadeInUp}
                            transition={{ delay: index * 0.1 }}
                            className={`group p-6 rounded-xl ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-purple-50"} 
                                shadow-lg hover:shadow-xl transition-all duration-300`}
                        >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 
                                ${darkMode ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600"}`}>
                                {feature.icon}
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {feature.title}
                            </h3>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Values Section */}
                <motion.div
                    {...fadeInUp}
                    className={`rounded-2xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl p-8 md:p-12`}
                >
                    <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Our Values
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className={`text-xl font-semibold ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
                                Authenticity
                            </h3>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                We believe in genuine expression and authentic connections between creators and readers.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className={`text-xl font-semibold ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
                                Community
                            </h3>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Building a supportive environment where everyone's voice is valued and respected.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About; 