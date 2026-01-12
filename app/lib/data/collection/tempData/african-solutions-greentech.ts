export const collection = {
	id: 'african-solutions-greentech',
	title: 'Grassroots green innovation in Africa',
	description: 'Research shows that most innovation is not made by companies or university, but by ordinary people trying to improve their lives, help their loved ones, or simply have fun. A <a target="_blank" class="text-blue-500 cursor-pointer"  href="https://www.undp.org/sites/g/files/zskgke326/files/2023-07/undp_informal_innovation_in_south_africa_final.pdf" > recent study </a> estimates one million grassroots innovators – 2.5% of the population – in South Africa alone. This collection looks at the dataset of solutions – related to the environment, climate and energy – mapped by the Accelerator Labs on the African continent. Its goal is to provide intelligence to UNDP\'s plans to incubate thousands of startups with the <a target="_blank" class="text-blue-500 cursor-pointer" href="https://www.undp.org/africa/projects/timbuktoo" > Timbuktoo initiative </a>. ',
	creatorName: 'Alberto Cottica',
	mainImage: '/images/bg-ags.jpg',	
	sections: [
		{
			items: [
			{ 
				type: 'txt', 
				txt: 'Research shows that most innovation is not created in corporate- or university labs. Rather, it is created by ordinary people trying to improve their lives, help their loved ones, or simply have fun. A <a target="_blank" class="text-blue-500 cursor-pointer"  href="https://www.undp.org/sites/g/files/zskgke326/files/2023-07/undp_informal_innovation_in_south_africa_final.pdf"> recent study </a>, co-authored by researchers at MIT and the UNDP Accelerator Labs, estimates one million grassroots innovators – 2.5% of the population – in South Africa alone.'
				},
				{
					type: 'txt', 
					txt: 'Scanning SDG Commons data can give a sense of what grassroots innovators are working on when it comes to inventing, developing, or adopting "green" technology that helps preserve the environment and a stable climate. We started by selecting the solutions mapped on the 58 African countries (about 3,000: while some solutions have been mapped in multiple locations, all of them have at least one location on the African continent); next, we used a Large Language Model to select those that aligned with the definition of "green/enercgy/climate tech" used by the Timbuktoo initiative. Finally, we went through 108 of the solutions most closely aligned with that definition, and created several boards. Each board gathers solutions that deployed a specific technological strategy, for example "develop affordable biodigesters to make use of the abundant organic waste and turn it into energy" or "connect machines to solar panels so that they can run even in remote locations where access to energy is limited". We next used various techniques to improve each board by removing false positives and finding  and adding false negatives. More on the methodology is available on the data analysis project\'s wiki <a target="_blank" class="text-blue-500 cursor-pointer" href="https://github.com/UNDP-Accelerator-Labs/timbuktoo-hub-solutions/wiki/Methods">here</a>. Some interactive data visualizations are accessible from <a target="_blank" class="text-blue-500 cursor-pointer" href="https://github.com/UNDP-Accelerator-Labs/timbuktoo-hub-solutions/wiki/Overview-and-visualizations">here</a>.' 
				},
				{
					type: 'txt', 
					txt: 'This process left us with a collection of 383 solutions close to Timbuktoo\'s description of green, energy, and climate tech. Many of these cluster into the five boards described below. The five boards can be interpreted as a list of the green technologies that African grassroots innovators believe to be both in demand and achievable. The relative size of the boards has no particular meaning, as it is influenced by the interests of the Accelerator Labs in Africa.' 
				},
				{
					type: 'list',
					items: [
						'<b>Green and clean energy</b>. These solutions answer to an unmet need for access to, saving of, and management of, energy in underserved communities. About half of them are aimed at production (often for immediate consumption by solar-powered machines– see below); the rest are mostly to save energy, with a few to transform it (for example alternators) or improve performance and safety.',
						'<b>Solar-powered machines</b>. "Connecting X to a solar panel" is a technological trope in Africa, where many communities have limited access to robust electric grids. Water pumps, egg incubators, heaters, coolers, respirators... even hearing aids.',
						'<b>Circular solutions</b>. Finding uses for the abundance of waste, especially plastics and organic or domestic waste.',
						'<b>Biodigesters</b>. In the quest for access to energy, African innovators are experimenting with biodigesters of various types, almost always tailored to the need of the individual household, or of a few households at most. These solutions are appreciated as they transform an environmental bad (pollution from organic waste) into an economic good (energy).',
						'<b>Clean and efficient cookers</b>. Firewood-powered cooking has long been known as a health hazard and a driver of deforestation. Many grassroots innovators in Africa are prototyping affordable, efficient, smokeless cookers.' ,
					]
				},
			]
		},
	],
	highlights: [],
	boards: [
		519,
		520,
		523,
		524,
		531,
		530
	],
}