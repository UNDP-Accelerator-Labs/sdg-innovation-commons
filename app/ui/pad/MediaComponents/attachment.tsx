import { CardLink } from '@/app/ui/components/Link';

interface Props {
    item: any;
}

export default function Attachment({
	item,
}) {
	let { srcs, name, instruction } = item;
	if (name === 'consent') name = 'Consent to share form or official link';

	return (
		srcs.map((href: string, i: number) => {
			return (
				<>
				{!instruction ? null : (
                	<p className='font-space-mono text-[14px] leading-[20px] mb-[10px]'><b>{instruction}</b></p>
            	)}
				<div key={i} className='flex flex-row items-center mb-[40px]'>
					<CardLink
					    href={href}
					    openInNewTab={true}
					    className='!float-left mr-[20px]'
					/>
					<span>{name}.</span>
				</div>
				</>
			)
		})
	)
}