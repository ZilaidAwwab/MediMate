import React from 'react';
import clsx from 'clsx';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={clsx(
            "fixed left-0 top-0 h-full bg-[#161616] w-64 transform transition-transform duration-300 ease-in-out z-20 rounded-tr-2xl overflow-hidden",
            isOpen ? "translate-x-0" : "-translate-x-64"
        )}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#1B3745]/30 to-transparent h-[300px] pointer-events-none" />
            <div className="p-4 relative z-10">
                <h2 className="text-xl font-bold mb-4">Conversations</h2>
                {/* Add conversation history here */}
            </div>
        </div>
    );
};

export default Sidebar;
