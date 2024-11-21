import { CardLink } from '@/app/ui/components/Link';

interface BtnProps {
  key: number;
  title: string;
  description: string;
  href?: string;
}


export default function Button(_kwargs: BtnProps) {
	const { key, title, description, href } = _kwargs;

  return (
  	<div className='px-[80px] py-[60px] relative flex flex-col justify-between border-black border-solid border-[1px] border-r-0' key={key}>
  		<div>
        <h3 className='slanted-bg blue capitalize'><span>{title}</span></h3>
  		  <p>{description}</p>
      </div>
      <CardLink
        href={href || '/'}
        className='self-end'
      />
  	</div>
  );
}