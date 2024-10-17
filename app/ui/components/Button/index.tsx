import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    // <button 
    // {...rest}
    //   className={clsx('w-[166.3px] relative h-[53.8px] text-center group bg-inherit text-inherit',
    //     className,
    //   )}>
    //   <div className="absolute h-[87.55%] w-[95.97%] top-[0%] right-[0%] bottom-[12.45%] left-[4.03%] bg-lime-yellow transition-all duration-300 group-hover:top-[15%] group-hover:left-[0.03%]" />
    //   <div className="absolute h-[87.17%] w-[95.97%] top-[12.46%] right-[4.03%] bottom-[0.37%] left-[0%] border-black border-[0.7px] border-solid box-border" />
    //   <b className="absolute w-[77.03%] top-[37.87%] left-[9.68%] leading-[17.76px] inline-block cursor-pointer">
    //     {children}
    //   </b>
    // </button>
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
