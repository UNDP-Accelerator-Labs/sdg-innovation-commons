'use client';

import ReactDOM from 'react-dom';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    isLoading: boolean;
}

export default function Loading({ isLoading }: Props) {
    if (!isLoading) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center w-screen h-screen">
            <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>,
        document.body 
    );
}