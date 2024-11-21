import Tablet from './tablet';
import Desktop from './desktop';

export default function Hero() {
	return (
		<>
		{/* Mobile */}
		{/*<div className="block lg:hidden">
			<NavBar session={session} />
		</div>*/}

		{/* Tablet */}
		<Tablet className='hidden md:block lg:hidden' />

		{/* Desktop */}
		<Desktop className='hidden lg:block' />
		</>
	);
}