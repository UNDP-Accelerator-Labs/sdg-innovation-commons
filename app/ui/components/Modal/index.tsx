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
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white font-space-mono shadow-lg md:max-w-2xl lg:max-w-3xl my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          className="absolute right-3 top-3 z-10 text-xl text-gray-600 hover:text-black bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
          onClick={onClose}
          aria-label="Close"
        >
          ✖
        </button>

        {/* Modal Header */}
        <div className="border-b border-gray-200 text-center p-6 pb-4 flex-shrink-0">
          <h2 className="font-semibold text-lg text-gray-800 md:text-xl">
            {title}
          </h2>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
