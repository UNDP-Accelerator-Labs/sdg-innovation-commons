"use client";

import Button from './button'; // Button

export default function BlockBtns() {
	const btns = [
		{ title: 'What we test', description: 'Wicked challenges we are curious about' },
		{ title: 'What we test', description: 'Wicked challenges we are curious about' },
		{ title: 'What we test', description: 'Wicked challenges we are curious about' },
		{ title: 'What we test', description: 'Wicked challenges we are curious about' },
	]

	return (
		<>
		<div className='flex flex-row'>
			{btns.map((d, i) => {
				const { title, description } = d;
				const key = i;
				return (Button({ key, title, description }));
			})}
		</div> 
		</>
	);
}