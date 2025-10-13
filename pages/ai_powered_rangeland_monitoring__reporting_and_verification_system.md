# AI powered rangeland monitoring, reporting and verification system

[[focal_point:jargalan.batorgil@undp.org]]

[[year:2025]]

[[type:learningplan]]

[[datasources:Citizen data]]
[[datasources:citizen-generated data]]
[[datasources:co-designing]]
[[methods:Data Visualisation]]
[[methods:Citizen Science]]
[[methods:Artificial Intelligence/Machine Learning]]
[[methods:brainstorming]]
[[methods:data analysis]]
[[sdgs:13. Climate action]]
[[sdgs:15. Life on land]]
[[thematic_areas:green transition,]]
[[thematic_areas:Climate Finance]]
[[thematic_areas:Emissions Tracking]]
[[thematic_areas:Climate Innovation.]]
[[thematic_areas:agricultural data]]
[[thematic_areas:AI-Powered Solution]]
[[thematic_areas:land management]]
[[thematic_areas:carbo sequestration]]
[[country:Mongolia]]
[[latlng:46.8258060660322,103.05628666206529]]
## Title
****

> Please provide a name for your action learning plan.



AI powered rangeland monitoring, reporting and verification system
## Challenge statement
****

> Challenge type: If you are working on multiple challenges, please indicate if this is your "big bet" or "exploratory" challenge. 

Please note: we ask you to only submit a maximum of 3 challenges - 1x Big Bet, 2x Exploratory. Each challenge must be submitted individually.


> Challenge statement: What is your challenge? (Please answer in specific terms: "Our challenge is that...”.)



Our challenge is that lack an integrated, end-to-end system to seamlessly link locally collected ground-truth data with satellite-based remote sensing observations and transform that combined information into standardized, verifiable metrics for reporting carbon footprints and carbon sequestration.

> Background: What is the history of your challenge? What is causing or driving it? Who is involved? How does the current situation look like? What undesired effects does it produce?



Mongolia’s rangelands, which cover over 70% of the country and support its livestock-based economy, are increasingly degraded due to overgrazing, climate change, and unsustainable land use. This degradation threatens rural livelihoods, biodiversity, and national climate goals, particularly since livestock emissions comprise a major part of Mongolia’s GHG reduction commitments. Despite interest in green finance, the lack of credible, standardized data on rangeland health and carbon impacts hampers progress. Current data systems are centralized, slow, and costly, with limited integration of local knowledge. The challenge involves multiple stakeholders—herders, policymakers, and financial institutions—and produces undesired effects such as weak climate finance readiness, poor land management decisions, and limited access to voluntary carbon markets. In response, a national AI-powered, participatory MRV system is being developed to provide real-time, verifiable data to support sustainable land use, climate finance mobilization, and inclusive governance.

> Quantitative evidence: What (official) data sources do you have on this challenge that better exemplifies the importance and urgency of this frontier challenge? You can add text, a link, or a picture.



<div class="group">


> 

We have ground cover images and the python code that calculates green cover of the image


</div>



<div class="group">


> 


![Missing alt text](https://undp-accelerator-labs.github.io/Archive_SDG_Commons_2025_01/blobs/learningplans/7654d57825320b01d6a28771ef324cd0.png)



</div>


> Qualitative evidence: What weak signals have you recently spotted that characterizes its urgency? Please provide qualitative information that better exemplifies the importance and urgency of this frontier challenge. You can add text, a link, or a picture.



<div class="group">


> 

Depending on the peson taking photo samples the scales and quality of the images are different which makes the data analysis difficult to distinguish the different photo samples


</div>


> Value proposition: What added value or unique value proposition is your Accelerator Lab bringing to solving this challenge? Why is it your Lab that needs to work on this challenge and not other actors within UNDP, other stakeholders in the country respectively? Why is it worth investing resources to this challenge?



The Accelarator lab is developing random pixel sampling which is then linked to ML model. We are looking at different data analysis solutions which then later will be proposed to other national stakeholders to be introduced into the green loan. Currently the banking sector is not using such data analysis technologies. We believe once the models trained and the monitoring is continuously working Mongolia can have a solid information ground which will be tailored for other green labelled actions.

> Short “tweet” summary: We would like to tweet what you are working on, can you summarize your challenge in a maximum of 280 characters?



Bridging local ground-truth surveys and satellite data via ML-driven pixel sampling to deliver real-time, verifiable carbon footprint &amp; sequestration insights—unlocking data-backed green loans and carbon markets for Mongolia.
## Challenge classification
****
## Partners
****

> Who are your top 5 partners for this challenge? Please submit from MOST to LEAST important and state Name, Sector and a brief description of the (intended) collaboration.



<div class="group">


> Please state the name of the partner:



1. Ministry of Environment and Climate change

2. Ministry of Food, Agriculture and Light Industry

3. General Agency for Land Administration and Management, Geodesy, and Cartography

4. National Agency Meteorology and the Environmental Monitoring

5. Financial institutions


</div>



<div class="group">


> What sector does our partner belong to?



</div>



<div class="group">


> Please provide a brief description of the collaboration.



Data exchange and establishment of interoperable platform


</div>



<div class="group">


> Is this a new and unusual partner for UNDP?



</div>

## Learning questions
****

> Learning question: What is your learning question for this challenge? What do you need to know or understand to work on your challenge statement?



1. Which spectral indices (e.g. NDVI, EVI, MSAVI) and sensor bands correlate most strongly with plot-level biomass and soil carbon across Mongolia’s natural zones?

2. How do we translate raw reflectance at 10–30 m resolution into per-hectare carbon estimates that align with field measurements?

3. What model architectures (e.g. Random Forests vs. CNNs) offer the best trade-off between accuracy, interpretability, and compute cost for on-device inference?

4. What uncertainty-quantification framework (e.g. Monte Carlo, bootstrapping) meets UNFCCC/green-loan auditing standards for carbon reporting?

> To what stage(s) in the learning cycle does your learning question relate?


- Explore
- Test

> Usage of methods: Relating to your choice above, how will you use your methods &amp; tools for this learning question? What value do these add in answering your learning question?



We’ll integrate enriched photo metadata to normalize image inputs, apply random‐pixel sampling for unbiased calibration datasets, leverage drone/LiDAR and IoT sensor streams to train and validate ML models across scales and seasons, and use dashboard analytics to capture stakeholder feedback—all of which deliver robust, uncertainty‐quantified carbon estimates aligned with both field measurements and policy reporting needs.

> Existing data gaps: Relating to your choice above, what existing gaps in data or information do these new sources of data addressing? What value do these add in answering your learning question?



Enriched photo metadata and automated random‐pixel sampling bridge the consistency and representativeness gap between field images and 10–30 m satellite pixels, directly improving our calibration and standardization. Meanwhile, high-resolution drone/LiDAR, continuous multispectral time-series, IoT soil sensors, and dashboard analytics fill scale, temporal, and trust gaps—providing dynamic carbon flux data, robust uncertainty estimates, and stakeholder validation essential for a credible MRV platform.
## Closing
****

> Early leads to grow: Think about the possible grow phase for this challenge - who might benefit from your work on this challenge or who might be the champions in your country that you should inform or collaborate with early on to help you grow this challenge?



Key early champions include the Ministry of Environment and Tourism and the Development Bank of Mongolia, which can pilot integration of MRV outputs into national reporting and green‐loan products. Local herder cooperatives and NGOs like WWF-Mongolia will benefit directly from improved pasture management data and can drive grassroots adoption. Technical partners such as the Accelerator Lab and the Mongolian University of Life Sciences can provide R&amp;D support and validation capacity. Engaging UNDP Mongolia and the General Agency for Land Administration and Management, Geodesy, and Cartography will lend institutional credibility and facilitate scaling across government and donor programs.
