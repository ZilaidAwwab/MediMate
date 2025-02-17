import React, { useState } from 'react';
import { Menu, Zap, Send, Heart, Settings as Lungs, Stethoscope, Brain, Baby, Bone, UserRound } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import ChatMessage from './ChatMessage';

function ChatPage({ specialty }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isConversationStarted, setIsConversationStarted] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const specialties = [
        { name: 'Cardiologist', icon: Heart, path: '/cardiologist' },
        { name: 'Chest Specialist', icon: Lungs, path: '/chest-specialist' },
        { name: 'General Physician', icon: UserRound, path: '/general-physician' },
        { name: 'Dermatologist', icon: Stethoscope, path: '/dermatologist' },
        { name: 'Neurologist', icon: Brain, path: '/neurologist' },
        { name: 'Pediatrician', icon: Baby, path: '/pediatrician' },
        { name: 'Orthopedist', icon: Bone, path: '/orthopedist' },
        { name: 'Gynecologist', icon: Stethoscope, path: '/gynecologist' },
    ];

    const getTitle = () => {
        if (specialty === 'general') return 'How can MediMate help you?';
        return `Ask your ${specialty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;
    };

    const getDescription = () => {
        if (specialty === 'general') {
            return 'Get expert medical guidance and answers to your health-related questions.';
        }
        return `Connect with our AI ${specialty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} for specialized medical advice and consultation.`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages([...messages, { type: 'user', content: input }]);
        setInput('');
        setIsConversationStarted(true);

        try {
            // Determine the backend URL based on the current route
<<<<<<< HEAD
            const backendUrl = `https://medimate-backend-production-f1e4.up.railway.app${location.pathname}`;
=======
            const backendUrl = `https://medimate-backend-production-f1e4.up.railway.app/${location.pathname}`;
>>>>>>> cd6b357147088331e84068d5709c8774a1d66e9c

            // Send the prompt to the backend
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: input, stream: false }),
            });

            // Check if the response is not OK (e.g., 4xx or 5xx status)
            if (!response.ok) {
                // Parse the error response from the backend
                const errorData = await response.json();
                if (errorData.message) {
                    // If the backend provides an error message, display it to the user
                    throw new Error(errorData.message);
                } else {
                    // If no specific error message is provided, throw a generic error
                    throw new Error('Failed to fetch response from the server.');
                }
            }

            // If the response is OK, parse the data and update the messages
            const data = await response.json();
            setMessages((prev) => [...prev, { type: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Error:', error);
            if (error.message === 'Unexpected token \'Y\', "Your promp"... is not valid JSON') {
                error.message = `Sorry, your prompt is not relevant to ${(specialty === 'general') ? 'medical condition' : specialty}.`;
            }

            // Display the actual error message to the user
            setMessages((prev) => [
                ...prev,
                { type: 'assistant', content: error.message || 'An unexpected error occurred. Please try again later.' },
            ]);
        }
    };

    // Function to handle the MediMate button click
    const handleMediMateClick = () => {
        if (location.pathname === '/') {
            // If already on the home page, force a reload
            window.location.reload();
        } else {
            // Navigate to the home page and replace the current history entry
            navigate('/', { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex">
            {/* Gradient overlay */}
            <div className="fixed inset-0 bg-gradient-to-b from-[#286179]/30 to-transparent h-[500px] pointer-events-none" />

            {/* Sidebar */}
            <div className={clsx(
                "fixed left-0 top-0 h-full bg-[#161616] w-64 transform transition-transform duration-300 ease-in-out z-20 rounded-tr-2xl overflow-hidden",
                isSidebarOpen ? "translate-x-0" : "-translate-x-64"
            )}>
                <div className="absolute inset-0 bg-gradient-to-b from-[#286179]/30 to-transparent h-[300px] pointer-events-none" />
                <div className="p-4 relative z-10">
                    <h2 className="text-xl font-bold mb-4">Conversations</h2>
                    {/* Add conversation history here */}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative">
                {/* Header - Fixed and Transparent */}
                <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-2">
                        <Zap className="w-6 h-6 text-[#00EEFF]" />
                        <button
                            onClick={handleMediMateClick}
                            className="font-bold text-lg hover:text-[#00EEFF] transition-colors"
                        >
                            MediMate
                        </button>
                    </div>
                </header>

                {/* Main Content Area - Scrollable */}
                <main className={clsx(
                    "flex-1 overflow-auto p-4 relative",
                    isConversationStarted ? "mt-16 mb-24" : "mt-16"
                )}>
                    {!isConversationStarted ? (
                        <div className="max-w-2xl mx-auto mt-20 text-center">
                            <div>
                                <h1 className="text-4xl font-bold mb-3">
                                    {getTitle()}
                                </h1>
                                <p className="text-gray-400 text-lg mb-16">
                                    {getDescription()}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            {messages.map((message, index) => (
                                <div key={index} className={clsx(
                                    "mb-6 p-4 rounded-lg",
                                    message.type === 'user' ? 'bg-[#262626]' : 'bg-[#161616]'
                                )}>
                                    <div className="flex items-start gap-3">
                                        <div className={clsx(
                                            "w-8 h-8 rounded-full flex items-center justify-center",
                                            message.type === 'user' ? 'bg-[#00EEFF]' : 'bg-[#2D2D2D]'
                                        )}>
                                            {message.type === 'user' ? 'U' : 'M'}
                                        </div>
                                        <div className="flex-1">
                                            {message.type === "assistant" ? (
                                                <ChatMessage message={message.content} />
                                            ) : (
                                                message.content
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* Input Area - Fixed at the bottom only when conversation starts */}
                <div className={clsx(
                    "w-full max-w-2xl mx-auto px-4 transition-all duration-300",
                    isConversationStarted
                        ? "fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-[#0A0A0A] border-t border-[#262626] p-4 z-10"
                        : "absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
                )}>
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="How can I help you today?"
                                className="w-full bg-[#161616] rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#00EEFF]"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00EEFF] hover:text-[#00EEFE]"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    {!isConversationStarted && (
                        <div className="mt-8 flex flex-wrap gap-3 justify-center">
                            {specialties.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <button
                                        key={s.name}
                                        onClick={() => navigate(s.path)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#262626] hover:bg-[#363636] transition-colors"
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{s.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sidebar Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="fixed left-4 bottom-4 bg-[#262626] p-3 rounded-full hover:bg-[#363636] transition-colors z-30"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

export default ChatPage;
