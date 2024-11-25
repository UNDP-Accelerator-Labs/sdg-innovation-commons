import React, { useState, useEffect } from 'react';

const Notification = ({ message, subMessage, type = 'success', duration = 3000 }:any ) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer); 
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-5 right-5 flex items-center max-w-sm p-4 border rounded-lg shadow-lg bg-white z-[200] ${
        type === 'success' ? 'border-green-300' : 'border-red-300'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center mr-3 ${
          type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
        }`}
      >
        {type === 'success' ? (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-4.293-3.707a1 1 0 10-1.414 1.414L10.586 10l-1.293 1.293a1 1 0 101.414 1.414l1.293-1.293 1.293 1.293a1 1 0 101.414-1.414L11.414 10l1.293-1.293a1 1 0 000-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
      </div>

      {/* Text */}
      <div>
        <h4 className="font-medium text-sm text-gray-900">{message}</h4>
        <p className="text-xs text-gray-500">{subMessage}</p>
      </div>

      {/* Close Button */}
      <button
        className="ml-auto text-gray-400 hover:text-gray-600"
        onClick={() => setIsVisible(false)}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Notification;
