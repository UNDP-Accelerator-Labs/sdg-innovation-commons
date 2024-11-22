import { CardLink } from '@/app/ui/components/Link';

interface Props {
  key: number;
  title: string;
  description: string;
  href?: string;
}


export default function Button({
  title,
  description,
  href,
}: Props) {
  return (
  	<div className='px-[40px] py-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] lg:py-[40px] mt-[-1px] relative flex flex-col justify-between border-black border-solid border-[1px] border-r-0'>
  		<div>
        <h3>
          <span className='slanted-bg blue capitalize'>
            <span>{title}</span>
          </span>
        </h3>
  		  <p>{description}</p>
      </div>
      <CardLink
        href={href || '/'}
        className='self-end'
      />
  	</div>
  );
}