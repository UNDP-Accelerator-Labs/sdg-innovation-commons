import React, { FC, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white p-10 font-space-mono shadow-lg md:max-w-lg lg:max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          className="absolute right-3 top-3 text-xl text-gray-600 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          ✖
        </button>

        {/* Modal Header */}
        <div className="border-b border-gray-200 text-center">
          <h2 className="font-semibold text-lg text-gray-800 md:text-xl">
            {title}
          </h2>
        </div>

        {/* Modal Content */}
        <div className="px-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
