import clsx from 'clsx';

interface Props {
    item: any;
    className: string;
}

export default function Checklist({
    item,
    className,
}: Props) {
    const { instruction, options } = item;
    
    const txt: string = options
        .filter((d: any) => d.checked === true)
        .map((d: any) => {
            return `${d.name.slice(0, 1).toUpperCase()}${d.name.substring(1)}`;
        }).join(', ');

    if (!txt?.length && !instruction?.length) return null;
    else {
        return (
            <>
            <div className={clsx('border-[1px] border-solid p-[20px] mt-[-1px]', className)}>
                {!instruction ? null : (
                    <p className='font-space-mono text-[14px] leading-[20px] mb-[10px]'><b>{instruction}</b></p>
                )}
                <p className='mb-0'>{txt}</p>
            </div>
            </>
        )
    }
}