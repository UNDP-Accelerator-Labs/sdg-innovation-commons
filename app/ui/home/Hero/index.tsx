import Mobile from './mobile';
import Desktop from './desktop';

export default function Hero() {
	return (
		<>
		{/* Tablet */}
		<Mobile className='lg:hidden' />

		{/* Desktop */}
		<Desktop className='hidden lg:block' />
		</>
	);
}