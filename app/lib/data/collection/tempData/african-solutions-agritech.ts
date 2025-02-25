export const collection = {
	id: 'african-solutions-agritech',
	title: 'Grassroots agricultural innovation in Africa',
	description: 'This collection looks at the dataset of grassroots innovation (also called "solutions") mapped by the Accelerator Labs on the African continent and related to food and agriculture. Its goal is to provide intelligence to UNDP\'s plans to incubate thousands of startups with the <a target="_blank" class="text-blue-500 cursor-pointer" href="https://www.undp.org/africa/projects/timbuktoo" > Timbuktoo initiative </a>.',
	creatorName: 'Alberto Cottica',
	mainImage: '/images/bg-as.jpg',	
	sections: [
		{
			items: [
				{
					type: 'txt', 
					txt: 'Research shows that most innovation is not created in corporate- or university labs. Rather, it is created by ordinary people trying to improve their lives, help their loved ones, or simply have fun. A <a target="_blank" class="text-blue-500 cursor-pointer"  href="https://www.undp.org/sites/g/files/zskgke326/files/2023-07/undp_informal_innovation_in_south_africa_final.pdf"> recent study </a>, co-authored by researchers at MIT and the UNDP Accelerator Labs, estimates one million grassroots innovators – 2.5% of the population – in South Africa alone.'
			},
				{ 
					type: 'txt', 
					txt: 'Scanning SDG Commons data can give a sense of what grassroots innovators are working on when it comes to inventing, developing, or adopting technology in support of agriculture and food systems in a broader sense. We started by selecting the solutions mapped on the 58 African countries (about 3,000); next, we used a Large Language Model to select those that aligned with the definition of "agritech" used by the Timbuktoo initiative. Finally, we went through about 120 of the solutions most closely aligned with that definition, and created several boards, each one gathering solutions that deployed a specific technological strategy, like "use sensors and actuators to reduce the consumption of scarce agricultural inputs, such as water" or "connect agricultural machines to solar panels to allow for a degree of mechanization even in rural areas where access to energy is problematic." More on the methodology can be found <a target="_blank" class="text-blue-500 cursor-pointer" href="https://github.com/UNDP-Accelerator-Labs/timbuktoo-hub-solutions/blob/main/README.md">here</a>.' 
				},
				{
					type: 'list',
					items: [
						'<b>Small-farm appropriate agricultural machines</b>. Most farms are small, but most machines for agriculture are conceived for large, industrial farms. A collection of simple, cheap machines that smallholder farmers can easily acquire and maintain. Solar pumps for irrigation in off-grid areas, pedal-powered cashew nuts peelers, olives presses, locally built and maintained electric mills, and more.',
						'<b>Advanced services to food systems</b>. Innovative services, often tailored for smallholder farmers. Market intelligence, logistics, e-commerce, and so on. Bringing them in line of sight of the farmers is about accelerating the adoption of innovation, rather than its generation.',
						'<b>Smart and precision agriculture</b>. Solutions that bring a smart component to farming in Africa: irrigation based on soil moisture, observation and monitoring with computer vision tech, and more.',
						'<b>Agro-ecology</b>. Solutions available to African farmers to grow crops and livestock in balance with nature. Insect protein as feedstock, paper production from grass instead of timber, organic methods to grow palms, and more.' ,
						'<b>Heirloom and local crops</b>. Solutions based on finding new uses and new markets for local/heirloom crops. Indigenous species are very well adapted to the local climate and soil characteristics, and often require less water, chemical fertilizers and pesticides. Blue chamomile in Morocco, energy drinks from baobab fruit in Zambia, drought-resistant cultivars in Niger, and more.'
						'<b>Food and produce conservation</b>. Renewable energy-powered dryers and traditional solutions for cooling provide affordable, sustainable alternatives to fossil-fuel based cold chains. Together with fertilizers production, cold chains are the main source of greenhouse gas emission in food systems.' 
					]
				},
			]
		},
	],
	highlights: [],
	boards: [
		509,
		510,
		512,
		514,
		511,
		528,
		529
	],
}