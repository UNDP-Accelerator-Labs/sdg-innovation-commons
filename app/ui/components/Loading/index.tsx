'use client';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    isLoading: boolean;
}

export default function Loading({ isLoading }: Props) {
    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center  w-screen h-screen">
                    <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
                </div>
            )}
        </>
    );
}