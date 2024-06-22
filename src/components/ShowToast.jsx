// ShowToast.js
import React from 'react';
import { Toast } from 'flowbite-react';

const ShowToast = ({ message, type, onClose }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Toast>
        <div className={`flex items-center ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          <div className="ml-3 text-md font-normal">{message}</div>
          <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </Toast>
    </div>
  );
};

export default ShowToast;
