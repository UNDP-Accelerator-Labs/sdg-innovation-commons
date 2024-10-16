"use client";

interface BtnProps {
  key: integer;
  title: string;
  description: string;
}


export default function Button(_kwargs: BtnProps) {
	const { key, title, description } = _kwargs;

  return (
  	<div className='p-[60px] relative border-black' key={key}>
  		<h2>{title}</h2>
  		<p>{description}</p>
  	</div>
  );
}