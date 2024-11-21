import Mobile from './mobile';
import Desktop from './desktop';

export default function About() {
    return (
        <>
        {/* Mobile */}
        <Mobile className='lg:hidden' />

        {/* Desktop */}
        <Desktop className='hidden lg:block' />
        </>
    );
}