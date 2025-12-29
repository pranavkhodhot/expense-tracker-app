'use client';
import React from 'react';

interface Props {
    isOpen: boolean;
    onClose: any;
    children: any;
}

const Modal: React.FC<Props> = ({isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-100 flex items-center justify-center z-50">
      <div className="bg-white border-7 border-green-600 p-6 rounded-3xl shadow-lg relative max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;