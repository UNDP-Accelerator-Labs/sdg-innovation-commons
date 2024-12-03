import React, { FC, ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title: string;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md md:max-w-lg lg:max-w-xl shadow-lg relative p-10 font-space-mono">
                {/* Close Icon */}
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl "
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✖
                </button>

                {/* Modal Header */}
                <div className="border-b border-gray-200 text-center">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
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
