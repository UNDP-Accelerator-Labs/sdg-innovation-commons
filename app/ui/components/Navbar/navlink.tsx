import Link from 'next/link';
import getSession  from '@/app/lib/session';

export const navItems = [
  { title: 'About Us', href: '/about' },
  { title: 'What We See', href: '/see' },
  { title: 'What We Test', href: '/test/all' },
  { title: 'What We Learn', href: '/learn/all' },
  { title: 'Next Practices for the SDGS', href: '/boards' },
];

const NavLink: React.FC = () => {
  return (
    <div className='mt-[20px] lg:mt-0 self-stretch flex flex-col items-start justify-start gap-1'>
      {navItems.map((item) => (
        <div key={item.title} className='self-stretch flex flex-row items-start justify-start'>
          <div className='flex-1 rounded-md overflow-hidden flex flex-row items-center justify-start py-[10px] lg:py-[20px] px-8 gap-2'>
            <div className='flex-1 flex flex-row items-center justify-start gap-3'>
              <Link href={item.href} className='relative leading-[26px] font-medium'>
                {item.title}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
    
  );
};

export const sess = async () => {
  const sess = await getSession(); 
  return sess;
}

export default NavLink;
