import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatPage from './components/ChatPage';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <Router>
            <div className="min-h-screen bg-[#0A0A0A] text-white flex">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col relative">
                    <Routes>
                        {/* Landing Page */}
                        <Route path="/" element={<ChatPage specialty="general" />} />

                        {/* Doctor-Specific Pages */}
                        <Route path="/cardiologist" element={<ChatPage specialty="cardiologist" />} />
                        <Route path="/chest-specialist" element={<ChatPage specialty="chest-specialist" />} />
                        <Route path="/general-physician" element={<ChatPage specialty="general-physician" />} />
                        <Route path="/dermatologist" element={<ChatPage specialty="dermatologist" />} />
                        <Route path="/neurologist" element={<ChatPage specialty="neurologist" />} />
                        <Route path="/pediatrician" element={<ChatPage specialty="pediatrician" />} />
                        <Route path="/orthopedist" element={<ChatPage specialty="orthopedist" />} />
                        <Route path="/gynecologist" element={<ChatPage specialty="gynecologist" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
