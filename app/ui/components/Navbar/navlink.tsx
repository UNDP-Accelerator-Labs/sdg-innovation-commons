import Link from 'next/link';

export const navItems = [
  { title: 'About', suffix: 'Us', href: '/about' },
  { prefix: 'What We', title: 'See', href: '/see' },
  { prefix: 'What We', title: 'Test', href: '/test/all' },
  { prefix: 'What We', title: 'Learn', href: '/learn/all' },
  { title: 'Next Practices', suffix: 'for the SDGS', href: '/boards' },
];

const NavLink: React.FC = () => {
  return (
    <div className='mt-[20px] lg:mt-0 self-stretch flex flex-col items-start justify-start gap-1'>
      {navItems.map((item) => (
        <div key={item.title} className='self-stretch flex flex-row items-start justify-start'>
          <div className='flex-1 rounded-md overflow-hidden flex flex-row items-center justify-start py-[10px] lg:py-[20px] px-8 gap-2'>
            <div className='flex-1 flex flex-row items-center justify-start gap-3'>
              <Link href={item.href} className='relative leading-[26px] font-medium'>
                {item.prefix} {item.title} {item.suffix}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
    
  );
};


export default NavLink;
