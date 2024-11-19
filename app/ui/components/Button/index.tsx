import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button 
    {...rest}
      className={clsx('h-[60px] font-bold font-space-mono text-[18px] px-[40px] detach',
        className,
      )}><span className='relative z-[2]'>
        {children}
        </span>
    </button>
  );
}
