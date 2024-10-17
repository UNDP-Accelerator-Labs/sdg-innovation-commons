"use client";
import { CardLink } from '@/app/ui/components/Link';

interface BtnProps {
  key: integer;
  title: string;
  description: string;
  href?: string;
}


export default function Button(_kwargs: BtnProps) {
	const { key, title, description, href } = _kwargs;

  return (
  	<div className='px-[80px] py-[60px] relative border-black border-solid border-[1px] border-r-0' key={key}>
  		<h3 className='slanted-bg blue'><span>{title}</span></h3>
  		<p>{description}</p>
      <CardLink
        href={href || '/'}
      />
  	</div>
  );
}