import React, { useState } from 'react';

const InputBar = ({onSend}) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        onSend(input);
        setInput('');
    };

    return (
        <div className="p-4 bg-gray-800">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="w-full p-2 bg-gray-700 rounded-lg"
                placeholder="Type a message..." />
        </div>
    );
};

export default InputBar;
