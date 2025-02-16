import React from 'react';
import { Link } from 'react-router-dom';

const DoctorIcons = ({ setMessages }) => {
    const doctors = ['Cardiologist', 'Chest-Specialist', 'General-Physician', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Orthopedist', 'Gynecologist'];

    return (
        <div className="p-4 bg-gray-800">
            <div className="grid grid-cols-2 gap-4">
                {doctors.map((doctor, index) => (
                    <Link
                        key={index}
                        to={`/${doctor.toLowerCase()}`}
                        className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 cursor-pointer"
                    >
                        <p className="text-white text-center">{doctor}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DoctorIcons;
