import Button from './button'; // Button

export default function BlockBtns() {
	const btns = [
		{ title: 'What we see', description: 'Explore our notes on grassroots innovations and other solutions', href: '/see' },
		{ title: 'What we test', description: 'Discover our notes on the experiments where we learn what works and what doesn’t in sustainable development', href: '/test/experiment' },
		{ title: 'What we learn', description: 'Explore our curated collection of blogs and publications where we reflect what we learn from action', href: '/learn/blog' },
		{ title: 'Get inspired', description: 'Wicked challenges we are curious about', href: '/boards' },
	];

	return (
		<>
		<div className='grid gap-0 md:grid-cols-2 lg:grid-cols-4'>
			{btns.map((d, i) => {
				const { title, description, href } = d;
				const key = i;
				return (
					<Button key={i} title={title} description={description} href={href} />
				);
			})}
		</div> 
		</>
	);
}