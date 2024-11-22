import Mobile from './mobile';
import Desktop from './desktop';

export default function About() {
    return (
        <>
        {/* Mobile */}
        <Mobile className='xxl:hidden' />

        {/* Desktop */}
        <Desktop className='hidden xxl:block' />
        </>
    );
}