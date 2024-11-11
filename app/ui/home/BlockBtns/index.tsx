"use client";

import Button from './button'; // Button

export default function BlockBtns() {
	const btns = [
		{ title: 'What we see', description: 'Wicked challenges we are curious about', href: '/see' },
		{ title: 'What we test', description: 'Wicked challenges we are curious about', href: '/test/experiment' },
		{ title: 'What we learn', description: 'Wicked challenges we are curious about', href: '/learn/blog' },
		{ title: 'Get inspired', description: 'Wicked challenges we are curious about', href: '/boards' },
	];

	return (
		<>
		<div className='flex flex-row'>
			{btns.map((d, i) => {
				// const { title, description, href } = d;
				const key = i;
				return (Button({ key, ...d }));
			})}
		</div> 
		</>
	);
}