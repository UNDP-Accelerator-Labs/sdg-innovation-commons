# Monitoring of the drained bottom of the Aral Sea

[[type:publications]]

[[source:https://www.undp.org/uzbekistan/publications/monitoring-drained-bottom-aral-sea]]

[Original article published here](https://www.undp.org/uzbekistan/publications/monitoring-drained-bottom-aral-sea)


[[year:2021]]

[[date:2021-04-22T00:00:00.000Z]]

[[continent:Asia]]

[[country:Uzbekistan]]



United Nations Development Programme

Scientific-Information Center of the Interstate Coordination Water Commission of Central Asia

Joint UNDP and UNESCO Programme on

“Addressing the urgent human insecurities in the Aral Sea region
through promoting sustainable rural development”

Funded by the UN Multi-Partner Human Security Trust Fund for the
Aral Sea region (MPHSTF) in Uzbekistan

MONITORING
THE DRIED SEABED OF THE ARAL SEA

Edited by Doctor of Technical Sciences, Professor V. A. Dukhovny,
Doctor of Biological Sciences G. V. Stulina,
and Doctor of Agricultural Sciences Sh. M. Kenjabayev

Tashkent 2020

Contents

1 A brief overview of research work on the drained bottom of the Aral Sea
and similar projects
1.1. The experience of developing deserts

2 Description of the study area
2.1. The Aral Sea – modern dynamics and research
2.2. General description of the area
2.3. Climate
2.4. Geomorphological processes on the dried bottom of the Aral Sea
2.5. Geological and hydrogeological characteristics of the study area
2.5.1. Aquifer complexes
2.6. Soil

3 Afforestation to combat erosion – background and status
3.1. Review of the performed works
3.2. Conditions for forest growth in Central Asia and the role of afforestation
in the Aral Sea region

4 Research methods
4.1. The objectives and team of the research expeditions: Organization of work
4.2. Field research methods
4.2.1. Methodology of soil research
4.2.2. Vegetation study methodology
4.2.3. Hydrogeological research methodology
4.2.4. Environmental survey methodology

5 GIS and remote sensing as a basis for field surveys
5.1. Methods
5.2. Field survey preparation
5.3. Expedition routes
5.4. Satellite data pre-processing
5.5. The Unsupervised Classification Technique

6 Results
6.1. Hydrogeological studies results

12
16

19
19
27
29
35
36
37
39

43
43

48

51
51
58
58
58
58
59

61
61
62
68
71
75

78
78

6.1.1. Analysis and evaluation of study results
6.1.2. Conclusions
6.1.3. Recommendations
6.2. Soil cover of the studied area
6.2.1. Soil cover of the western part of the Aral Sea dried bottom
6.2.2 Soil cover of the eastern part of the dried bottom of the Aral Sea
6.2.3. Soil map
6.2.4. Conclusions
6.3. Vegetation cover
6.3.1. Recommendations
6.4. Ecological situation on the dried seabed
6.5. Study of forest vegetation cover
6.5.1. Organization of research
6.5.2. Study of forest cover and recommendations made from the expeditions’ results
6.5.3 Results of the new forest crops survey
6.5.4 General recommendations
6.5.5 Prospective measures to improve phyto- and forest-reclamation works
6.6. Landscape assessment with remote sensing
6.7. Assessment of land cover and soil erosion risks in the Aralkum
based on Earth Observation data
6.7.1. Background and purpose of this document
6.7.2. Research area
6.7.3. Goals
6.7.4. Data sets used
6.7.4.1. Ground control data
6.7.4.2. Satellite data
6.7.5. Methods
6.7.5.1. Pre-processing of ground control data
6.7.5.2. Satellite imagery pre-processing
6.7.5.3. Creating land cover maps
6.7.5.4. Creating environmental risk maps
6.7.5.5. Accuracy assessment
6.7.5.6. Assessment of land cover area
6.7.6. Results
6.7.6.1. Evaluation of the accuracy of the random forest classifier
6.7.6.2. Classification of land cover
6.7.6.3. Environmental risk maps
6.7.6.4. Summary of land cover changes and environmental hazards

79
91
92
93
93
114
124
129
129
148
163
174
174
174
182
182
188
190

199
199
199
200
201
201
201
206
206
207
210
212
212
213
213
213
213
218
218

6.7.7. Discussion
6.7.8. Recommendations and practical conclusions

7 Discussion
7.1. Changing the soil cover and its environmental hazards
7.2. Measures to reduce the negative effects of the desiccation of the Aral Sea

8 Conclusions
References

218
223

226
226
230

235
237

Authors

Scientific-Information Center of the ICWC

Prof. Viktor Dukhovny
Dr. Galina Stulina

Dr. Odilbek Eshchanov
Dr. Shavkat Kenjabaev
Sherzod Zaitov
Islom Ruziev
Klara Kurbanova

Chapters 1, 2.1, 6.5.2, 7.2, Conclusion
Chapters 2.2, 2.3, 2.6, 4, 6.2, 7.1, Conclusion, compiling
information for the book
Chapter 6.4
Chapters 5, 6.6
Chapters 5, 6.6
Preparation of GIS maps, Chapters 6.2, 7.1
Technical design

International Innovation Center of the Aral Sea Region under
the President of the Republic of Uzbekistan

Dr. Muratbay Ganiev
Kamal Idirisov

Chapters 3, 6.5
Chapter 6.2

Institute of Bioorganic Chemistry

Prof. Sanjar Sherimbetov
Sayora Abdirakhimova

Chapter 6.3
Chapter 6.3

Karakalpak Aral Hydrogeological Expedition “Hydroingeo”

Gaybullo Esenbaev

Chapters 2.4, 2.5, 6.1

Analytical center for the quality, composition and repository of soils of the State Cadastre
Inna Kojenkova
Malika Norkulova

Lab tests
Lab tests

MapTailor Geospatial Consulting, Germany
Chapter 6.7
Dr. Fabian Löw

The authors of the book, researchers of the Aral Sea and the Aral Sea region, express their sincere
gratitude to UNDP and the Ministry of Investment and Foreign Trade of the Republic of Uzbekistan
for their organizational and financial support.

Introduction:
Towards a new destiny of the Aral Sea

(Embodying the idea of President of Uzbekistan Sh. M. Mirziyoyev to transform the dried seabed
and the Aral Sea region into a zone of innovation and technology)

The tragedy of the Aral Sea is well known
throughout the world as an example of human-
kind’s destructive impact on nature. This has
been the position of thousands of environmen-
tal activists in reference to the Aral Sea in our
great country. Foreign critics of the Soviet state
were particularly hypocritical in their condem-
nation, not noticing that all over the world, and
notably in the Soviet state’s main opponent, the
United States, there are many examples of such
destruction: The Mono Lake, the Salt Lake, the
Colorado Delta and the Joaquin Delta.

The Aral Sea’s ten-fold reduction in volume
as the world’s fourth-largest freshwater reser-
voir and the resulting formation of a new des-
ert, the Aralkum, is a devastating example of
the rapid degradation of nature caused by un-
countable human activity to meet the needs of
the rapidly growing regional population. It took
only half a century to entirely eliminate a nor-
mal functioning body of water and for it to be
replaced by a newly developed natural forma-
tion. Ironically, both the former Aral Sea bed and
the Aral Sea region, forgotten and seemingly
abandoned, have not turned into a lifeless des-
ert. On the contrary, they have begun to form a
combination of remnants and wetlands provid-
ing a new wildlife environment for animals, birds
and salt tolerant drought-resistant tree species.
Subsequently, the area also turned out to be
a source of fossil fuel. The former boundless

water space was suddenly abundant numerous
exploration sites and liquid gold wells number-
ing over a hundred, attracting mining companies
of many countries who came as hunters for this
raw material. Previous to the arrival of the min-
ing companies, the remaining local residents
around the Aral Sea were engaged in fishing and
fur farming on the marine reservoirs. Livestock
breeders of camels and small cattle grazing on
pastures of the former shores of the sea trans-
formed the space. Herds of gazelles and kulans,
as well as wild boar and wolves, migrated along
the Amudarya River in the vicinity of the densely
populated Bukhara and Khorezm oases and the
semi-desert of northern Karakalpakstan, and the
hunters soon followed. More importantly scien-
tific researchers soon arrived and took their own
initiatives, perhaps insufficiently due to minimal
finances available at the time, but they took con-
trol of the processes taking place in this huge
transforming territory. Representatives of nature
protection, water management, hydrogeological
and dendrological organizations worked to-
gether with the researchers. Each expertise at-
tempted to help nature survive by drilling water
wells for pastures, creating a system of small
reservoirs and wetlands, and finally, by planting
drought-resistant plants. Saxaul groves, as well
as thickets of tamarix, halostachys and other
drought-resistant species appeared on the
drained seabed, transforming the desert.

7

From 2005 to 2011 a total of nine exhibitions
were conducted to the region. These included a
ground expedition survey organized by GTZ and
the Federal Ministry for Economic Cooperation
and Development (BMZ) together with SIC
ICWC. Their findings revealed that as of 2008,
240,000 hectares of trees planted by Karakalpak
forestry with donor assistance, but mainly at
budget expense, had survived. During this time,
it was evident that near and around a once dry
seabed were now two hundred thousand hect-
ares of self-overgrowing. Nature was protecting
itself!

However, until 2018, the focus of work in the
Aral Sea region had concentrated only on mining
and maintaining the inadequate local initiatives
of the surviving population. The locals of the
area, composed mostly of local Karakalpaks and
a few Russians, believed that a new era would
dawn.

This period came with the arrival of Shavkat
Miromonovich Mirziyoyev as the leader of the
Republic of Uzbekistan. During his time as
Prime Minister of Uzbekistan he had received
UN Secretary-General Ban Ki-moon in Muynak,
where he promised the population that the region
would be transformed. Later when he became
President, he did not forget his promises, and in
his first speech at the 72nd session of the United
Nations General Assembly on 19 September 2017
he said, “Overcoming the consequences of the
drying sea now requires a vigorous consolida-
tion of international efforts.” The effects of this
were soon apparent. Addressing the meeting of
the Heads of State in Turkmenbashi in August
2018, President of Uzbekistan Sh. Mirziyoyey
proposed his initiative to the founders of the
International Fund for Saving the Aral Sea to
declare the region a zone of environmental in-
novations and technologies. The government of
Uzbekistan and the UN agreed on a draft spe-
cial resolution of the UN General Assembly and
followed up with the President’s proposal. ‘The
Aral Region - Zone of Environmental Innovations

international conference held

and Technologies’ project was reviewed at the
high-level
in
Nukus on 25 October 2019. UN Secretary-General
António Guterres sent a video message to the
conference and noted that despite the loss of
the sea and numerous negative consequenc-
es for the livelihood and health of people, that
through the joint efforts of the Government of
Uzbekistan and the international community,
the situation can be improved. A very import-
ant step in the practical implementation of the
President’s initiative was the establishment of
the Multi-Partner Human Security Trust Fund for
the Aral Sea region (MPHSTF) during a special
high-level meeting held on 27 November 2018 at
the UN Headquarters in New York. The goals and
directions of the foundation aimed to catalyse
and strengthen multisectoral and people-cen-
tred responses to one of the largest man-made
disasters in the world, by being transformative,
needs-based, human rights-based and inclusive
in its purpose. The MPHSTF provides a coherent
strategy for coordinating aid flows and increas-
ing government leadership of the assistance
process to achieve sustainable results. The foun-
dation’s strategies address six clusters of inter-
related problems:

a) Environmental safety
b) Economic security
c) Food security
d) Health security
e) Social security
f)

Inefficiency of donor assistance

Along with this the Government of Uzbekistan
developed and approved on 16 November 2018,
by Resolution No. 965f, a roadmap for measures
to implement the President’s instructions. One
of the first activities under this programme was
the substantial development of measures on
the afforestation of the drained seabed to sus-
tain the landscape and as a new climate change
approach.

8

In 2018, the government of Uzbekistan
launched a large-scale tree-planting campaign
on the dried bottom of the Aral Sea to improve
the ecological and socio-economic situation in
the region. Significant numbers of both civilians
and military personnel were involved, making
it possible to cover an area of almost a million
hectares in two years. Planting was carried out
using airplane aerial seeding. Although the land-
scaping work was done mainly at the expense
of the national budget, some contribution was
made by UN organizations. Within the framework
of the joint project ‘Solving Urgent Problems
of Human Security in the Aral Sea Region by
Promoting Sustainable Rural Development’,
UNDP and UNESCO worked to strengthen the
technical and institutional capacity of the state
forestry body in Karakalpakstan. Special agricul-
tural equipment and mobile wagons provided
by UNDP and UNESCO were delivered to forestry
enterprises growing saxaul on the arid bottom
of the Aral Sea, and they were also used to cre-
ate nurseries for growing more seedlings and
further sowing in the surrounding area of the
regional forestry body.

In addition, the project aims to strengthen
evidence-based approaches and introduce in-
ternational practices of effective afforestation
methods.

In 2020, a series of trainings for 100 special-
ists of the Committee on Forestry were organized
within the project and the Ministry of Innovative
Development was actively involved in the road-
map’s realisation. On 16 October 2018, the
President of the Republic of Uzbekistan signed
Decree No. PP-3975 on the establishment of the
International Innovation Center for the Aral Sea
Region (IICAS). The main tasks and priorities of
the IICAS were defined as follows:
 Improvement of ecosystem and sustainable
livelihoods in the saline lands of the dried
seabed of the Aral Sea;

 Conducting work on cooperation with inter-

national organizations to develop and imple-
ment innovations and solutions to a variety
of problems in saline environments;
 Establishment of experimental fields for

trails;

 Identification, promotion and transfer of
innovative technologies and approaches,
including agroforestry, afforestation, aqua-
culture, bioenergy, crop diversification, inte-
grated cropping, animal husbandry, pasture
improvement, drought management and
mitigation, adaptation to climate change,
and;

 Development of public-private partnership in
the field of overcoming the consequences of
the drying up of the Aral Sea and the ecologi-
cal rehabilitation of the Aral Sea basin.

Funding from the UNDP Multi-Partner Trust
Fund, provided during 2019 and 2020, contribut-
ed to the great achievements made during the
initial stage of monitoring the drained seabed.
The decision of the government to resume the
monitoring work was made at the insistent re-
quest and justification by SIC ICWC back in 2015.
In 2017 a subsequent request was made and
included a specified source of funding, specif-
ically the Deutsche Gesellschaft für Technische
Zusammenarbeit
later the Deutsche
Gesellschaft für Internationale Zusammenarbeit
(GIZ). During the extensive negotiations between
the Government of the Republic of Uzbekistan
and the Ministry of Foreign Affairs of the Federal
Republic of Germany, monitoring did not take
place. However, under the initiative of President
Sh. Mirziyoyev and the establishment of the UN
Foundation, it was then possible to begin this
particularly important work.

(GTZ),

The monitoring of the dried seabed involved
a number of tasks that were determined by both
the new period of development work initiated
by the President and by an assessment of the
dynamic changes in natural conditions that had

9

occurred in this area since the last expedition in
2011. This list included:

seabed. (See the attached detailed cartographic
materials included in this publication.)

a) Determination of the conditions and the size

of the drained area;

b) Approximate classification of the landscape
on the newly drained area with the use of
satellite monitoring;

c) Assessment of the landscape, soils, hydro-

geological conditions, fauna and flora of the
whole dried area;

d) The state of vegetation, especially of artifi-

cial plantations;

e) Scale of desertification processes and

changes in landscape classes and risk zones
in comparison with the state of previous
monitoring of 2005-2011, and;

f) Development of recommendations to improve
the ecological condition and productive use
of the dried and developed territories.

The first two expeditions of this project were
conducted during two months of fieldwork, in
October 2019 and May-June 2020 respectively.
After eight months of field data processing, two
consecutive detailed research reports were pre-
pared covering an area of 1.2 million hectares of
2.7 million hectares of the completely drained

The conducted expeditions were a small part
of the large, complex measures implemented
under President Sh. Mirziyoyev’s initiative and
will serve as a compass for future development.

In recent years, thanks to the consolidation
of efforts of the government and international
institutions, large-scale construction has been
launched in the Aral Sea region, new jobs are
being created and infrastructure is being de-
veloped. The concept ‘The Aral Region - Zone of
Environmental Innovations and Technologies’
has been successfully prepared and is currently
at the final stage of approval.

The construction of a multi-million dollar
water supply complex for this area is nearing
completion, being one of the elements of the
renovation of the ancient South Aral Sea area.

The authors are confident that the work car-
ried out and the subsequent coverage of the en-
tire area of the drying seabed will provide a basis
for a programme of rational nature management
on the entire territory of the former seabed and
the Aral Sea area.

10

1

A brief overview of research work on
the drained bottom of the Aral Sea
and similar projects

The drought of 1974-1975 sharply affected
Central Asia, causing a depressed water inflow
into the Aral Sea. The situation alerted Soviet
scientists to the need for the sea’s future con-
servation, and consequently two commissions
on water supply were organized in the region. As
of 1974 the Commission of the State Committee
on Science and Technology was headed by ac-
ademician Gerasimov I.P. and in 1975 the USSR
Council of Ministers was chaired by the First
Deputy Chairman of the USSR State Construction
Committee, Borovoy K.K. The commissions were
faced with two problems, firstly how to meet the
water needs of Central Asia’s rapidly growing
population and economy, and secondly how to
preserve the Aral Sea.

Gerasimov I.P, as the head of the Institute of
Geography of the USSR Academy of Sciences, was
a pioneer in the development of scientific works
on the Aral Sea, and immediately organized ex-
peditions comprised of outstanding geographers
and environmental scientists. Kuznetsov N.T.,
Gorodetskaya M.E., and Kes A.I. (1980) were to clar-
ify the regime of water content and of the entire
basin. Gorodetskaya M.E. and Kes A.I. were respon-
sible for studying the economic and geographical
potential in the dynamics of the sea’s transforma-
tion (1986). Kurochkina L.Ya and Kuznetsova N.T.
were assigned to assess the ecological condition
of the sea and its conservation potential.

Somewhat later, Zaletaev V.S., Novikova N.M.
and Kuks V.I., of the same institute studied the
gradual drainage, the state of the seabed and
carried out mapping and zoning the territory of
the drained seabed as of 1990 (1992). In the same
year, Bortnik V.N., Kuksa V.I. and Tsitsyarin A.G.
published a forecast of the decline in sea level
up to 2015.

During this same time in 1980, scientists from
the Laboratory of Salt Water Hydrobiology of
the Institute of Zoology of the USSR Academy of
Sciences, Plotnikov I.S., Aladin N.V. and Filippov
A.A., began a long-term study of the sea’s chang-
ing fauna and flora. They observed the com-
plete disappearance of freshwater biota and the
transformation of the sea into a saline body of
water with a completely changed character of
animal life. To date, the institute continues its
research, now in freshwater and mainly in the
northern region of the Aral Sea, the so-called
Small (or Northern) Sea.

It should be noted that the work of the
Moscow Institute of Oceanology (Zavyalov P.S.)
on the study of the hydrology of the separated
reservoirs of the Aral Sea was started later. In
1965, the regularities of the formation of un-
derground waters of the lower reaches of the
Amudarya River were studied from the prospec-
tive of hydrogeological justification of irrigation
and drainage measures and their relationship

12

with surface waters and the Aral Sea. The report
and several maps (water table, depths of hy-
droisohypses deposition, groundwater surface,
schematic map of hydrogeological and recla-
mation zoning of the Amudarya River’s lower
reaches at 1:200,000 scale) were prepared. Since
1971, systematic research of bottom, coastal
(including a new dry area) and deltaic sedi-
ments were started by numerous research and
production organizations of Uzbekistan (RSU
- Reznikov S.A., Khrustalev Y.I., Vronsky V.A., GN
and AS USSR - Turovsky D.S., Institute of Geology
and Geophysics AS Uzbek SSR - Rubanov I.V.,
Ishniyazov D.P., Baskova M.A. and others).

In 1981, Rafikov A.A. and Tetyukhin G.F. pub-
lished the monograph ‘Decrease of the Aral Sea
Level and Changes in Natural Conditions of the
Amudarya Lower Reaches’ and described the rad-
ical transformation of geo-ecosystems and the
desertification of the Aral Sea region based on
field and camera work of the Aral Sea expedition
by the Geography Department of the AS of the
Uzbek SSR for the period of 1977-1979. The mono-
graph depicted symptoms of arid tendency in the
development of eco- and geo-systems, decrease
of groundwater levels, increase of their degree
of salinity, salt accumulation in the root layer of
soil, drainage of the lake-marsh and degradation
of riparian sites, strengthening of wind-erosion
processes, and the formation of aeolian forms of
landscapes. In 1982-1988, hydrogeological stud-
ies were carried out to substantiate the forecast
of changes in the hydrogeological conditions of
the area in connection with the lowering level
of the Aral Sea. The boundary conditions of
the artesian basin in the South Aral Sea region
(ABSA) were studied, including their quantitative
assessment, and new data were collected of the
geological structure and hydrogeological fea-
tures of the Aral-Kyzylkum rampart. The area of
groundwater discharge of the artesian basin in
the South Aral Sea region was studied to identify
the regularities of groundwater formation and to

calculate their current balance, in order to fore-
cast changes in hydrodynamic conditions.

The area of groundwater discharge of the ar-
tesian basin in the southern part of the Aral Sea
region was studied to identify the regularities
of groundwater formation and calculate their
current balance and enabled forecast changes
in hydrodynamic conditions. During these stud-
ies, a permanent hydrogeological model of the
ABSA was developed based on data obtained
and characterised from the ecological situation
of the dried bottom of the sea.

Since 1976, many teams in Uzbekistan have
been involved in research on the Aral Sea prob-
lem. Ishankulov M.S. and Vukhrer V.V. (Institute
of Botany, Academy of Sciences of the Uzbek
SSR) organized a detailed complex, ecological
research project on the sea’s eastern coast.
During the same period, large-scale soil studies
were carried out by the Institute of Soil Science
of the Academy of Sciences of the Uzbek SSR by
Prof. Sattarov D.S., Sektimenko V.E. and Popov
V.G. They summarized the results of their work
in the monograph ‘Condition of the Soil Cover
of the Aral Region in the Context of Draining the
Aral Sea’ published in 1993.

Comprehensive ecological, hydrogeological
and engineering geological surveys (research
and mapping) of 1:200,000 scale were conducted
in 1989-1999 for the dried part of the Aral Sea
bed and the adjacent territory within the limits
of the following index charts: K-40-V, VI, K-41-I
and L-40-XXXV, XXXVI, and L-41-XXXI. Within
those surveys, qualitative and quantitative char-
acteristics of modern geological processes were
developed, the intensity and direction of their
development were revealed, and centres of salt
and dust drift were mapped. The main hydrogeo-
logical parameters of aquifers and complexes,
pollution of soils, surface and ground water and
vegetation with toxic microelements and heavy
metals were also determined. The environmen-
tal and hydrogeological state of the territory was
assessed and a set of maps (1:200,000) and an

13

ecological-hydrogeological map of the dried bed
of the Aral Sea was drawn up.

and hydrogeological state of the territory was as-
sessed. A set of maps (1:50,000) was compiled.

At that time, the first calculations of the vol-
ume of salts removed from the drained bottom
of the Aral Sea and the negative consequences
to the ecology of the Aral Sea region were made.

From 1986 to 1992, the first geo-ecological
studies (1:50,000) were initiated on the left bank
of the Amudarya River between the Ustyurt
Plateau cliff and the old Amudarya River chan-
nel in the south and the Muynak Peninsula in the
north, known as the modern Aral Sea shoreline.
The current state of geological-hydrogeological
and environmental conditions, hydrochemical
and hydrodynamic conditions of groundwater of
the first aquifer from the ground surface, as well
as geomorphology, structure and structure of
marine deposits were studied. As a result of the
executed works, the following basic estimated
parameters have been studied:

 Depth of groundwater table and ground-

water heads;
Thickness of aquifers;


 Hydrogeological parameters, and;
 Water quality, and contaminants in soil
and groundwater affecting the environ-
ment.

Qualitative and quantitative characteristics of
modern geological processes were given, the in-
tensity and direction of their development were
revealed, and the allocation of salt and dust
drift were mapped. An ecological and hydrogeo-
logical map of the dried bed of the Aral Sea was
drawn up.

The first calculations of the volume of salts
carried out from the dried bottom of the Aral Sea
and their negative impact on the ecology of the
Aral Sea region were determined. The main hy-
drogeological parameters of aquifers and sites,
being the pollution of soils, surfaces, groundwa-
ter and vegetation with toxic microelements and
heavy metals, were identified. The environmental

In 1970-1980, in order to study the influence of
the Aral Sea’s drop in level and its influence on the
depth of the groundwater table and salinity in the
dried part of the Aral Sea, regional stream gauges
were established at Muynak, Akkala, Aral-Buzgul
and Sudochie-Adjibay. The gauges crossed all
geomorphological areas and man-made complex-
es to the zone of regional groundwater discharge
(South Aral Depression). However, the observation
stream gauges’ sites could not provide a consis-
tent area characteristic in the regional changes in
the dynamics of levels and chemical composition
of groundwater.

Ratkovsky S.P. made the first attempt to pro-
vide a typological characterisation of forest site
conditions and identified five groups of sand
types in Central Asia. However, Ratkovsky’s typo-
logical scheme does not reflect all types of forest
site conditions in the sand deserts of Central Asia
but is often the most widely referenced. Petrov
M.P. proposed a comprehensive classification
of sandy deserts by forest-steppe types, which
considers the ratio of the 10 most important hab-
itat factors. Studies of Kabulov S.K. (Changes in
Phytocenosis of Deserts under Aridization (the
Aral Sea region case), Tashkent, ‘Fan’, 1990) have
shown that in the process of aridization of dried
sea bays, a natural change of phytocoenosis takes
place, which is expressed in changes in species
composition, number and other bioparameters of
a valuable population. The leading factors of their
change are fluctuations in moisture and salinity
of soils. The fundamental works of academician
Babayev A.G. on consolidation of the Karakum
desert sands, specifically the method of sowing in
the strips formed by reed fences on moving sands,
had a great influence on afforestation measures
on the dried seabed.

The post-independence period for Uzbekistan
and Kazakhstan meant a period of sharp decline
in the work in the Aral Sea area due to the poor
interest and simultaneous worsening of the eco-

14

nomic potential of both republics. Nevertheless,
the decisions of the Central Asian governments
and the Board of the International Fund for Saving
the Aral Sea outlined measures to strengthen co-
operation on rational and economical water use
among the basin countries. The measures have
only been implemented partially and the decline
in sea level has continued at an accelerated rate
despite the forecasts and the Board’s decisions.
Construction of the first pioneer facility on the
dried seabed was carried out in 1995-1997. It was
undertaken in order to establish conditions for
sustainable water supply and the improvement of
Sudochie Lake conditions. However the develop-
ment of most pioneer facilities occurred mainly in
Kazakhstan and Uzbekistan, and was only partial-
ly completed.

In 2004, SIC ICWC prepared and submitted a
feasibility study with a budget of 90 million USD to
the Government of the Republic of Uzbekistan to
analyse the system on sustainable watering of the
entire Amudarya Delta by 2004. In order to save
money, the ‘Sredazgiprovodkhlopok’ project for
establishing small water reservoirs was presented
as an alternative option. Its implementation was
postponed for the next 15 years, destabilising the
water supply to the delta, and was resumed only
when Sh. Mirziyoyev came to power.

From 2000-2003, SIC ICWC carried out an eco-
nomic assessment of the socio-economic damage
of the Aral Sea on both the southern and northern
sides due to a sea level decrease and the produc-
tivity loss of the sea itself and the Aral Sea region.

The results were reflected in two mono-
graphs, including ‘Assessment of Socio-Economic
Consequences of Ecological Disaster - Drying up
of the Aral Sea’ (2001) and ‘Economic Assessment
of Local and Joint Measures to Reduce Socio-
Economic Damage in the Aral Sea Area’ (2004).

From 1991 to 2005 there were practically no se-
rious measures that would allow for the assess-
ment of landscape degradation and transforma-
tion of the natural and economic complex of the

Aral Sea and its region. In less than a few decades
the world’s fourth-largest freshwater body had
disappeared and turned into a desert, processes
that in other global contexts would have taken
centuries. It is a shame that these transforma-
tions have occurred amongst a civilised society
with an available scientific capacity, but due to the
challenges of their own survival, an oversight and
analysis of the rapid changes in nature and soci-
ety were missed opportunities. Simultaneously,
there were diverse surface modifications of the
dried seabed developing in both positive and
negative ways, and conditioned by natural chang-
es such as the moisture level due to precipitation
and groundwater, and by human activity.

As the leading research organization in the
Aral Sea basin, SIC ICWC could not ignore these
processes and constantly sought partners inter-
ested in this research. Therefore, the proposal
of GTZ on collaborative study was accepted with
understandable enthusiasm. German scientists
brought a new element to the project with their
use of remote-space methods of assessing land-
scape changes, which SIC ICWC had very limited
experience with and even less technical and fi-
nancial capabilities. As a result, SIC ICWC enthu-
siastically partnered with the German scientists
who conducted the remote assessment while SIC
ICWC undertook ground assessments. Between
2005 and 2011, nine expeditions were conducted
on the dried seabed, which made it possible to
create ground monitoring in parallel with satellite
observations.

Multidisciplinary specialists conducted unique
and complex research that identified the nature
and direction of changes in soils, hydrogeology,
landscape and soil formation features on the par-
ent rocks in the drainage zone. The degradation of
the newly formed landscape and the emergence
of ecological risk zones of desertification were
also studied. Particular attention was paid to the
development and condition of forest plantations
of drought-resistant tree species. It was discov-
ered that of all forest plantations in the bottom

15

of the sea totalling 338,800 hectares (according
to the Forestry Department of Karakalpakstan),
240,000 hectares or 70.8 percent were preserved
plantations. Remarkably the expeditions’ surveyed
territory revealed the existence of 233,000 hect-
ares of self-overgrowing area. During these works,
17 landscape classes were identified and the pros-
pects of their transformation from one classifica-

tion to another were determined. Based on these
results, the estimated degradation and erosion
risk areas were documented.

‘Comprehensive Remote and Surface Studies
of the drainage of the Aral Sea bed’ was a study
published by SIC ICWC in 2008 that contains a de-
tailed analysis of the sea dynamics based on both
literary sources and satellite images before 2007.

1.1. The experience of developing deserts

Throughout the world, deserts are multiply-
ing. The focus on ecological sustainability is
common among countries with arid climates,
and many undertake the same afforestation
measures with similar species as those of the
Aral Sea region. Typically afforestation is un-
dertaken by a majority of the population living
in these areas, as it creates the basis for the
development of pasture-based livestock, land-
scaping and improvement of climatic conditions,
and in particular the reduction of wind activity.
Examples of large-scale works in this direction
can be seen in Israel (Negev Desert), China (Gobi
Desert) and in Libya (Libyan Desert).

Israel is undoubtedly a pioneer in the devel-
opment of deserts. Since 1978, the Arava Desert
has been home to the renowned Sde Boqer
Desert Development Center, and Israel reached
significant achievements in the Negev Desert
where tens of thousands of hectares have been
reclaimed with the development of greenhouses.
Desert irrigation was initiated by the mandatory
development of infrastructure including roads,
communication lines and power lines (previous-
ly applied in the Arava Desert). The greenhous-
es use sewage water piped in from the Tel Aviv
wastewater treatment plants and saline ground-
water from the desert.

The ambitious projects in the Negev Desert
were launched in late 2014 after the Israeli gov-
ernment began work in providing renewable
energy. The Arava and Negev projects are locat-

ed adjacent to a solar complex and are approx-
imately 25 miles (40 kilometres) south of Be’er
Sheva. The projects include various technologies
and are managed by separate consortiums. The
first of these is a massive 121 MW thermal solar
power plant covering more than 988 hectares of
land, called Negev Energy. The power plant in-
cludes 28,000 tons of steel structures and about
500,000 parabolic mirrors that collect light to be
converted into energy. The plant plans to reduce
about 245,000 tons of carbon dioxide emissions
per year, the equivalent of removing 50,000 cars
from the road, and to provide “clean” energy to
as many as 60,000 households in Israel by 2020.
The second project is smaller. A concentrated
solar energy plant on 300-hectares includes a
massive 250-metre-high solar tower, the largest
such tower in the world, and is playfully dubbed
the “Tower of Power.” Costing an estimated
800 million USD, it includes a solar field with
more than 50,000 programme-controlled he-
liostat mirrors that concentrate sunlight on the
solar receiver’s steam generator.

The third project is a 35 MW solar plant based
on photovoltaic (PV) power, which uses solar
cells to generate electricity. The initiative had
an initial investment of about 100 million USD
and was named as a project of A Shalim Sol. A
fourth initiative, the Ramat Hanegev Wastewater
Treatment and Decontamination Plant, is part of
the government’s plan to support solar installa-
tions, which also includes strengthening the in-

16

frastructure surrounding the energy production
complexes. All this energy goes to serve Bedouin
settlements, and the irrigation is mostly used for
greenhouses. Thousands of hectares of citrus
fruits are grown in the desert zone in the north-
ern Negev with a unique irrigation system that
uses treated wastewater. Along with a green ap-
proach to producing renewable and solar energy
there are two other important components of
the projects, namely employment and tourism.
By hiring thousands of construction and main-
tenance workers (many from Bedouin commu-
nities of southern Israel), these initiatives con-
tribute greatly to local employment. The project
is also expected to boost regional development
by promoting ecological planning and tourism,
with its unique observation sites and boundless
fields of greenhouses.

The greenhouses are also used to supply
water to fish pools located under their awnings.
Moshav En Tamar introduced this closed-loop
system for breeding fish in salt water in the
desert. The procedure begins with a mechani-
cal aerator and silo with mixed fodder in each
pool, with water being directed to a mechanical
treatment through a micromesh, drum filter,
and finally to a large biological pond where the
water becomes highly enriched with nitrogen
compounds released by the life cycle of the in-
habiting fish. Due to the warm climate and sunny
days, microalgae, as well as simple algae, grow
quickly and “absorb” the pollution produced by
the fish. Herbivorous fish, such as silver carp, are
bred in large ponds to control the plant growth.
Such a system cannot be built in a climate zone
with poor sunlight since no water is poured out
of the system and water is added only to com-
pensate evaporation.

In 2009, in the Gobi Desert (Gansu Province
in North-west China) a programme was launched
to build greenhouses to grow cash crops of veg-
etables, mushrooms and grapes. Farming in the
Gobi Desert has its advantages, with plenty of
sunlight and substantial differences in tempera-

17

ture between day and night, which help the soil
to accumulate nutrients. The desert’s hot and
dry air significantly protects plants from pests
and crop diseases. The first 50 greenhouses,
built on approximately 800 hectares, have been
equipped with various types of high-tech sys-
tems and ecological methods.

The first 50 greenhouses are equipped with
various types of high-tech systems and ecolog-
ical methods. Remote control through smart-
phone applications is used extensively for no-till
cultivation, integrated water, fertiliser manage-
ment and cropping. The use of the Greenhouse
Manager App makes it possible to monitor the
greenhouses’ environment, temperature and
humidity in real time, through the adjustment of
a variety of sensors installed by this application.
One screen touch can open the insulating layer
on the roof, allowing fresh air to enter, while
the ecological methods of drip and spray irriga-
tion systems help to reduce water consumption
by nearly 50 percent, compared to traditional
farming. Substrates recycled from rotten leaves,
straw and livestock manure are also used.

China’s Kuzupchi Desert is 18,000 square kilo-
metres of golden dunes and barchans that wind
in a sandy arc from the northern part of the
Ordos Plateau in the Inner Mongolia Autonomous
Region, to south of the great bend of the Huang
He River. Over the centuries, climate change and
human activity stripped the land of any vegeta-
tion and left thousands of locals in desperate
poverty with no water supplies, no electricity,
no roads and no communications. In 1988, Wang
Wenbiao, a local resident and founder of Elion
Resources Group Corporation who was often re-
ferred to as the “King of the Desert”, initiated the
large-scale ecological project called the Kubuqi
Ecological and Restoration Project.

Annually, the project’s team plants trees on
about 34,000 hectares of land in the Kuzupchi
approximately
Desert,
6,000 square kilometres. Afforestation is still the
main method of combating desertification in the

currently

covering

Kuzupchi, but times have changed and afforesta-
tion must now also bring in financial benefits.
The agro-afforestation initiative in the Kuzupchi
Desert has already transformed into a high-tech
large-scale production chain and is considered
a main agricultural production site. The soil here
is “treated” with liquorice whose medicinal roots
have nitrogen fixation capacity that improves
soil fertility. Huge plantations of potatoes, au-
bergines, melons, tomatoes, watermelons, sun-
flowers, maize and even lavender generate prof-
its that benefit the local population.

The Chinese authorities plan to create a
“green belt” within six years to stop the desert-
ification of the Tengger Desert. According to the
Xinhua News Agency, which has published pho-
tos of the work that has begun, the belt will be
one kilometre in width and 500 kilometres in
length. The Tengger Desert is the fourth largest
desert in China, and it has several freshwater
lakes that partially slow the desertification of
the area. Planting of low maintenance plants re-

sistant to dry and hot conditions is also used to
stop desertification.

Trials currently underway in China allow sci-
entists to study the ability of mosses and li-
chens to control the spread of lifeless desert
soil and to identify if these plant species can
intensify agriculture on the Tengger Desert in
the Ningxia Hui Autonomous Region. The portal
http://agroxxi.ru has reported that “the new
method shows promising results in terms of sta-
bilizing the desert and helping to improve soil
fertility.”

The confidence of Sh. Mirziyoyev’s ideas of
turning the dried seabed into a zone of ecological
innovation are realistic, as similar innovations in
desert development have already been realised
in various countries. For instance, Jordan is using
Israeli technology, Qatar and Egypt are using the
Sahara technology developed and implemented
by Norway, and in the Libyan Desert the pivot
irrigation method is being applied.

18

2 Description of the study area

2.1. The Aral Sea – modern dynamics and research

As a closed, drainless water body, the Aral
Sea is precariously placed between the forma-
tion and interspersion zone of the basin and its
deltaic part. Humankind’s requirement for sus-
tained development has contributed to the sea’s
downfall, resulting in the degradation of the
delta and desertification.

This is typical not only for the Aral Sea, but
also for the Victoria and Chad lakes in Africa,
Urmia Lake in Iran and even for the Gulf of Mexico
where the water-abundant Colorado River once
flowed, and for the San Joaquin River Delta in the
Gulf of San Francisco in the United States.

Differences amongst these examples exist
since the bottoms of closed reservoirs are
drained and a desert is formed on the base of
continental bottom rocks. In the case of “sea de-
sertification”, the bottom remains under water,
but fauna disappears. Both of the aforemen-
tioned bays have nearly lost their fish popula-
tions due to the loss of fresh water, nutrients,
and the biota characteristic of the fresh-water
delta.

The changes in the characteristics of the Aral
Sea up to 2006 were described in SIC ICWC’s
previous publication of the results of the first
stage expeditions (Complex Remote Sensing

and Ground-Based Studies of the Dried Aral Sea
Bottom – 2008), as well as a number of other
studies devoted to the water regime and econo-
my of the Aral Sea region (Economic Assessment
of Local and Joint Measures to Reduce Social
and Environmental Damage in the Aral Sea Zone
– 2004). It should be noted that if during the first
10 years the sea level decrease was on average
20 centimetres per year (1 metre decrease per
5 years), then from 1975 to 1980, the sea level
had already fallen by 3.26 metres, being on aver-
age a reduction by 0.65 metres per year. Initially
the problem was not noticed until irrecoverable
losses appeared as the sea’s water quality dete-
riorated, freshwater fish disappeared, navigation
ceased and most importantly, the sea vanished,
leaving dead marine sediments behind.

In this paper, the desiccation of the Aral Sea is
considered in the context of the new land forma-
tion on the exposed seabed (Fig. 2).

The tragic dynamics of the sea’s disappear-
ance are illustrated without the ability to pre-
vent its further loss. Currently in Uzbekistan,
there is an increase of seasonal droughts due to
the negative impact of the drying process on the
climatic conditions of the region. The Aral Sea
catastrophe is exacerbated by the continental

19

Fig. 2. The Aral Sea

20

25 August 2000

15 August 2001

20 August 2002

12 August 2003

16 August 2004

12 August 2005

climate which increases the dryness and heat in
the summer and prolongs the cold and severe
winters.

To date, the water balance of the remaining
Aral reservoir is in an unbalanced state due to
the limited, and in some years, the lack of flow
of the Amudarya and Syrdarya rivers. As a result,
there has been a further drop in sea level, a re-
duction in its surface area and an increase in the
concentration of elements dissolved in it. Fig.
3 shows how the water bodies of the Aral Sea
have changed over the past 20 years. In 2007, the
southern Aral Sea split into eastern and west-
ern parts but remained loosely connected at

both ends. By 2009 after a severe drought, the
shallower eastern part had nearly disappeared.
From 2009 to 2018, water levels fluctuated annu-
ally depending on the water content of the year.
The existence of the Eastern Reservoir (it can no
longer be called a sea) is determined mainly by
the tributary of the Amudarya River. Data of var-
ious water levels collected from space from 2010
to 2019, have allowed for an assessment of the
actual dynamics of changes of the western and
eastern parts of the Aral Sea’s wetlands and the
open water surface1.

The monitoring data (Table 1) show that due
to the unstable water inflow, the water surface

1 http://www.cawater-info.net/aral/data/monitoring_amu.htm

21

15 August 2006

16 August 2007

18 August 2008

16 August 2009

26 August 2010

15 August 2011

19 August 2012

25 August 2013

19 August 2014

22

19 August 2015

21 August 2016

20 August 2017

21 August 2018

18 August 2019

20 August 2020

Fig. 3. Changes in the water bodies of the Aral Sea in August 2000-2018

area of the western and eastern parts of the Aral
Sea has changed dramatically over the years de-
pending on the water content of each given year.
By 2018 and 2019, compared to the high-water
years of 2010 and 2017, the water surface area
of the western part decreased from 380,000 to
265,000 hectares. There is a similar situation
in the eastern part where the area decreased
from 533,000 to 128,300 hectares in 2018 and to
16,700 hectares in June 2019.

The decrease in the water surface area has
meant the areas of wetlands have increased.
Compared to 2010, the area of wetlands in the
western part of the sea increased by 114,000 hect-

ares by 2019, and in the eastern part, the increase
amounted to 516,000 hectares.

Table 2 shows data on the total inflow to the
Aral Sea, while Fig. 4 shows the dynamics of
water supply to the Aral Sea and the deltas of
the Syrdarya and Amudarya rivers for 2011-2019.
Fig. 5 shows the dynamics of water discharge
into the Great Aral Sea in 2011-2019.

From the above data, it becomes clear that the
current situation of the Aral Sea is completely
dependent on the inflow through the Amudarya
River to the eastern and western reservoirs and
the inflow of releases from the smaller sea.
Simultaneously, when the western part of the

23

Comparison of open water surface areas and wetlands of the Aral Sea
(2010-2019) by thousand ha

t
s
u
g
u
A

0
1
0
2

t
s
u
g
u
A

1
1
0
2

t
s
u
g
u
A

2
1
0
2

t
s
u
g
u
A

3
1
0
2

t
s
u
g
u
A

4
1
0
2

t
s
u
g
u
A

5
1
0
2

t
s
u
g
u
A

6
1
0
2

t
s
u
g
u
A

7
1
0
2

r
e
b
m
e
v
o
N

8
1
0
2

e
n
u
J

9
1
0
2

Table 1.

Wetlands

182,34

165,86

161,25

224,78

186,99

264,55

265,54

283,15

293,0

296,5

Western part of the Aral Sea by thousand ha

Water
surface

379,59

396,08

369,66

360,69

337,52

315,78

295,81

278,2

268,4

264,81

Eastern part of the Aral Sea by thousand ha

Wetlands

964,14

1243,9

1214,53

1155,3

1019,59

1183,95

1340,79

1036,02

1353,0

1480,1

Water
surface

532,68

252,94

215,99

184,31

103,22

149,19

156,04

460,81

128,3

16,7

sea is at low water content, a constant decrease
in the water level continues, and it still retains
a depth of more than 20 metres. Mineralisation
is growing and has reached the current level of
130 g/l.

The shallow eastern reservoir is completely
dependent on wastewater and ranges from al-
most completely dry to a volume of 17 billion
m3 with a marked difference of almost 3 metres,
making the western and eastern reservoirs high-
ly saline with a salinity of 130 to 350 g/l.

The ongoing changes in the physical and
chemical regimes of the Aral Sea affect the cur-
rent state of its biological systems. It should be
noted that, despite the huge losses in the species
diversity of the biota suffered during the ecolog-
ical crisis, the modern biological communities
of the Aral Sea cannot be called dead or dying.
The sea has developed a very specific, but quite
an active ecosystem consisting of plankton and
benthos species that have managed to adapt
to the enormous salinity. Their total biomass is
significant. There are even attempts at commer-
cial extraction of the dominant representative of
the zooplankton of the Aral Sea, the gill-legged

crustacean Artemia. (The evolution of biological
communities determined primarily by changes
in the physical and chemical regimes of the sea
should be the focus of further research.)

A detailed data analysis of the dynamics of
changes to the sea’s drained bottom on the
Uzbekistan and Kazakhstan territories is given
in Fig. 6. Table 2 and Fig. 4 show how strongly
interrelated the sea’s drained bottom is with the
water supply.

Water supply significantly changes the east-
ern reservoir’s water surface area as it is com-
pletely dependent on the discharge water and
directly affects the area of the drained bottom of
the Great Aral Sea. The water entering the east-
ern part is partially accumulated in this reservoir,
partially enters the western part, and is partially
lost due to evaporation and filtration. The east-
ern part is characterised by an increase in the
water surface area with a total inflow to the sea
of more than 8 km3 per year. With an inflow less
than 6 km3 per year, the water surface area of
the sea decreases (at present, the water surface
level is 26.3 metres). This was clearly seen when
in 2017 the total volume of water discharged into

24

Total inflow to the Aral Sea, million m3

Table 2.

The Northern Aral Sea

The Southern Aral Sea Region

Total water supply
to the Small Aral
Sea via the Syrdarya
River, hydrological
post (h/p)
Karateren

Including the
discharge from
the Small Aral Sea
to the Great Aral
Sea

Total water supply to
the Amudarya River
delta, Samanbai h/p,
taking into account
the discharge of
the collector and
drainage network
(CDN)

Including the
discharge from
the Amudarya
River delta into
the Great Aral Sea

Total volume
of water
discharged
into the Great
Aral Sea

4636

4588

4444

5127

4545

4332

7906

3009

3697

3462

2004

2424

2570

2440

2816

6661

3310

830

1933

10679

3388

4270

8685

4106

11583

1715

4037

1041

3533

2126

520

4522

1874

6057

846

1217

4503

5537

4550

3090

6962

4690

12748

4156

2047

Years

2011

2012

2013

2014

2015

2016

2017

2018

2019

the Greater Aral Sea was 12.7 km3 (Table 2) and
the area tripled accordingly – from 156,040 to
460,810 hectares (Table 1).

The western part is characterised by a trend
of decreasing water levels (currently, the water
surface level is 24.7 metres) and water surface
area, which presents different intensities of fall-
ing depending on the inflow of water to the sea
and water availability in the eastern part (level
difference between the eastern and western
parts).

As can be seen, the main consequences of
the drying up of the Aral Sea, in addition to the
decrease in water volume and water surface,
were manifested in the formation of a huge salt
desert on more than 5.5 million hectares which
replaced the dried seabed.

Since the last SIC ICWC expedition in 2011,
the area of the drained bottom of the Aral Sea
has increased from 4.611 million to 4.998 million
hectares. As such, the drained bottom has in-
creased by 0.386 million hectares.

The organization management of this com-
plex human-natural system is a major issue of
the continuing monitoring of the drained bottom
of the Great Aral Sea in Uzbekistan’s territory.
The drained bottom is a unique laboratory of na-
ture. The origin, development and replacement
of some formations by others, or their combi-
nation, reflects the evolution of the landscapes
themselves and depends primarily on provincial
or local features of the dried seabed, the com-
position of bottom sediments, their salinity, the
depth of occurrence and groundwater salinity.

25

14000

12000

10000

8000

6000

4000

2000

0

10679

11583

8685

7906

4636

4588

4444

5127

4545

4270

4332

4106

4037

3388

1933

3009

3697

1715

3

m
n
o
i
l
l
i

m

,
e
g
r
a
h
c
s
i
d
r
e
t
a
w

f
o
e
m
u
l
o
v
l
a
t
o
T

2011

2012

2013

2014

2015

2016

2017

2018

2019

Syrdarya

Amudarya

Fig. 4. Dynamics of the water supply to the Syrdarya and Amudarya rivers’ deltas for 2011-2019, million m3

14000

12000

10000

8000

6000

5537

4503

4550

4522

4690

6962

6661

6087

4000

3462

3533

2004

1041

2000

0

2424

2126

2570

3090

2440

2816

1874

520

12748

4156

3310

2047

846

1217

830

2011

2012

2013

2014

2015

2016

2017

2018

2019

Water discharge from the Small Aral Sea

Water discharge from the South Aral

Total water discharge

Fig. 5. Dynamics of water discharge into the Great Aral Sea in 2011-2019, million m3

26

Years

The total area of the
drained bottom of the
Great
Aral Sea (km2)

2005

2006

2007

2008

2009

2010

2011

2012

2013

2014

2015

2016

2017

2018

2019

37661,5

41028,6

40562,5

44666,6

46232,5

42955,7

46112,7

46971,5

47349,3

48950,1

48063,9

48645,5

44747,2

48018,1

49981,6

Fig. 6. Dynamics of changes of the drained bottom of the Great Aral Sea (excluding the Northern Aral Sea)
from 2005-2019

2.2. General description of the area

The hypothesis about the area’s prehistor-
ic period is based on the geological works of
Russian researchers of the late 19th and early
20th centuries. They confirmed that in the Post-
Pleocene epoch, the Great Aral Sea flooded a
portion of the Karakum Desert between the chink
of Ustyurt in the north, the mouths of Murgab
and Tejen in the south and the foot of Kopetdag
in the west. The eastern part of the connected
Aral-Caspian Sea had, in their opinion, the chink
of the Unguzov coastline as the border of the
former Karakum Gulf. This united sea covered a
wide strip of the modern Caspian region up to
the bottom of the western spurs of the Kopetdag.
At that time, the Aral part flooded the entire
Sarykamysh depression and formed a bay up

to Pitnyak, which is now occupied by the mod-
ern Amudarya River delta and the Khiva Oasis.
The Uzboy was a channel connecting both these
water areas, but apparently, its present shape
with large gradients was formed as the Caspian
Sea separated from the Aral Sea and the differ-
ence in their water surface elevations increased.
During the subsequent geological period to the
present day, the united Aral-Caspian basin was
divided into its constituent parts and gradually
was reduced to its present size. First there was
a watershed between the Aral-Sarykamysh and
the Caspian Sea, then the Uzboy channel grad-
ually formed. From the geological point of view,
the absolute age of the sea is 139±12,000 years.
In the Neogene period, powerful tectonic move-

27

ments in Central Asia formed three deep depres-
sions in the center of the Turan Plain, specifically
the Aral, Khorezm, and Sarykamysh. During the
Early and Middle Pleistocene, all of these de-
pressions developed in subaerial conditions.

The current SIC ICWC expeditions include
an invited dendrologist from the International
Innovation Center for the Aral Sea basin under
the President of the Republic of Uzbekistan.
The aim of the expeditions was to resume the

Fig. 7. The Uzbek part of the Aralkum (the territory within the Aral Sea coastline), 1960. Two polygons of
the study area are shown. An image from the Landsat 8 satellite taken in October 2019 is shown in the
background.

28

monitoring of the dried seabed in the territory
of Uzbekistan, which had been started earlier
in 2005-2011. Unfortunately, observations were
interrupted until the second half of 2019 due
to lack of the necessary funding. The total area
of the sea within Uzbekistan for this project is
3,086,176.08 hectares, of which the current drain-
age area is 2,879,192 hectares.

The work area, located in the northern zone
of the Turan plate, is enclosed between the
geographic coordinates 430331-440201 NL and
590201 and 600251 EA, and is a flat or slightly
wavy plain with a general slope to the north/
north-west. The newly formed aeolian high plain
occupies a significant area of recent sand dunes.

The research was carried out on two sites.
The first is located at the Amudarya River’s
left-bank from the eastern chink of the Ustyurt
plateau to the Amudarya River (Ustyurt Aral
Basin) and the Amudarya River’s right-bank
to the Kokdarya channel to the north-western
edge of the Kyzylkum (South Aral Basin). In the
south, the work area of the first site is limited
by the territory of Muynak city and the sea line
(1960), as well as the Kazakhdarya channel. In
the north it is impassable because of the dried
dunes and solonchaks of the dried bottom of
the Aral Sea, and the Djiltyrbas Lake in the east.
The second section is from the Djiltyrbas Lake to

the Kokdarya channel on the eastern border, in
the south - collectors KC-3 and Karauzyak. In the
north, there are also impassable solonchaks of
the dried Aral Sea bed.

The main settlements in the work area con-
nected with Nukus by roads are the cities of
Kungrad, Muynak, Takhtakupyr, and the villages
of Shagyrlyk, Aral, Kazakhdarya, Chimbay and
Karauzyak.

The predominant part of the population,
made up of Karakalpaks, Uzbeks, and Kazakhs, is
concentrated in the zone of irrigated agriculture.
In the drainage zone, the bulk of the population
is engaged in cattle-breeding, fishing and less
frequently in agrarian farming.

Over the past 15 years, commercial companies
from China, Korea and Malaysia have carried out
large exploration activities on the dried seabed
to find and develop oil fields. Today there are
45 exploration and production wells of various
countries on the former seabed and a large soda
factory has been built near Kungrad.

Based on a number of government decisions,
significant work on developing Muynak city and
streamlining the Amudarya River delta has been
undertaken. This has helped to stop migration
from the Aral Sea region and an active popula-
tion has emerged.

2.3. Climate

The study area is located in the northern part
of the arid belt of subtropical latitudes of the
northern hemisphere, which affects the over-
all dry climate, manifested in the absence of
precipitation in the long summer period and
sharp continental conditions with typically high
amplitudes.

The territory of the region is open to the inva-
sion of various air masses, causing sharp changes
in the weather. The peculiarities of atmospheric
circulation are the main reason for the high nat-

ural variability of the climate. In addition, this
variability is affected by various anthropogenic
impacts, a significant one being the reduction of
the Aral Sea.

Analysis of maximum temperature changes
has also shown the presence of upward trends
in most months. It is interesting to note that in
summer and autumn, the tendency to higher
minimum temperatures is more significant than
to maximum temperatures, and in summer, a de-
crease in maximum temperatures was recorded

29

at a sufficiently large number of stations. In the
segment of changes in minimum temperatures
(November), the climatic contribution to the dry-
ing of the Aral Sea can be traced. This contribu-
tion is expressed in smaller trends towards an
increase in minimum temperatures in the Aral
Sea region. This is a consequence of the arid-
ization effect (a decrease in humidity in the sea
retreat zone), which causes an increase in the
daily amplitude of air temperature (Muminov F.
A., Inagamova S. I., 1995). This example indicates
that the impact of sea retreat on the micro-
climate of the area in some months is already
manifested in changes in climatic norms.

High air temperature and low precipitation
determine high evapotranspiration values of up
to 1,900-2,000 millimetres/year, many times (17-
30) greater than the total sum of precipitation.

Below is a description of the climate according
to data from meteorological stations in Kungrad,
Nukus and Chimbay:

Winter in the study area is moderately cold,
with little snow and mostly cloudy weather.
Persistent frosts begin in mid-December and in
the coldest month, January, the air temperature
reaches -2.4 °C to -9.60 °C during the day, from
-10 oC to -20 °C at night, while the maximum air
temperature reaches -22 °C to -28 °C. Severe
frosts come with the arrival of the Siberian an-
ticyclone and can last 3-4 months (for instance:
1968-1969, 1993-1994). Precipitation in winter is
mainly in the form of snow, however the thick-
ness of the snow cover is usually no more than
5-8 centimetres. The relative humidity is approx-
imately 55-80 percent.

Spring (March-May) is characterised by un-
stable weather, cloudy, windy weather with
maximum precipitation. Air temperature during
the day is 4 °C to -15 °C. Precipitation is in the
form of short but heavy rains in the range of 9.0-
37.4 millimetres. Relative humidity is about 26-65
percent.

Fig. 8. Meteorological station on Lazarev Island, expedition photo, 2006

30

Fig. 9. Meteorological station on the dried-up bottom of the Aral Sea

Summer (June-September) is dry and hot.
Daytime temperatures range from +27 °C to
+30.4 °C, with maximum temperatures of 40 °C
to 45 °C and night-time temperatures of 10 °C
to 23 °C. Precipitation is in the form of short but
heavy rains in the range of 0.6-6.7 millimetres.
Relative humidity is about 25-48 percent. In the
second half of June, due to intensive warming
of air and ground surface, a thermal depres-
sion begins and reaches its greatest values in
July-August.

Autumn (October-November) is dry and most-
ly clear. Temperatures range from 6.5 °C to 20 °C
during the day and from 5.5 °C to -5.4 °C at night.

Night frosts begin in late October. Precipitation
is in the form of rain and snow. Winds throughout
the year are predominantly north-easterly and
easterly. The prevailing wind speed is 4-6 m/s.
Strong winds of 15-22 m/s are rare and occur
mostly in the autumn-winter period. The amount
of atmospheric precipitation varies from 4.0 to
41.3 millimetres.

The two meteorological stations

located
closest to the sea and the dried seabed are
‘Aktumsuk’ and ‘Lazarevo’. Table 3 shows data on
the Aktumsuk meteorological station. The mete-
orological station on Lazarev Island finished its
operation in 1987 (Fig. 8). The two stations were

31

Table 3.

Average long-term meteorological information according to the data of the Aktumsuk
meteorological station for the period 2000-2018

Parameters

Average month
air temperature,
оС

Absolute
minimum air
temperature, oC
/ year

Absolute
maximum air
temperature, oC
/ year

Average monthly
precipitation,
mm

Average wind
speed for a
month, m / s

I

II

III

IV

V

VI

VII

VIII

IX

X

XI

XII

Год

Month

-8.1

-7.3

1.7

11.1

19.3

25.0

27.2

25.7

18.1

9.1

1.5

-4.8

9.9

-35.7
/2006

-34.1
/2014

-25.3
/2011

-11.5
/2005

0.8
/2018

0.1
/2018

7.1
/2014

5.7
/2015

-4.4
/2017

-15.7
/2014

-21.5
/2016

-28.3
/2012

-35.7
/2006

10.0
/2007

13.1
/2016

25.5
/2001

32.6
/2000

37.1
/2014

40.9
/2014

43.4
/2017

43.0
/2006

40.0
/2017

29.0
/2006

28.0
/2006

22.0
/2006

43.4
/2017

4.2

4.5

11.0

9.2

6.0

3.5

3.1

2.4

1.5

4.3

6.6

6.4

62.7

3.9

4.0

3.8

3.5

3.4

3.4

2.9

2.7

2.7

2.8

3.1

3.6

3.3

Average frequency of wind directions by 8 points, %

N

10

NE

18

E

28

SE

8

S

7

SW

5

W

20

NW

4

installed on the dried seabed in the “zero” area
and on the coast of the East Sea by the Chinese
Academy of Sciences (Fig. 9).

Comprehensive work with a series of obser-
vations has been carried out at the stations
since 1931 and show the effect of anthropogenic
influences in the Aral Sea basin on the moisture
regime. Six stations were selected and their
initial data were released (Spectorman T.Yu.,
Nikulina S.P., 2002). Nukus covers the irrigated
lower reaches of the Amudarya River. The Tamdy
station reports on the central Kyzylkum, while
Tashkent follows the foothill zone in an area with
the strongest influence of urbanisation. Jizzakh,

on the Golodnaya Steppe, is an area where there
has been an intensive increase of irrigated land
in recent decades. Chimbay and Muynak charac-
terise the conditions of the Aral Sea, and Muynak
is a former coastal station.

The project considered the change in mois-
ture deficit as a very climate-sensitive indicator
of drought. In the absence of local anthropogen-
ic impacts, this indicator captures the trends of
increasing aridity in the autumn-summer sea-
son. Fig. 10 shows the graphs of changes in the
average humidity deficits for the autumn season
at the selected stations.

32

Fig. 10. Changes in the average moisture deficit for the autumn season at some stations

Even though the Nukus station is located
near irrigated massifs, the trends of humidity
deficit changes are similar to those observed at
the Tamdy desert station. There are no trends
in the winter and spring months, but there are
trends of deficit increase in summer and fall. At
the Tashkent station, trends of humidity defi-
cit growth are traced practically in all seasons,
and the Jizzakh station records anthropogenic
decrease of humidity deficit (Spektorman T.Y.,
2002).

In the Aral Sea region, the trends of humidity
deficit change are practically unambiguous with
coastline retreat. An increase in humidity defi-

cit in all seasons of the year and an increase in
the range of fluctuations are fixed. Even visual-
ly, a violation of the uniformity of observation
series related to the regression of the Aral Sea
is noticeable. Anthropogenic impact on climate,
both at a global level (increased concentration
of greenhouse gases in the atmosphere) and at
a local level (urbanisation, increased irrigated
areas, creation of reservoirs and irrigation-dis-
charge lakes, and the shrinking of the Aral Sea),
make it difficult to identify the global warming
signal and increase the uncertainty of climate
scenarios in the Aral Sea region.

33

Fig. 11. The scenario of changes in the average annual temperature in the Aral Sea region according to the
REMO model

Fig. 12. Scenario of evapotranspiration change (ETo) in the Aral Sea region according to the REMO model

Modern developed models of general atmo-
spheric circulation and regional models built
on this basis allow for generating scenarios of
climate change. The REMO model (D. Jacob & R.
Podzun, 1997) of the Potsdam Earth Institute is
used to estimate the climatic parameters of the
Aral Sea region until 2050. So far, trends found in
the analysis of the results show (Figs. 11 and 12)

an increase in annual temperature and potential
evapotranspiration in the future under condi-
tions of further sea drying. In the conditions of
the Aral Sea region and the dried bottom of the
Aral Sea, this indicates increasing aridization of
the climate, as well as growing desertification
processes and increasing environmental risks.

34

2.4. Geomorphological processes on the dried bottom
of the Aral Sea

The area of works extends to the northern
zone of the Turan plate. It includes the eastern
part of the Ustyurt Plateau to the old channel
of the Amudarya (Akdarya) in the east, the dried
bottom of the Aral Sea and Sudochie Lake in
the north, and the Muynak and Shegakul polder
zone in the south.

The work area is a flat or slightly wavy plain

with a general slope to the north/north-west.

A characteristic feature of the relief is the al-
luvial delta plain of the Amudarya River, which
occupies a large area. The surface of the plain
descends very flat to the north towards the Aral
Sea. Absolute heights of the Amudarya alluvial
delta plain vary from 70 metres in the south-east-
ern part of the former Muynak Peninsula to 25-30
metres in the north-east and north-west. In the
coastal zone, the Aral Sea forms levelled saline
surfaces at 50-40 metres. Takyrs are widely dis-
tributed in the north-eastern part of the alluvial
delta plain of the Amudarya. The aeolian newly
formed upland plain occupies a significant area
of the modern desert.

The relief is ridge-like and the ridges have a
submeridional orientation and are usually traced
at a distance of 0.2 to 1-2 kilometres. The largest
modern ridges reach a height of 3-5 metres with
a width of 0.1-0.3 kilometres. The main ridges
are 1-3 kilometres apart, covered with sandy and
sandy-clay loam and loam solonchaks extending
to Muynak elevation, meadow, swamp-meadow
and marshy soils in the Amudarya Delta plain.

The former Muynak Peninsula has the shape
of a sickle, with its convex side facing to the
north-east.

The heights of its surface vary from 58 me-
tres on the coast to 86 metres in the central
part. The northern side faces the severe Surgil
Lagoon, and the salt marsh of the same name,

is relatively flat. The Surgil Lagoon (now solon-
chak), is separated from the modern small sea
and is a classic coastal bar known as “Tigroviy
Hvost” (Tiger’s Tail). The lagoon stretches for
more than 50 kilometres. In the south it is over-
grown with kandym, tamarix and saxaul, and
has been perfectly preserved after the sea’s
regression. The dried seabed, which has re-
treated by 60,100 kilometres over the decades,
has become the world’s youngest saline desert,
the ‘Aralkum’. It is a grey, uniform and highly
saline sea plain with a very slight (0.000256)
slope to the north. A large area is complete-
ly devoid of shrubbery and covered only with
dry saltwort, and in the recently emerged
dried spaces, not even saltwort grows. Sandy
loam and loam are covered with a salt-gypsum
crust with numerous plugs and swelling ridges
and white thenardite dry hydrate. The former
sandy beaches are now intensively winnowed
and have become massifs of mobile or partial-
ly fixed kandym and saxaul hummocky-dune
sand with a height of 1-3 metres. An extensive,
meridionally elongated massif of mobile sands
is located to the north of the former Muynak
Peninsula. It is confined to a former underwa-
ter shoal, bordered by a horizontal line of 30
metres.

The area of the second expedition belongs
to the middle zone of the Turan Plate and cov-
ers the areas of the Amudarya River delta, the
north-western outskirts of the sandy Kyzylkum
Desert, to the eastern chink of the Ustyurt pla-
teau. It is a flat or slightly wavy plain with a gen-
eral slope to the north/north-west.

A characteristic feature of the relief is the
presence of numerous residual elevations
(Kyzyljar, Kushkanatau, Beltau, etc.) and drain-
(Ulken Karasor, Balykbay,
less depressions
Kokchatengiz, Karateren, Dautkul, etc.) with a

35

difference in elevations of 20-40 metres relative
to the plain. In the southern and south-eastern
parts of the study area are low mountain ranges
of Sultanuzdag, Kokcha, Buzgul, and others.

The alluvial delta plain of the Amudarya
River occupies a significant territory (more than
44,000 km2) from the Tuyamuyun gorge to the
Aral Sea, a length of about 400 kilometres. Its
width compared to the Sarykamysh depression
and the Aral Sea (according to V.V. Akulov, 1959)
is 320 kilometres.

The surface of the plain is very flat on one side
towards the Aral Sea, and westward towards the
Sarykamysh it is a depression. Absolute height
of the alluvial delta plain of the Amudarya River
varies from 100 metres in the south/south-east-
ern part of it, to 35-55 metres in the north and
north-west. In the coastal strip of the Aral Sea

leaves aligned solonchak surfaces at elevations
of 45-35 metres.

Takyrs are widespread in the north-eastern
part of the Amudarya’s alluvial delta plain of
the total area of which measures approximate-
ly 1,500 km2. The flatness of the territory is
disturbed by active watercourses, and uplands
formed by Neogene and older rocks. The Aeolian
upland plain occupies a significant area of the
Kyzylkum part of Karakalpakstan.

Its surface declines gently to the north to-
wards the Aral Sea. The relief is ridge-like, has
a submeridional orientation, and is usually lo-
cated at a distance of 3-4 kilometres. The largest
ridges reach a height of 6-8.0 metres and a width
of up to 0.5 kilometres, with main ridges sepa-
rated from each other by 3-5 kilometres.

2.5. Geological and hydrogeological characteristics
of the study area

The study area is located on the border of
two major hydrogeological structures of the first
order. In the west is the Ustyurt, while in the
east is the Syrdarya. They are separated by the
Aral-Kyzylkum rampart. In fact, structures of the
second order, the North Ustyurt and South-Aral
artesian basins included in the research area,
adjoin the rampart.

To the west of the Aral-Kyzylkum rampart,
there are two hydrogeological zones of very diffi-
cult and hard water exchange, and an upper zone
of free water exchange. The first two are confined
to Permo-Triassic, Jurassic, and Cretaceous res-
ervoirs, while the upper one covers the Miocene,
Pliocene, and Quaternary reservoirs. The upper
Cretaceous-Paleogene
is the regional
water bearing separating different hydrodynam-
ic zones in the lower and upper hydrogeological
floors. East of the rampart, in the Meso-Cenozoic
formations, one hydrogeological zone is distin-

layer

guished as a free water exchange zone covering
the entire section of the sedimentary sequence
from the Upper Jurassic to Eopleistocene-
modern sediments. However, here the upper
Cretaceous-Paleogene formations are also con-
sidered as a regional aquiclude. The peculiarity
of the distribution of aquifers and complexes are
direct connections with the natural factors in-
tensively developed in the study area. Based on
the conditions of occurrence and feeding, dis-
tribution and discharge, and the geological and
lithological composition of water-bearing rocks,
aquifers and complexes were allocated and
characterised. Previously, wells were drilled for
water supply for livestock, forestry and farming
by different organizations and in some southern
areas, on a contractual basis. Considering the
presence of livestock wells, this report chapter
is compiled by the materials of the research of
the adjacent areas.

36

2.5.1. Aquifer complexes

Based on the analysis of the geological
structure and hydrogeological conditions of the
study area, the following aquifers and aquiclude
horizons and complexes are distinguished as
the low-water-bearing alluvial-marine Upper
Quaternary and modern complex, aquiclude al-
luvial-lake Upper Quaternary and the modern
complex, the aquiclude Eopleistocene aquifer,
the aquiclude Akchagyl local-aquiclude com-
plex, the aquiclude Senon-Paleogene complex,
and the aquiclude Upper Cretaceous complex.
Information on the lower aquifer complexes is
not given due to their insufficient study and
suitability for the national economy.

Alluvial-marine Upper Quaternary modern
complex with low water content

Groundwater in these sediments throughout
the area is the first from the surface, the depth
of the level varies between 0-3 metres in the
northern and polder zones, and 3.2 metres in
the rest of the area. Water-bearing rocks are
sandy loam, loam, clay, silt, and silty sands. The
thickness is within 0.2-7.0 metres. Groundwater
in terms of salinity, refers to saline and brine
in the range of 35 to 200 g/l. According to O.A.
Alekin, the chemical composition of water is
mainly chloride class sodium and less often
calcium.

Aquiclude alluvial-lacustrine upper quater-
nary and modern complex

The aquiclude is spread throughout the en-
tire area and contains groundwater. North of
the native shore, the aquiclude is underlain by
alluvial-marine and is hydraulically connected.
Mainly sands and sandy loams with interlayers
of irregularly alternating clays and loams rep-
resent the aquiclude complex. The thickness
of the complex is 5-18 metres. The depth of
groundwater occurrence is 3-5 metres and has
a free surface. Interrelation of surface waters
was studied by the previous authors using two

sections of wells, consisting of 5 wells each,
equipped on the north-western margins of the
Rybatsky and Djiltyrbas bays.

The groundwater is highly saline and brine
with a salinity of 40-70 g/l. It is somewhat
lower in the southern part, adjacent to polders
Sudochie, Djiltyrbas and the canals Kungrad,
Muynak, Amudarya, Kazakhdarya and Kokdarya,
with salinity from 1.5-3.0 to 13-28 g/l. The chem-
ical composition is mainly of the chloride class
of the sodium group.

Of particular importance in conditions of
desertification and the dynamics of harmful
exogenous geological processes in the Aral
Sea region is the further study of groundwater
confined to the upper hydrogeological level.
It lies above the regional Senonian-Paleogene
water table and is characterised by free water
exchange with surface and atmospheric waters.

The peculiarity of the distribution of upper
aquifers and complexes is a direct connection
with the natural factors intensively developed
in the study area.

Eopleistocene aquifer

The aquifer is ubiquitous in the studied area.
It is absent (eroded out) only in some parts of
the Aral-Kyzylkum berm. The rest of the terri-
tory is overlain by deposits of alluvial-lake and
alluvial-marine complexes. Clays and marls
of the Santonian-Oligocene complex from the
ACWR to the Ustyurt cliffs underlie the base of
the horizon by chalk sandstones within ACWR,
clays, sandstones, and salts to the east of
ACWR. Sands mainly represent the water-bear-
ing rocks and sandstones with a total thickness
of 18-30 metres of the horizon water and are
hydraulically interconnected with the waters of
the overlying sediments.

Groundwater levels are usually 0.5-1.0 metres
below the levels of upper aquifer complexes. In
the south-eastern right-bank part of the terri-
tory, water lies first from the day surface level

37

at a depth of 4.1 metres. Well flow rates do not
exceed 3.0-3.5 l/s. The filtration coefficient of
sands and sandstones is 1.4-4.9 metres per day.
Groundwater salinity is 34.3-84.4 g/l (quantity
of salts in a litre of solution) over most of the
area. According to the chemical composition,
waters are mainly of the chloride class of the
sodium group.

Akchagyl local aquiclude complex

The Akchagyl deposits are spread in the right-
bank (eastern) part of the Amudarya River. They
are overlapped by Eopleistocene sediments and
underlain by rocks of regional Paleogene clays
(50-120 metres thick). The overlying layer lies at
the depth of 22-34 metres from the day surface.
Groundwater level of the complex, depending
on the depth of the sampled collector, is set at
1.55-6.6 metres. Waters are weakly pressurised
and the head height above the overlying layer
is 24-28 metres. Specific well flow rates are 0.1-
0.15 l/s metres. Sandstone filtration coefficients
are 0.11-0.66 metres per day. Horizon waters
are saline and brine with mineralisation of 22-
85.5 g/l. According to chemical composition, the
waters are of the chloride class of the sodium
group. Underground waters have no practical
value.

Aquiclude Senonian-Paleogene Complex

The Senonian-Paleogene sequence is a re-
gional aquiclude layer, which separates mainly
groundwater with free hydraulic surface and
pressurised water of the middle hydrogeolog-
ical stage in the considered regions. Its section
is composed mainly of clays, marls and marl
calcareous clays, and within the section there
are thin interlayers of clayey limestone and
clayey sandstone. The thickness varies from
545 to 975 metres.

These are widespread everywhere, absent
only within the Aral-Kyzylkum berm where the
impermeable complex is eroded and located
under alluvial-marine, Upper Quaternary and

modern sediments or under Eopleistocene sed-
iments. It emerges on the surface of the Ustyurt,
Kyzyljar and Beltau hills.

Upper Cretaceous aquifer complex

The groundwater of the Upper Cretaceous
sediments in this territory has an area-wide
distribution. They come to the day surface
within the Ustyurt, Kyzyljar, the former Muynak
peninsula of the Aral-Kyzylkum shaft, the
Beltau and Kushkanatau elevations, and in
other submerged areas penetrated by all ex-
ploration-mapping and reference wells. The
exception is the vaults of some brachyanticlinal
and local geostructures of the Aral-Kyzylkum
rampart where the water-bearing rocks of the
complex are partially eroded or drained due to
their hypsometric position (60-80 metres, kPa).

The depth of the aquifer roof varies from 0.0-
5.0 metres (within the uplands) to 37-57.0 metres
and more (in the troughs). The revealed thick-
ness is 50-130 metres. As the aquifer complex
dips towards the Aral depression, groundwater
gradually sinks and becomes subartesian.

Since the water-bearing layers of sands and
sandstones have a monoclinal dip, complicat-
ed by a whole series of folds, several latitudi-
nal and sublatitudinal troughs and uplifts are
formed in the area under consideration.

The section of the aquifer is composed of a
layer of unevenly interstratified sands, sand-
stones, clays, and siltstones. The reservoir
properties of sandstones are generally low,
total porosity 20-36 percent, saturation poros-
ity 21-28 percent, and a filtration coefficient
0.125-3.05 metres per day.

According to experimental filtration and
laboratory studies, the water content of the
aquifers is relatively low. The flow rates of the
well during trial pumping are 0.5-5.0 l/s and
more, with a decrease in the water level of 12-15
metres.

38

The mineralisation of underground waters
of the Amudarya River’s left bank complex,
starting from the ACWR to the Ustyurt cliff, var-
ies widely both in area and depth. These are
salty waters and brines with a solid residue of
37.8 g/l, up to 142.4 g/l. Waters belong to the
chloride class of the sodium group of the sec-
ond and third types. Waters of the complex of
this part are practically not used due to their
high mineralisation.

Groundwater salinity of the Amudarya River’s
right bank complex is much more favourable
and varies within ACWR up to 10.2-15.0 g/l, mov-
ing away from ACWR towards western Kyzylkum
from 2.5-5.0 g/l. The least mineralised waters of
the complex, with a dry residue of 2.0-3.0 g/l, are

2.6. Soil

The flat character of the dried seabed relief
creates a virtually undrained area, close ground-
water occurrence, capillary capacity of soils, and
intensive evaporation which contributes to sa-
linisation of the Aral Sea drainage area. The rea-
son for significant salinisation is salt deposits
on the Aral Sea bed under a thin (0.5-1.5 metre)
silt layer (V.V. Rubanov, 1977). Chalov P.I. (1968)
and then Weinsberg I.G. (1972) obtained the first
information on the presence of salt on the Aral
Sea bed. The formation of a salt layer under
bottom sediments is related to salt deposition
from seawater as its salinity increases. The bot-
tom sediments themselves, deposited under the
sea to a depth of 1 metre and being the parent
rock of soil formation (Brodskaya N.G., 1952), are
represented in the central and western parts by
marls, and in the peripheral parts by sands and
siltstones.

The main part of the drainage area is occu-
pied by solonchaks. The specific conditions of
soil formation on the dried seabed predeter-
mined a special subtype of solonchaks called
coastal solonchaks. After discussions, local soil

developed within the central part of the South
Aral region work area of the water pressure
basin. As the distance from the Aral-Kyzylkum
berm towards eastern Kyzylkum, for instance in
the eastern part of the work area, mineralisa-
tion of horizon groundwater decreases to 1, 7-2,
5 g/l.

According to the chemical composition,
the groundwater of Upper Cretaceous aquifer
complex is chloride-sulphate, magnesium-so-
dium. Within the ACWR and Aral Sea water
area, the composition changes to chloride-so-
dium. Waters of this complex are used for dis-
tant-pasture cattle breeding and forestry, and
other similar purposes.

scientists considered it possible to classify the
solonchaks of the dried seabed as soils. Further
studies confirmed the validity of this decision.

A study of the dried seabed showed that the
chain of solonchak transformation ends in the
formation of desert-sandy soils under the sax-
aul, not only under artificial plantings, but also
in self-overgrowing areas.

The evolution of solonchak soils passes
through the stages of excessively hydromorphic
soils (marshes) → moderately hydromorphic so-
lonchaks → semi-hydromorphic solonchaks →
semi-automorphic solonchaks → automorphic
solonchaks. At the last stages of soil develop-
ment (Sektimenko, 1991), solonchak processes
caused by hydromorphic conditions are faded,
and the role of the arid-zonal factor increases
many times under the influence of which the
further development of soils follows the typical
desert type.

Soil formation begins when the seafloor is

exposed.

39

Fig. 3 in Chapter 2 shows the dynamics of the
Aral Sea bed drainage and changes in the shore-
line position by years.

In 1990, a soil study of the dried seabed was
carried out by the Institute of Soil Science, and
a soil map was developed based on the results
of this study.

By the 1990s, the groundwater in the previ-
ously surveyed area had lowered to at least
4-7 metres and had a very high salinity of up to
50 g/l. Hydromorphic and semi-hydromorphic
solonchaks were transformed into semi-auto-
morphic and automorphic ones.

The newly formed hydromorphic soils moved

after the receding seawater edge.

As a result of four expeditions on the dried
seabed during 2005-2007, conditions of further
changes in the seabed cover were studied. A soil
map (Dukhovny V.A. et al., 2008) was developed
and an analysis was performed of soil cover
changes over 15 years.

1990,

Since

there has been an

in-
crease (Table 4) of automorphic solonchaks by
more than 50,000 hectares due to the lowering
of the groundwater table and the transition
of hydromorphic soils into their automorphic
counterparts.

As a positive sign, 233,500 hectares of des-
ert-sandy soils were formed. However, the ar-
ea’s under sands significantly increased from
172,000 to 322,000 hectares, indicating the in-

Fig. 13. Soil map, as of 2005

40

tensification of erosion processes on the dried
seabed (Dukhovny V.A. et al., 2008).

Local soil scientists considered the exposed
soils as soils which differ from zonal soils by
their specific features. These peculiarities con-
sist in dynamism of soil-forming process devel-
opment both in space and time, in underdevel-
opment and weak differentiation of soil profile,
low biogenicity, predominance of organic matter

destruction processes and almost full absence
of their accumulation, and as a result, the spec-
ificity of water-salt regime of young soils. These
features allowed the soil cover of the dried part
of the Aral Sea bed to undergo a century-long
development cycle in a short period of time
(Sektimenko, 1991; Stulina & Sektimenko, 2004).

Changes in the soil cover of the dried Aral Sea bed

Table 4.

Soil Groups

1990

In the area covered by
the survey in 1990

In the drying zone from
1990 to 2005

2005

Hydromorphic and semi-hydromorphic

Automorphic and semi-automorphic

Desert sand

Sand

Desert meadowlands

763204

114443

172348

276340

165834

233460

321745

52616

1049995

1049995

372568

8304

4381

81888

45

467186

41

42

3 Afforestation to combat erosion –

background and status

3.1. Review of the performed works

Aridization caused by the drying of the Aral
Sea, its intercoastal lakes, and deltaic inun-
dation of the Amudarya and Syrdarya rivers,
together with desertification of vast areas of
dried-up seabed and river deltas, has resulted
in deterioration of environmental conditions in
the sea’s region.

Vegetation emerged in the dried-up area
after sea recession produced a positive impact
of relief from environmental disaster. Within the
first three years, salinity of seabed’s dried-up
clay soils stood at 0.9-1.2 percent. This paved
the way for the intensive growth of salt-resis-
tant plants such as glasswort (Salicornia), sea
blite (Suaeda) and other halophilous vegetation.
During the fifth and tenth years the salinity of
the seabed’s dried-up clay soils reached 3.45 to
4 percent, eliminating chances for seed regener-
ation and growth even for salt-resistant plants.
Therefore, most of the sea area that dried-up
between 1980 and 1998 now contains bare and
bleak vegetated sites. In the fourteenth through
eighteenth years, salinity of the seabed’s dried-
up clay soils reduced to 2.6 to 3.5 percent, due to

aeolian salt and dust transfer and atmospheric
precipitations.

In recent years, the dry-up process intensified
and led to a vast land surface area developing
from beneath the sea and remote from various
desert plants seed sources. Considering the
emergence of various benthal deposit types in
the area, it is essential that relevant methods
are adjusted to local conditions to perform veg-
etative reclamation facilitating the overgrowth
of self-organized vegetation.

Considering

intensive desertification and
lack of potable water, vegetative reclamation
becomes an affordable, reliable and environ-
ment-friendly way to reduce albedo (reflectiv-
ity). It also reduces the intensity of soil blowout
and aeolian saline dust transfer with a simulta-
neous increase in vegetative productivity of the
dried-up Aral Sea bed and the Amudarya River
desert cone delta.

Tables 5 to 7 reflect data on the vegetative rec-
lamation of the dried-up seabed as performed
since 1980s to 2020.

43

2000-2008 donor funded reafforestation Works on the Dried Aral Sea bed

Table 5.

№ Name of the organization

Years of
production

Total area, ha

Including

Sowing, ha

Planting, ha

1100

2800

2800

2700

1450

965

785

500

13100

1

GTZ
(Germany)

Total

2

IFAS
(Nukus branch)

3

4

Total

National Association
‘Priaralie’

Total

Separate directorate
for enterprises under
construction -1 (National
Association ‘Priaralie’)

2000

2001

2002

2003

2004

2005

2006

2007

2002

2003

2004

2005

2006

2007

2008

2009

2010

2011

2014

2015

2016

2017

2018

2004

2004

2005

2006

2007

1300

4300

5300

5500

3450

2465

2585

2100

27000

450

339,7

2551

2012,8

582,6

2667,93

1250,88

1145,13

97,54

1632

1126,5

849

405

721,4

200

1500

2500

2800

2000

1500

1800

1600

13900

450

339,7

2551

2012,8

582,6

2667,93

1250,88

1145,13

97,54

1632

1126,5

849

405

721,4

15831,48

15831,48

321,5

321,5

1000

1729

1796

1775

321,5

321,5

1000

1729

1796

1775

Total

63000

63000

44

№ Name of the organization

5

KOFUTIS (Uzbek-French
company)

Years of
production

2004

Total

TOTAL

Total area, ha

Including

Sowing, ha

Planting, ha

1450

1450

50903

1450

1450

37803

13100

Table 6.

State Committee on Forestry of the Republic of Karakalpakstan’s 1988-2019 reafforestation
works on the Dried Aral Sea bed

№ Production years Total area, ha

Mechanical
sowing

Planting

Aero-sowing

Promoting
natural renewal

Including

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

1988 г. и ранее

1989

1990

1991

1992

1993

1994

1995

1996

1997

1998

1999

2000

2001

2002

2003

2004

2005

2006

2007

2008

2009

2010

2011

2012

71730,0

11343,5

13240

9835

6760

8729

10358

11353

14872

14865

14823

5751

15080

16384

11870

15769

6972,5

16812

14962

14400

14924

15330

12602

16794

16781

58730

11260

12940

8768

6438

8374

10180

11012

14322

14131

14127

5036

14500

15491

11150

14635

6305

13756

7207

7375

7690

6545

3375

3600

3665

45

83,5

300

1067

322

355

178

341

550

734

696

715

580

893

720

1134

667,5

2056

3908

3015

3022

4060

4527

5094

5141

1000

3847

4010

4212

4725

4700

8100

8075

№ Production years Total area, ha

Mechanical
sowing

Planting

Aero-sowing

Promoting
natural renewal

Including

26

27

28

29

30

31

32

2013

2014

2015

2016

2017

2018

2019

Total

16822

17338

18242

18894

19043

19064

460875

952618,0

3600

3575

3475

8162

9733

11505

119440

450002

4705

5058

5403

5390

5410

4359

15285

85769

326150

326150

8517

8705

9364

5342

3900

3200

-

90697

An area of over 1 million hectares of the dried
seabed was prepared for planting in 2019 (Fig.
14), with 700 hectares of forest seed distributed
by intensive aero sowing.

Uzbekistan has started to implement affor-
estation measures in order to halt the drifting
sands on the Aral Sea’s dried seabed, since 1980.
Twenty years later international organizations

also took up the task, particularly the German
Development Cooperation Agency (later called
the Deutsche Gesellschaft für Internationale
Zusammenarbeit, GIZ), the International Fund
for Saving the Aral Sea (IFAS), the World Bank,
the Global Environmental Facility (GEF), the
Japan Fund for Global Environment (JFGE), the
Embassy of Japan, and others.

2015-2019 Artificial forest plantations of the Aral Sea’s dried seabed

Table 7.

№

Name of forestry enterprises

Total area
(ha)

Including

2015

2016

2017

2018

2019

1

2

3

4

5

6

7

8

9

10

11

12

Buzatau

Chimbay

Karauzyak

Takhtakupir

Muynak

Kazakdarya

Kungrad

Nukus

Khodjeilinsk

Nukus (specialised)

Shumanaysk

Kanlykulsk

701

2020

2344

2555

8029

3245

601

2073

2382

2593

8149

3245

620

2075

2387

2252

8350

3200

180

620

2080

2390

2260

8155

3500

2300

200

119

10

555

1937

2230

2435

7840

3245

2300

380

119

3097

10185

11733

12095

40523

16435

2300

380

119

10

10

55

Total

96942

18242

18894 19043

19064 21699

46

Fig. 14. Information on the work designed for and implemented on the drained bottom of the Aral Sea
(as of 1 December 2019)

47

3.2. Conditions for forest growth in Central Asia and the role
of afforestation in the Aral Sea region

In Turkmenistan on 24 August 2018, the
Summit of the Heads of the States, founders of
IFAS, in an effort of recent political good will, pri-
oritised the issues of the environmental health
of Central Asia’s transboundary rivers and the
problem of the Aral Sea.

Countries of the region currently have oppor-
tunities to progress in restoring rivers and eco-
systems and recovering them both domestically
and regionally. It goes far beyond the under-
standing that sustainable development and up-
grading living conditions depends on preserving
natural resources.

The President of the Republic of Uzbekistan
at the IFAS Summit proposed the initiative to
proclaim the Aral Sea region as a zone of en-
vironmental innovations and technologies as
a guideline for further actions. This involves a
drastic transformation of the Aral Sea’s disaster
solution ideology. It involves not just drawing
attention to the environmental crisis in order
to mitigate its negative consequences, but also
putting in place a mechanism to eliminate the
crisis completely.

Thus, it was proposed to consider the Aral Sea
region as an integral water-and-ecology system
with possible divisions into subzones of the
north and south. This will enable a consolida-
tion of efforts of the Aral Sea basin countries,
including Afghanistan, for
innovation-driven
development.

Experts proposed the protective planting of
vegetation able to grow in severe desert soil and
climate conditions with minor precipitations.
This efficient method combats salt and dust
transfer, fixing drifting sands and limiting its ad-
verse impact on the environment, rehabilitates
ecological conditions, and further develops a
sustainable basis for shieling.

Desert plants absorb carbon dioxide and emit
oxygen, though to a lesser extent than conifer
and foliose trees. Still, they can fix drifting sands
and create a favourable environment for flora
and fauna within the protected area.

By the end of the 1980s, the first examina-
tions for further forest planting of the dried
seabed were undertaken by the ‘Uzgiproleskhoz’
research institute. A detailed design was devel-
oped and served as a basis for further forest
reclamation works. Since the beginning of re-
search to 2018, Uzbekistan afforestation projects
have covered over 500,000 hectares. Recently,
the Government of Uzbekistan turned its focus
to stopping the sea’s drifting sands and signifi-
cantly increasing afforestation, with the last two
years of the project covering 1,164.3 hectares of
dried seabed. The changes occurring here are
striking in their dynamism, which makes it nec-
essary to address the issues of conservation of
this unique zone and to prevent possible neg-
ative impacts. The dried seabed and the Aral
Sea region currently serve as a platform for the
application of innovative methods of nature
transformation. In addition, the zone is a unique
laboratory for scientists, who can observe and
study processes that usually take centuries.

One of the tasks of the comprehensive expe-
dition of SIC ICWC in 2019-2020, organized with
financial support from UNDP and with partici-
pation of the Aral Sea Innovation Center, was to
study the seabed’s soil cover and state of the
vegetation. Comparisons were made between
some environmental indicators of recent years
and the previous period.

Two expeditions of the surveyed areas that
belong to the state forest fund of the Muynak
and Kazakhdarya forests carried out artificial
planting and the sowing of forest crops.

48

Undersoil features and the thickness of ae-
olian sands affect forest growing conditions.
Adjacent thick impermeable rocks limits trees
and shrub growth. In permeable loose rocks,
plant roots develop better with higher produc-
tivity. Thus, referring to the topsoils of aeolian
sands only while classifying is not advised.

Key factors affecting forest growing condi-
tions are the upper layers’ humidity conditions,
groundwater depth, as well as its salinity. Higher
porosity and smaller moisture-holding capacity
prevent sufficient amounts of water from accu-
mulating in the upper layers required for sowing
and planting. Abundant atmospheric precipi-
tations penetrate the capillary pores creating
water reserves on the groundwater level.

Precipitations in the desert area account for
80-180 millimetres annually, with 50 percent
coming during the colder seasons. Maximum
is not clearly distinguished.
precipitation
Precipitation on the dried-up Aral Sea bed bare-
ly reaches 100 millimetres annually. Atmospheric
precipitations are not observed in the summer-
time. A flushing soil regime emerges in this con-
dition. The average wetted depth of sandy soils
is 100 centimetres, in loamy sands it is 70 centi-
metres, and in clay loams it reaches almost 60
centimetres. In the springtime, a 1 metre layer
of loamy sand dries up, but sandy soils preserve
a layer of ground where humidity level exceeds
wilting ratio.

Precipitation is the prevailing part as water
balance increases under desert woodland with
Haloxylon aphyllum. A three years’ average for
precipitations totalled 107.4 millimetres, for con-
densation, 25 millimetres, and for hydromete-
ors, 7.4 millimetres. An average annual moisture
amount is 139.8 millimetres. Moisture is evap-
orated by 76.2 millimetres and transpiration by
62.6 millimetres. Gravitation-driven precipita-
tion moisture downstream weathering zone in
case desert woodland, from the top of the soil to
the groundwater table, with Haloxylon aphyllum,
is lacking.

Thus, the main feature of the water regime
of barchan sands is the soaking of the entire
aeration zone by precipitation, which deter-
mines the formation of a leaching type of soil
water regime and the accumulation of moisture
in groundwater. In overgrown hilly sands and
under high-density haloxylon desert woodland,
atmospheric precipitations are completely iso-
lated from groundwater and a nonpercolative
water regime with thick impermeable horizon
is formed. This feature determines the specific
nature of the desert sands forest reclamation
works.

The quality of groundwater affects the veg-
etation range. For saline water, even at small
groundwater depth (up to 2 metres), only
salt-resistant species such as tamarix, halox-
ylon, salsola richteri and calligonum can grow.
Groundwater can be divided into three groups
according to quality, including freshwater with
dissolved solids up to 2 g/l, light-salted water
with dissolved solids up to 3 g/l, and saline wa-
ters with dissolved solids over 3 g/l.

When assessing the forest site’s conditions,
it is necessary to consider the nature of the re-
lief. This determines agricultural techniques and
the use of mechanised planting. There are three
types of barchan sands, including small-barchan
of up to 1 metre high, medium-barchan of 1 to
3 metres, and large-barchan of above 3 metres.
The speed and type of mobile sands’ movements
are determined as progressive, oscillatory and
oscillatory-compulsive, and depend on the
thickness of sand accumulations, sand over-
growth and the wind regime of the area.

In different climatic conditions, the above ty-
pology of sands will have its own characteristics.

Several subtypes of sands are distinguished
within the climatic belt according to the char-
acter of forest-styled conditions, including in-
tra-coastal, littoral and prioazial sands. Methods
of fixation and afforestation of moving sands on
coastal plains and within inland deserts have

49

their own features. Seaside sands are better
wetted and therefore characterised by more fa-
vourable silvicultural conditions. The salinity of
the surface horizons of seaside sands is usually
higher but is not critical for the development of
a number of salt-tolerant plants. Prioazis and
intra-oasis sands have even more favourable
forest-styling conditions, which is determined

by the close occurrence of desalinised ground-
water and periodic moistening of sands due to
the discharge of irrigation water outside the
oases. Under such conditions, the possibility of
afforestation and consolidation of mobile sands
increases significantly. Oasis sands are used for
growing not only forest plantations, but also
(after minor reclamation) agricultural crops.

50

4 Research methods

4.1. The objectives and team of the research expeditions:
Organization of work

The results of nine expeditions from 2005 to
2011 revealed continuous changes in the newly
formed landscapes, both in the direction of
stabilisation and the development of risk and
desertification processes due to the draining
of the Aral Sea bed and the maintenance of the
ecological balance in the recently developed
Aralkum Desert. Despite the increasing scale
of stabilisation works, the real improvement of
ecological conditions has lagged behind due to
the destructive action caused by the machinery
and transport of various teams and organiza-
tions searching for organic raw materials and
undertaking their extraction.

Monitoring the state of the dried seabed be-
came urgently necessary in order to observe
natural and anthropogenic interferences in the
natural regeneration, as well as preventing the
seabed’s further degradation by assisting nature
in its self-improvement. Monitoring also prior-
itised the protection of this unique entity from
destruction.

The uniqueness of the processes occurring
on the dried seabed in the form of significant
areas of self-overgrowing and soil formation on
the bedrock with the parallel development of

microbiological processes has been discovered
and published. The results of previous expe-
ditions have established self-overgrowing by
seed spraying for tree plantings on an area of
more than 200,000 hectares, almost equal to the
entire artificial forest plantations recorded at
those dates. Moreover, processes that in other
evolutionary contexts take decades or even cen-
turies to occur, continue at an accelerated rate
throughout this area as it dries up, and this can
be observed on an annual basis.

Proceeding from these important findings,
and considering the absence of observations for
eight years, the expedition was assigned both
practical and scientific tasks:

- Identifying conditions and dynamics of chang-
es on dried-up areas;

- Approximate classification of landscape on
newly dried-up areas, using remote observation
data;

- Landscape, soil, hydrogeology, fauna and flora
conditions of dry-up areas, especially that of ar-
tificial forest stands;

- Identifying desertification scope, landscape
class and risk zone changes and comparing the

51

outcomes of previous monitoring conducted
during 2005-2011;

- Forming recommendations on improving en-
vironmental conditions and the efficient use of
dried-up and developed areas.

Out of necessity, it was decided to evaluate
the condition of the area planned for afforesta-
tion first, and to simultaneously evaluate the
past results from the position of their preserva-
tion. The availability of funds for only two expe-
ditions of the planned five determined the scope
of the expeditions. The studied territory included
the dried seabed from the Amudarya Riverbed
(delta and avandelta) to the Kokdarya River and
Toguzarkan Channel, from the mark of 53 metres

(the sea level of 1960) to the current water level
of the East Sea. The shore of the sea, consisting
of wet clay with salt, was actually possible to ap-
proach and was accordingly investigated.

The first expedition was conducted in the
‘Muynak zone’ on the territory of 600,000 hect-
ares from the Ustyurt chink to the Amudarya
riverbed, and from the mark of 53 metres to its
present level (Fig. 15). The expedition took place
from 20 September to 20 October 2019.

The second expedition was conducted in the
‘Djiltyrbas zone’ from 28 May to 26 June 2020, on
the territory of 600,000 hectares.

The expeditions were multidisciplinary.

Fig. 15. Area of the dried-up seabed and routes of the first and second expeditions

52

The expedition team (Fig. 16) included:

6. Botanist - Sherimbetov S.

1. Head of the expedition and soil scientist -

Stulina G.V.

2. GIS specialist - Zaitov Sh. (Kenjabaev Sh.)

3. Ecologist - Eshchanov O.

4. Dendrologist - Ganiev M.Sh.

5. Hydrogeologist - Esembaev G.

7. Soil scientist - Idirisov K.

8. Worker (GIS) - Ruziev I.

9. Worker - Zueva N.

10. Worker - Aydjanov J.

11. Driver - Stepanov V.

12. Driver - Zuev S.

Composition of the work and research methods

Work plan:

 Remote sensing: Determination of sur-
face classes based on satellite images;
 Hydrogeology: Level and mineralisation



of groundwater;
Soil: Genetic description, texture, humus,
carbonates, gypsum, salinity, salt com-
position, soil type;





Vegetation: Composition, conditions of
natural vegetation and artificial plant-
ings, assessment of vegetation, assess-
ment of self-overgrowing;
Ecology: Landscape sustainability, risk
classes.

Fig. 16. Expedition members on the dried bottom of the Aral Sea

53

species composition, height, and projec-
tive vegetation coverage on all tiers was
prepared;
Self-overgrowth processes were defined;
Fifty-six soil profiles were placed, on the
basis of which a morphological descrip-
tion of the soil profile was performed
and soil samples were selected accord-
ing to genetic horizons;
The existing hydrological network of
four wells and eleven self-discharging
wells was monitored, groundwater levels
were measured, and water was taken for
analysis;
A description of the ecological condition
of the area and a preliminary environ-
mental risk assessment was carried out








Transportation

Three vehicles were used on the route of the
expedition, specifically a Mitsubishi Pajero Sport
Jeep, a Nissan Patrol Jeep, and a Ural-577 (Fig. 17).

Expedition routes

The expedition routes (Figs. 20 and 21) were
chosen based on uncontrolled classification of
satellite images in approximation to the routes
of previous expeditions. The route of the first ex-
pedition covered 2,500 kilometres. Considering
the large territory of the survey, four tent camps
were organized (Figs. 18 and 19). The mileage
of the vehicles for the second expedition was
2,850 kilometres and two camps were organized.

Results of the ground expeditions:



Full description of 2,142 points on the
ground for the identification of satellite
images was completed;

 Botanical description of the vegetation
was made, and plant formations were
identified;

 Description of the state of natural vege-
tation and artificial plantings, including

Fig. 17. Expedition vehicles

54

Fig. 18. Expedition camp

Fig. 19. Field lunch

55

Fig. 20. The route of the first expedition

56

Fig. 21. Route of the second expedition

57

4.2. Field research methods

4.2.1. Methodology of soil research

Soil surveys consist of:

1. A field study of soil cover along expedition

routes;

2. Laboratory analysis of selected samples;

3. Analysis of the obtained data, and devel-

opment of soil maps.

The field study included a description of
the area, selection of key sites, laying of soil
sections, morphological description of the soil
profile by genetic horizons, and soil sampling.
Soil description was made based on a stan-
dard sample. Soil samples were submitted to
the laboratory to determine the chemical and
physical condition of soils, the content of salts
by the full composition of the water extracted,
its anionic and cationic composition, organic
matter content, gypsum, and carbonate con-
tent, and the mechanical (granulometric) com-
position of soils.

The soil survey had several objectives:

territory, with consideration of the features of
vegetation and soil-groundwater conditions
that define the areas subscribed in terms of
salinisation and desertification, and prediction
of their foci.

Description of vegetation cover begins with
a preliminary survey study area for general ori-
entation, as well as establishing the ecological
relationships of plant communities with local
conditions, which include topography, soils,
moisture features, soil salinity and other mat-
ters. After a thorough examination, the most
typical site of the phytocenosis with a certain
representativeness, uniform floristic composi-
tion and habitat conditions was selected.

Significant place was given to phytomeliora-
tive survey of land and specifically, to the plant-
ing and sowing of saxaul, as well as shrubs and
semi-shrubs, in order to create pastures. Based
on the detour and inspection routes of the area
and the state of saxaul and other types of veg-
etation, several sites have been selected for
geobotanical description of soil sections.

1. Study the soil cover of the dried seabed

and develop a soil map as of 2019;

Geobotanical description has been made si-
multaneously on three sites in three repetitions:

2. Analyse the soil cover with consideration
of vegetative cover, and identify areas of possi-
ble vegetation planting;

3. Compare soil maps of 1990 and 2006, de-

termine changes and assess trends.

Each key site has geographic coordinates,
and information is included in the summary
table of field observations.

4.2.2. Vegetation study methodology

Characteristics of the natural vegetation
cover in the context of ongoing changes are
given in the geobotanical description of the

a) Best survival rate

b) Average survival rate

c) Poor survival rate

4.2.3. Hydrogeological research
methodology

The types, volumes, sequence and meth-
odology of the hydrogeological survey should
be justified and carried out considering the
geological and hydrogeological conditions of
the study area and the successful solution of
the basic and additional tasks set before the
survey (Klimentov P.P. et al. Methodology of

58

Hydrogeological Research, Vysshaya Shkola,
Moscow, 1978, 408 p.). They include the collec-
tion of previously given geological, geomor-
phological, hydrological and hydrogeological
observations. Various types of ground-based
visual observations are carried out during
route surveys of the mapped area, which are
one of the main integral types of work in the
hydrogeological survey. The material obtained
as a result of route surveys is important for
studying and evaluating the upper aquifers
(penetrated by the erosion network, mine wells
and shallow wells) and compiling an appropri-
ate hydrogeological map. The level and salinity
of groundwater may have required the drilling
of pits along the adopted route.

4.2.4. Environmental survey
methodology

The main method of the environmental
survey is the study of the dried seabed’s land-
scapes, direct observation, condition assess-
ment, description of the selected field routes
(automobile and visual), as well as a descrip-
tion of the topography of the terrain at points,
and soil cover. The routes of the expedition
are marked with sections or the individual
segments to describe the characteristic imag-
es. Descriptive methods are one of the main
methods used in environmental monitoring.
Direct observation of the objects under study,
recording the dynamics of their state over time
and the evaluation of the changes recorded,
allows for predictions of possible processes in
the natural environment.

Descriptive methods are used in the reg-
istration of the main features of the objects
under study, mapping of ecological phenom-
ena, and the inventory of valuable natural
objects. These methods are key in ecological
monitoring.

It is especially important in ecological stud-
ies to identify the factors that determine the
status of the environment. For the Aral Sea, the
direction of processes is significant. The vol-
ume of drainage, intensity of drainage, change
of species composition, state of vegetation,
salt transfer, surface desalinisation, change of
biogeocenosis and others matters all deter-
mine the environment’s status.

The next step of ecological monitoring is the

ecological zoning of the area.

Its purpose is to systematise data on the
ecological conditions of territories and to
assess their complexity and heterogeneity.
Recently, environmental specialists have been
increasingly using ecological zoning in their
work since it not only has scientific value, but
also important practical value. In general, the
research can be called “ecological landscape
monitoring.”

Automatic and remote devices are import-
ant for the continuous monitoring of and dis-
tinguishing of positive and negative changes
of the dried seabed. It is possible to identify
zones of varying degrees of environmental risk,
and to study the changes taking place in the
ecosystem.

59

60

5 GIS and remote sensing as a basis for

field surveys

5.1. Methods

In environmental research, the integration
of remote sensing with ground-based mea-
surements is of growing interest. To this extent,
Geographical Informational System (GIS), Earth
Observation (EO) and Remote Sensing (RS) sat-
ellites in space are viewed as successful and
intensively developing innovative assets. The
directive of the President of the Republic of
Uzbekistan No. R-5209 stated that “…measures
to develop satellite research and technologies
in the Republic of Uzbekistan” (12 February 2018)
confirmed that the introduction of RS is signifi-
cant. This chapter describes the preparation of
field surveys based on RS and GIS data, and will
show surface measurements for landscape class
testing on the dried-up Aral Sea bed with the
GPS navigator, as well as imaging and populating
a field report with obtained information.

GIS is a software package for spatial data
development (data on an object’s geographical
location), visualisation, search and analysis (Lo
& Yeung, 2004). In most cases, it uses geographic
coordinates such as latitude and longitude, iden-
tified with the GPS (Global Positioning System)
navigator. The World Geodetic System (WGS 84)
has been used in the Republic of Uzbekistan
since 2018.1 RS supervises and measures ener-

gy and polarisation characteristics of radiation
emitted by objects from various diapasons of
the electromagnetic spectrum, to identify the lo-
cation, types, features and temporal variability
of environmental objects without direct contact
(Campbell, 1996; Jensen, 2004).

Data on the same survey area (ground envi-
ronmental site investigation surveys, measure-
ment of soils’ hydrophysical property features,
statistical data, cartographical materials, and ae-
rial and satellite survey materials), as obtained
from various sources, provide a bulk of miscella-
neous information with a different scope. Due to
the complexity of data processing, analysis and
storage, the role of GIS-based cartographical da-
tabases in the geo-environmental assessment
of utilized areas are increasing. This enables re-
searchers to develop a single e-base of spatial
and alphanumeric data, increase selectivity and
efficiency of data processing and analysis, and
produce soft and hard copies of comprehensive
cartographical documents.

Considering the above, all geospatial data (in-
cluding space imaging) have been transformed
in the framework of the WGS 84 coordinate sys-
tem. The following methods were employed as

1 Resolution of the Cabinet of Ministers of the Republic of Uzbekistan No. 1022 ‘On application and open use of
international geodetic systems of coordinates within the territory of the Republic of Uzbekistan’ dated 26 December 2017.

61

major methodical tools to analyse the survey
area’s geo-environmental status:





Soil and vegetation cover condition
assessment methods, reflecting data
of the RS optic systems (Kozodyorov &
Kondranin, 2008);
Ecosystem monitoring, simulation, and
assessment methods (Lopez & Frohn,
2017);

 Our previous developments (SIC ICWC,

2008).

Obviously, expeditions collecting field mea-
surements on site must be thoroughly planned
and optimised. Expeditions often cover large

and remote areas, meaning they require both
logistics and infrastructure. To determine the
test areas of the study, the available data was
analysed, and the primary processing of remote
sensing data (including unsupervised classifica-
tion) was carried out. Based on these materials,
expedition routes were determined and a field
form describing the area with fixed GPS coordi-
nates of field observation points was compiled.
The GPS recording of ground measurements and
field observations enables a detailed analysis of
geospatial data. The data, in the form of moni-
toring point matrices, are used to decode, cal-
ibrate, verify, and validate the mapping results
from RS data. The following describes the steps
of field survey preparation:

5.2. Field survey preparation

Stage 1: Defining a landscape mapping
legend

Легенда отражает семантическое «оThe
Legend reflects semantic “summarising/gener-
alisation” of a certain geographic area. The real
world can be considered as a “continuum” with
significant granularity of various information.
Thus, the process of categorising is a process of
minimizing this complexity. It is important for
“map producers” to ensure that the minimal re-
quirements for the correct use of the Legend are
met:


Clear and undoubted identification of a
class;

 No class-related semantic in clarity,

meaning the class (semantic) edge is not
overlapped with other legend classes.

In this study we used an already defined leg-
end containing 17 classes from the previous 2006
study

Currently the Minimum Mapping Unit (MMU)
is used instead scale mapping and defines “the
smallest earth surface reflected on the map, i.e.,

62

representation.” Thus, MMU is not just a more
accurate parameter for cartographic edges of
the map, but also affects its specific details.

It is recommended to visit only areas with a
homogeneous land cover of at least 1 hectare (or
within a radius of 100 metres), which is defined
as MEC. In this study, the spatial resolution of
satellite images (in our case LandSat with a res-
olution of 30 * 30 metres) must be considered
when determining the MEC.

Stage 2: Identifying field measurements
scope based on legend class

A sample unit is a unit of area that is observed
in a field. It can be an outline of fields or land (in
the sense of a polygon), an artificially defined
segment (in the form of squares, rectangles or
from image processing software such as eCogni-
tion), sections, points, or others.

The sampling unit of the field measurements
in the selected classes is the reference unit, and
it associates the spatial location on the ground
with the corresponding location on the map. The

shape and size of the sampling unit must be de-
termined so that observations in the field can
be spatially related and compared to the ground
resolution of the corresponding spatial unit on

the land cover map, which are classified either
as pixels or polygons.

The option for polygon sampling is to auto-
matically generate observation points or areas

Land cover map legend class (SIC ICWC, 2008)

Table 8.

Class

NN

1

WATER

1.1. Water surface

1.2.

Shallows, sometimes with reeds

2

SOLONCHAKS

2.1. Marches without vegetation or with soleros communities

2.2.

2.3.

Wet seaside with seashells, sometimes with isolated specimens of sarsazan and
sclerosal

Crusty-plump and crusty without vegetation, sometimes with single specimens of shrubs
(karabarak, comb)

2.4.

Salt marshes with a blown sand cover with sparse swan and selina communities

2.5.

Sor salt marshes of closed depressions without vegetation, sometimes framed by
sarsazan forests

3

SANDS

3.1.

Plain (with shells) without vegetation or with sparse shrubs (saxaul, comb)

3.2. Dune without vegetation

3.3.

Shallow hilly (weakly fixed) with sparse communities of wormwood, shrubs and selenium
crops

3.4. Hilly and hilly-ridge without vegetation and weakly fixed

3.5. Hilly, hilly-ridge fixed with ephemeral-wormwood-shrub communities

4

PLAINS DELTA AND ACCUMULATIVE

4.1.

Meadows on alluvial plains (reed, herb-grasses) on alluvial-meadow, bog-meadow and
meadow-bog soils

4.2. Desertifying hydromorphic cereal-halophytic forbs with shrubs

4.3.

Shrub thickets (halophytic: tamarix, karabarak)

4.4. Desertifying shrub

4.5.

Shrub-saxaul (desert forests/artificial plantations)

63

within selected polygons. The coordinates of the
points are used to distribute the observation
areas within the selected polygons of the class.
This technique can be adapted according to the
size of the polygon or land cover class, for in-
stance by assigning more than one observation
site on large polygons. The sampling unit is still
a polygon, but the use of multiple representa-
tive observation sites allows the observation of
polygons that are too large to be observed at a
single observation point.

To get an overview, in 2019 an unsupervised
k-means image classification method was ap-
plied to determine the boundaries of spectrally
homogeneous regions/contours representing
homogeneous landscape types. A more detailed
description of the unsupervised classification
method is given in Chapter 5.5. The extracted
polygons are assigned to one of 17 land cover
classes (Table 8) and are the target-sampling
units of the field measurements. Within each
target-sampling unit, one or more locations will
be visited during the field campaign (large poly-
gons may require the collection of GPS data over
multiple locations).

Stage 3: Sampling design

The sampling design describes the protocol
by which sampling units are selected for field ob-
servation. The purpose of the sampling scheme
is to define a proper and transparent selection
process that creates a representative sample of
the map and efficiently allocates available re-
sources. There are two different types of sam-
pling schemes, including probability sampling
and non-probability sampling. Examples of
non-probability sampling are usually used to
collect training data for map classification. An
example would be a “survey of the terrain along
the road,” where the researcher observes “suit-
able” land cover patterns and position along the
road.

Here, the number of measurements after
probability sampling, based on the unsupervised
classification map, is preselected in order to
first stratify the study area to better control the
number of measurements per map class and to
ensure that all classes are well represented for
analysis. The number of samples that are select-
ed from each stratum can be the same for each,
or based on different criteria, such as being pro-
portional to the number of samples per stratum

Fig. 22. Example map of selected samples (left: Google Maps as background; right: unsupervised classification
as background)

64

Preliminary sample quantities by volume of map classes or object area

Table 9.

Land cover map classes and polygon area

Required number of samples

< 12 classes or < 4,000 km2

> 12 classes or > 4,000 km2

50

75-100

or area. We selected samples proportional to the
area of the stratum (Fig. 22).

Stage 4: Selecting the number of samples

One of the most important questions when
planning field measurements is to determine
how many samples are needed in total and how
many samples should be allocated to each layer
(map class) to get a satisfactory estimate of map
accuracy. In general, the more samples collect-
ed, the higher the reliability of the estimated
map accuracy result, but for a certain number
of samples, the level of reliability that addition-
al samples can create is negligible. Moreover,
field studies are expensive, so it is desirable to
find the optimal number of samples to collect
as a compromise between the required level of
reliability and available resources for ground
measurement.

Often the number of measured samples of-
fered for verification (comparison) is derived
from non-statistical analyses, empirically, or
simply from the experiments of experts. For
example, the approach proposed by Congalton
(1991) determines the number of samples per
map class or strata according to the number of
classes and the size of the test plot. This “rule
of thumb” should provide a guideline for esti-
mating the appropriate number of all samples
needed (Table 9).

Following this approach we planned to take a
minimum of 1,275 samples, since the total area
of the study site is less than 4,000 km2 (about
2.2 million hectares), and the number of un-
controlled land cover classes under study is 17
classes (i.e., 17x75 = 1,275 samples).

Stage 5: Survey instructions

The survey guideline defines what data are
collected in the field and how they should be
appropriately collected. Field measurement, or
benchmark data collection, is a fundamental
step in confirming the accuracy of any model re-
sults. The accuracy assessment assumes that the
field data collected are accurate (reflecting the
reality of the study area) and representative/
representative but based on an independent
sample of land cover.

Expeditions in 2019-2020 were expected to
follow previous and known routes with good ac-
cessibility as much as possible, for instance the
same routes as 2006, 2007 and 2009 (Fig. 23). It is
recognised that not every pre-selected sampling
point can be reached. Water points (water-logged
areas) close to the shoreline, where soils are
likely to be wet and inaccessible to vehicles, as
well as sand dunes, dunes, and dense vegetation
along the road, will be omitted. Also, if the point
is located in the middle of a polygon or close
to the boundary between two class polygons, it
may be necessary to adjust the route.

65

Fig. 23. Location of field points of the previous routes from the expeditions to the dried Aral Sea bed in 2006,
2007 and 2009, on a background of Google Maps

Stage 6: Conducting field work

The following is the fieldwork required to de-
termine GPS coordinates of typical landscapes
of the area:
 Daily preparation and planning of the route

using prepared maps of previous expeditions
(Fig. 24);

 Marking GPS coordinates of points with

visual inspection of vegetation cover, soil
features and landscape description within a
radius of 50-100 metres:

 Digital photos (at least four in each



direction: north, east, south and west);
Input of data from the GPS navigator,
photos into the computer and backup
after each trip (route);

 Daily comparison of collected GPS points
for each of the 17 classes prepared by
the method of unsupervised classifica-
tion..

 Daily entry of visual observations in the field

book (Table 10).

66

Field book for entering visual survey data

Table 10.

67

5.3. Expedition routes

Routes for the expedition were determined
considering the changes of the previously stud-
ied eco-landscape (studies that were conducted

in 2006-2007 and 2009). In total, 33 routes were
organized during 2019-2020, and 2,142 sites/
points were visited (Table 11, Fig. 24).

Fig. 24. Travel routes and number of sites/points visited during the two expeditions in 2019-2020, on a
background of Google Maps

68

Routes and number of points of the two expeditions in 2019-2020

Table 11.

№

Name of the route

Number of points
(numbering)

1st expedition, 2019

Route #1: From Camp #1 towards Polder Adjibay-1 and back in a circle.
Direction from Camp: South and South-West.

Route #2: From Camp #1 to the road to Chinka. Direction from Camp:
South-West and West.

Route #3: From Camp #1 to the West Sea shoreline. Direction from Camp:
North and North-West.

Route #4: From Camp #1 towards the Sudochie-Adjibay hydrogeological
site. Direction from Camp: North.

Route #5: From Camp #1 in the direction of the Mejdurechenskaya
Reservoir (through the “Tigroviy Hvost” (Tiger’s Tail)). Direction from
Camp: South.

Route #6: From Camp #2 towards Polder Adjibay-2 (between Muynak Dam
and Rybatsky to the old riverbed of Injeneruzyak). Direction from the
camp: North and North-East.

44 (Т.1-44)

51 (Т.45-94)

42 (Т.95-136)

67 (Т.137-203)

46 (Т.204-249)

66 (Т.250-315)

Route #7: From Camp #2 towards the dried bottom of the East Sea (along
the Amudarya riverbed). Direction from Camp: North and North-East.

41 (Т.316-356)

Route #8: From Camp #2 towards Polder Djiltyrbas-1, along the coastline
(Berdybek). Direction from Camp: East.

Route #9: From Camp #2 towards the zero marker. Direction from Camp:
North and North-West.

Route #10: From Camp #3 in the direction of the island “Revival”. Direction
from Camp: North.

Route #11: From Camp #4 (from «Nulyovka»/zero marker) to the north-
western part of the Muynak reservoir. Direction from Camp: South.

Route #12: From Camp #4 to the «Aral» village and then the experimental
area of the International Innovation Center for the Aral Sea Region and
around the Muynak reservoir. Direction from camp: South, South-East.

63 (Т.357-419)

124 (Т.420-550)

270 (Т.551-819)

92 (Т.820-911)

112 (Т.912-1023)

Route #13: From Camp #4 along the shoreline (through «Tigroviy Hvost»).
Direction from Camp: North.

94 (Т.1024-1117)

Route #14: From Camp #4 to the Amudarya riverbed (through Parlantau).
Direction from Camp: North-South and South-North (circle).

152 (Т.1118-1269)

Route #15: From Camp #4 to the Northern part of the lake Sudochie (along
the dam). Direction from the Camp: West and North.

104 (Т.1270-1373)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

69

№

16

17

18

19

1

2

3

4

5

6

7

8

9

10

11

12

13

14

Name of the route

Route #16: From Camp #4 in the direction of the unstable ecological zone
- sand dunes through Sudochie Lake. Direction from the camp: West and
North.

Number of points
(numbering)

24 (Т.1374-1400)

Route #17: From Camp #4 in the direction of the “Neftyanoy burovoy”.
Direction from Camp: North.

53 (Т.1401-14 53)

Route #18: From Camp #4 to Kyzyljar, and the Tek Uzek Canal. Direction
from Camp: South.

Route #19: From Camp #4 to the North-East of Sudochie Lake. Direction
from Camp: South and South-West.

72 (Т.1454-1525)

72 (Т.1454-1525)

2nd expedition, 2020

Route #1: From Camp #1 to Akkala (along the Varashilov Canal to the bank
of the new Amudarya River channel (Urdabay channel)). Direction from
Camp: West-North-West-North.

69 (Т.1-69)

Route #2: From Camp #1 to Akkul. Direction from the camp: North.

55 (Т.70-120)

Route #3: From Camp #1 to the Kazakhdarya Dam (Amudarya channel).
Direction from Camp: West-South-West.

Route #4 (crossing): From Camp #1 to Camp #2 (central camp of forestry).
Direction from the camp: South-South-East-North.

Route #5: From Camp #2 to the temporary bridge of Kokdarya. Direction
from the camp: North-North-East.

Route #6: From Camp #2 to soil section #22 from 2005. Direction from
Camp: North-East-North.

22 (Т.121-142)

49 (Т.143-191)

43 (Т.192-233)

18 (Т.234-251)

Route #7: From Camp #2 to soil section #21 from 2005. (Along the border of
barchans with a height of 6-8 metres). Direction from the camp: North.

42 (Т.252-293)

Route #8: From Camp #2 to the Northern Camp of the forestry enterprise.

4 (Т.294-297)

Route #9: From Camp #2 to the right bank of the Kokdarya.

Route #10: From Camp #2 to soil sections from 2005.

Route #11: From Camp #2 to the left bank of the Kokdarya.

Route #12: From Camp #2 to the Route - Wellhead of the Hydrogeological
Service.

Route #13: From Camp #2 to the Chinese Canal “Gazarkent”.

Route #14: From Camp #2 to the Djiltyrbas Dam.

36 (Т.298-331)

2 (Т.332-333)

47 (Т.334-380)

89 (Т.381-469)

29 (Т.470-499)

62 (Т.500-561)

70

5.4. Satellite data pre-processing

images

In preparation for the field studies and to
determine the routes for studying the land-
scapes of the dried Aral Sea bed, the prelim-
inary analysis and processing of satellite im-
ages from Google Earth (ver. 7.3.2.5776) and
satellite
from Sentinel-2, Landsat
5 Thematic Mapper (TM) and Landsat 8 OLI
(Operational Land Imager) were downloaded
from the EarthExplorer (https://earthexplorer.
usgs.gov) archive, and a search was performed.
After registering on the site, this archive can be
accessed both to simply browse the catalogue
and to directly retrieve stored materials.

Google Earth bases its data on satellite
images from Landsat (resolution 15 m/pixel),
GeoEye-1 (0.41 m/pixel) and QuickBird-2 (reso-
lution 0.68 m/pixel), obtained from DigitalGlobe
(Stupin, 2011). All these images have the
Universal Transverse Mercator (UTM) cylindri-
cal projection using the WGS 84 coordinate
system.

The operator of the Sentinel-2 mission is
the European Space Agency (ESA), which makes
the imagery data publicly available to any
user. The Sentinel-2 imagery is systematically
processed at Level 1C by the Data Processing
Center (PDGS). The Level 1C product consists of
100x100 km2 tiles (orthoimages in UTM/WGS84
projection).

The Landsat 5 and Landsat 8 missions
are operated by the USGS Earth Resources
Observation and Science Center (EROS Center)
in partnership with NASA. The Landsat 8 image

has a Level 1 systematic processing (after geo-
metric and atmospheric correction and radio-
metric calibration) and consists of tiles with
a preliminary scene size of 170 kilometres
(north-south) and 183 kilometres (west-east) in
UTM/WGS 84 projection (EROS, 2015). It should
be noted that all satellite and remote sensing
systems have four types of resolution.

1. Spatial resolution determines the linear
dimensions (pixels) of an image, i.e., the ground
surface area covered by a pixel image. A large
area covered by a pixel means a low spatial
resolution and vice versa. The spatial resolu-
tions of Sentinel-2, Landsat 5 and Landsat 8 are
presented in Table 12.

2. Spectral resolution corresponds to the
number of EM spectrum bands and the size of
survey zones registered by the survey equip-
ment. Spectral resolutions of Sentinel-2,
Landsat 5 and Landsat 8 channels (band) are
given in Table 12.

3. Temporal resolution determines how often
the sensor acquires images of a certain area on
the Earth’s surface. While Sentinel-2 receives
images every 10 days, Landsat 8 receives imag-
es every 16 days.

4. Radiometric resolution corresponds to the
width of the dynamic range of the used space-
craft sensor, i.e., the number of sampling levels
corresponding to the transition from black to
white colour (sensor sensitivity to the value of
received EM energy).

71

Spatial and spectral resolutions of Sentinel-2, Landsat 5 TM (Thematic Mapper) and Landsat 8 OLI
(Operational Land Imager) satellite images

Table 12.

Channels *

Spectral resolution
range, µм

Spatial resolutions,
м

Sentinel-2 (Immitzer et al., 2016)

Band 1 – Coastal/aerosol

Band 2 – Blue

Band 3 – Green

Band 4 – Red

Band 5 – Red Edge 1

Band 6 – Red Edge 2

Band 7 – Red Edge 3

Band 8 – Near infrared (NIR1)

Band 8A – Near infrared (NIR2)

Band 9 – Water vapor

Band 10 – Cirrus

Band 11 - Infrared short wave (SWIR1)

Band 12 - Infrared short wave (SWIR2)

Band 1 – Coastal/aerosol

Band 2 – Blue

Band 3 – Green

Band 4 – Red

Band 5 – Near infrared (NIR1)

Band 6 – Infrared short wave (SWIR1)

Band 7 – Infrared short wave (SWIR2)

Band 8 – Pancromatic (PAN)

Band 9 – Cereus (Cirrus)

Band 10 – Thermal IR (TIR1)

Band 11 – Thermal IR (TIR2)

0.430 - 0.457

0.440 - 0.535

0.537 - 0.582

0.646 - 0.684

0.694 - 0.713

0.731 - 0.749

0.769 - 0.797

0.773 - 0.908

0.848 - 0.881

0.932 - 0.958

1.337 - 1.412

1.539 - 1.682

2.078 - 2.320

0.435 – 0.451

0.452 – 0.512

0.533 – 0.590

0.636 – 0.673

0.851 – 0.879

1.566 – 1.651

2.107 – 2.294

0.503 - 0.676

1.363 - 1.384

10.60 - 11.19

11.50 - 12.51

60

10

10

10

20

20

20

10

20

60

60

20

20

30

30

30

30

30

30

30

15

30

100

100

Landsat 8 OLI (EROS, 2015)

72

Channels *

Spectral resolution
range, µм

Spatial resolutions,
м

Landsat 5 ТМ (Source: https://landsat.gsfc.nasa.gov/the-thematic-mapper/)

Band 1 – Blue

Band 2 – Green

Band 3 – Red

Band 4 – Near Infrared (NIR)

Band 5 – Infrared short wave (SWIR1)

Band 6 – Brightness thermal (temperature)

Band 7 – Infrared short wave (SWIR2)

* The channels highlighted in colour are used to analyse the data.

0.45 – 0.52

0.52 – 0.60

0.63 – 0.69

0.76 – 0.90

1.55 – 1.75

10.40 – 12.50

2. 08 – 2.35

30

30

30

30

30

120

30

The Sentinel-2 image was used exclusively for
the preparation and planning of the expedition,
while Landsat 5 and Landsat 8 were used to cre-
ate maps in 2006 and 2019/2020, respectively.

In total, five tiles of the Landsat image cover
the whole territory of the Uzbek part of the

Aral Sea (water area of 1960, Fig. 25, left). Forty-
seven images in 2019 (Fig. 26) were used to cre-
ate the classification and risk zone maps, while
in 2006 thirty-three images from four Landsat
tiles (tracks 160-161, lines 29-30) were created.
Although some tiles partially cover the gener-
al area, they were used to fill in the gaps and

Fig. 25. Map of Landsat’s five-tile coverage of the Uzbek part of the Aral Sea (left) and two tiles of the study
area of all expeditions (right),on a background of Google Maps

73

achieve complete coverage within the two 2019-
2020 expeditions.

In 2019-2020, two tiles from Landsat 8 with
cloud cover of up to 20 percent (path 161, lines
29-30) were used to analyse the spectral bright-
ness ratio of the reflecting surface (surface
reflectance, mainly OLI sensor 1-7) of ground
objects (landscapes), and to develop a linear
regression of the supervised classification mod-
elling so that clouds do not cover the study area
(Table 13). All of the 2006-2007 and 2009 expedi-
tion points, as well as those for 2019-2020, are
within these two Landsat tiles (Fig. 25, right).

The U.S. Geological Survey (USGS) provides
Landsat 8 surface reflectance data for the

Operational Land Imager (OLI) / Thermal Infrared
Sensor (TIRS) sensors on request through
EarthExplorer. Surface Reflectance products are
already processed at the EROS Center at a spa-
tial resolution of 30 metres. The EROS Science
Processing Architecture (ESPA) interface corrects
these images on demand. All Landsat 8 imag-
es from the site archive are converted into re-
flectance values (surface reflectance), so they
can be directly used for analysing the spectral
brightness coefficient of reflecting the surface of
ground objects, as well as for calculating vegeta-
tion indices.

Quantum GIS software (QGIS, ver. 2.18.24) and
R language (RStudio, ver. 3.4.0) were used to pro-
cess these images.

Table 13.

List of Landsat 8 images used to analyse the spectral brightness coefficient of the reflecting surface (surface
reflectance) based on field data from Expeditions 1 and 2, 2019-2020

Date

20 March 2019

20 March 2019

7 May 2019

7 May 2019

23 May 2019

23 May 2019

8 June 2019

8 June 2019

24 June 2019

24 June 2019

11 Aug 2019

11 Aug 2019

12 Sept 2019

12 Sept 2019

Tile paths

Path

Row

Cloudiness, %

Angle of
azimuth of the
sun, о

161

161

161

161

161

161

161

161

161

161

161

161

161

161

29

30

29

30

29

30

29

30

29

30

29

30

29

30

151.73

150.61

145.68

143.66

142.34

139.98

138.98

136.32

136.87

134.13

143.58

141.65

153.60

152.34

8

12

0

3

8

6

0

0

0

0

3

20

0

9

74

Sensor
(channels)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

Date

28 Sept 2019

28 Sept 2019

14 Oct 2019

14 Oct 2019

2 Feb 2020

2 Feb 2020

22 March 2020

22 March 2020

9 May 2020

9 May 2020

25 May 2020

25 May 2020

10 June 2020

10 June 2020

Tile paths

Path

Row

Cloudiness, %

Angle of
azimuth of the
sun, о

161

161

161

161

161

161

161

161

161

161

161

161

161

161

29

30

29

30

29

30

29

30

29

30

29

30

29

30

8

18

6.5

1.3

0.1

0

4.8

8.5

0.44

0

0

0

0

0

158.00

157.00

161.39

160.58

154.52

153.72

151.54

150.39

145.08

142.99

141.66

139.22

138.44

135.74

Sensor
(channels)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

OLI (Band1-Band7)

5.5. The Unsupervised Classification Technique

Classification is one of the main tasks of sat-
ellite images processing, and it requires the use
of specialised software packages. Image classifi-
cation techniques involve the process of quan-
tifying data from images and grouping points
or parts of an image into classes designed to
represent different physical objects or types.
The result of the image classification process is
classification maps.

algorithm) is used in the absence of a priori in-
formation (ground data) about the survey object
and is mainly used for the preliminary selection
of test fields for determining the survey route.
As cluster analysis belongs to digital automated
methods of processing space images, it allows for
singling out contours with non-contrast spectral
brightness structure, such as vegetation, open
soil and water, and other objects.

Two types of classification are known:


Classification without training (unsuper-
vised classification)
Classification with training (supervised
classification)



In this section, we will look at the methodolo-
gy of unsupervised classification. Unsupervised
classification (sometimes called the clustering

75

The most popular among unsupervised clas-
sification (clustering) algorithms are k-means
and ISODATA algorithms. In our case, we used the
k-means algorithm in the Quantum GIS software
package (QGIS, version 2.18.24) (Theiler & Gisler,
1997). For this purpose, the combined method of
Iterative Minimum Distance and Hill-Climbing in
the software module QGIS - SAGA GIS (2.3.2) was
chosen (Forgy, 1965; Rubin, 1967). This method

selects the distribution of expectation values
(i.e., iterations) for images clustering. Given the
available class-legend map of land cover from
2006, which contains 17 specialised classes
(Table 8), we selected 17 clusters and 100 itera-
tions. During the first iteration of clustering, the
space is evenly divided into regions, each cen-
tred on the average vegetation index (NDVI) val-
ues of the clusters. After iteration, the real mean
values of spectral features on the obtained clus-
ters are calculated, because their mean values
vary depending on the predominant brightness
of the pixels caught in them. Then a second it-
eration is performed, during which the cluster-
ing is repeated with new mean values and the

cluster boundaries are calculated. After that, the
new mean values are determined, and a new
iteration is performed. Such recalculations are
repeated until all pixels with a given probability
(convergence threshold) fall into a cluster (Table
14).

The NDVI raster layers of the two tiles (path
161, lines 29-30) calculated from the two-channel
ratio
(Rouse
((Band5-Band4)/(Band5+Band4))
et al. 1973) of the Landsat 8 OLI image from 12
September 2019, were the basis for automati-
cally dividing the image pixels into 17 groups of
similar pixel spectral characteristics (Fig. 26).

Statistical parameters of Landsat 8 OLI image clustering, 12 September 2019

Table 14.

Cluster ID

NDVI average value

NDVI standard deviation

P161R029

P161R030

P161R029

P161R030

0

1

2

3

4

5

6

7

8

9

10

11

12

13

14

0.364

-0.903

-0.992

0.245

0.178

-0.826

-0.751

0.126

-0.677

0.092

0.640

-0.607

0.064

-0.533

0.039

0.3052

-0.7393

-0.6514

0.2320

-0.5704

0.1730

-0.4818

0.1230

-0.3807

-0.2768

0.3973

0.0841

-0.1632

0.0570

0.6952

76

0.048

0.024

0.015

0.025

0.017

0.021

0.021

0.012

0.021

0.009

0.094

0.021

0.008

0.034

0.006

0.0235

0.0393

0.0231

0.0189

0.0246

0.0157

0.0273

0.0127

0.0297

0.0316

0.0324

0.0092

0.0331

0.0108

0.0593

Cluster ID

15

16

NDVI average value

NDVI standard deviation

P161R029

P161R030

P161R029

P161R030

-0.246

0.023

0.5373

-0.0482

0.082

0.007

0.0439

0.0317

Fig. 26. Map of uncontrolled classes based on Landsat 8 OLI from 12 September 2019 on a background of
Google Maps

77

6 Results

Comprehensive studies of the dry bed of the
Aral Sea have allowed for a clear understanding
of many aspects of its present condition. Based
on the analysis of the obtained materials, ex-
perts have described the area, reflected on the
main causes of desertification, identified envi-
ronmental risk zones, and proposed ways for
preserving the unique, natural site.

This chapter includes the results of hydrogeo-
logical, soil, environmental, botanical and den-
drologic studies.

Special attention is paid to the use of satel-
lite images and Geographic Information System
(GIS), which has allowed for a dynamic evalua-
tion of a large area.

6.1. Hydrogeological studies results

The studied objects were the unconfined water
basins located at the unconfined and confined
left and right riverbanks of the Low Amudarya
unconfined water and confined groundwater de-
posits of the Ustyurt and South-Aral region arte-
sian basins. Areas and sites showing man-made
impacts on groundwaters at the dried part of the
Aral Sea in Karakalpakstan were also included in
the survey.

Mainly, the studies were conducted in two
areas. The first research area was located on
the left riverbank of the Amudarya River from
the eastern cliff of the Ustyurt Plateau to the
Amudarya River (Ustyurt Artesian Basin) and the
right riverbank of the Amudarya River from the
Kokdarya River channel to the north-western
edge of the Kyzylkum Desert (South Aral Region
Artesian Basin). This research area was bounded
by irrigated lands in the south, impassable dried
sand-dune shores of the Aral Sea in the north,

and the Djiltyrbas Lake in the east. The second
research area stretched from the Djiltyrbas Lake
to the Kokdarya River channel at the eastern
boundary, and the KS-3 and Karauzyak collectors
in the south. In the north, there are also impass-
able saline lands of the Aral Sea’s dried bed.

The main tasks were to study the current
status of groundwater hydrogeological condi-
tions, predict changes, and the hydrogeological
processes induced by natural and man-made
factors.

During the research, in order to achieve the
objectives of the targeted tasks, the groundwater
table and quality were measured. Their transfor-
mations caused by natural and man-made fac-
tors were recorded to predict revealed changes
in the groundwaters, their interaction with the
environment, as well as to develop recommen-
dations for elimination of the consequences

78

caused by negative processes. All targeted tasks
were solved by means of surveys of the area and
observation points, by measuring the ground-
water table, and sampling water from the wells
encountered during the two survey expeditions.

6.1.1. Analysis and evaluation of study
results

As previously mentioned, aquifers of pres-
ent-day marine sediments on the southern shore
of the retreated part of the Aral Sea are bound
from the south by contours of the water table
at the absolute elevation of 50 metres, from the
north by the Aral Sea, from the east by an old
river channel of the Akchadarya River and the
northern shore of the Kyzylkum Desert, and from
the west by the Ustyurt cliff. These are what can
be conventionally called the Northern-Ustyurt

and Southern-Aral hydrogeological regions of
ground and confined waters.

Hydrogeological conditions are characterised
here by the distribution of aquifer systems of
the marine New Aral (ma) and underlying alluvi-
al-lake Amudarya (al) and marine (m1) Holocene
deposits, and all have ubiquitous distribution
within the dried seabed.

The groundwater regime within the Aral
Sea’s dried bed is influenced both by the drop
in the sea’s level, which is the regional base of
its discharge, and by periodic discharges from
Sudochie Lake and Rybatsky Bay.

The hydrochemical status of groundwater is
formed under the influence of climatic, hydro-
logical and land improvement factors, as well as
irrigation.

Fig. 27. Layout of hydrogeological sections located on the dried seabed

79

Fig. 28. Observation hydrogeological wells at the Sudochie-Adjibay and Muynak River sections – the
groundwater table at the Muynak part of the dried seabed, as of the year

80

Fig. 29. Observation hydrogeological wells at the Sudochie-Adjibay and Muynak River sections – the
groundwater table at the Muynak part of the dried seabed, as of the year 2019

81

Characteristics of the level and hydrochem-
ical status of the groundwater of the Muynak
part, the first from the surface aquifer systems,
are given for two hydrogeological sections (Fig.
27). These include Sudochie-Adjibay and Muynak
in both the first and second expeditions, and the
Djiltyrbas part and Akkala section in the second
expedition. Due to the draining of the sea and
the drop in the groundwater table, the Muynak
and Akkala sections have been closed since 2010,
and no observations are currently conducted.

The Sudochie-Adjibay section

This section is located in the western part of
the dried seabed between the Ustyurt cliff and
the Aral-Kyzylkum swell and consists of 10 hy-
drochemical clusters (GHK) of wells (Figs. 28 and
29). The wells characterise the groundwater sta-
tus, Holocene, Pleistocene and partially Upper
Cretaceous (Turonian, Coniacian and Santonian
stages).

The hydrogeological conditions of the station
location are characterised by the distribution of
aquiferous complexes of marine New Aral (ma)
and underlying alluvial-lake Amudarya (al) and
marine (m1) Holocene deposits, and they have
ubiquitous distribution within the western part.

Changes in level depth over a multi-year
period (2004-2017), depending on the loca-
tion of hydrogeological observation wells, are
shown based on multi-year groundwater level
observations.

The section GKH-5 is located at the greatest
distance from the sea (Fig. 30). The groundwater
level was at a depth of 7.9 metres in 2017. This
level occurred to be equal to 1.33 metres, and
had changed insignificantly over 13 years, at a
rate of 0.1 metres per year. The small by-year
changes in groundwater level and salinity (in
70 g/l) can be explained by the influence of the
Adjibay Bay.

Changes in the depth of the groundwater
table and groundwater salinity in well GHK-7,

located in the south of the section, are due to
the influence of the Sudochie-Karadjar polder
system. If one considers the trend in dynamics
of the groundwater table, it should be noted that
the changes were insignificant, from 5.5 metres
in 2004 to 5.04 metres in 2011. At the same time
there were sharp changes in the period of 2011-
2017 from the groundwater table at 5.04 metres,
to the groundwater table of 1.7 metres in 2017,
with the average amplitude of fluctuations in
this period being 0.48 metres per year. There is
a level rise of 0.6-0.9 metres in 2013 and 2016.
Groundwater salinity varies within a wide range
of values from 54.7 to 29.1 g/l. Groundwater table
and salinity change dynamics in the wells of the
Sudochie-Adjibay section for a given period of
time is shown in Fig. 31. Discharges from the
Sudochie Lake influence the groundwater table
regime, which is manifested in the rise in level
and a salinity decrease.

The wells of GHK-3, located in the middle
part of the section (Fig. 32), saw the depth of the
groundwater table over a multi-year period from
2004 to 2006 change from 1.18 to 0.3 metres. The
decrease in the groundwater table from 2006 to
2017 from 0.3 to 4.22 metres is associated with a
decrease in the level of the Rybatsky reservoir,
which directly affects the groundwater regime of
the observation points of this section. Changes
in salinity have varied from 25 g/l to 100 g/l.

The closest to the shoreline as of 2017 is the
GHK-801 cluster of wells (Fig. 33), where the
groundwater table is more dependent on the
sea level. Between 2009 and 2017, the ground-
water table decreased by 1 metre and practically
settled at 7 metres with salinity of 30 g/l. For in-
stance the decrease was at a rate of 0.1 metres
per year.

As one can see from Fig. 34, a level decrease
is observed in the wells located on the periphery
of the Amudarya River delta outside the dried
seabed and in the wells located in the north of
the section.

82

Fig. 30. Dynamics of the groundwater (GW) table and salinity of the Sudochie-Adjibay section at the cluster of
wells GHK-5

The study indicated that the groundwater
level regime changes from south to north. In
the wells located in the southern part of GHK-
6-7, the level rose by 0.37 metres until the fall
of 2015, and in 2017, the level decreased to the
initial marks.

In the northern direction, the influence of dis-
charges from the delta reservoirs decreases as
the modern sea level is approached (Figs. 28 and

29), and the regime of changes in the groundwa-
ter table of the northern wells is determined by
the natural decrease in the sea level.

The problem of interaction between the
sea and groundwater and its influence on the
groundwater has been studied for many years.
The search for an answer was complicated by
the fact that this influence was very weak and
could not be detected by existing techniques

Fig. 31. Dynamics of the groundwater level and salinity of the Sudochie-Adjibay section at the GHK-7
hydrochemical cluster of wells

83

Fig. 32. Dynamics of the groundwater level and salinity in the Sudochie-Adjibay section at GHK-3

and research methods. Some groundwater back-
up from the sea existed, but the flow was so
negligible that it was impossible to measure this
back-up.

The data obtained earlier (by the ARAL-KUM
project) proved that groundwater moves towards
the sea, but discharges in the backwater zone,
represented by a strip which is 250 metres wide

Fig. 33. Dynamics of the groundwater level and salinity of the Sudochie-Adjibay section by GHK-801(2)

84

Fig. 34. Groundwater tables in the sections of the GHK located relative to the shoreline

Fig. 35. Map of groundwater salinity

85

on average, adjacent to the sea level at the time
of studies. Groundwater outflow does not partic-
ipate in the Aral Sea balance. The observed out-
flow along the dried seabed almost completely
evaporates into the atmosphere. Discharge of
groundwater from the Cretaceous sediments
through vertical filtration into the Aral Sea in-
creased from 1.23 m3/sec (0.04 km3/year) in 1960
to 1.8 m3/sec (0.06 km3/year) in 1990. The total
value of groundwater and confined groundwater
discharge was 4.67 m3/sec or 0.14 km3/year from
the area under consideration, in other words in-
creasing two times compared with 1960.

According to the latest data, groundwater dis-
charge into the Aral Sea hollow is 0.12 km3/year.

In general, the magnitude of underground
flow into the Aral Sea is too small compared to
surface flow and in no way affects the position of
the Aral Sea level.

Long-term observations show that the influ-
ence of the Aral Sea on the groundwater table
position extends up to 15-25 kilometres from the
initial shoreline. The stabilisation of groundwa-
ter tables in recent years indicates that there is
practically no relation between the present sea
and groundwater in the delta.

Nevertheless, the question of the ground-
water role in the overall Aral Sea water balance
cannot yet be considered completely solved, be-
cause the answer is associated with numerous
factors that are difficult to study and take into
account.

Due to further dewatering of the sea and the
loss of groundwater and sea level contact, three
new hydrogeological monitoring clusters of wells
were installed in July 2019 at the new dewatered
area of GHK-6, GHK-8 and GHK-9 (Figs. 29 and 36).

Fig. 36. Groundwater table monitoring wells, GKH-6, installed in July 2019, Sudochie-Adjibay section

86

Fig. 37. Groundwater tables , metres, Muynak section, NP 1

Fig. 38. Self-discharging wells on the road to Vozrojdenie (Ascension)

87

This section is located to the east of the
Muynak peninsula and includes three hydro-
chemical clusters of wells. The long-term obser-
vations at this site show that within the Muynak
part covering the dried seabed, dynamics of the
level and hydrochemical regimes of groundwa-
ter in the GHK-3-5 wells located to the north of
the site depends only partly on the groundwa-
ter flow coming from the Rybatsky polder and
the Amudarya riverbed, and is mainly directly
determined by the Aral Sea shoreline retreat.
Due to the retreat of the sea and the lowering

of the groundwater level (Fig. 37) in the obser-
vation wells, observations were suspended at
the Muynak site in 2010. At present there are two
abandoned wells and the last measurements
have resulted in the following information: Well
2 - 1.97 metres, x - 43°54’00”, y - 58°59’22.6” and
in Well 3 - 2.13 metres, x - 44°01’09”, y - 59°05’26”.

Three self-discharging wells were drilled on
the dried seabed of the Eastern Sea (Fig. 38).
Their characteristics are shown in Table 15.

Table 15

Information about the Aralkum GGP wells for the year 2019

Filter installed
interval
185-195
210-220
218-295

240-270

170-190
300-320
185-205
290-310

247-275

245-275
305-315
200-225
255-270
190-200
220-250

196-206
216-236

№

Number
of well

1

2

3

4

5

6

7

8

1

2

3

46

44

3

42

1

38

36

35

1 profile
(Shagal
site)

2 profile
(Umid
site)

3 profile
(0km)

Depth of the
well, m

Salinity,
g/l

Hardness,
eq/mlg

GW table

Note for
orientation

350

350

350

345

344

322

350

334

40.3

62.5

45.1

54.5

47

28.1

34

45.5

168

158

288

280

300

190

198

210

Muynak cleaning

300

3

2.5

Self-discharge
+7l/sec.

Self-discharge
+5 l/sec

14,0(10,0 km)

25,0(7,0 km)

2.9

3.39

3.14

1.3

0

82(1,2k m)

84(12 km)

8.74

98(2 km)

Self-discharge
+7 l/sec

On the NE
side of the
Vozroj-denie
island.

110

170

32.1

201

-

-

1.3

5.2

15 reverse
calculation
from 0 to the
left

88

The Akkala section

Is located in the central part of the first sec-
tion between the Aral-Kyzylkum swell and the
Djiltyrbas Lake. At present, out of five observa-
tion points, we have found only four clusters of
wells consisting of two and three wells in each
cluster. The first cluster, 437 (Fig. 39), consists of
three wells (234, 235 and 236) with depths of 40,
21 and 10 metres, respectively, and is located on
the northern outskirts of the Kazakhdarya set-
tlement. Groundwater tables produced through
the survey were within the ranges of 2.37 metres
in well 234, 3.77 metres in well 235 (Fig. 40) and
9 metres in well 236. Water samples were taken
from each well for laboratory chemical proper-
ties analysis. Groundwater salinity in the wells
was within 5.2, 2.7 and 8.4 g/l at water hardness
of 50.2, 14 and 46 mg-eq/l, respectively.

The second cluster 111 consists of three wells
(1, 2 and 3) with depths of 31, 18 and 11 metres,
respectively, and is located 16 kilometres north-
west of the Kazakhdarya settlement (NP 437). At
present, only one well exists out of the three. The
groundwater table during the survey was with-

in 7.12 metres. Salinity of groundwater sampled
from the well was 6.4 g/l with a water hardness
of 57.1 mg-eq/l.

The third cluster 112, consisting of four wells
(1, 2, 3 and 4) with depths of 68, 31, 18 and 10.7 me-
tres, respectively, is located 11 kilometres north
of observation point 111. All four wells were avail-
able at the time of the survey. The fourth well
turned out to be drained. Groundwater tables
in those wells were between 9.05-10.79 metres.
Salinity of groundwater sampled from the wells
was 24.1 g/l with a hardness of 132.0 mg-eq/l.

The fourth and last cluster of the Akkala sec-
tion is located on the former sea shoreline with
an absolute marker of 46 metres. The section
consists of 4 wells (1, 2, 3 and 4) with high el-
evations, up to 2.5 millimetres. The reason for
such high elevations cannot be explained. The
depths of the wells are 92, 51, 28 and 6.5 metres,
respectively. During the survey, the fourth well
turned out to be drained. In the second and
third wells it was impossible to measure levels
and take water samples due to the welded cover.
Groundwater tables in them were within 5.79

Fig. 39. Groundwater table regime, from 2001 until 2020

89

Fig. 40. The Akkala section for groundwater
observations

Fig. 41. Farm well near the Voroshilovskaya
breakthrough (the Mailyozek channel)

metres, and in the last well, it was dry at a depth
of 11.7 metres. Salinity of groundwater sampled
from the well was 33.6 g/l with a water hardness
of 134.0 mg-eq/l.

The length of the section is more than 40 ki-
lometres of off-road terrain with very difficult
conditions, with alternate routes around loose
sands and sand-dunes. In addition, on this first
section we surveyed four deep self-discharging
wells installed on a Cretaceous aquifer aimed
to provide a water supply to livestock farms,
forestry farms and small-oasis irrigation. When
surveying all of the deep self-discharging wells
encountered along the way, water flow rates
were measured whenever possible and water
samples were taken for chemical analyses.
Flow rates of self-discharging wells were up to
2-3 l/sec, while water temperature was 40-45°C.
Salinity of groundwater sampled from these four
wells was within 1.7-2.5 g/l with a water hardness
of 3.4-7.0 mg-eq/l.

In addition, one well (Fig. 41) (Tn 28) with a
depth of 7 metres was found in the lowland (at
a shepherd location near the farm, at the edge
of the old Mailyozek channel of the central part
of the site). The water level in the well was 1.97
metres from the ground. The salinity of under-

ground water sampled from the well was within
2.6 g/l, at a water hardness of 16.0 mg-eq/l.

The groundwater table level regime both
throughout the Aral Sea water area and the stud-
ied area changes from south to north. In the wells
located in the southern part, near watercourses
and lakes, the level elevation was observed to
be 0.2-0.5 metres, which continued until autumn
(during the vegetation period), while during the
non-growing period the level decreased to the
initial marks.

Discharges from the Djiltyrbas Lake, collectors
KS-1 and KS-3, as well as from the Kazakhdarya
channel, influenced the groundwater level re-
gime through a level elevation and salinity
decrease.

In the northern direction, as we approached
the present-day sea level, the influence of dis-
charges decreased and in the northern wells
the regime of changes in the groundwater table
was determined by a natural decrease in the sea
level.

The second site, as noted above, is located
between the Djiltyrbas Lake and Kokdarya on the
eastern border, and to the south the KS-3 and
Karauzyak collectors. This section is very poorly
studied in terms of hydrogeology. The length of

90

Fig. 42. The Daryabay hydrant

this section is longer than 70 kilometres along
off-road terrain with very difficult driving con-
ditions, with bypass routes around loose sands,
swamps, sand-dunes and wet solonchaks.

On the second site there are no observation
points of the state groundwater monitoring
equipped for unconfined groundwater (upper
horizon), and also confined groundwater. We
surveyed four deep (up to 500 metres) self-dis-
charging wells installed on the Cretaceous aqui-
fer, intended to provide water supply for live-
stock farming, forestry farms and small-oasis
irrigation.

Flow rates of self-discharging wells are within
0.8-4.0 l/sec (wells: Aral 2-4 l/sec, Aral 2 - 3 l/sec,
the Nemis hydrant - 1 l/sec, and the Daryabay
hydrant – 0.8 l/sec) (Fig. 42). Water temperature
is 37-41°C. The salinity of the groundwater sam-
pled from these four self-discharging wells is
within 1.6-1.8 g/l with a water hardness of 2.6-
5.2 mg-eq/l.

91

6.1.2. Conclusions

Due to the drying of the Aral Sea and its sur-
rounding region, several complex environmen-
tal, socio-economic and demographic problems
have emerged, having a global origin and conse-
quences, and are manifested through the follow-
ing matters:

 Degradation of the Amudarya River







delta;
Intensification of desertification of a vast
territory;
Salt and dust transfer from the dried
Aral Sea bed;
Pollution and salinisation of water and
land resources;
Shortage of drinking water;


 Depletion of the gene pool of flora and

fauna;



Changes in the climate and landscape of
the Aral Sea region;

 Deterioration of the health of the popu-

lation and its gene pool;

 Disappearance of traditional livelihoods,
such as fish and livestock farming, as
well as hunting.

Land degradation and desertification pro-
cesses occurred as vast areas of salt appeared
on the dried part of the sea, which transformed
into the new Aralkum Desert with an area of
more than 5.7 million hectares, in the territories
of Uzbekistan, Kazakhstan and Turkmenistan.

The retreat of the Aral Sea has exposed huge
underwater areas that are now occupied, as
a rule, by solonchaks and brine lakes with ex-
tremely high salinity.

High evaporation creates additional con-
ditions for even greater salinisation of waters
and soils. Widespread deflation processes and
desertification of the territory create condi-
tions for carrying sand and salts to oases of
Karakalpakstan and Khorezm.

The most important issue for this area is to
solve the migration of salt masses contained in
brines and the salt of Neogene-Anthropogenic
water-bearing formations.

In the period of 1989-1995, researchers of the
Aral Sea region performed the ecological-hydro-
geological and engineering-geological survey of
the dried part of the Aral Sea bed at a scale of
1:200,000 within sheets L-41-XXI. Geochemical,
hydrogeological, engineering-geological and
ecological-geological maps were drawn.

However, the period from 1995 to 2020 saw
changes in the geological environment under
the influence of man-made factors, and it is
obligatory to assess changes in the geological
environment of the studied area since that time.

Further studies of groundwater, confined to
the upper and lower hydrogeological levels, is
of particular importance in the conditions of de-

sertification and the development of harmful ex-
ogenous-geological processes in the South Aral
Sea region. The first one lies above the regional
Senonian-Palaeogene water confining bed and
is characterised by free water exchange with sur-
face and atmospheric waters.

6.1.3. Recommendations

1. The Aral Sea level decrease has had a signif-
icant impact on the change in the groundwater
regime of the Upper Quaternary and modern de-
posits of the Amudarya and Aral complexes only
within the dried seabed, for instance between
the shoreline marks of 53.0 metres abs. (1961)
and 30.0 metres abs. and more (2010-2019).

2. To improve the ecological situation of the
dried part of the Aral Sea it is necessary to
arrange:
 Phytomeliorative protection (forestry farms)

– basic.

 Rational use of water from existing self-dis-
charging wells for free-range livestock farm-
ing, forestry farms, and other purposes.

 Increasing the polder zone areas (moistening
to prevent salt and dust transfer), in case of
surface water shortage, by drilling new water
wells.

 Increasing the number of free-range live-
stock farms with a water supply from
groundwater by drilling new wells in the
Cretaceous aquifer with a salinity of 2-3 g/l.

 A connection with the intensive shoreline

variation and desertification of the Aral Sea
to study the groundwater table level and hy-
drochemical regimes. It would be advisable
to lay a hydro-well between the Djiltyrbas
Lake and the Arkhangelsk swell, equipped
with coupled observation wells located at
every 7-10 kilometres to the upper and lower
aquifers, extended to the impassable area
towards the Aral Sea.

92

6.2. Soil cover of the studied area

The Aral Sea drying out processes led to the
formation of a new soil structure on the dried
seabed.

The parent rock of modern soil formation on
the dried bed has a marine, lacustrine, alluvial
and aeolian genesis.

Initially the seabed is changing due to the
processes taking place, including the outcrop
of the avandelta, the drying of residual lakes
with the formation of brine, oversanding, the
movement of sand masses, and the movement
of sand-dunes.

The initial stage of soil cover formation is
connected with the intensive salinisation of
soils, which have offlapped from below the
water level and are a formation of marsh and
coastal solonchaks. As a result, in the process
of drainage, the change of hydrogeological
conditions and the further transformation of
soil cover takes place and varieties of solon-
chaks are formed. At the last stages of soil de-
velopment, the salinisation processes caused
by hydromorphic conditions fade, but the role
of arid-zonal factor increases many times caus-
ing the further development of typically desert
type soils.

When studying the soil cover on the dried
bed of the Aral Sea, we identified and de-
scribed the following types of coastal soils:
semi-hydromorphic solonchaks, hydromorphic
solonchaks, semi-automorphic solonchaks,
automorphic solonchaks, desert sandy soils,
deserted alluvial-meadow soils, and sands
fixed to different degrees. When carrying out
forest-reclamation measures, a differentiated
approach to the choice of soil conditions will
be required.

The field studies included routes and de-
scriptions of landscape points, vegetation,
and soil cover. Fifty-six soil profiles were laid

in the typical selected sites. The depth of em-
bedding was 1.5 metres. When necessary, soil
profile sections were made. A morphological
description of the profile according to the re-
quired format was carried out, genetic hori-
zons were selected, soil samples were taken
from the middle of them, and soil description
by genetic horizons and photographs of the
soil profiles were given. Soil samples were ana-
lysed to determine their chemical and physical
properties, including the content of organic
matter, humus, qualitative and quantitative
composition of water-soluble salts, as well as
gypsum and carbonates. The laboratory anal-
yses were performed by the laboratory of the
Analytical Center of Soil Quality, Composition
and Repository under the Committee for Land
Resources, Geodesy, Cartography and State
Cadastre.

6.2.1. Soil cover of the western part
of the Aral Sea dried bottom

The first expedition included a study of
the soil cover at the Muynak part of the dried
seabed. This area is mostly flat, with a gener-
al slope to the west and north. In the middle
of the massif there is a sand spit with sand-
dunes, currently connected to Lazarevo Island.

Coastal hydromorphic solonchaks
and their varieties

Hydromorphic solonchaks,

including so-
lonchaks created during the soil formation
process with the participation of groundwater
located, were at the depth of 0-3 metres in the
soil. Hydromorphic solonchaks include marsh
solonchaks, hydromorphic and moderately
hydromorphic ones with a groundwater depth
of 0-2 metres, and semi-hydromorphic ones

93

Fig. 43. Location of soil profile sections

with a groundwater depth of 2-3 metres. This
division is conditional, as groundwater par-
ticipation is also determined by soil parame-
ters, for instance granulometric composition.
When classifying soils, important attention is
also paid to soil condition in its morphological
description.

Marsh solonchaks (Fig. 44) are a strip fring-
ing the sea periodically flooded by sea water.
The marsh solonchaks have a leaching regime
and uniform salt distribution along the profile,
while the salinity type of the solonchak is chlo-

ride. Their granulometric composition widely
varies, ranging from clay to sand.

The formation of marsh solonchaks has its

own features caused by the Aral Sea drainage.

Fig. 44 shows an example of the West Sea’s
marsh solonchaks, which have been formed as
a result of periodic inflow of water into the sea
and their subsequent drainage in dry years. On
the West Sea coast, the marsh solonchaks are
distinguished by a narrow strip, as the inflow of
water into the sea in recent years is very insig-
nificant (Fig. 45), and the process here is mainly
one-sided in the direction of draining.

94

Fig. 44. Narrow strip of marsh solonchak, West Sea

Fig. 45. Dynamics of the Aral Sea level marks

95

Fig. 46. Transition from marsh to hydromorphic coastal solonchak

Schematic breakdown
of the soil section
profile P-22

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-2

2-10

10-12

12-28

28-36

36-46

46-60

60-90

Crust light grey, dry

Sand, salt, wet, structureless, shines in the sun

Layer of light loam, rusty coloured, large amounts
of salts, loose, structureless, in some places brown
structured inclusions

Dark, grey, almost blue moist clay, layered, rusty spots
on the faces of separated layers

Blue, large amount of rust, lumpy structure 1-2
centimetres, wet, transition noticeable

Dark grey, wet, rusty spots, more loose, scattered into
small lumps, shells

Dark grey, moist, light loam, powdery, many shells, rust
spots, horizon drier than others

Wet, bluish, rusty spots, light loam, heterogeneous

Fig. 47. Profile description, profile P-22, coastal hydromorphic (moderately hydromorphic) on the parent rock
of marine genesis

96

Semi-hydromorphic,
hydromorphic and moderately
hydromorphic solonchaks

Hydromorphic coastal solonchaks occupy
more than half of the area of the dried seabed.
They are distributed between the semi-auto-
morphic solonchaks and the modern seawater
edge. Semi-hydromorphic soils are represent-
ed by both crustal (fragile and firmly crustal)
and crust-puffed varieties. Sometimes there
are salt-whitened spots of puffed soils that
are easily deflated. In some places, where the
surface horizons are represented by sandy
loam-sandy deposits, traces of wind erosion
are visible.

Due to their wide distribution, these types
of solonchaks are formed on sediments of dif-
ferent mechanical composition, and often have
a layered profile, sometimes of mixed alluvi-
al-marine genesis.

Vegetation is represented by different as-
sociations depending on the location of the
contour of the semi-hydromorphic solon-
chak, including karabarak-gramineous, tamar-
ix-gramineous, saltwort, remnants of reed veg-
etation, and open surface without vegetation.

The typical hydromorphic (moderately hy-
dromorphic) solonchaks observed with close
groundwater are confined to the western dried
part of the East Sea. Groundwater levels along
the profile starting from the zero-level mark
vary from 1.5 to 0.8 metres. According to granu-
lometric composition, soils are sandy loam and
sandy (P-21, P-23, P-24 and P-25) (Table 16) and
stratified with loamy interlayers (P-22) (Fig. 47,
Table 16). Soils have sulphate-chloride and sul-
phate salinity, by salinity degree strongly and
medium saline by ECe, and weakly and medium
saline by Cl and Na (Fig. 48).

The ECe dS/m values range from a maxi-
mum in the upper part of the loamy profile of
161.6 dS/m in profile P-22 and up to 329.6 dS/m

in profile P-18, heavy loamy and clayey soil,
while the remaining profiles with loamy and
sandy composition do not have a clear differ-
entiation of salts in the profile.

The profile P-18 was laid in moderately hy-
dromorphic conditions and has a heavy gran-
ulometric composition throughout the profile
(Table 16). The soil is coastal solonchak, formed
on layered alluvial-marine sediments of the
avandelta and seabed (Figs. 48 and 49).

Similar to deltas, avandeltae are formed
from hydrosuspended material. Here, too, a
lithologically layered profile is formed, but
whereas deltas have alternate layers of alluvial
genesis, avandelta are interspersed with layers
of marine sediments, which can clearly be ob-
served in the profile of soils on alluvial-marine
material.

Semi-hydromorphic coastal solonchaks are
formed when saline groundwater lies within
2-3 metres. Groundwater salinity reaches 20-80
g/l. Salinity type is predominantly magne-
sium-sodium chloride.

Semi-hydromorphic coastal solonchak and
fragile crust soils are characterised by tran-
sects P-9 and -.11 (Figs. 50 and 51). The soils
are very strongly saline throughout the profile
in classifications estimates by ECe m (24-69
dS/m), TDS (2-9 percent), by Na and Cl (Table
16). The salinity type is chloride (Fig. 51).

In terms of granulometric composition, soils
are classified as clays sanded from the surface
and underlain by bluish wet clay.

In all soil horizons, rusty oxide colours,
stains and white coating and crushed shells
are observed. All are indications of the rock’s
marine genesis.

Rusty-coloured oxide deposits indicate that
the soil periodically dries out and moistens
again.

97

Fig. 48. Coastal solonchak moderately hydromorphic P-18

Schematic breakdown
of the soil section
profile P-18

Horizon
and its
thickness,
cm

Description of the section: Granulometric
composition, moisture, colouring, structure, density,
texture, new formation, inclusion,
nature of mixing, nature of transition
horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-1

1-8

8-22

22-38

38-45

45-70

Crust, salt

Brown, greyish, puffy, loose, light loam

Grey, moist, dense, whitish due to the large amount of
salts, 7-18 layers of white

Blue, moist, heavy loam, lumpy-nutty-like structure, rare
white spots (salt) 37-40 layers

Almost white, moist, clay, fine, lumpy-nutty layer,
transition noticeable

Blue clay, plastic, wet

Fig. 49. Profile description, profile P-18, coastal solonchak (moderately hydromorphic) semi-hydromorphic on
the parent rock of alluvial-marine genesis

98

At present, the natural cover is disturbed ev-
erywhere by furrows created in preparation for
forest plantations.

In coastal semi-hydromorphic solonchaks,
the leaching regime is replaced by the evapo-
transpiration regime.

Hydromorphic coastal solonchaks are found
near inflowing water bodies, in depressions
of the bottom, and around numerous residu-
al lakes. This type includes soils of the drying
depression, lakes along the “Tigroviy Hvost”
(Tiger’s Tail), lacustrine-brine type soils, and
the soil of profile 31 on the wet solonchak
(shora solonchak).

Groundwater salinity of magnesium chlo-
ride-sodium composition here reaches 65 g/l.
From the soil surface, dark grey crust is very
dense, 2-3 centimetres thick, medium-loamy,
strongly saline, and a chloride-sulphate salin-
ity type. The rest of the profile is strongly and
very strongly saline compacted sand, while the
salinity type is sulphate-chloride (Table 16).

The most susceptible to wind erosion among
semi-hydromorphic solonchaks are puffed so-
lonchaks, the surface of which is represented
by a powdery earthy-salt layer, as well as solon-
chaks formed on sandy loam-sandy sediments.

On the surface of the latter, a very weak san-
dy-salt crust is formed that can be easily de-
stroyed by wind. The soil surface is covered by
flat (stratum) deflation centres. These solon-
chaks are active producers of salts transported
by wind outside the basin of the former water
area. The vegetation is represented by differ-
ent associations, depending on the location of
the semi-hydromorphic solonchak contour, in-
cluding karabarak-gramineous, tamarix-gram-
ineous, saltwort, remnants of reed vegetation
and open surface without vegetation.

Fig. 50. Semi-hydromorphic coastal solonchak, fragile crusted

99

Schematic breakdown
of the soil section
profile P-9

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-2

2-15

15-32

32-42

42-55

55-73

73-100

Crust, fragile, loamy sand

Light grey, moist, large number of shells, very loose,
medium loam with heterogeneous sand

Dark grey, brownish, wet, dense, lumpy-nutty structure,
easily scattered into pieces in the hand, a lot of rust
spots and white plaque, the inclusion of crushed shells,
heavy loam

Dark grey, brown tint, rusty all over, well-defined
prismatic structure, covered with rusty patina on the
edges, heavy loam, the transition is noticeable

Dark grey with brown spots, moist, with white shells,
powdery inclusion of carbonates, very plastic, clay,
noticeable transition

Wet clay with rusty spots

Blue clay

Fig. 51. Profile description, profile P-9, coastal semi-hydromorphic solonchakon parent rock of marine genesis

Fig. 52. Hydromorphic solonchak P-31, wet solonchak

100

Automorphic and semi-automorphic
coastal solonchaks

Automorphic (profiles P-2, P-7, P-13, P-14,
P-15, P-16, P-19, P-20, P-27, P-28, P-29, P-30 and
P-35) (Table 16) and related semi-automorphic
(profiles P-1, P-3, P-4, P-5, P-6, P-8, P-10, P-26,
P-33 and P-34) (Table 16) coastal solonchaks
are spread in the southern part of the dried
seabed. Automorphic solonchaks are formed in
conditions with groundwater occurring deeper
than 5 metres. They can be most often found
together with sands. Automorphic solonchaks
are mainly represented by crust and crust-
puffed varieties. The earthy-salt crust strong-
ly armours the soil surface and protects the
underlying powdery-puffy horizon from wind
erosion. Such contribution is also made by the
dried vegetation cover, which sometimes cov-
ers the land surface very densely. Destruction
of the earthy-salt crust and destruction of the

vegetation residues leads to the activation of
aeolian-erosion processes.

A large body of automorphic solonchaks is
located in the middle part of the studied area,
confined to a sandy spit extending from south
to north, as seen in profiles P-12 and P-13.

Below one can find a description of profile
P-13, laid in an old saxaul bush, with soil that
is a crust-puffed solonchak and automorphic
(Figs. 54 and 55).

The eastern part of the territory adjacent to
the avandelta and the river avandelta contains
automorphic solonchaks and desert-sandy
soils, of profiles P-15, P-16, P-19 and P-20 (Table
16) (Fishenko Bay). The layered nature of soils
formed by river sediments leads to the for-
mation of thick desiccation cracks in the pro-
file when the soils dry out. Atmospheric and
surface water enters these cracks and causes
erosion. Karst-suffosion sinkholes are formed,
sometimes of a very large size (Fig. 56).

Schematic breakdown
of the soil section
profile P-31

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-2.5

2.5-6

6-25

25-37

37-53

Crust is dense, dark, grey, with a dark spot

Salted sand, light brown, layered

Light brown, layered, 0.5 centimetre thin, small plant
roots

Grey with rusty spots, white salt noticeable

Red sand with seashells

53-90

Shallow, light loam, with the whole profile being damp

Fig. 53. Profile description, profile P-31, coastal hydromorphic solonchak on parent rock of lake-marine
genesis

101

In the peripheral parts of the avandelta,
desiccation cracks are also formed when drying
out, but they are hidden under the sandy-san-
dy loam marine sediments.

Automorphic solonchaks are a transitional
stage to desert-sandy soils, so the soil assess-
ment should indicate that such a process takes
place, including profiles P-13 and P-15.

Salinity varies by ECe from 9 to 60 dS/m, and

by TDS from 1 to 9 percent.

Automorphic solonchaks located

in the
western and southern parts of the studied
area along the cliff (profiles P-2, P-35 and P-27)
(Table 16) are also found together with hilly
sands, with sand dunes, overgrown with vege-
tation and weakly overgrown with vegetation.

Automorphic soils are crusty and crusty-san-
dy, but when unfortified artificially or naturally

they are a hazard and a source of salt and dust
transfer.

In a coastal solonchak (semi-automorphic)
(Fig. 59) the evapotranspiration regime takes
place. Capillary fringe in especially heavy soils
rises to the soil’s surface and on its borders in-
tensive evaporation and deposition of salts in
the upper horizon occurs, which is demonstrat-
ed by the results of water extraction of profile
samples (profile P-10) (Fig. 60).

In a 0-20 centimetre layer of profile P_10 soil
salinity is 120-180 Ds/m, TDS 13.7-16.7 percent.
Other horizons have values of salinity of ECe
20-25, TDS 1.7-2.3.

In the profile of P-5, respectively, the values
of salinity are ECe 165, TDS 12.2 percent and ECe
11-70, TDS 0.8-9.6 percent.

Fig. 54. Crust-puffed solonchak, automorphic P-13

102

Schematic breakdown
of the soil section
profile P-13

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-1

1-6

6-16

16-37

37-58

58-85

85-90

Crust light grey, dry, dense in an undisturbed state, a
large number of small roots, sandy loam

Subcrust, light grey sandy loam, dusty, dry, large number
of roots, small, residual shells, whole and fragmented

Light grey, dry, loose, unstructured, dusty, small plant
roots, brown tinge in profile, transition noticeable in
density

Grey with a brown tint, dense, heterogeneous in
composition, nutty structure, between parts of the pores
are filled with fine-grained sand of the upper horizon

Grey with a brown tint, almost dry, lumpy structure, light
loam, 0-10 centimetre lenses of sand in the middle of
the horizon, sparkles in the sun, a large number of shells

Almost dry, grey with a brown tint, layered, lumpy
structure, medium loam, sand layers along the profile,
pale stains, carbonates, remains of shells are present

Very dense, dark grey, cool to the hand, light loam,
coarse and crumbly

Fig. 55. Profile description, profile P-13, automorphic crusty-puffy coastal solonchak

Fig. 56. Karst-suffosion sinkholes (ukpans)

Fig. 57. Fragile crust automorphic solonchak,
profile P-15

103

Schematic breakdown
of the soil section
profile P-15

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-1

1-6

6-10

10-30

30-39

39-44

44-77

Crust, loose

Light grey, with a paler tint, dry, dusty, loose,
unstructured, shiny in the sun, many shell rocks,
transition noticeable, sand, loamy sand

Raw, brown with bluish interlayers, fine lumpy structure,
loose, separate inclusion, red spots in some places, light
loam

Raw, dense, well-defined nut-like structure that measures
0.5-1.5 centimetres in undisturbed compounding, looks
layered, inclusions white and floury, inclusions in the form
of stones similar to glass (gypsum) 0.5-1.5 centimetres,
cracks filled with pale melkozem, brown

Raw, brown with bluish spots, inclusion in the form of
small pebbles of 0.5 cm, a large number of rusty spots,
heavy loam

Homogeneous brown in colour, coarsely nutty lumpy,
inclusion in the form of stones like glass, 0.5-2
centimetres gypsum, heavy loam, clay, rusty spots

Sand, light brown with red spots, thinly porous sand

Fig. 58. Profile description, profile P-15, automorphic coastal solonchakon a marine mother rock, periodically
moistened from the Engineer-Uzyak

Fig. 59. Strong-crusted semi-automorphic
solonchak, profile P-10

Fig. 61. Crusty semi-automorphic solonchak with shell
rock in some places, profile P-1

104

Schematic breakdown
of the soil section
profile P-10

Horizon and
its thickness,
cm

0-1

1-22

22-30

30-65

65-90

The profile is fractured, with cracks
up to 20 centimetres filled with soil,
and 22 centimetres of loose, brown,
unstructured material

Description of the section: Granulometric
composition, moisture, colouring, structure,
density, texture, new formation, inclusion,
nature of mixing, nature of transition horizons,
signs of waterlogging, salinity, alkalinity, and
other features

Crust

Loose, light loam, brown, almost dry, dusty,
unstructured, lamellar, noticeable transition

Dark grey with a paler shade of heavy loam,
many small roots, well-defined nutty structure,
moist, transition noticeable in moisture
content

Wet, dark grey, heavy loam, very plastic, lumpy
structure weakly expressed, rare white spots,
gradual transition

Wet (almost wet), lamellar, unstructured, rare
white dots (shell rock), viscous clay

Fig. 60. Profile description, profile P-10, coastal solonchak semi-automorphic solid-crustal
on the parent rock of marine genesis

Like the previous example, the semi-au-
tomorphic soil (profile P-1) (Figs. 61 and 62)
is characterised by salt accumulation in the
upper ECe horizon of 247.2 Ds/m and TDS
16.284 percent.

According to the groundwater table data,
all given examples demonstrate that although
the profiles are located in conditions of deep
groundwater (>5 metres) because of their lo-
cations they should be referred to as auto-
morphic solonchak. However, the heavy gran-
ulometric composition of these soils provides
good capillary recharge from groundwater and
evaporation moisture regime. Therefore they
are referred to as semi-automorphic soils, and
within the morphological description of soils
it has been noted that the soil profile is very
damp in the lower part, even wet.

Desert-sandy soils

Two types of desert-sandy soils are found in

the studied area.

The first type is genetically formed, old soils
that are in a long-term soil-forming process.
These soils are confined to island landscapes.
As a result of aeolian activity, they are often
overlain by sand.

The second type is the ethmolode primitive
desert-sandy soils (Fig. 63). In their profile,
the humus horizon is already clearly defined,
but they still retain signs of salinity inherent
in solonchaks, on which desert-sandy soils are
formed.

To demonstrate the initial process of soil
formation, transition to desert type and for-
mation of desert-sandy soils, two profiles were

105

laid at some distance from each other. One was
under an old saxaul, and the other in an empty
ungrown area (profiles P-30 and P-29) (Figs. 63
and 65), to the north of Rybatsky Bay.

To characterise the morphological profile of
desert-sandy soils, we described profile P-30,
laid in the territory of ten-year old artificial
plantations of saxaul.

As follows from the morphological descrip-
tion, soil profiles here are practically identical

and have the same granulometric composition,
but the processes of change are already traced
in two directions of transition to desert-sandy
soil. For example the coastal solonchak (pro-
file P-29) has a chloride type of salinity, while
the desert-sandy soil (profile P-30) has a chlo-
ride-sulphate type of salinity. Humus content
in the upper part of the profile is 0.42 and 0.60
percent, respectively.

Schematic breakdown
of the soil section
profile P-1

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-1

1-10

10-26

26-43

43-57

57-73

Crust, rather dense, white, finely porous, with salted
shell rock on top

Brown, almost dryish, moist, unstructured, dusty,
inclusion of large amounts of shell rock, the transition
noticeable in salt

Dark grey, heavy loam (slightly sandy), damp, dense,
layered, lamellar-nutty structure, small white spots

Noticeable difference from other horizons, heavy
loam, dark grey moist, well-defined nutty structure
in undisturbed folding, layered, sparse white spots,
transition noticeable in colour

Clay, moist, well-defined, medium-lumpy structure,
scattered into faceted clumps, light-coloured
underbrush along the edges, rare small spots of up to 1
centimetre, gradual transition

Heavy loam, dark grey, moist, dense, pronounced lumpy-
lamellar structure, rusty, sandy loam, light grey, sparse,
small white spots

73-100

Clay, plastic moist, homogeneous, rather dense, weakly
expressed

Fig. 62. Description of the profile, profile P-1, coastal semi-automorphic solonchak, crusty on the parent rock
of marine genesis

106

Fig. 63. Desert-sandy soil under an old saxaul, profile P-30

Schematic breakdown
of the soil section
profile P-30

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-1

1-5

5-20

20-47

42-45

47-56

56-85

Crust dry, loamy sand, on the surface a large number of
plant residues

Dry, loamy sand, weakly expressed lumpy structure, a lot
of small roots, dusty, noticeable transition

Raw, light loam, light brown in colour, crumbles in the
hand, rare white spots 1-2 mm, more compact than the
previous, transition is noticeable

Very dense, brown, lumpy structure, rusty spots on
structural faces, heavy loam, layered in profile

Grey sand

Whitish, dense, damp, shell layer, sand

Brown, damp, unstable structure, crumbles in the hand,
layered, light loam, at a depth of 65 centimetres to the
bottom of the cut, and a powerful root of 6 centimetres

Fig. 64. Profile description, profile P-30, desert-sandy soil

107

Fig. 65. Coastal semi-automorphic crustal solonchak, profile P-29, at a distance of 10 metres from the forming
desert-sandy soil, profile P-30

Schematic breakdown
of the soil section
profile P-29

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-1,5

1,5-4

4-18

18-33

33-38

38-69

69-95

The crust is dry, dense, on the surface there is shell

Dry, dusty, loamy sand, shiny in the sun, rare shells

Dry, grey, light loam with occasional rust spots,
glistening in the sun, lots of shells, no plant roots

Dense, damp, brown, coarse-lumpy structure, almost all
rust-coloured, medium loam (heavy loam), remains of
shells and sand interlayers (30-33 centimetres) in the
lower part of the profile – the transition is noticeable

Shell rocks, shiny in the sun, sandy loam, almost white
(whitish), light grey, very rare brown spots

Light brown, damp, sand, light loam, shiny in the sun,
brown layer at a depth of 52-54 centimetres, in the
profile a lot of shells, no plant roots, transition is
noticeable

Yellow, with red interlayers, damp, not strong lumpy
structure, dense

Fig. 66. Profile description, profile P-29, coastal solonchak, automorphic, crustal

108

Sandy formations with aeolian ero-
sion-accumulative landscape

The drying of the sea has led to the redistri-
bution of sandy material and the formation of
aeolian-accumulative landscape (Fig. 67).

To date, several sand bodies have formed
and are currently in different degrees of
stability.

These two bodies are in contact with the
alluvial delta plain of the Amudarya River and
the Adjibay Bay. The eastern part of the studied
area of the dried seabed has a ridge-sand dune
character in some places.

As one moves westwards towards the water
channel, the accumulative landscape chang-
es to shallow hilly with unfixed mobile sands.
The northern half of these bodies often have
a landscape characteristic of deflationary sur-
faces, specifically undisturbed sandy bottom
surfaces alternating with numerous deep pock-
ets of deflation. The southern part, despite ac-
tive deflation, is covered with relatively good
grass vegetation in some places. Here desert
sandy soils are formed under the automorphic
regime of moisture. The upper horizons of the
soil cover are similar to loose turf.

In the area of Adjibay Bay, west of Muynak
Bay, the sand body acquires a bumpy landscape.
Here quite a diverse population of shrubs and
herbaceous vegetation can be found. Primitive
desert sandy soils are formed on the surfaces
fixed by herbaceous vegetation.

A chain of medium to high semi-fixed knolls
and sand dunes stretches along the “Tigroviy
Hvost” (Tiger’s Tail) peninsula, where in some
places one can find desert-sandy soils.

The western coast of the peninsula is com-
posed of marine sediments and fragments of
Tertiary deposits. It stretches from south to
north along the coast. At present, the Tertiary
debris is exposed or partially interbedded
with coarse gravel-sandy material with an ad-
mixture of shells. Part of the area is buried
under separate low knolls of overblown sands.
Ridge sand dunes oriented from north-east to
south-west, up to 5-7 metres high, unvegetat-
ed, stretch along almost the entire strip of the
cone of sand transfer, sand spit, in the middle
part of the sand body. The eastern part of this
regional elevation is occupied by plain unfixed
sands with bedrock deposits.

The general landscape of the territory is a
plain with a slope towards the modern water
level and a slope from the cliff to the Adjibay
Bay. The drying of the sea here was observed
in two directions. The sea departed from the
Ustyurt’s steep shore to the east and simulta-
neously moved to the north. The steep shore of
Ustyurt is layered with Quaternary sediments
(Fig. 68).

As a result of the analysis of the obtained
field and laboratory data on the typical soil
profiles, a classification of soils was made
(Table 15). The results of this work are given
below.

109

Fig. 67. Aeolian erosion-accumulative landscape

Fig. 68. Cliff of Ustyurt

110

№

Number
of the
GPS
point

Number
of the
soil
profile

1

2

3

4

5

6

7

8

9

10

11

12

13

9

37

45

51

65

66
(43 old)

112

124

148

166

211

233

1

2

3

4

5

6

7

8

9

10

11

12

13

Table 16.

Soil Classification 2019

Brief characteristic of the soil **
(Galina Stulina, Kamalatdin Idirisov, Islom Ruziev)

Soil type

Granulometric
composition

Salinity type

Coastal solonchak, crusty,
takyr-like semi-automorphic

Medium and heavy loam
by profile

Chloride/
sulphate-
chloride

Ch/Ch

Medium heavy loam along
the profile

Heavy loam

Clay loam and heavy loam,
loamy sand in the lower
part of the profile

Loam and clay, loamy
sand in the lower part of
the profile

Ch-S / S-Ch

Ch / S-Ch

Loam and clay

S-Ch / S-Ch

Layered complex of sandy
loam and light loam, clay
in lower part of profile

S / Ch-S

Loam

S / Ch / S-Ch

Clay sanded from the
surface
Clay, loam from the
surface
Clay, sandy loam from the
surface
Light loam, sandy loam
from the surface

Ch / Ch

Ch / Ch

Ch / Ch (S-Ch)

S / Ch-S

Heavy loam, sandy loam
from the surface

Ch-S / S-Ch

Coastal solonchak,
automorphic (semi-
automorphic)
Coastal solonchak, crusty,
semi-automorphic, washed
periodically
Coastal solonchak, fragile
crusty, semi-automorphic,
periodically washed takyr-like
surface
Coastal solonchak, crusty,
wet from surface, semi-
automorphic
Sandy solonchak, non-sandy-
crusty, semi-automorphic

Sand with large amounts of
shell rock, underlain by clay

Solonchak, takyr-like, semi-
automorphic, furrows
Solonchak, fragile crustal,
semi-hydromorphic, furrows
Strong-crust solonchak, semi-
automorphic
Solonchak fragile crustal, semi-
hydromorphic, furrows

Sandy solonchak

Solonchak crust-puffed, sandy
automorphic, closer to desert-
sandy soil (under saxaul)

111

№

Number
of the
GPS
point

Number
of the
soil
profile

14

274

15

317

16

326

17

337

14

15

16

17 (soil
profile
section)

18

353

18

19

383

19 (soil
profile
section)

20

535

20

21

22

23

24

25

583

614

656

742
3 artesian
wells

745

21

22

23

24

25

Brief characteristic of the soil **
(Galina Stulina, Kamalatdin Idirisov, Islom Ruziev)

Soil type

Granulometric
composition

Salinity type

Solonchak automorphic,
washed out, compacted from
a depth closer to the desert-
sandy soil
Solonchak crust-puffed from
the surface, automorphic
gypsiferous
Saltwort, crusty (salt layer at
a depth of 20-26 centimetres),
automorphic (semi-
automorphic)

Light loam, clay at the
bottom of the profile

S / S-Ch

Clay with sandy loam at
the top and bottom of the
profile

S / S-Ch

Layered, loam, loamy sand

S / Ch

Solonchak with shell rock

Light loam

S / Ch - S

Solonchak, crusty, moderately
hydromorphic, strongly saline
from the surface, furrows
(Andijan region)
Solonchak strong-crust, in
some places overlain by
sand, automorphic (semi-
automorphic)
Solonchak, non-solid
crustal, automorphic (semi-
automorphic), gypsified, sandy
loam in some places, weakly
saline, furrows
Solonchak moderately
hydromorphic, furrows
Hydromorphic solonchak,
crusty, furrows
Solonchak, saline sand,
loose crust, moderately
hydromorphic
Solonchak fragile crustal,
saline sand, near bush,
hydromorphic
Sandy-sandy, non-crustal,
hydromorphic solonchak

Layered complex, heavy
loam, clay

Ch-S | S-Ch
S-Ch | Ch-S

Layered complex, light
loam, loam, loamy sand

Ch / S-Ch

Layered complex with a
predominance of sandy
loam from the surface and
in the lower part

S / Ch-S

Bound sand

S / Ch-S

Loam, loamy sand in the
upper part of the profile

S-Ch / S-Ch

Sandy loam, sand at the
bottom

Ch-S / S-Ch

Sandy loam, sand

Ch-S / S-Ch

Sand porous

S / Ch-S

112

№

Number
of the
GPS
point

Number
of the
soil
profile

26

888

27

28

29

954

1036

1082

30

1082

31

1096

26

27

28

29

30

31

32

1398

32

33

34

35

1442

1448

1564

33

34

35

Brief characteristic of the soil **
(Galina Stulina, Kamalatdin Idirisov, Islom Ruziev)

Soil type

Granulometric
composition

Salinity type

Solonchak, strong-crust, semi-
automorphic on lake-alluvial
sediments (GW table, 2.5-3
metres)
Desert-sandy, reclaimed soil,
automorphic
Solonchak (closer to desert-
sandy soil) periodically washed
Solonchak strong-crusted,
automorphic, shells on the
surface

Desert-sandy soil (near a tree),
automorphic

Shora, black, hydromorphic
(0-1.5 m) Solonchak on lake-
marine sediments
Solonchak on lake-alluvial
deposits, crusty. Shell rock
from the surface, near sand
dunes
Crustal solonchak, semi-
automorphic, periodically
washed
Crust solonchak, (upturned
crust) semi-automorphic
Crustal solonchak,
automorphic, periodically
washed

Layered complex, light
loam and heavy loam

S-Ch / S-Ch

Loam, loamy sand in the
upper part of the profile

(S-Ch) S / S

Sandy loam, sand

Layered, heterogeneous,
light loam, sandy loam,
compacted sand
Layered, heterogeneous,
light loam, sandy loam,
compacted sand

Ch / Ch

Ch-S / S-Ch

Loam from the surface,
sand along the profile

Ch (Ch-S) / S-Ch

Layered, heavy loam, loam
in the lower part, light
loam and loam in the
upper part

(S-Ch) Ch / S-Ch

Light and heavy loam

S-Ch / S-Ch

Light and heavy loam

Ch / Ch-S (Ch)

Light and heavy loam, clay
in the lower part

Ch/S / S-Ch

113

6.2.2 Soil cover of the eastern part
of the dried bottom of the Aral Sea

Undoubtedly, the entire territory of the dried
seabed has the same characteristics, but in the
geomorphological, geological and soil sense,
apart from the general one, each part of the
dried seabed has its own characteristics. Thus,
at present, the Muynak part of the drainage
area adjoins both the West Sea and the East
Sea. The Djiltyrbas part is adjacent to the East
Sea after the division of the Large Aral Sea. This
imposes peculiarities on the soil-forming pro-
cess taking place. Peculiarities of drying have
also led to a different ratio of soil varieties.

Solonchak semi-hydromorphic,
hydromorphic and moderately
hydromorphic

The level of the East Sea is more dependent
on the influx of water sources and does not de-
pend on the natural sea level regime, but on an-
thropogenic factors that determine its regime.

In this regard, there is a difficulty in identify-
ing marsh solonchak, the formation of which by
nature is associated with natural fluctuations
in sea level, which forms a strip periodically
wetted and washed along the sea.

The influx of water into the East Sea varies
depending on the water content of the year,
but part of the sea irreversibly passes into the
land. Thus, the drainage of the sea leads to the
formation of a considerable area of coastal
hydromorphic and semi-hydromorphic solon-
chaks (Fig. 69) on marine sediments, separat-
ed from the entire drainage body by a ridge
of sand dunes and coastal dunes, impassable
unfixed and movable.

In 2005, profile P-22 was established on a
low thickness hydromorphic solonchak under-
lain 15 centimetres by wet red clay, on the bor-
der of a sand dunes body.

At present, the deflating sands have signifi-
cantly moved to the south-western direction,
overlapping the hydromorphic soils on marine
sediments. In terms of chemical composition
coastal hydromorphic solonchaks have a high
salinity of the chloride type, and uniform salt
distribution along the profile.

Other conditions for the formation of hy-
dromorphic and semi-hydromorphic soils are
the Kokdarya spills, Djiltyrbas Bay and the
Toguzarkan channel.

Hydromorphic soils formed on alluvial and
marine sediments have an overlapping granu-
lometric profile P-16 (2), (Figs. 70 and 71).

The salinity of all soil profiles is chloride.
Salinity degree depends on granulometric
composition. Medium and high salinity varies
from 2 to 15 dS/m, ECdS/m from 0.6 to 3.2, TDS
from 0.2 to 1.2 percent, while high salinity re-
fers to being heavy on granulometric composi-
tion layers.

Hydromorphic solonchaks are characterised
by a salt crust on the surface and are very highly
saline P-16 (2), EU - 64 dS/m, TDS - 7.8 percent.

In light soils P-24(2) the crust is weakly thick,
while in conditions of heavy and medium gran-
ulometric composition of surface the crust is
strong, uplifted, and the surface is takyr-like
P-25(2). There is a high degree of salinisation
with values ECe - 21.5 dS/m - 123.2 dS/m, and
TDS - 3-14 percent in the layer of 0-20 centime-
tres of the P-24(2) soil profile and ECe 25.5 dS/m
- 242.0 dS/m of the P-25(2) soil profile.

The presence of chloride salts is an unfa-

vourable condition for plant establishment.

In the Muynak part around Adjibay Bay, there
are lake sediments. Alluvial lake rocks are de-
posited near Adjibay Bay, near Djiyltyrbas, as a
result of periodic wetting and drying up.

Along the bed of the Amudarya River, sorted

alluvial deposits are present.

114

Schematic breakdown
Soil section
profile P-22, 2005

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-3

3-7

7-14

14-27

27-31

31-47

47-63
2 arr.

63-150

Sand, grey, dry, loose, shell rock

Light grey, bluish, dry, dense, lamellar structure (l.sug),
sand

Dark grey, wet, loose sand with inclusions of small
shells, crushed shells

Brown wet, clay with rust spots

Layer of yellow sand

Clay, with inclusions of sand rusty spots

Sand with rust stains

Red clay

Fig. 69. Description of the profile (profile P-22, 2005) shallow hydromorphic solonchak

Fig. 70. Hydromorphic solonchak, salt crust, profile P-16 (2)

115

The frequency of overflows of the Djiltyrbas
and Kuat Lakes affects the soil cover of the ad-
jacent area. The profile P-10(2) was laid in the
area of bay influence in saxaul plantations. Soil
cover is represented by the complex of firm-
crust and crust-puffed solonchak semi-hydro-
morphic, and a groundwater table at 2-3 metres.

In regards to the type of salinity, this is
sulphate-chloride,

and

chloride-sulphate
respectively.

Granulometric composition is loose sand
with maximum salts in upper horizons, accord-
ing to ECe 30.80 dS/m and 11.8 dS/m, according
to TDS 3.9-1.5 percent strongly and medium sa-
line. The rest of the soil profile is medium-sa-
line sulphate-chloride type.

Automorphic and semi-automorphic
soils

Automorphic soils P-5(2), P-8(2), P-13(2),
P-17(2), P-20(2), P-21(2) and P-22(2) are locat-
ed in the central part of the sand body, where
the influence of the Djiltyrbas Bay and the
Kokdarya River is less.

At the same time, the presence of nearby
sand dunes provides a sandy loamy surface for
these soils.

In this connection, the soil in profiles P-5(2)
(Figs. 72 and 73) and P-8(2) is loose sand
throughout the profiles in terms of granulo-
metric composition. They are non-saline and
slightly saline with ECe values 0.4-0.9 dS/m,

Schematic breakdown
of the soil section
profile P-16(2)

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-2

Crust, light grey, whitish, compacted, sandy loam, saline

2-10

10-25

25-40

42-50

50-60

60-80

80-100

Grey, dry, dusty, shiny in the sun, few shells

Pale, raw, fine-grained, sandy, whitish

Wet, ochre, pale, coarse sand, the lower boundary is
lighter, 40-42 centimetre interlayer of shell rock

Dark grey, wet, white spots, there are crushed shells,
heavy loam

Ochre, with white spots, wet, heterogeneous in fur,
composition, light clay

Wet sand, red, ochre, with crushed shells

Blue wet sand

Fig. 71. Profile description, profile P-16(2), solonchak hydromorphic, crustal, salt crust from the surface

116

TDS 0.1-0.7 percent, and ECe 1-4.5 dS/m and
TDS 0.1-0.6 percent, respectively.

Soil salinity type is chloride-sulphate.

The surface of the soil is covered with dense

shell rock.

groundwater table of 3-5 metres. Their location
on shores and near shores explains the high
degree of chloride type of salinisation.

Desert-sandy soil

Profile P-13(2) is sandy loam and sandy
throughout the profile, non-saline and slightly
saline in the surface horizons.

Desert-sandy soil is formed, as shown in
previous studies (SIC ICWC, 2008) under ten-
year-old saxaul.

The profiles P-20(2) and P-22(2) can be at-
tributed to automorphic soils, according to the

Indicators of the transition from solonchak
in the formation of desert-sandy soils are pro-

Schematic breakdown
of the soil section
profile P-5(2)

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-2

2-21

21-40

40-54

54-79

Light grey, dry, loose, large number of shells, small plant
roots, sand is scattered, the transition is noticeable in
density

Sand, light grey, dry, shiny in the sun, very loose, loose,
there are whole shells, many small roots

Light grey, damp, cold in the hand, sand, small plant
roots, glistening in the sun, small, layered shell rock

Medium-grained sand, shiny in the sun, thin root debris,
shell rock, rusty spots along the course of plants

Raw, layered, layers of fine and medium-grained sand,
inclusion in the form of shell rock in the lower part of
the profile

79-81

Light grey, coarse-grained sand, wet, there are shells

81-120

Raw, with a bluish tint, medium-grained sand, some
small crushed shells, the transition is noticeable in the
fur composition

120-150

Dark grey with a bluish tint, with an odor of hydrogen
sulphide, stratified, structural, loam

Fig. 72. Profile description, profile P-5(2), solonchak fragile crustal sandy with shell rock, semi-automorphic
with signs of gleying in the lower layer

117

files P-21(2) and P-17(2) (Fig. 73). Although or-
ganic matter is insignificantly present in the
soil, in terms of organic matter content, like al-
most all soils of this territory, it is poor and can
be explained by their mechanical composition,
sandy loam-sand, and the structure is formed
along the soil profile.

In the description of the soil, it is noted that

it has a well-defined structure.

Sandy formations with aeolian ero-
sion-accumulative landscape

The dried bottom of the Aral Sea between
the Kokdarya, Djiltyrbas and the Toguzarkan

channel, mainly has the appearance of a
sloping plain which has undergone changes
under the influence of desiccation and aeolian
processes.

Sand dunes and dune ridges encircle the
studied area and extend from north-east to
south-west in the central part (Fig. 75). Sand
dunes, dunes, and sands covering the soil oc-
cupy a considerable area.

In terms of organic matter content, like al-
most all soils in this area the profile’s soils are
poor, which is explained by their mechanical
composition as sandy loam sand.

Fig. 73. Formation of desert-sandy soil

118

Deserted alluvial and lake-meadow
soils

The soils are represented by profiles P-1(2)
and P-2(2). Alluvial-meadow soils occupy a
significant part along the old riverbed of the
Amudarya (Fig. 21).

The construction of a dam in Mejdure-
chenskaya caused the Amudarya to change its
riverbed, which in turn created a desertifica-
tion zone in part of the area between the old
and new riverbeds and between the new river-
bed and Djiltrybas Bay.

Schematic breakdown
of the soil section
profile P-21(2)

Horizon
and its
thickness,
cm

0-2

2-6

6-13

13-15

15-47

47-59

59-64

64-87

87-115

Description of the section: Granulometric
composition, moisture, colouring, structure, density,
texture, new formation, inclusion,
nature of mixing, nature of transition
horizons, signs of waterlogging,
salinity, alkalinity, and other features

Grey, dry, small amount of shells, annual plants

Grey, dry, dusty, sandy loam, undisturbed, layered,
finely porous, small inclusions of shells, shiny in the
sun

Light grey with a paler tint, dusty, very loose, a lot of
shells, shiny in the sun

Dark grey, damp, well-defined finely nutty structure,
many plant roots, light loam, rare inclusions in the
form of shells, similar to the humus horizon (no sample
was taken)

Grey with ochre underlain along the roots, damp,
dense, weakly expressed structure, layered, sandy
loam, almost no shell rocks, visible transition

Dark grey, heterogeneous in colour, bluish tinges on
the edges of the individual sections, shells occur,
lumpy-lamellar structure of 1 centimetre, light loam

Ochre, coarse sand, wet, a lot of crushed shells (we did
not take a sample)

Dark grey with a bluish tint, moist, heterogeneous in
colour, whitish interlayers, loose nutty structure, plant
roots

Blue, dark grey, wet, weakly expressed reflection on
the edges, ochreous patina, a lot of whole shells,
reddish colour, clay

Fig. 74. Profile description, profile P-21(2), crust-puffed automorphic solonchak
in the process of desert-sandy soil formation

119

The occasional fluctuations in the level of
the Djiltyrbas Bay causes periodic flooding
and drying of the soil profile and leads to sec-
ondary salinisation of the soil. This leads to
a change of vegetation, transition of meadow
and meadow-marsh soils into solonchaks. The
profile P-2(2) is located near the Djiltyrbas Bay
(Fig. 76).

The study of soil conditions shows that in
the process of desertification, the meadow soil
transformed into a crusty-large-cell (takyr-like)
semi-hydromorphic solonchak. The soil retains

a large amount of organic matter in the surface
horizon and according to the humus content of
4.3 percent, the soil is very rich. However, the
strongly saline soil profile with chloride-sul-
phate salinity indicates the presence of a de-
sertification process. Similar desertification
processes are observed in the Amudarya riv-
erbeds. Preservation of organic matter with
0.7 - 5.35 percent content of humus, nutrients
16-160 mg/kg P2O5, and 337.1-467.1 mg/kg K2O
surface horizon is already slightly and medium
saline.

Fig. 75. Fixed sand dunes on the dried seabed of the Aral Sea

120

Schematic breakdown
of the soil section
profile P-2(2)

Horizon
and its
thickness,
cm

Description of the section: Granulometric composition,
moisture, colouring, structure, density, texture, new
formation, inclusion, nature of mixing, nature of
transition horizons, signs of waterlogging,
salinity, alkalinity, and other features

0-0.1

0.1-16

16-20

20-43

43-49

49-73

73-83

83-110

110-150

Crust, dark grey, dense, with surface salt

Light grey, dry, dusty, loose, unstructured, shiny in the
sun, rusty spots, large number of white inclusions of
carbonates, sandy loam, transition is noticeable

Pale with reddish spots, large number of white spots
0.1 millimetre in size, arranged vertically, (carbonates)
damp, fragile structure, plant roots light loam, transition
noticeable in density

Dark grey, large number of medium and large roots,
rusty spots along the roots, white spots (carbonates),
less than in the previous horizon, light loam

Light grey, moist, shiny in the sun, sandy loam, medium
to large plant roots found, powdery white spotted
inclusions, also red root blotches, transition noticeable
by mech

Dark grey, moist, lightly loamy, shiny in the sun, lumpy-
rusty structure, large number of medium and large plant
roots, rusty underbrush along the roots, rare white spots
(inclusions)

Dark grey, moist, dense in undisturbed composition,
loose and crumbly structure, rusty underbrush along the
roots, sandy loam, inclusion of white spots

Light grey, wet sand, shiny in the sun, transition
noticeable in density

Dark grey, moist, dense in undisturbed, in disturbed
unstructured, layered on shiny, rust-coloured faces,
shiny in the sun, in the profile layered, rusty roots, there
are carbonates (white spots), sandy loam

Fig. 76. Profile description, profile P-2(2), crust solonchak, coarse-cell, semi-hydromorphic, desertifying
meadow

121

№

Number
of the
GPS
point

Number
of the
soil
profile

Soil Classification 2020

A brief characteristic of the soil **
(Galina Stulina, Kamalatdin Idirisov, Islom Ruziev)

Soil type

Granulometric composition

1 (2)

Alluvial meadow

Medium loam in the upper
horizons, underlain by sandy
loam

Crustal solonchak, coarse-
cell, semi-hydromorphic

Layered, light loam,
sandy loam, cohesive sand

Table 17.

Salinity
type

Ch-S /Ch
Chloride-
sulphate/
chloride

Ch/ S-Ch

33

93

218

2 (2)

3 (2)

Well 3

Hydromorphic solonchak
(semi-hydromorphic)

Sandy loam, loose sand

Ch-S / S-Ch

221

4 (2)

Sandy hydromorphic
solonchak

Sand cohesive, loose sand in the
middle part of the profile

Ch-S / Ch

235

5 (2)

243

6 (2)

Solonchak non-solid crustal
sandy semi-automorphic with
signs of gleying in the lower
layer

Saltwort sandy semi-
hydromorphic semi-
automorphic with signs of
gleying in the lower layers

Loose sand along the entire
profile

Ch-S

Loose sand underlain by heavy
loam

Ch-S / Ch

7 roots

Digging
No. 7

No description

Loose sand, heavy loam
Loose sand

S-Ch / Ch-S

122

1

2

3

4

5

6

7

№

Number
of the
GPS
point

8

247

Number
of the
soil
profile

8 (2)

Aral Sea
bottom
near
section

A brief characteristic of the soil **
(Galina Stulina, Kamalatdin Idirisov, Islom Ruziev)

Soil type

Granulometric composition

Solonchak strongly sandy,
non-structural-crustal, semi-
automorphic

Loose sand
Loose sand

9

263

9 (2)

Solonchak fragile crustal
semi-automorphic

Layered profile, cohesive sand,
loose sand, light loam, medium
loam

Salinity
type

Ch-S

Ch-S

Ch

10

274

10 (2)

11

12

290

11 (2)

294

12 (2)

13

297

13 (2)

14

298

14 (2)

Solonchak combined, firm-
crusty, crusty-puffy, sandy
semi-hydromorphic

Solonchak fragile crustal,
semi-automorphic

Crustal solonchak, semi-
hydromorphic, surface finely
rippled

Solonchak automorphic
fragile crusty, semi-
automorphic (automorphic)
covered with shell rocks

Sandy solonchak, semi-
automorphic (semi-
hydromorphic)

Sandy loam, from the surface,
loose sand along the profile

Ch /Ch-S

Homogeneous, loose sand

Ch-S / Ch

Sand cohesive, in the lower part,
light loam

Ch

Homogeneous, loamy sand

Ch-S / Ch

Homogeneous in profile, loose
sand

Ch-S / Ch

15

16

17

305

15 (12)

Solonchak strong-crust
(seems to be the lowered part
unsanded)

The sand is loose, underlain by
heavy and light loam

323

16 (2)

Hydromorphic solonchak,
crusty, surface saline

Homogeneous, cohesive sand,
sandy loam

Ch

Ch

332

17 (2)

Solonchak non-strength-
crust, automorphic (semi-
automorphic)

Layered, cohesive sand, loose
sand underlain by heavy loam

S-Ch / Ch

123

№

Number
of the
GPS
point

Number
of the
soil
profile

A brief characteristic of the soil **
(Galina Stulina, Kamalatdin Idirisov, Islom Ruziev)

Soil type

Granulometric composition

Salinity
type

18

333

18 (2)

Strong-crust solonchak with
signs of alugene

381

19 (2)

Hydromorphic solonchak

Layered, sandy loam, loose sand,
cohesive sand, medium loam,
light clay

Layered, sandy loam, loose sand,
light loam

Ch

Ch

415

20 (2)

Crust-puffed solonchak,
automorphic

Sandy loam on medium to light
loam

Ch/-S

21

442

21 (2)

Solonchak crusty-puffy,
automorphic on the way to
waste soil

Sandy loam is underlain by light,
medium, heavy loam

22 (2)

Solonchak fragile crustal,
sanded automorphic

Homogeneous layer, sandy loam,
cohesive sand

454

106

340

499

Т. 106

Solonchak strong-crust, crust

Т. 340

Strong-crust cellular, crusty

26(2)

Solonchak fragile crustal,
semi-hydromorphic

Furrows

Aral

491

24 (2)

Strong-crust solonchak

Light loam

Sandy loam

Cohesive sand
Cohesive sand

Sandy clay
Sand cohesive
Loose sand

19

20

22

23

24

25

26

27

28

29

498

25 (2)

Solonchak strong-crustal
cellular, semi-hydromorphic

Medium surface loam, profile
Sand cohesive, loose, loamy sand

Ch

Ch

Ch

Х

Ch

Х

Х

Х-С

Ch

Ch

6.2.3. Soil map

As a result of the performed field and labo-
ratory works and the analysis of the obtained
results, a soil map (Fig. 77) of the dried Aral Sea

bed territory as of 2020 was constructed. Fifty
soil differences were identified, which are shown
as contours on the map. The explanation to the
soil map is given in Table 18.

124

Fig. 77. Soil map of the dried Aral Sea bed, 2020

Explanation of the soil map as of 2020

Table 18.

Number of
contour

Soil name

Granulometric composition

1

2

3

Solonchak coastal excessively moistened
salt crust

Coastal solonchak semi-hydromorphic
strong-crusty in some places with salt
bodies

Solonchak, crusty, moderately hydromorphic,
strongly saline from the surface, furrows
(Andijan region) on alluvial-marine
sediments

Layered complex of loam, sandy loam, sand

Layered complex of loams, sandy loams

Layered complex of loam, sandy loam, sand,
with a predominance of loam

125

Number of
contour

Soil name

Granulometric composition

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

Solonchak, non-solid crustal, semi-
automorphic, gypsified, sanded in some
places, slightly saline, furrows

Coastal solonchak moderately hydromorphic
crusty, sandy-sandy in some places, furrows

Coastal semi-hydromorphic solonchak,
weakly crustal, sandy in some places

Coastal solonchak hydromorphic, non-
crustal, sandy

Coastal solonchak, crusty, wet from the
surface, semi-automorphic, periodically
washed, takyr-like in some places

Coastal solonchak moderately hydromorphic
crusty-puffy, sandy, saline crust in some
places

Solonchak crust-puffed, sandy automorphic,
semi-automorphic closer to desert-sandy
soil (under saxaul)

Layered complex of loam, sandy loam, sand

Layered complex of loam, sandy loam, sand

Layered complex of loams, sandy loams

Layered complex of loams, sandy loams

Layered complex of loam, sandy loam, sand,
underlain by heavy and medium loam

Layered complex of loam, sandy loam, sand,
underlain by heavy and medium loam

Sandy loam, with pronounced sinks

Coastal solonchak moderately hydromorphic
crusty, sandy-loam sandy in some places

Heavy- and medium-loam (in some places
weakly sandy) on layered loams with interlayers
of sandy loam and sand

Coastal solonchak, automorphic crusty,
mossy

Clay and heavy loam (sandy on top)

Solonchaks are automorphic with
overhanging weakly overgrown hilly sands
and high sand dunes

Sandy loam and sandy loam with thick
interlayers of clay and heavy loam in the lower
part of the profile

Solonchak on lake-alluvial deposits, crusty,
shell rock from the surface, near the sand
dunes

Sandy loam and sandy loam with thick
interlayers of clay and heavy loam in the lower
part of the profile

Desert-sandy soil

Desert-sandy soil

Light loamy, bottom-heavy

Layered complex of sandy loam, sand. Loam.

Combination of solonchak of coastal
hydromorphic and excessively hydromorphic
(lacustrine-brine) and plains-mildly hilly
sands

Sandy, light loamy and sandy loam in lake-like
depressions

Coastal solonchak moderately hydromorphic
overlain by sand

Sandy-sandy

Coastal solonchak, crusty, semi-
automorphic, periodically washed

Sandy-sandy

126

Number of
contour

Soil name

Granulometric composition

20
20а

Solonchak strong-crust, automorphic, shells
on the surface with sandy masses (ongoing
formation to desert-sandy soil)

Layered complex with a predominance of sandy
loams and sands over loams and clays

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

Coastal semi-automorphic solonchak with
sandy bodies

Clay and loam with interlayers of sandy loam
and sand in the lower part of the profile

Unfixed sand in the complex with solonchak
furrows

Layered complex with a predominance of sandy
loam and sand

Coastal solonchak semi-hydromorphic
fragile crustal, overlain by loose sand, with
outcrops of bedrock in the form of boulders

Layered complex with a predominance of sandy
loam and sand

Sand with shell rock

Sand

Crustal solonchak, semi-automorphic,
periodically washed, in a complex with sand
dunes

Coastal solonchak semi-hydromorphic
weakly crustal, sandy in some places, with
isolated patches of shell rock

Solonchak semi-automorphic and
automorphic crust-puffed and non-crusted
gypsumized

Solonchak semi-automorphic and
automorphic crust-puffed and non-crusted
gypsumized

Layered complex of loam, sandy loam, sand

Layered complex of loam, sandy loam, sand

Clay and loam in the lower part of the profile

Clay and loam in the lower part of the profile

Sand fixed

Sand

Automorphic solonchak in a complex with
unfixed sands

Layered complex of sandy loam, sand. Loam.

Solonchak excessively moistened

Layered complex of sandy loam, sand. Loam.

Hydromorphic solonchak overlain by sands

Predominantly sandy loam and sandy loam
with interlayers of loam and clay

Dunes

Sand

Solonchak semi-hydromorphic, semi-
automorphic with weakly consolidated sands

Predominantly sandy loam and sandy loam
with interlayers of loam and clay

Solonchak strongly silted, imperfectly
crusted, semi-automorphic, semi-
hydromorphic

Solonchak moderately hydromorphic in
some places overlain by mobile sands

Loamy-sandy

On heavy-loam and medium-loam sediments

127

Number of
contour

Soil name

Granulometric composition

37

38

39

40

41

42

43

44

45

46

47

48

49

50

Complex of semi-automorphic and semi-
hydromorphic solonchak with sand hillocks
and sand dunes

Layered complex of different mech.
Composition

Automorphic solonchak overlain by sand in
some places (plantings)

Sandy and sandy loam on layered sediments of
different mechanical composition (from clay to
sand)

Coastal semi-hydromorphic solonchak
overlain by a thick cover of mobile loose
sands

Complex of solonchak of lacustrine-brine
(shora solonchak) with desert-sandy soils of
relict islands

Sandy and sandy loam

Sandy and sandy loam

Sand with a large amount of shell rock.
Underlain by clay.

Layered, sandy loam and light loam complex,
clay in the lower part of the profile

Marsh solonchak

Wet solonchak

Sand body

Layered complex of loams, sandy loams

Layered complex of loams, sandy loams

Sand

Coastal solonchak excessively humidified

Layered complex of loams, sandy loams

Mainland

Sand dunes

Meadow desertifying

Sand

Clayey, heavy- and medium-loamy (sand-
laden) on low-layered sediments of different
mechanical composition

Wet solonchak (shora solonchak)

Layered complex of sand, loam, clay

Lakeside-brine solonchak, hydromorphic,
semi-hydromorphic, silty, periodically
flooded

Sandy and sandy loam on layered sediments,
in some places with the presence of clay and
loam

128

6.2.4. Conclusions

As a result of the conducted monitoring of
the Aral Sea dried seabed cover, a large volume
of field and laboratory data were obtained. This
data collected during the expeditions will serve as
a basis for further studies of genetic features of
unique soils formed on the seabed. The transient
nature of the processes occurring on the Aral Sea
requires fixing the current status, otherwise the
opportunity to study the process of the formation
of zonal desert soils will be missed.

At present, in our opinion, the coastal solon-
chaks of the dried bed of the Aral Sea should be
considered as intrazonal soils. However, they have
a clear local zonality. The genetic types of soils,
according to the classical notion of soil formation,
have horizontal and vertical zonality. In the stud-

ied area, the zonality is clearly traced. The Akpetki
island system is characterised by the change of
soil cover in the direction from the drying lakes to
the continental part protruding above them. For
the plain part, the change of soil cover occurs in
connection with drainage and the increase in the
horizontal strip of the dried area. Since the dried
area was formerly the bottom of the sea and was
at different depths, there is also a vertical zona-
tion associated with the character of the bottom
sediments. The temporal factor of soil formation
is especially expressive in these conditions, more
than anywhere else.

As we know, according to the classical
Dokuchaev soil science, there are five main factors
of soil formation including climate, landscape,
parent rock, vegetation and age. In this case, age
is particularly important.

6.3. Vegetation cover

The dried seabed of the Aral Sea is an open,
deserted and unique “laboratory” in the Central
Asia region. The dried surface contains mainly
different levels of soil, salts, and sands. The rea-
son for such a chemical composition of the soil
is the annual increase in the content of miner-
als, including sulphates, chlorides, sodium and
magnesium.

It is important to note that the process of soil
formation in the area is still ongoing. The current
ecological state of the dried Aral Sea bottom
emphasises the importance of a comprehensive
study of the biological objects of the Aral Sea re-
gion, which are of great scientific and practical
importance not only for science and technology,
but also for the industry of the country.

At the present time, one of the problematic
issues of Aralkum biodiversity formation is the
natural formation of vegetation cover, which is
of great scientific and practical interest to bota-
nists, ecology scientists and forestry specialists.

From the start of the Aral Sea’s drying out
until now, a large part of the dried area has been
revived by sand, dust and salt-binding plants.

Not all of the dried area has been revived by
forest plants, as much of this area still remains
unvegetated with shell residues and a white sa-
line surface (Fig. 78).

The need for a thorough study of the seabed
is the result of the formation of new natural
complexes of plant communities, by structure,
by development and vital activity of plants, and
by succession and changes in the landscape. The
formed land and the processes occurring on it
predetermine the need for a detailed study of
the dynamics (migrations) of plants.

Halophilic species and communities are an
indispensable component of the flora and veg-
etation of the desert zone, where increased salt
content is typical for almost all types of soils.

Global resources of halophytes are character-
ised by a great diversity of genera, species and

129

Fig. 78. The dried bottom of the Aral Sea

populations of ecotypes. The global gene pool of
halophytes includes 2,000-2,500 species. 700 of
these species have been identified in Central
Asia (Akjigitova, 1982).

Modern processes of changing the natural
environment of the Amudarya delta by the ces-
sation of flooding, the expansion of irrigated
lands, and the drying of the Aral Sea bed, have
all contributed to the activation of salt accumu-
lation and the expansion of halophilic vegeta-
tion positions.

have mainly the salt accumulating representa-
tives of the goosefoot (Chenopodiaceae) family
and less so of the salt-extracting ones.

The halophytic type of vegetation (Halophyta)
is widespread throughout the dried part of the
Aral Sea, and is formed on various saline soils of
the Aralkum Desert. In the southern part of the
dried bed of the Aral Sea, almost all species of
halophytic community groups are present. This
was once again theoretically and practically con-
firmed during vegetation studies in recent years.

Increased salt content in soil has a favourable
effect on the development and accumulation of
the biomass of halophytes. Halophilic properties

The chemical and physical characteristics of
the biosphere are determined by the relatively
constant formed environments that ensure the

130

existence of living matter in an ecosystem. An
ecosystem consists of a community of all living
organisms in a given area and has a balanced
cycle of chemical elements and energy flow.
There is a homeostatic relationship between the
non-living (abiotic) environment and living or-
ganisms (biotic environment).

300 herbarium specimens) having been collect-
ed during the expedition. Taxonomic identifica-
tion was performed at the Institute of Bioorganic
Chemistry of the Academy of Sciences of the RUz
and the Central Herbarium Laboratory (TASH)
of the Institute of Botany of the Academy of
Sciences of the RUz.

The purpose of this study is to determine the
composition of vegetation species of the south-
ern Aralkum, to study the current state of the
vegetation cover and to identify the dynamics of
plant migrations across the dried seabed.

During the first expedition in 2019, the vegeta-
tion cover with the following large bodies of the
south-western part of the dried bed of the Aral
Sea was studied: Tigrovy Hvost, Akhantai, Uchsai,
Muynak Bay, the vicinity of Sarybas Lake, Lazarev
Island along the perimeter of the Eastern Cliff
of Ustyurt, around the “zero” area, and other
points. During the second expedition in 2020, the
following bodies of the dried south-eastern bot-
tom of the Aral Sea were studied: The vicinity of
the Kazakhdarya settlements, from Djiltyrbas to
Kokdarya, covering the Karateren and Kokdarya
lands.

All field work at the above-mentioned sites
was carried out by mutual agreement between
expedition members and within a set period of
time.

The purpose of these expeditions was to de-
termine the spring and summer species com-
position of higher plants of the south-eastern
Aralkum, and to study the current state of the
vegetation cover.

The object of the study is the flora and veg-
etation of the dried bottom of the Aral Sea’s
southern part, with plant materials (more than

Classical morphological-geographical, tra-
ditional geobotanical and other field methods
were used in the research. The route-geobotan-
ical methods (Bykov B.A., 1953; Lavrenko E.M.,
1959; Yaroshenko P.D., 1961; Nitsenko A.A., 1971;
Shelyag-Sosonko Y.R. et al., 1991, ‘Vegetation
cover of Uzbekistan’, 1972, and Zakirov K.Z. and
Zakirov P.K. classification, 1978) were used when
studying the plant cover.

For registration of plant formation and asso-
ciation we used the classical generally accepted
form #1 (according to the Drude scale) (habitat,
number of plant species, life forms, etc.), accord-
ing to which herbaceous plants of 10 m2, trees
and shrubs of 100 m2, rare plant communities of
250 m2 were examined by using a 7-point system:
cop3 - 7 points; cop2 - 6 points; cop1 - 5 points;
sp1 - 4 points; sp2 - 3 points; sp3 - 2 points; and
sol - 1 point. The obtained geobotanical materi-
als were generalised and systematized accord-
ing to the classification scheme of Zakirov K.Z.
and Zakirov P.K., 1978.

As a result of the identification of herbarium
samples collected during the second expedition
and research work, 74 species of higher plants
belonging to 51 genera and 21 families over
2,060 (2019 – 1,500, 2020 - 560) points of the dried
Aral Sea bed and plant communities determined
by most formations of the vegetation cover were
identified (Tables 19 and 20, Figs. 78-104).

131

List of species composition of higher plants of the dried seabed of the Southern Aralkum

Table 19.

№

Families

Types of plants

Role in vegetation cover

1. Haloxylon aphyllum (Minkw.) Iljin.

2. Haloxylon persicum Bunge ex Boiss.

3. Halostachys belangeriana (Moq.) Botsch.

4. Salsola richteri Kar.

5. Salsola paletzkiana Litv.

1

Chenopodiaceae

6. Salsola dendroides Pall.

7. Salsola micranthera Botsch.

8. Salsola paulsenii Litv.

9. Corispermum aralo-caspicum Iljin

10. Climacoptera crassa Botsch.

11. Climacoptera aralensis (Iljin) Botsch.

12. Climacoptera lanata Pall.Botsch.

13. Salicornia europaеа L.

14. Atriplex pratovii Sukhor.

15. Bassia hyssopifolia (Pall.) Kuntze.

16. Suaeda crassifolia Pall.

17. Suaeda cuminate Moq.

18. Ceratocarpus arenarius L.

19. Agriophyllum lateriflorum (Lam.) Moq.

20. Halocnemum strobilaceum (J.Pall.) M.Bieb.

21. Halimocnemis karelinii Moq.

22. Horaninovia ulicina B.Fisch. et С.A. Mey.

23. Сhenopodium album L.

24. Halogeton glomeratus C.A. Mey.

25. Tamarix hispida Willd.

26. Tamarix ramosissima Ledeb.

27. Tamarix florida Bunge

28. Tamarix laxa Willd.

Tamaricaceae

Capparaceae

29. Capparis spinosa L.

Nitrariaceae

Solanaceae

Peganaceae

30. Nitraria schoberi L.

31. Lycium ruthenicum Murr.

32. Peganum harmala L.

Zygophyllaceae

33. Zygophyllum oxianum Boriss.

Elaeagnales

34. Elaeagnus turcomanica Kozlowsk.

132

2

3

4

5

6

7

8

Dominant

Dominant

Dominant

Dominant

Dominant

Dominant

Temporary dominant

Temporary dominant

Temporary dominant

Temporary dominant

Temporary dominant

Temporary dominant

Dominant

Dominant

Subdominant

Subdominant

Dominant

Dominant

Subdominant

№

Families

Types of plants

Role in vegetation cover

35. Karelinia caspia (Pall.) Less.

36. Lactuca undulate Ledeb.

Subdominant

9

Asteraceae

37. Acroptilon repens (L.) DC.

38. Artemisia terrae-albae Krasch.

39. Artemisia diffusa Krasch.

Dominant

Dominant

10

11

12

13

Apocynaceae

40. Cynanchum sibiricum Willd.

Convolvulaceae

41. Convolvulus erinaceum Ledeb.

Boraginaceae

42. Heliotropium arguzioides Kar. et Kir.

43. Heterocaryum rigidum DC.

Orobanchaceae

44. Orobanche cernua Loefl.

45. Alhagi pseudalhagi (Bieb.) Desv.

45. Ammodendron conollyi Bunge ex Boiss.

47. Astragalus ammodendron Bunge

14

Fabaceae

48. Astragalus villosissimus Bunge

Dominant

Dominant

Dominant

Dominant

15

Plumbaginaceae

49. Halimodendron halodendron (J.Pall.) Voss

50. Glycyrrihiza glabra L.

51. Eremosparton aphyllum (Pall.) Fisch. et Mey.

Dominant

52. Limonium gmelini (Willd.) Kuntze

Subdominant

53. Limonium otolepis (H.Schrenk) Kuntze

54. Calligonum acanthopterum Borszcz.

55. Calligonum aphyllum (J.Pall.) W. R. Guerke

56. Calligonum aralense Borszcz.

Dominant

Dominant

Dominant

Dominant

Dominant

Subdominant

Subdominant

16

Polygonaceae

57. Calligonum caput-medusae H.Schrenk

58. Calligonum macrocarpum Borszcz.

59. Calligonum microcarpum Borszcz.

60. Calligonum eriopodum Bunge

61. Calligonum junceum (Fisch. et Mey.) Litv.

62. Descurainia sophia (L.) C. J. Webb et Silipr.

63. Strigosella africana (L.) Botsch.

17

Brassicaceae

64. Strigosella scorpioides (Bunge) Botsch.

65. Tetracme quadricornis (Steph.) Bunge

66. Octoceras lehmannianum Bunge

18

Cyperaceae

67. Carex physodes M.Bieb.

133

№

Families

Types of plants

Role in vegetation cover

68. Stipagrostis karelinii (Trin. et Rupr.) Tzvelev

69. Stipagrostis pennata (Trin.) De Winter

Poaceae

70. Phragmites australis (Cav.) Trin. ex Steud.

71. Aeluropus littoralis (Gouan) Parl.

72. Eremopyrum orientale (L.) Jaub. et Spach

Dominant

Dominant

Dominant

Typhaceae

73. Typha angustifolia L.

Salicaceae

74. Populus diversifolia Schrenk.

Subdominant

Dominant

19

21

22

Analysis of the distribution of genera and
species into families shows that six large fami-
lies (Chenopodiaceae, Tamaricaceae, Fabaceae,
Polygonaceae, Poaceae and Brassicaceae) have
58 species, while other families have 16 species.
The largest family Chenopodiaceae includes 16
genera and 24 species, while 12 families have
only one genus and species each.

During the study (2019-2020), the following
dominant and subdominant plant species were
identified
in the Halophyta, Psammophyta,
Gypsophyta, and Potamophyta vegetation of the
Southern Aralkum.

Dereza russica – Lyciumruthenicum Murr.
Dominant. Halomexerophilous shrub up to
1-1.5(3) metres in height.

Karelinia caspica – Kareliniacaspia (Pall.)
Less. Subdominant. Halomezophilous perennial
up to 1-1.5 metres in height.

Kermek Gmelina – Limoniumgmelini (Willd.)
Kuntze. Subdominant. Halomezophilous peren-
nial up to 0.5-1 metres in height.

Climacopteracrassa Botsch. Temporary domi-
nant. Halomesophilous annual up to 15-30 centi-
metres in height.

Dominants and subdominants of halophilic
vegetation – Halophyta

Black saxaul – Haloxylon aphyllum (Minkw.)
Iljin. Dominant. Halo xerophilous tree, reaching
(3) 4-5 metres in height.

Salsola dendroides Pall. Dominant. Halo xe-

rophilous shrub up to 1-1.5 metres in height.

Halo stachys belangeriana (Moq.) Botsch.
Dominant. Halo mexerophilous shrub up to 1.5-
2.5 metres in height.

Tamarix hispida – Tamarixhispida Willd.
Dominant. Halomexerophilous shrub, reaching
2-3 metres in height.

Schober’s selittiferous shrub – Nitrariaschoberi
L. Dominant. Haloxeromesophilous shrub up to
1-1.5(3) metres in height.

Climacoptera

Botsch.
aralensis
Temporary dominant. Halomesophilous annual
up to 15-40 centimetres in height.

(Iljin)

Climacoptera woolly – Climacopteralanata
(Pall.)
dominant.
Halomesophilous annual up to 20-40 centime-
tres in height.

Temporary

Botsch.

Glasswort – Salicornia europaaea L. Temporary
dominant. Halomezophilous annual up to 15-30
centimetres in height.

Pratov’s goosefoot – Atriplexpratovii Sukhor.
Temporary subdominant. Halomezophilous an-
nual up to 15-20 centimetres in height.

Bassiahyssopifolia (Pall.) Kuntze. Temporary
subdominant. Halomesophilous annual up to
20-30 centimetres in height.

134

Dominants and subdominants of psam-
mophilous vegetation – Psammophyta

Saxaul-white – Haloxylonpersicum Bungeex
Boiss. Dominant. A psammose-xerophilous tree,
reaching 4-5 metres in height.

Ammodendron conollyi Bunge ex Boiss.
Dominant. Psammose-xerophilous shrub up to
2-3 metres in height.

Sandy-tree astragalus – Astragalus ammoden-
dron Bunge. Dominant. Psammose-xerophilous
shrub up to 1-2 metres in height.

Salsolarichteri Kar. Dominant. Psammome-

xerophilous shrub up to 2-3 metres in height.

Salsola paletzkiana Litv. Dominant. Halome-

xerophilous shrub up to 2-2.5 metres in height.

Medusa head candymere – Calligonum
Caput-medusa Schrenk. Dominant. Psammome-
xerophilous shrub up to 2.5-3 metres in height.

Calligonum aralense Borszcz. Dominant.
Psammose-xerophilous shrub 2 metres in height.

Calligonum aphyllum (J.Pall.) W.R. Guerke.
Dominant. Psammose-xerophilous shrub 2 me-
tres in height.

Calligonum macrocarpum Borszcz. Dominant.
Psammose-xerophilous shrub 2 metres in height.

Calligonum microcarpum Borszcz. Dominant.

Psammose-xerophilic shrub 2 metres in height.

Calligonum eriopodum Bunge. Subdominant.
in

Psammome-xerophilous shrub 2 metres
height.

Calligonum junceum (Fisch. et Mey.) Litv.
Subdominant. Psammose-xerophilous shrub,
2 metres in height.

Artemisiaterrae-albae Krasch. Dominant.
semi-

(psammospermophilous)

Xerophilous
shrub up to 30 centimetres in height.

Sprawling wormwood – Artemisia diffusa
Krasch. Dominant.Xerophilic semi-shrub up to
40 centimetres in height.

Camelthorn – Alhagi pseudalhagi (Bieb.) Desv.
Dominant. Haloxeromesophilous perennial up to
1-1.5 metres in height.

Aristidaperia – Stipagrostis pennata Trin.
Dominant. Psammose-xerophilous perennial
1 metre in height.

Aristida Karelinii – Stipagrostis karelinii
Roshev. Dominant. Psammos-exerophilous pe-
rennial 1.5 metres in height.

Dominants and subdominants of hypsophi-
lous vegetation – Gypsophyta
Eremosparton leafless – Eremosparton aphyl-
lum (Pall.) Fisch. Et Mey. Dominant. Psammose-
xerophilous shrub up to 1.5-2 metres in height.

Astragalus oblongata – Astragalus villosissimus
Bunge. Dominant. Psammose-xerophilous semi-
shrub up to 1 metre in height.

Peganum harmala Subdominant. Psammome-
xerophilous perennial up to 25-40 centimetres
in height.

Dominants and subdominants of riparian
vegetation – Potamophyta

Turanga diversifolia – Populus diversifo-
lia Schrenk. Dominant. Mesophilous tree up to
5-8 metres in height.

Tamarix ramosissima – Ledeb. Dominant.
Halomexerophilous shrub up to 1.5-3 metres in
height.

Tamarix florida – Tamarix florida Bunge.
Subdominant. Halomexerophilous shrub up to
1.5-2 metres in height.

laxa

Tamarix

Subdominant.
Halomesoxerophilous shrub, up to 1.5-2 metres
in height.

Willd.

Phragmites australis (Cav.) Trin. ExSteud.
Dominant. Hygroesophilous perennial up to
2-3 metres in height.

135

The main dominant vegetation species of the Southern Aralkum Desert and their habitats (soil)

Associations

Dominants and subdominants

Abun-
dance

Soil

Solon-
chak

Clay

Sand

Table 20.

Formation black saxaul – Haloxyletaaphylli

Black saxaul

Haloxylonaphyllum (Minkw.) Iljin

Djingilov and black
saxaul

Cherkezovo - black
saxaul

Karabarakovo - black
saxaul

Haloxylonaphyllum (Minkw.) Iljin

Tamarixramosissima Ledeb

T. hispida Willd.

Haloxylonaphyllum (Minkw.) Iljin

Salsolarichteri Kar.

Haloxylonaphyllum (Minkw.) Iljin

Halostachysbelangeriana (Moq.) Botsch.

сop3

cop2

сop1

сop1

сор2

сор1

сор2

сор1

Formation Kuyansuyak – Ammodendretaconollyi

Djingilov-kuyansuyak

Cherkezovo
kuyansuyak

Ammodendronconollyi Bunge ex Boiss.

Tamarixramosissima Ledeb

Ammodendronconollyi Bunge ex Boiss.

Salsolarichteri Kar.

Selinovo kuyansuyak

Ammodendronconollyi Bunge ex Boiss.

Aristida pennata Trin.

сop2

сop1

сop2

сop1

сop2

сop1

Formation Cherkez – Salsoletarichteri

Djuzgunovo- djigilovo
cherkezovaya

Black saxaul-
cherkezovye*

Kuyansuyk-
cherkezovye

Salsolarichteri Kar.

Tamarixramosissima Ledeb

Calligonum sp. sp.

Salsolarichteri Kar.

Haloxylonaphyllum (Minkw.) Iljin

Salsolarichteri Kar.

Ammodendronconollyi Bunge ex Boiss.

сop2

sp2

сop2

сop1

sp1

сop2

сop1

Kyzyljingilov

Tamarixramosissima Ledeb

cop3

Formation Kyzyljingilov – Tamaricetaramosissimae

+

+

+

+

+

+

+

+

-

-

-

-

-

-

-

-

-

-

-

-

+

+

+

+

+

+

+

+

+

-

-

-

-

-

-

-

-

-

-

-

-

+

+

-

-

-

-

-

-

-

+

+

+

+

+

+

+

+

+

+

+

+

+

-

136

Associations

Dominants and subdominants

Jingyla

Cane and kyzyljyngyl

Tamarixramosissima Ledeb

T. hispida Willd.

Tamarixramosissima Ledeb

Phragmites australis (Cav.) Trin. Ex Steud.

Solerosovo
kyzyljingilov

Balykkuzovo
kyzyljingilov

Tamarixramosissima Ledeb

Salicornia europaea L.

Tamarixramosissima Ledeb

Climacopteralanata (Pall.) Botsch.

Chernosaxaulo -
kyzyljingilov *

Tamarixramosissima Ledeb

Haloxylonaphyllum (Minkw.) Iljin

Abun-
dance

cop2

cop1

cop2

cop1

cop2

cop2

cop2

cop2

cop1

sp2

Formation Yermanyjingil – Tamaricetahispida

Akbashevo -
yermanyjingilov

Karabarakovo -
hermangilov

Reed - hermangiland

Tamarixhispida Willd.

Kareliniacaspia (Pall.) Less.

Tamarixhispida Willd.

Halostachysbelangeriana (Moq.) Botsch.

Tamarixhispida Willd.

Phragmites australis (Cav.) Trin. Ex Steud.

cop2

sp3

cop2

cор1

cop2

cop1

Formation Reed – Phragmitetaaustralis

Cane

Phragmites australis (Cav.) Trin. Ex Steud.

Rogozovo reed

Yermanyjingilo - vo -
trostnicheskaia

Phragmites australis (Cav.) Trin. Ex Steud.

Typha angustifolia L.

Phragmites australis (Cav.) Trin. Ex Steud.

Tamarixhispida Willd.

сop3

сop2

сop1

сop2

sp3

Formation Selinum – Aristidetapennata

Selinum

Aristida pennata Trin.

Calligonum-selinum

Aristida pennata Trin.

Calligonum caput- medusa Schrenk

сop2

сop2

сop1

Karabarakova

Halostachysbelangeriana (Moq.) Botsch.

сop3

Formation Karabarak – Halostachetabelangeriana

Soil

Solon-
chak

Clay

Sand

-

-

-

-

+

+

+

+

+

+

-

-

+

+

-

-

-

-

-

-

-

-

+

+

+

+

+

-

-

-

-

+

+

+

+

+

+

+

+

-

-

-

-

-

-

+

-

-

-

-

-

-

-

-

-

-

-

-

-

-

-

-

+

+

+

+

+

+

-

137

Associations

Dominants and subdominants

Akbashevo -
karabarakova

Chernosaksaulovo
karabarakova

Yermanyjingilovo
karabarakova

Halostachysbelangeriana (Moq.) Botsch.

Kareliniacaspia (Pall.) Less.

Halostachysbelangeriana (Moq.) Botsch.

Haloxylonaphyllum (Minkw.) Iljin

Halostachysbelangeriana (Moq.) Botsch.

Tamarixhispida Willd.

Abun-
dance

сop2

сop1

сop2

sp1

сop2

sp3

Karabarakovo-
kumuzumovaya

Amber
karachingyl -
cumusum

Formation Cumulus – Nitrarietaschoberi

Nitrariaschoberi L.

Halostachysbelangeriana (Moq.) Botsch.

Nitrariaschoberi L.

Lyciumruthenicum Murr.

Alhagipseudalhagi (Bieb.) Desv.

сор2

сор1

сор2

cор1

sp2

Formation Balikkuzovaya – Climacopteretalanata

Mixed-balancourt *

Alabutavo
balikkuzovaya

Bassievo
balikkuzovaya

Climacopteralanata (Pall.)Botsch.

С. аralensis (Iljin) Botsch.

Climacopteralanata (Pall.)Botsch.

Atriplexfominii Iljin

Climacopteralanata (Pall.)Botsch.

Bassiahyssopifolia (Pall.) Kuntze

N o t e: * - associations cited by the author for the first time

сор3

сор1

сop2

sp2

сор2

сор1

Soil

Solon-
chak

Clay

Sand

+

+

+

+

+

+

+

+

-

-

-

+

+

+

+

+

+

+

+

+

+

+

+

+

+

+

+

+

-

-

+

+

-

-

-

-

-

-

-

-

-

-

-

-

-

-

-

-

-

-

-

Typha

angustifolia

Subdominant.
Hygroesophilous perennial up to 2-3 metres in
height.

L.

To reduce the removal of toxic substances, it
is necessary to fix mobile sands and solonchak,
and the dominant and subdominant vegetation
species undoubtedly play a major role.

The results of laboratory studies of herbar-
ium samples make it possible to conclude that
the dominant species are mainly halophilous
and some psammophilous plants from the fam-
ilies Chenopodiaceae, Tamaricaceae, Fabaceae,
Polygonaceae and others, as they create forma-
tions, associations and occupy a certain part of
the dried area (Tables 21-23).

138

Table 21.

Species (floristic) composition of some psammophilous communities of the Southern Aralkum

Types of vegetation

Types of plants

Associations

Psammophile

Psammophile

Psammophile

Psammophile

Selinum

Akbashevo -
blacksaxaulovaya

Black saxaul

Calligonum

Coordinates

60° 14’ 8.556» E
43° 51’ 47.639» N

60° 14’ 44.725» E
43° 51’ 57.229» N

60° 19’ 32.930» E
43° 54’ 10.444» N

60° 21’ 21.992» E
43° 58’ 8.807» N

Description date

9.06.2020

9.06.2020

9.06.2020

11.06.2020

No. of site(s)

Projective coverage,
%

Site size

Trees

Haloxylon aphyllum

Shrubs

Astragalus
villosissimus

Calligonum sp.

Tamarix hispida

Salsola sp.

Herbs

Stipagrostis
pennata

Stipagrostis
karelinii

Karelinia caspia

Atriplex pratovii

Euphorbia
seguieriana

Phragmites
australis

Horaninovia ulicina

Alhagi pseudalhagi

Total

317

55-60

100 m2

318

35-40

100 m2

sol

-

sol

sol

-

cop3

-

sol

sol

-

-

-

-

6

sp1

-

sol

sol

-

-

-

cop2
-

sol

-

-

-

5

139

327

50-60

100 m2

cop1

sp2

sp2
-

-

cop1

-

-

-

-

sol

-

-

5

371

35-40

100 m2

-

sp2

cop1
-

sol

-

sp2

-

-

sol

-

sp2
sol

7

Table 22.

Species (floristic) composition of some halophilic communities of the Southern Aralkum

Halophilic

Halophilic

Halophilic

Halophilic

Types of vegetation

Types of plants

Associations

Djuzgunovo -
chernosaxaulovo
- cherkezova

Djuzgunovo -
chernosaxaulovo
- cherkezova

Djuzgunovo -
chernosaxaulovo
- cherkezova

Chernosaxaulovo -
cherkezova

Coordinates

60° 10’ 39.943» E
43° 55’ 4.066» N

60° 10’ 30.533» E
43° 55’ 41.041» N

60° 10’ 10.981» E
43° 56’ 55.378» N

60° 10’ 1.225» E
43° 57’ 16.852» N

Description Date

5.06.2020

5.06.2020

5.06.2020

5.06.2020

No. of site(s)

Projective coverage,
%

Site size

Trees

Haloxylon aphyllum

Shrubs

Salsola richteri

Calligonum
macrocarpum

Tamarix hispida

Herbs

Horaninovia ulicina

Atriplex pratovii

Total

242

70-80

100 m2

cop1

sp1

cop3

sp1

sp2
sol

6

244

60-70

100 m2

cop1

sp1

cop3

-

sp2
-

4

246

50-60

100 m2

cop1

sp1

cop3

-

sp2
-

4

247

45-50

100 m2

cop1

cop2

-

-

sp2
-

3

Species (floristic) composition of some riparian communities of the Southern Aralkum

Table 23.

Types of plants

Umbrella

Umbrella

Umbrella

Umbrella

Types of vegetation

Yulgunova

Yulgunova

Turanga

Reed

Associations

Coordinates

59° 26’ 14.626» E
43° 35’ 44.023» N

59° 37’ 46.286» E
43° 28’ 22.030» N

59° 19’ 37.600» E
43° 23’ 38.594» N

60° 10’ 15.395» E
43° 38’ 45.917» N

Description Date

31.05.2020

1.06.2020

2.06.2020

12.06.2020

140

Types of plants

No. of site(s)

Projective coverage,
%

Site size

Trees

Populus diversifolia

Elaeagnus
orientalis

Shrubs

Tamarix hispida

Tamarix florida

Tamarix sp.

Halostachys
belangeriana

Ziziphus jujuba

Herbs

Climacoptera
aralensis

Zygophyllum
fabago

Euphorbia
seguieriana

Alhagi pseudalhagi

Phragmites
australis

Karelinia caspia

Taraxacum
officinale

Corispermum
aralo-caspicum

Limonium otolepis

Umbrella

Umbrella

Umbrella

Umbrella

Types of vegetation

Yulgunova

Yulgunova

Associations

32

90

50 m2

-

-

cop1

-

-

-

-

sp2

sol

sol

sp2

sp2

-

sol

sol

sp2

68

40-50

50 m2

sol

-

cop1

cop1

-

sp2

-

-

sol

-

-

sp2

sp2

-

-

-

141

Turanga

142

50-60

50 m2

cop1

sol

-

-

sp2

-

sol

-

sol

sp2

sol

-

sp2

-

-

-

Reed

452

65-70

50 m2

sol

-

sp1

-

-

-

-

-

-

-

cop2

-

sp2

-

-

-

Types of plants

Aeluropus littoralis

Сhenopodium
album

Atriplex tatarica

Carex sp.

Agriophyllum
lateriflorum

Итого

Umbrella

Umbrella

Umbrella

Umbrella

Types of vegetation

Yulgunova

Yulgunova

Turanga

Reed

Associations

cop1

sol

-

-

-

11

sp2

-

sol

sol

-

10

-

-

sol

-

sol

10

-

-

-

-

-

4

Note: the species composition of all points (2062) is attached as a separate table.

Some species are dominant and subdominant
in several associations. For example: Haloxylon
aphyllum (Minkw.) Iljin., Tamarix hispida Willd.,
Salsolarichteri kar., Ammodendron
conol-
lyi Bunge ex Boiss., Halostachys belangeriana
(Moq.) Botsch, Phragmites australis (Cav.) Trin. Ex
Steud., Stipagrostis pennata Trin., Climacoptera
lanata
(Pall.) Botsch., Artemisiaterrae-albae
Krasch., Artemisia diffusa Krasch.

Based on the results of the study of phyto-
cenoses of the southern part of the dried bottom
of the Aral Sea, the following halophilic plant
groups were identified. Below are the results of
the study of halophilic vegetation, which plays
a major role in the composition of biological di-
versity of the dried seabed of the Aral Sea.

I. Haloxyletaaphylly – Black Saxaul Formation

The Black Saxaul Formation is widespread
throughout the dried Aral Sea bed, especially in
large bodies in the southern part. With the low-
ering of the Aral Sea level (since the 1960s), sax-
aul communities gradually appeared on sandy
shores and sandy bodies (after a series of suc-
cessions of plant groups).

this

formation

The edificator of

is
Haloxylonaphyllum (Minkw.) Iljin, a haloxeroph-
ilous tree of the Chenopodiaceae family, reach-
ing (3) 4-5 metres in height. As a representative
of this formation, it is the dominant plant in the
upper layer of plant cover on various saline soils
of the dried bed (Fig. 82 and 83). In our study
of the Black Saxaul Formation, we identified six
associations:

a) Black saxaul (Haloxylon aphyllum);

b) One-year saltwort-black saxaul (Haloxylon
aphyllum, Atriplex pratovii, Suaeda crassifolia,
Climacoptera lanata). Spread on wet, puffy
solonchak;

c) Solanaceous-carabarachian-black saxaul
(Haloxylon aphyllum, Halostachys belangeriana,
Salsola nitraria). Widespread on highly saline
soils and crusty, crusty-puffed solonchak;

d) Cerkez-yulgun-black saxaul (Haloxylon
aphyllum, Tamarix hispida, Salsola richteri).
Widespread on medium saline soils and crust-
puffed solonchak;

e) Adraspanic-cherkezov-chernosaxaulic
(Haloxylon aphyllum, Salsola richteri, Peganum

142

harmala). Distributed on moderately saline soils
and sands;

f) Grass-black saxaul (Haloxylon aphyllum,
Eremopyrum orientale, Descurainia sophia,
Salsola paulsenii). Widespread on saline soils
and sands.

II. Halostachydetabelangerianae – Karabarak

Formation

The Karabarak Formation is distributed on sa-
line habitats of the dried Aral Sea bed. We first
recorded this formation in the south-western
part of the Aralkum Desert in 2007. Long-term
observations have shown that associations of
the Karabarak Formation are well developed and
formed year after year throughout the dried sea
area and play a significant role in the composi-
tion of vegetation cover and biodiversity.

(Chenopodiaceae),

The edificator of this formation is Belyanger’s
Saltwort – Halostachys belangeriana (Moq.)
Botsch., Haloxerophilous shrub, family of the
Marecchiaceae
reaching
2-3.5 metres, strongly branched with articulate
stems and opposite branches (Fig. 99). Annual
shoots are succulent, cylindrical, segmented,
glaucous-dark green, and blackening in autumn.
Leaves are reduced to filmy, short-triangular
scales, which, clustered in pairs, form a slightly
lagging two-lobed belt around the stem. During
our studies, we identified three associations:

a) Saline-black saxaul-karabarak (Halostachys
belangeriana, Haloxylon aphyllum, Salsola
micranthera);

b) Cherkezov-karabarak (Halostachys belangeri-
ana, Salsola richteri);

c) One-year saltwort-sulphur-karabarak
(Halostachys belangeriana, Tamarix hispida,
Climacoptera lanata, Salicornia europaea).

III. Tamaricetahispidae – Yulgun Formation

The Yulgun Formation is widely distributed
on saline soils and solonchak throughout the
south-western part of the dried bed. Other spe-

cies and hybrids of the genus Tamarix are often
found as part of this formation, which form mixed
communities inhabiting several tens of hectares
in different areas. The formation is considered
one of the leading communities forming in the
area. The role of the formation in the composi-
tion of biodiversity of the dried Aral Sea bed is
very characteristic.

The edificator of this formation is the Tamarix
hispida, Tamarixhispida Willd., a halomexeroph-
ilous shrub, reaching 2-3 metres in height, of
the family Tamaricaceae (Fig. 79 and 86). The
crown is formed with numerous thin and small
branchlets or by coarse and obtuse branches.
The leaves are scale-like, with awns at the base.
Young branches and leaves are puberulent with
straight, short hairs. The bark is brown-red.

a) Mixed-jugular (Tamarixhispida, T. laxa, T.
ramosissima, T. spp.);

b) Astragalus chernosaxaulo yulgu-
na (Tamarixhispida, Haloxylonaphyllum,
Astragalusammodendron);

c) One-year saltwort-julguna (Tamarix hispi-
da, Bassia hyssopifolia, Climacoptera lanata,
Salicornia europaea, Atriplexpratovii);

d) Bassi-desert-julgunian (Tamarixhispida,
Lyciumruthenicum, Kareliniacaspia,
Bassiahyssopifolia).

IV. Halocnemeta strobilacei – Sarsazan

Formation

The edificator of the Sarsazan Formation is
Halocnemum srtobilaceum (J.Pall.) M.Bieb., a
haloxerophilous small greyish shrub of up to
70 centimetres, of the Chenopodiaceae family,
strongly branched with segmented stems and
opposite branches, forming circles or tubercles
with prostrate, dense, in turn branched and part-
ly rooting branches (Fig. 97). The annual shoots
are cylindrical, succulent, and geniculate, with
short cylindrical or almost club-shaped seg-
ments. Its leaves are undeveloped, in the form

143

of supronate, almost shield-shaped scales. Its
habitat is puffy and crusty solonchak.

number of associations and plants, as well as
abundance – Haloxyleta aphylly.

a) Sarsazan (Halocnemum srtobilaceum);

b) One-year saltwort-sarsazan (Halocnemum sr-
tobilaceum, Salicornia europaea, Climacoptera
aralensis, Suaeda crassifolia);

c) Black saxaul-juzgun-sarsazan (Halocnemum
srtobilaceum, Calligonumaphyllum,
Haloxylonaphyllum);

d) Kermeko-wormwood and sarsazan
(Halocnemum srtobilaceum, Artemisiaterrae-
albae, Atraphaxisspinosa, Limonium otolepis).

V. Climacoptereta aralensis – Climacopteric

Formation

The edificator of the Climacopteric Formation
is Climacoptera aralis (Iljin) Botsch. A temporary
dominant, halomesophilous annual of up to 15-40
centimetres in height, of the Chenopodiaceae
family. Stems and branches during fruiting are
covered with sparse, straight, short protruding
hairs. Branches and leaves are alternate, or only
the lowest suprose, descending. Forage grazing
plants, especially in fall and winter.

a) Climacopter (Climacoptera aralensis, C. lana-
ta, С. spp.);

b) Annual;

c) Saltwort-climacoptera (Climacoptera aral-
ensis, C. lanata, Bassia hyssopifolia, Atriplex
pratovii, Tamarix hispida).

VI. Mixto-Chenopodiaceta – One-year Saltwort

Formation (Fig. 88).

a) Yulguno-one-year old saltwort (Suaeda
crassifolia, Climacoptera spp, Salsola paulsenii,
Tamarix hispida);

b) Camishevo-one-year old saltwort (Bassia
hyssopifolia, Climacoptera lanata, Salicornia
europaea, Phragmites australis).

Among the identified halophilic plant groups,
the Black Saxaul Formation leads in terms of the

Despite the Aral Sea bed’s unfavourable envi-
ronmental conditions, the development of these
plant communities and their wide distribution
has been established.

The question of great theoretical and practi-
cal importance is which of the plant species first
appeared on the bottom of the dried sea. It is
known that Salicornia europaea first begins to
grow in the vicinity of the dried area of each lake
and sea. It is followed by halophytes, which are
adapted to grow on the background with com-
paratively less salt in the soil.

Based on the research results, changes in the
composition of flora and vegetation depending
on changes in the mineral composition of soil
and groundwater from the seabed to the Aral Sea
(water) were revealed. On the old shorelines (on
the territories) the vegetation cover is more than
40-50 percent and has a great positive impact
on the formation of sustainable ecosystems. On
the old shorelines the level of vegetation cover
decreases towards the sea.

The vegetation of the Sarybas (Rybatsky) Lake
coast is formed by plants of the Amudarya River
delta. It should be noted that at this time, the
vegetation cover on the shore of Sarybas Lake
is still forming. Our further goal is to thoroughly
study the vegetation of this area and the rela-
tionship of the vegetation cover with other lakes
of the dried bottom of the Aral Sea.

More than 30 species of higher plants of the
south-western Aralkum territories are the re-
sults of floristic studies for the last three years.
The presented number of plants (30) and taxo-
nomic units may necessarily change (increase)
due to the continuation of further migration and
flora formation.

In the first years in the waterless areas, plants
were found alone or not at all. This is due to the

144

fact that the soil level in the first year of water
release is very high.

It turned out that the main mass of the stud-
ied areas had an abundance of halophyte vege-
tation adapted to different saline soils. Due to
the high salt content and high salinity of ground-
water, difficult conditions for the growth and
development of plant species were observed.
Despite this, relatively well-formed plant com-
plexes were discovered in some sands and areas
with relatively low salt content. At the same
time, most of the dehydrated areas form a cover
of halophilic vegetation adapted to growing on
different saline soils.

The Aral Sea drainage vegetation cover for-
mation is one of the main factors of arid lands
development.

By economic importance, fodder plants pre-
vail - 24 species, sand and solonchak fixers - 10
species, essential-oil and alkaloid - 9 species,
medicinal - 7 species.

In order to determine which ecological group
each species belongs to, scientific sources and
materials collected during expeditions were
analysed. According to scientific sources, as a
result by plant habitats three types were iden-
tified, including halophytes, psammophytes and
hypsophytes. The analysis of the distribution of
ecological groups shows that halophytes make
up a great number of species.

Most plant species of the southern Aralkum
are represented by those that are adapted to
grow on different levels of salinity of soils and
saline sands. It should be particularly noted that
due to strong salinity of soils, the vegetation
of annual saltwort worsens. In connection with
this, on sea overgrowing plots in the first year,
there were few plants and these did not develop.

Observations showed the formation of phy-
togenic hillocks and sand dunes ranging on av-
erage from 1.5 to 2-3 metres in height and 1.5-
3.7 metres in diameter. Each of such phytogenic
sand dunes hold an average of 15-20 tons of salt-
mixed sand (soil).

The research results can be used for writing
scientific works on the flora of the dried Aral
Sea bed and developing the modern system of
higher plants of Uzbekistan. The research data
on formations and associations can be used
in highlighting the further formation of plant
communities of the Aralkum. The species iden-
tified by us can be used in fixing moving sands
and solonchaks in phytomelioration works, and
those having fodder value as pasture lands for
livestock farming.

Endangered plant species in need of protec-
tion were identified based on the analysis of
herbarium data and the study of scientific sourc-
es, as well as the study of materials collected
during expeditions. As a result, one species was
identified as being in need of protection, spe-
cifically Atriplex pratovii Sukhor, and its habitat
continues to be reduced. As a result of research,
the area of its distribution is expanded.

It can be noted that about 5-6 percent of the
flora of the Southern Aralkum are considered to
be species in need of protection and are rare for
this territory.

As a result of our research, we were able to
identify dominants and subdominants that
play a major role in the migration of flora and
vegetation.

Table 24 shows some features of the migra-

tion of flora and vegetation.

145

Table 24.

Migration of flora and vegetation of the southern part of the Aral Sea bed

Migra-
tion
groups

Brief description

g The group is formed by a strip of
n
i
t
a
r
g
i
M

the first years of drying, arising
after the retreat of the sea.
The group continues to form in
progressive dynamics.

Types of
vegeta-
tion

s
u
o
l
i

h
p
o
l
a
H

s
l
a
u
n
n
a

Dominant and subdominant
plants

Soils. Ratio

Salicornia europaeа,
Climacoptera lanata,
C. aralensis, Suaeda
crassifolia, Bassia
hyssopifolia, Atriplex
pratovii

Solonchak
(wet)

i

g
n
d
n
a
p
x
E

g
n
i
s
i
l
i

b
a
t
S

i

g
n
n
i
l
c
e
D

The group is formed in the later
stages of overgrowth of the
dried seabed. Their spreading
goes in the direction from the
bedrock shore to the water’s
edge. The group continues to
form in progressive dynamics.

The group forms near the coast
of the native shores of the
former sea, which requires a
less saline soil. The group forms
in progressive dynamics, but
is relatively slower than the
previous ones.

A group of declining species,
which are characteristic of
hygro- and hydrophilic plants,
formerly of the shallow water
and representatives of the
meadow-tugue flora. A group in
regression.

d
n
a
s
u
o
l
i
h
p
o
l
a
H

s
u
o
l
i
h
p
o
m
m
a
s
p

s
u
o
l
i
h
p
o
m
m
a
s
P

d
n
a
s
l
a
i
n
n
e
r
e
p

d
n
a
-
o
r
g
y
h

,

h
s
r
a
m

s
u
o
e
c
a
b
r
e
H

Tamarix ramosissima,
T. hispida, Halostachys
belangeriana, Salsola
richteri, Haloxylon aphyllum,
Calligonum eriopodum, C.
caput-medusa и др.

s
b
u
r
h
s
-
i

m
e
s

d
n
a
s
b
u
r
h
s

Solonchak (crusty
and puffy), saline
sand

Artemisia terrae-albae,
Stipagrostis pennata, Carex
physodes, Halimodendron
halodendron, Astragalus
ammodendron,
Ammodendron conollyi, and
others

Ceratophyllum demersum,
Najas marina,
Zostera minor,
Phragmites australis,
Typha angustifolia

s
b
u
r
h
s
-
i

m
e
s

s
l
a
u
n
n
a
c
i
l
i
h
p
o
r
d
y
h

s
l
a
i
n
n
e
r
e
p
d
n
a

Salty sand

Swamps

The high adaptation of plant groups and types
of vegetation (halophilic, psammophilic) indi-
cate the instability of environmental conditions.

Annual hyperhalophytes (Salicornia europaeа
L., Suaeda crassifolia (Pall.), Bassia hyssopifo-
lia (Pall.) Kuntze, Climacoptera aralensis (Iljin)
Botsch., and others) are adapted to grow on
highly saline soils. Therefore, they develop new
areas of the drying sea.

Due to the hyperhalophytes which reduce
soil salinity, halomesoxerophilous, haloxerome-
sophilous shrubs and semi-shrubs from the
families Chenopodiaceae and Tamaricaceae are
formed behind them. However, these plant spe-
cies (groups) are not the main representatives of
the flora and vegetation cover.

Psammophilous perennials

and

shrubs

(Artemisiaterrae-albae

semi-
Krasch.,

146

Stipagrostispennata Trin., S. karelinii Roshev.,
Carexphysodes M.Bieb., Astragalusammodendron
Bunge., Ammodendron conollyi Bungeex Boiss.,
Atraphaxisspinosa L., and others) occupy a much
larger part of the dried area. There are plant
species whose habitat is reduced due to shallow
water bodies and groundwater drying out.

There is a connection between soil salinity
and plant species. On strongly saline soil, there
are glasswort, climacoptera and saltwort. On
medium saline soil there are tamarix and some
representatives of annual saltwort, and on low
saline soil there is kermek, black saxaul and also
vegetation of various grasses (ephemeroids).

The following conclusions can be made based
on the results of studies to determine the reg-
ularities of the formation of the flora of the
south-western part of the Aral Sea bed:

1. In the process of forming the flora and veg-
etation of the dried Aral Sea bed, the pioneers
are annual hyperhalophytes: Salicornia euro-
paeа L., Suaeda crassifolia Pall., Bassia hyssopi-
folia (Pall.) Kuntze., Climacoptera aralensis (Iljin)
Botsch., С. Lanata (Pall.) Botsch., Atriplex pratovii
Sukhor., and others. They migrate at the site of
the drying up of the sea.

2. The main dominant species of the flora are
habitat-expanding halophytes and psammo-
phytes: Tamarix hispida Willd., T. ramosissima
Ledeb, Halostachys belangeriana (Moq.) Botsch.,
Haloxylon aphyllum (Minkw.) Iljin., Salsola rich-
teri Kar., Calligonum eriopodum Bunge., C. ca-
put-medusa Schrenk., Astragalus ammodendron
Bunge., Ammodendron conollyi Bunge ex Boiss.,
Stipagrostis pennata Trin., and others.

3. The habitats of declining species of flora
are hygro and hydrophytes: Ceratophyllum
demersum L., Najas marina L., Zostera minor,
Phragmites australis (Cav.) Trin. ex Steud., Typha
angustifolia L., and others.

4. The migration of flora goes in the follow-
ing order: migrating plants (halophytes: hy-

perhalophytes, halomesophytes) → habitat
expanding plants
(haloxeromesophytes, ha-
lomesoxerophytes) → relatively stabilized plants
(psammophytes:
psammoxeromesophytes,
psammoxerophytes).

Starting from the base of the shore to the
bottom of the dried sea, the vegetation cover
and flora composition will naturally change with
changes in the soil and water regime.

In subsequent years, it is noted that vegeta-
tion barely grows on the site of the dried seabed.

As a result of subsequent retreats of the lake,
plant growth may not occur at all due to the
onset of solonchaks, which form a white saline
soil surface.

It should be noted that geobotanical data
of the vegetation community of the southern
Aralkum Desert are not final. Further study of the
vegetation cover of this area should undoubted-
ly lead to clarification of the communities of the
southern part of the dried bed of the Aral Sea, in
connection with the continued formation of flora
and vegetation.

The above-mentioned associations can be
used for stabilizing sands and solonchaks, and
as forage pastures in the spring and autumn pe-
riods. Further detailed study of the vegetation
cover of the studied territories can undoubted-
ly contribute to the solution of the Aral Sea re-
gion’s ecological problem (Figs. 82, 84, 85, 87, 92,
93 and 96).

Year by year, the content of sulphates and
chlorides of such minerals as sodium, magne-
sium and potassium increases in Aralkum soils.
It has been proved that the coverage of saline
soils by plants takes place in accordance with
natural regularities, which stipulate stage-by-
stage settlement by psammophilous plants of
soils developed earlier by halophytes. The land-
scape decreases, including the degree of vegeta-
tion cover formation (quantitative composition

147

and diversity), in the direction from the former
seashore to water (the Aral Sea).

The practical significance of this research
is that the approach to phytomelioration work
aimed at the dried Aral Sea bottom re-population
with promising plant species (Tamarixhispida,
ramosissima, Halostachys belangeriana,
T.

Haloxylon aphyllum, Salsoladendroides, S.
orientalis, Climacoptera aralensis, Nitraria
schoberi, Lycium ruthenicum, Limonium oto-
lepis) has been developed to fix moving sands
and solonchaks. Additionally, the prospects of
the region’s plants have been revealed as being
promising resources for the development of the
pharmaceutical industry of the Republic.

6.3.1. Recommendations

As a result of observations made during expe-
ditions and laboratory research, we have made
the following practical recommendations:





The use of a number of plant species in
phytomelioration works on the dried Aral
Sea bottom.
The use of the Aral Sea region’s plants
as a natural source for the isolation of
protein-peptide components with high
biological activity, and the further devel-
opment of new generation medicines on
their basis.

Consideration of the flora formation duration
in the southern Aralkum showed that the num-
ber of plants and the composition of taxonom-
ic units are undoubtedly increasing. Based on
the observations made during the expeditions,

we may assume that the flora of the southern
Aralkum will become stable in a few hundred
years, as in the neighbouring natural-geograph-
ical areas.

As a result of our studies, it was confirmed
that plant coverage of areas with saline soils
occurs in accordance with the natural regulari-
ties, which determine replacement of halophilic
plants by psammophilic plant representatives.

Our results contribute to a better understand-
ing of the fundamental mechanisms of plant ad-
aptation to environmental stressors and to the
development of a strategy for periodic sowing of
promising plant forms and species in the dried
Aral Sea seabed area, to fix mobile sands and
solonchaks.

148

Some dominant plant species and their plant communities
on the Southern Aralkum

Fig. 79. Tamarix ramosissima, Haloxylonaphyllum, Stipagrostis pennata

Fig. 80. Kokdarya, Phragmites australis

149

Fig. 81. Eremopyrum orientale and one year saltwort

Fig. 82. Haloxylon aphyllum

150

Fig. 83. Horaninovia ulicina, Calligonum, Haloxylon aphyllum

Fig. 84. Stipagrostis pennata, Haloxylon aphyllum

151

Fig. 85. Stipagrostis pennata

Fig. 86. Alhagi pseudalhagi, Tamarix hispida, Phragmites australis

152

Fig. 87. Calligonum caput-medusae

Fig. 88. Ammodendron conollyi

153

Fig. 89. Nitraria schoberi and annual saltwort with black saxaul

Fig. 90. Sand dune knolls. Annual saltwort and various shrubs

154

Fig. 90. Sand dune knolls. Annual saltwort and various shrubs

Fig. 91. Limonium otolepis, Tamarix hispida

155

Fig. 92. Natural grass pastures

156

Fig. 93. Reed formation. Phragmites australis, Tamarix spp

Fig. 94. Riparian vegetation. Populus diversifolia

157

Fig. 95. Populus diversifolia

Fig. 96. Alhagi pseudalhagi, Tamarix spp

158

Fig. 97. Halocnemum strobilaceum

Fig. 98. Atriplexpratovii, Climacopteraaralensis

159

Fig. 99. Halo stachys belangeriana

Fig. 100. Tamarix hispida Willd., Tamarix ramosissima Ledeb.,
Astragalus villosissimus Bunge

160

Fig. 101. Haloxylon aphyllum (Minkw.) Iljin., Astragalus villosissimus Bunge.,
Ammodendron conollyi Bunge ex Boiss

Fig. 102. Haloxylon aphyllum (Minkw.) Iljin

161

Fig. 103. Haloxylon aphyllum (Minkw.) Iljin., Tamarixhispida Willd., Climacoptera sp

Fig. 104. Haloxylon aphyllum (Minkw.) Iljin., Climacoptera lanata Pall. Botsch., Salsola richteri Kar., Tamarix
hispida Willd

162

6.4. Ecological situation on the dried seabed

The expeditions of 2019 and 2020 covered ap-
proximately 1,200,000 hectares of the dried Aral
Sea bed located in the Republic of Uzbekistan
territories. These territories, which belong to the
earliest dried seabed, revealed rather hetero-
geneous processes and sharp differences in the
landscape.

The Aral Sea’s dried bed is a unique labora-
tory of nature, where a new landscape is formed
by the natural processes of the gradual forma-
tion of soil cover on the background of vegeta-
tion. Simultaneously, destructive processes take
place under the impact of desertification and
anthropogenic destruction of the emerging frag-
ile natural cover. At the same time, the origin,
development and replacement of one formation
by another, or in combination, reflects the evo-
lution of landscapes themselves and depends
on several factors. These include firstly the local
features of the dried bottom, secondly the com-
position of bottom sediments, their salinity and
the depth of occurrence and groundwater sa-
linity, thirdly, wind direction and strength, and
finally, human interference. Along the expedi-
tions’ route, it was possible to observe different
vegetation cover and landscape combined with
various forms of meso- and micro-landscapes.

A landscape is a natural, genetically homoge-
neous territorial complex with vegetation cover
as a main component. The natural process-
es of landscape formation are interconnected
and are influenced by afforestation which af-
fects its condition. The processes of vegetation
overgrowth were established by such shrubs as
Tamarix hispida Willd (jyngyl), Halostachys be-
langeriana Botsch (saltwort belanger, karabarak)
or Phragmites australis (common reed), as well
as dense perennial thickets of saxaul.

In the course of previous expeditions and
the analysis of remote sensing data, landscapes
of the dried Aral Sea bed and field survey data

allowed specialists of GTZ, Terra Firma and SIC
ICWC (Dukhovny V.A. et al., 2008) to reduce the
number of landscape subsections and narrow
down the composition of classes for creating a
subject-related map with regards to the project
goals and objectives. This composition of class-
es makes it possible to estimate the degree of
erosion danger and to trace the dynamics of de-
sertification processes. As a result of the anal-
ysis of the spectral characteristics, 17 classes
were identified, which are given in Chapter 5.2.

The defined and coordinated list of classes
for the dried bed area corresponds to the goals
and objectives of the project identification of
erosion-hazardous areas and areas for promis-
ing phytoreclamation works.

Assessment of landscapes by degree
of ecological hazard

For perspective development and elaboration
of nature protection measures, it is particularly
important to assess the landscape of the dried
and drained seabed from the position of possi-
ble changes, development of deflation process-
es, dust, and salt transport. Such assessments
should be based on landscape classification in
connection with soil cover, vegetation state and
other factors.

By its nature, the landscape is a highly
non-equilibrium, changeable system, which is
characterised by daily, annual and multi-year
rhythms. We consider the modern transforma-
tion of the Aral Sea region’s natural environment,
which has a regional scale, to be an anthropo-
genic-driven aridization process. The peculiari-
ty of this process is that the trigger mechanism
was man-made. Because this process develops
against the background of desert zonal condi-
tions, the leading factor of dynamics being the
reduction of moisture, the landscapes evolve to

163

forms corresponding to desert complexes and
this process is called “desertification”.

As noted above, environmental hazards are
considered from the perspective of a harsh land-
scape that will not easily sustain life or the possi-
bility of human economic activity. The instability
of the dried seabed’s landscapes is manifested

not only in the momentary state, but may also
occur during any economic interference in the dy-
namics of their formation. Thus, the assessment
of the ecological hazard is carried out taking into
account the dynamics of processes occurring in
the area in accordance with the scheme given
earlier (Dukhovny V.A. et al., 2008).

Environmental hazard rating scale for classification results

Table 25.

Degree (level) of environmental
hazard

Index on the map

Distribution of classes according to the degree of
territory instability

No (practically none)

Weak

Medium

Strong

1

2

3

4

1.3 1.4 2.1 2.2 2.5 4.1 4.3 4.5

1.1 1.2 3.5 4.2

2.3 3.4 4.4

2.4 3.1 3.2 3.3

Scale of environmental hazard adopted ac-
cording to the assessment of the development
of destructive exogenous processes:

1. Practically no environmental
hazard:

2.1 Marsh solonchak without vegetation
or with saltwort communities, excessively
hydromorphic

2.2 Wet coastal solonchak with shell rocks,
sometimes with isolated specimens of saltwort
and sarsazan, hydromorphic

2.5 Saltwort solonchak of closed depres-
sions without vegetation, sometimes
framed by sarsazanites, hydromorphic and
semi-hydromorphic

4.1 Meadows on alluvial plains (reedy,
mixed grass-cereals) on alluvial-meadow,
swamp-meadow and meadow-bog soils

4.3 Shrub thickets (halophytic: tamarix,
karabarak) on alluvial-meadow soils

4.5 Shrubby saxaul (desert forest/artificial plan-
tations) on desert-sandy soils

Solonchaks are not dangerous because they

are hydromorphic for most of the year.

In landscapes of lake plains periodically
or permanently watered by river and collec-
tor-drainage water pose no danger as they be-
long to the hydromorphic regime. In addition,
vegetation is one of the main factors determin-
ing the dynamic state of the landscape; mead-
ows on alluvial plains have sufficiently high pro-
jective cover and shrub thickets contribute to
the fixation of moving sands.

2. Weak environmental hazard:

1.2. Shallows, sometimes with reeds

3.5. Hilly, hilly-ridgy fixed sands with ephemeral
wormwood-shrub communities

4.2. Deserted alluvial-meadow soils, hydromor-
phic, with cereal-halophytic-grass communities
with shrubs

These classes are categorised as weak eco-
logical hazard because their existence depends

164

on water inflow to the delta, for instance on
the water availability of the year. For example,
in low-water years, the area of water surface
decreases significantly, causing suppression of
reed vegetation.

3. Medium environmental hazard

2.3 Crust-puffed and crust solonchak without
vegetation, sometimes with isolated specimens
of shrubs (karabarak, tamarix-grass)

3.4 Hilly and hilly-ridgy sands without vegeta-
tion and weakly fixed

4.4 Deserted meadow-alluvial soils covered with
shrubby plants

The surfaces without vegetation, sometimes
with a single specimen of shrubs (karabarak,
tamarix), are one of the main suppliers of salt
and dust to the atmosphere. Deserted shrub-
lands pose a danger in terms of vegetation
degradation causing intensive development of
aeolian processes. Hilly and hilly-ridgy sands
not fixed by vegetation occupy significant areas
of the dried bed of the Aral Sea. The degree of
projective coverage varies from 20 to 40 percent
and contributes to the development of aeolian
processes. Therefore, the inter-sand dune de-
pressions are the main supplier of salt and dust
to the atmosphere.

4. Severe environmental hazards

2.4 Solonchak with overblown sandy cover with
sparse goosefoot and selinum communities

3.1 Plains (with shells) without vegetation or
with sparse shrubs (saxaul, tamarix)

3.2 Dunes without vegetation

3.3 Shallow-hilly (weakly fixed) with sparse com-
munities of wormwood, shrubs, and selinum
crops

These classes represent territories with in-
tensive development of exogenous processes

and represent the highest degree of ecological
hazard, being the formation of salt-dust-transfer
source. A significant part of the territory devel-
ops in automorphic regime.



The ecological situation on the dried and
drained seabed is under several impacts, which
are two sides of the transformation of this object:
 Desertification is manifested in the form
of sea retreat, up to the disappearance
of some water bodies, causing the
exposure of bedrock and the gradual
formation of a new landscape, as well
as the development of new biological
processes (overgrowing, soil formation,
formation of microbiological biota) and
in parallel, the emerging processes of
aeolian transformations.
The watering of peripheral areas of the
sea, both from the delta and other water
bodies, including collectors, wells and
discharge canals, and the anthropogenic
impact in the form of both protective
and nature-supporting measures (af-
forestation, stocking of residual water
bodies and their biological use) and
negative measures harmful to nature
in the form of geological prospecting
and extraction works. This should also
include unregulated water inflow both to
the delta and remnant reservoirs, along
the river and through collectors flowing
into this area.

The stochasticity of natural processes, as well
as the variously directed anthropogenic impacts,
indicates that the current environmental situa-
tion is extremely unstable. The main goal of en-
vironmental activities, sustainable functioning
and production, is difficult to achieve and cost/
effort intensive to manage, in order to maintain
the natural-anthropogenic stability.

At present, it is difficult to determine which
area is under the influence of purely natural
inducing factors (shoreline retreat and sea-

165

bed drainage, development of sand transport
and overgrowth, and the reduction of area and
volume of water bodies), which is predatorily
used and destroyed by oil producers and will
be subjected to sustained wetting. This will be
possible to determine precisely after complet-
ing an expeditionary survey of all three million
hectares of the Uzbek part of the seabed, as
well as a multi-year analysis of satellite obser-
vations of the wetting zones. Variations of hu-
midification zones are shown in the table below.

Two remnants of the Aral Sea on the territory of
Uzbekistan have, as presented in Table 26, an
area of 422,000 hectares.

SIC ICWC has regularly monitored the Aral Sea
and Aral Sea region for many years using Landsat
8 OLI satellite images. The images determined
areas of wetlands and open water surface on
the Aral Sea in dynamics since the beginning
of the year (Table 1 in Chapter 2.1) and areas of
wetlands and open water surface in the Aral Sea
region (Fig.105, Tables 26 and 27).

Areas of wetlands of the Aral Sea region, by hectare

Table 26.

Water body

19.02.2020

22.03.2020

25.05.2020

10.06.2020 28.07.2020

Sudochie

Mejdurechenskaya

Rybatsky

Muynak

Djiltyrbas, bounded by a dam

Djiltyrbas (together with the former
right and left channels)

Dumalak

Makpalkol

Mashan-Karadjar

Water surface south of Muynak

Water surface along the bed of the
Kazakhdarya River

20613,6

28506,8

6018,6

11200,9

36993,5

21799,0

28295,5

8271,2

13705,1

38807,6

29466,78

32837,28

43851,93

31002,77

33072,59

34936,58

8676,63

15217,56

41897,2

8854,92

15274,17

41817,8

8891,82

15557,85

41740,7

71151,3

77756,8

93206,6

97683,2

98829,8

15358,5

7283,6

25361,1

8900,9

15604,3

7655,7

25861,6

9536,2

4751

4751

15860,64

16016,07

16049,19

7854,11

26299,38

9605

4751

8031,14

26414,4

9605

4751

7946,27

26590,26

9605

4751

Zakirkol Lake

2339,0

2253,7

2692,12

2721.6

2791,3

Total:

238 479,8

254 298,6

286 530,4

297 079,8

311 542,3

Areas of open water surface of the Aral Sea region, by hectare

Table 27.

Water body

19.02.2020

22.03.2020

25.05.2020

10.06.2020 28.07.2020

Sudochie

Mejdurechenskaya

Rybatsky

Muynak

Djiltyrbas, bounded by a dam

37910,3

36724,9

29057,22

25686,72

14672,07

9277,1

5474,3

4963,0

10478,8

9488,4

3221,7

2458,8

8664,7

6781,23

2816,37

946,44

5575,14

4711,41

2638,08

889,83

5654,52

2847,42

2601,18

606,15

5731,65

166

Djiltyrbas (together with the former
right and left channels)

27799,6

21194,1

5744,34

1267,74

121,14

Dumalak

Makpalkol

Mashan-Karadjar

Water surface south of Muynak

Water surface along the bed of the
Kazakhdarya River

691,4

1400,3

1839,8

704,0

0

445,6

1028,2

1339,3

68,7

0

189,36

829,89

901,62

0

0

33,93

652,86

786,6

0

0

Zakirkol Lake

452,2

537,5

99.18

69,66

0,81

737,73

610,74

0

0

0

Total:

100 991,3

85 172,5

52 940,7

42 391,3

27 928,8

Fig. 105. Wetlands of the Aral Sea region

167

Water surface area reduction increased the
area of wetlands. Compared to 2010, the area of
wetlands in the western part of the sea increased
by 114,000 hectares by 2019, and in the eastern
part of the sea, the wetland area correspond-
ingly increased to 498,000 hectares. Extremely
unstable and poorly predictable watering of the
Amudarya River delta and all water body rem-
nants of the Aral Sea, formed a new Aral Sea
region. This region extends to the dried bed, cre-
ating an unstable landscape and simultaneously
causing difficulties to the potential of this vast
area, similar to best international practice.

For example, in the first expedition, water-
ing was observed on the territory of the former
Adjibay Bay, where water was discharged from
the Sudochie Lake system. Water was also dis-
charged from Muynak and Rybatsky Reservoirs
and from the Mejdurechenskaya Reservoir. In
the high-water year of 2017, moistened zones
formed around the Adjibay discharge channels,
spreading the seeds of shrubs and other plant
species contributing to the natural self-over-
growing of a large area. During the second ex-
pedition, many flooded areas were found in the
Djiltyrbas Reservoir’s territory of the Kokdarya

Fig. 106. Direction of drying sea surface classes transformation, regulated process development, possible
process development

168

and Kazakhdarya Channels, where rather hy-
dromorphic vegetation was observed. The pres-
ervation of this vegetation requires constant
moistening and watering, which is unfortunately
problematic as it is not consistent.

Considering the significant influence of the
natural state of the bottom, natural processes
and impacts, as well as anthropogenic factors,
the classification of the territory is a dynamic
process. Based on the comparison of the sit-
uation in 2006 and the process of the two ex-
peditions, maintaining if possible the route
of previous years, the dynamics of landscape
transformation in the territory covered was ob-
tained and is reflected in the attached matrix.
The scheme and the matrix of class transfor-
mation are given below. The matrix is compiled

based on the territory assessment by 17 classes
(Fig. 106, Table 28).

Here, the vertical line shows classes at the
level of the year 2006, and the horizontal line
shows classes at the level of the year 2019. The
green colour shows the most common transfor-
mations. Below are examples of these changes.

Point 147. In 2006, corresponded to Class 6:
2.4 (6). Solonchak with overlain sandy cover
with sparse communities of goosefoot and se-
linum. Class 2019 did not change and remained
to be 6. Rare saxaul in association with very rare
karabarak. Flat terrain, soil with white patches and
shell rocks.

Point 583. In 2006 corresponded to Class 8:
3.1 (8). Plains (with shells) without vegetation or

Matrix of the drying sea surface classes transformation

Table 28.

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

6

6

5

2

2

113

1

1

3

1

9

53

2

1

1

5

2

1

2

8

2

3

9

3

54

28

1

20

11

1

1

6

17

16

13

8

17

15

14

10

5

21

12

58

34

24

44

20

32

28

12

1

4

5

9

5

4

6

2

14

35

12

6

9

16

1

1.1

1.2

2.1

2.2

2.3

2.4

2.5

3.1

3.2

3.3

3.4

3.5

4.1

4.2

4.3

4.4

4.5

169

with sparse shrubs (saxaul, tamarix). No change in
Class in 2019. Terrain is flat with sliced furrows. The
solonchak is moderately hydromorphic. Planting
tamarix seedlings along furrows, sparse results
clearly visible.

Point 27. In 2006, the terrain landscape of soil
and vegetation cover was by Class 14: 4.2 (14) - de-
sertifying hydromorphic cereal-halophytic mixed
grasses with shrubs. In 2019 it became Class 15:
4.3 (15). Shrubby thickets (halophytic: tamarix,
karabarak). Terrain is flat, soil is crust solonchak
with shell rocks. Vegetation cover of karabarak
with plant height up to 0.3 metres with vegetation
cover of 60 percent.

Point 44. In 2006, it was Class 11: 3.4 (11). Hilly
and hilly-ridgy with no vegetation and poorly
consolidated. In 2019 changed to Class 16: 4.4 (16).
Desert shrubs, soil is crusty-puffy solonchak
with shell rocks, sliced sand-accumulative fur-
rows. Rare young saxaul mixed with annual dried
grasses.

Point 99. In 2006 corresponded to Class 14:
4.2 (14). Deserted hydromorphic cereal-halophyt-
ic grasses with shrubs. In 2019 became Class 15:
4.3 (15). Shrubby thickets (halophytic: tamarix,
karabarak). Terrain is flat, soil is semi-hydromor-
phic solonchak. Where plants do not grow, the
soil has white salt spots. Groundwater is close.
Vegetation cover is mostly tamarix, well devel-
oped with a height of almost 2.0 metres. There is
karabarak and climacoptera.

Point 866. In 2006, was Class 10: 3.3 (10).
Shallow-hilly (weakly anchored) with sparse com-
munities of wormwood, shrubs and selinum crops.
In 2019 became Class 12: 3.5 (12). Hilly, hilly-ridgy
fixed with ephemeral-wormwood-shrub commu-
nities. There are sand dunes of up to 1.0 metres
high. Soil is sandy with shells. Perennial saxaul
up to 3 metres high. Climacoptera in some places,
dried up annual grasses. There is young saxaul,
self-overgrowing.

Point 1107. In 2006 was Class 9: 3.2 (9). Dunes
with no vegetation. In 2019, became Class 12:

3.5 (12). Hilly, hilly-ridgy fixed with ephemeral
wormwood-shrub communities, dune sands of 0.5-
1,0 metres. Soil is sandy with shells, stony covers.
Perennial saxaul with a height of 0.5-1.5 metres,
together with young saxaul, is self-overgrowing.
There is also karabarak, kandym, selinum, ajrik
(Aristida L.) and camelthorn (Lat. Alhági).

Point 1359. In 2006, it corresponded to Class 9:
3.2 (9). Dunes without vegetation. In 2019, became
Class 17: 4.5 (17). Shrubby Saxaul (desert forests/
artificial plantations). Saxaul old planting 2-3 me-
tres high, self-overgrowing, dried annual grasses
in progress.

The whole route of both expeditions was sum-
marised in the corresponding table with the for-
mat given below, and based on this, a breakdown
by risk classes was made and is summarised in
the table and compared with the data of distance
classifications. As an example, an excerpt from the
mentioned Table 29 is given.

After flooding, seeds of shrubs and other veg-
etation species came with water to a part of the
dried seabed and contributed to the increase of
vegetation cover on the dried seabed. This means
that it is necessary to maintain some intervals at
discharges to form wetted zones on the dried sea-
bed of the Large Aral Sea.

In the absence of repeated rewetting on the
dried seabed for a long period, soils degrade, the
water table decreases, and the salt content of the
soil increases. Biodiversity also decreases signifi-
cantly. The overgrown vegetation cover begins to
dry out.

During the expedition it was determined that
the discharge waters cannot always flow in the
former directions where it used to flood. This
has been caused by artificial dams, canals and
roads made by oil and gas companies working
on the dried Aral Sea bed, especially on the
surveyed territory of the first expedition in the
Muynak part of the drainage. It should be noted
that these water structures, dams, canals and
engineering facilities (asphalted, gravel and un-

170

Assessment of the ecological hazard degree of soil and vegetation cover classes on the dried
seabed of the Aral Sea

Route
num-
bers

Total
number
of
points

The topography of the
described area

Land cover data

Assessment of
the degree of
environmental
hazard

Table 29.

1

44
(Т.1-44)

The landscape of the
area covered by the
first route is variable,
flat at the beginning,
then with a transition
of landscape with
sand dune sands. In
some places there
are depressions and
sinkholes with a
diameter of 0.1-0.4
metres on the dried
seabed.
Then the landscape is
flat, with rare dunes.
In the continuation of
the route, the terrain
is flat.

2019

From the beginning, the main landscape
plants were karabarak with vegetation
cover of 20-30 percent with dried
branches. Then sparse vegetation
appears, sowing seeds in the spring
period of 2018 gave no results, while
on sand hills the height of plants is 0.2
metres. Sand hills sometimes reach 10-20
metres.
Furthermore, the described area along
the route changes to rare 5-6-year-old
saxaul, 1.8 metres high. There is a process
of self-overgrowing, the soil is covered
with annual grasses, dried after the
summer period, sowing lines are visible,
but there are no results. The soil is dark
solonchak in some places. Vegetation
cover is 10 percent, then 4-5-year-
old saxaul, a lot of young saxaul, and
intensive self-overgrowing is going on.
Vegetation cover is almost 100 percent,
and saxaul disease was found. Another
described area was flooded by water, and
because of this the plant cover appeared
mainly to be of tamarix, with a cover of 60
percent.
Furthermore the soil is compacted, with
the gas prospecting drilling unit having
been working, and the vegetation cover
consists of annual dried grasses. In
most places along the route, furrows
are cut and accumulate sand. Saplings
are occasionally planted in the furrows,
where there is little or no overgrowth.

171

At the beginning of
the route there is
an (25%) average
environmental
hazard.

Next there are
(25%) strong
environmental
hazards.

In the remaining
points of the route
there are mostly
weak (40%) and
the rare medium
(10%) environmental
hazards.

Route
num-
bers

Total
number
of
points

The topography of the
described area

Land cover data

Assessment of
the degree of
environmental
hazard

2

51
(Т.45-
94)

The terrain is mostly
flat, while in some
places there are very
rare dunes.

At the beginning of the route, rare young
saxaul mixed with dried annual grasses
were observed. Then there are very rare
dunes with tamarix and karabarak plants
0.4-1.0 metres high. The soil is puffed
solonchak, wet on the surface, white
in some places, and sandy loam-sandy
furrows are cut. The landscape changes
to very rare shrubs of tamarix, karabarak
and Selitraria schoberi (lat. Nitraria
schoberi). Dried saxaul seedlings are
found. Further along the route, mixed
thickets of karabarak occasionally with
tamarix are observed. Due to the earthen
dam, a certain area up to the dam was
flooded with water. In this area there is
the process of the self-overgrowing of
shrubs of karabarak and tamarix. On the
other side of the dam there are fields
without vegetation, but with very rare
small dunes, where Nitraria schoberi
grows.
At the end of the route the landscape
changes to rare perennial saxaul of up
to 3.5 metres high, and with annual dried
grasses.

At the beginning of
the route is a strong
(43%) environmental
hazard.

Then a switch to
a mixed class of
no environmental
risk and weak
environmental
hazard (33%).

In the remaining
points, there is
an average (24%)
environmental
hazard.

paved roads) are constructed arbitrarily without
coordination with local water management or-
ganizations, which operate the local water bod-
ies in region.

During

land expeditions, self-discharging
wells for water supply, livestock farming and
shallow irrigation were also studied.

It should be noted that in the area between
the bed of the Amudarya and Djiltyrbas (in the
area of Kazakhdarya), close to settlements, there
is degradation of pastures, especially around
the self-discharging well due to constant grazing
of animals, mainly cattle and horses.

At this time, in the area between Djiltyrbas
and Kokdarya, as well as in the area behind

Kokdarya, geophysicists carried out explosion
works to prospect for oil and gas.

In the Kazakhdarya area, between the bed
of the Amudarya and Djiltyrbas, they found a
road where asphalted sections had collapsed
in several places and large steep precipices had
formed and could be dangerous for vehicles of
working personnel and of the population in this
area.

Local water bodies in the southern Aral Sea
region have a certain reserve and an appropri-
ately designed water level. In high-water years,
excess water is forcedly discharged towards the
dried bed of the Large Aral Sea. The Amudarya
flow is characterised by great variability, and

172

there are short-term flood releases that pose a
danger to structures.

Therefore, the construction of water man-
agement structures and engineering facilities
on the seabed without coordination with local
water management organizations endangers the
safety of these oil and gas facilities. With such
inconsistency of design data and sites of facili-
ties, there will probably be a consequence in the
form of the flooding of gas wells and facilities
where drilling operations are currently carried
out.

Another negative aspect of the works carried
out on the dried seabed by gas and oil compa-
nies is that the construction of roads, dams and
discharge channels prevent self-overgrowing
processes and the preservation of vegetation.

The negative environmental impact of new
infrastructure on the seabed is also related to
the drilling rigs for producing natural gas, and
leads to the destruction of the grass cover and
vegetation on the bottom of the dried sea where
the recovery processes are particularly slow. In
the areas where the drilling unit is standing and
where the drilling has already been completed,
the vegetation cover is completely destroyed
in an area of about 2-3 hectares. Even after ten
years vegetation has not been restored at the
drilling site.

In pursuance of the President of the Republic
of Uzbekistan’s order to create a “green cover”
on the dried bed signed in December 2018,
large-scale works were started for the afforesta-
tion of the dried Aral Sea bed, with over 1 million
hectares to be completed by the end of 2019. To
accelerate the afforestation, 400 billion soums
in funds were allocated from the state budget of
Uzbekistan in 2019. More than 530 tractors from
all regions of the country and two AN-2 aircraft
were mobilised, while 1,532 tons of saxaul seeds
and 73 tons of karabarak were prepared. In the
period from December 2018 to March 2019, work
was carried out on an area of 451,600 hectares.

323,150 hectares were sown by two AN-2 aircraft,
119,440 hectares were sown with agricultural
equipment, and 3,000 hectares were sown by
hang-glider.

The results of ground expeditions obtained in
most of the explored areas along the route, es-
pecially in the survey area of the first expedition,
showed that cut furrows for sand accumulation
areas were found almost everywhere. To date
seedlings are planted very seldomly on these
furrows and where planting is made, only rarely
do the plants take root.

According to field studies, self-overgrowing
is particularly active near and at the end of the
plots with artificial plantations on the territories
where international projects have been imple-
mented (for instance by GTZ), as well as on the
areas afforested on the dried Aral Sea bed by
the State Forestry Committee where sites are
correctly selected. This proves that the choice
of planting sites must be carefully studied, and
their locations must be properly determined. In
order to ensure good establishment, a detailed
study of the ecological condition of the area,
including the soil cover in parts of the select-
ed sites, also needs to determine the boundary
conditions for groundwater levels and salinity.
This is a strong indication of the positive impact
of mitigation works on the ecological situation in
the area of the dried Aral Sea bed.

Another environmental problem of the dried
Aral Sea bed is garbage pollution. During both
expeditions along the route, we often saw plac-
es where there was abandoned refuse includ-
ing empty glass and plastic bottles, and plastic
bags. Closer to the town of Muynak, at the “Ship
Graveyard” Museum, a landfill of construction
waste had appeared. These examples stress the
need for urgent measures to be taken by the
State Committee of Ecology to prevent negative
impacts on the ecology of the dried Aral Sea bed.

173

6.5. Study of forest vegetation cover

The Government of Uzbekistan, in pursuance
of the initiative of the President Sh. Mirziyoyev,
has deployed large scale works with striking dy-
namism that without such decisions, a natural
transformation would require centuries to un-
dertake. Monitoring the dried seabed and the
processes occurring there is considered to be the
main tool for undertaking such transformational
and partial preservation of this unique zone, and
to prevent the development of possible negative
phenomena. The Aral Sea region and the dried
seabed currently serve as a space for innovative
methods of nature transformation. In addition,
the dried seabed zone is a unique laboratory for
scientists, who can observe and study within the
lifespan of one generation, the processes that
normally take place over centuries.

The issue of resuming monitoring of the dried
seabed was raised in several government doc-
uments after German financing ceased in 2010.
However, financial support reappeared through
the establishment of the UN Multi-partner Trust
Fund for Human Security for the Aral Sea region.
In 2019-2020, comprehensive expeditions were
organized by SIC ICWC with the financial sup-
port of UNDP and with the participation of the
International Innovation Center of the Aral Sea
Region under the President of the Republic of
Uzbekistan. The expedition’s tasks studied the
soil cover and the state of flora on a part of the
dried seabed, observed the changes of some en-
vironmental indicators in recent years, and com-
pared the dynamics with the previous period.

As previously mentioned, the two expeditions’
survey areas belong to the state forest fund of
the Muynak and Kazakhdarya forestries. In these
areas, the main works of artificial planting and
sowing of forest crops have been carried out
from the 1980s to the present day.

6.5.1. Organization of research

The surveys included routes and descrip-
tions of landscape points, vegetation, and soil
cover. The analyses determined the amount of
reforestation work performed, methods of silvi-
cultural and phytomeliorative measures, identi-
fied sources of disease and plant pests in the
surveyed area to determine the survival rate
of conducted reforestation work, as well as the
state of the natural regeneration between rows
and around older forests. Participants strictly
recorded any factors that may have influenced
the survival rate of plantings, including age, con-
dition, diseases and efficiency. Such factors have
included, among others, the presence of canals,
lakes, streams and other sources of moisture,
the presence of pastures and wells both active
and abandoned, roads, and anthropogenic dam-
age to plants.

6.5.2. Study of forest cover and rec-
ommendations made from the expe-
ditions’ results

The development of deserts in conditions of
scientific and technical revolution is a difficult
task and one that carries great responsibility. On
the one hand significant capital investments, a
special approach and the application of appro-
priate methods and technical means are all re-
quired, while on the other hand there must be a
close connection with environmental protection,
the improvement of the ecological situation, and
the scientific forecasting of undesirable conse-
quences of human interference into the existing
natural balance. At the same time, it is neces-
sary to keep in mind that the nature of deserts is
especially unstable and easily irreversible. Arid
biogeocenoses are fragile systems, since anthro-
pogenic impacts can quickly destroy them, and
their recovery is slow. Desert preservation under

174

conditions of increased economic pressure re-
quires continuous improvement of the organiza-
tion and technology of rational land use, and the
application of special measures.

Results of research conducted in the
first expedition

The first expedition covered the south-west-
ern part of the dried seabed. It was conducted
from four camps along 16 routes and recorded
1,581 observation points.

As an example, an excerpt from the dendrolo-

gist’s field log is given below.

‘Route 2’ (Т.45-Т.94)

“Second route from the first camp along the
road to the cliff in the south-western and west-
ern directions (T.45-T.94). The area is flat with a
slope to the cliff.

The following features were noted.

The area changes considerably based on
what amount of water flows downstream of the
Amudarya River into the Tuyamuyun reservoir.
In affluent years water spills from the Adjibay
Bay, holds for a long time, and contributes to
the development of tamarix and karabarak.
The karabarak body has 80 percent coverage
(T.45-T.47). Part of the route (T.50-T.64) passes
through sliced furrows of heterogeneous ap-
pearance with rare specimens of climocoptera,
karabarak, tamarix and saxaul. Wet and dry so-
lonchak patches alternate. Point (Т.65) has rare
thickets of saxaul aged 3-5 years and tamarix
sprouts, of a 5 percent coverage. (Т.66) has co-
ordinates of 43 points of previous expeditions,
saxaul in poor condition. Open space (T.67-T.70) –
dead saxaul sowing. At points (T.71-T.73) – natural
bodies of saxaul of 10-12 years old and tamar-
ix, 50 percent coverage. Karabarak and tamarix
bodies in (T.74-T.81), 85 percent coverage. Tamarix
massif (T.87), 70 percent coverage.”

In addition, the botanist gave a detailed sys-
tematic description of the vegetation. Finally, the
ecologist’s log and summaries provided charac-
teristics of the vegetation, including self-over-
growth, which was compared with the results of
2006. Particular attention in the first expedition
is paid to new plantings and the preparation of
furrows.

The following are conclusions of the
first expedition:



Intensive natural regeneration between
and around intercropping is observed.
 Most of the area of the “Tigroviy Hvost”
(Tiger’s Tail) massif and along the cliff of
the Ustyurt plateau is often subjected to
flooding. Thanks to this, natural regen-
eration of tamarix, karabarak and other
salt-tolerant crop species appears in this
area (Fig. 107 and 108).
Furrows were cut (Fig. 109) for the fur-
ther planting of desert plants.
Immediately after cutting sand-forage
furrows, salt-tolerant species were
planted.





 Due to premature silvicultural works on
the cut furrows with no accumulated
sand layer, the degree of rooting of the
planted vegetation is not satisfactory.
In some areas, sources of desert plant
diseases such as powdery mildew and
gall blight appear (Fig. 110).



Recommendations for the first expe-
dition area



Considering that the cutting of furrows
on these territories is premature, it is
necessary to wait until the sub-surface
groundwater has lowered and loamy soil
formation appears. These are favourable

175





conditions for the development of desert
crops’ root systems.
After the second year of cutting fur-
rows, it is necessary to annually survey
and wait until the amount of sand
accumulation allows for the planting of
forest crops. Aerial seeding should be
carried out on those areas where tam-
arix-karabarak thickets dry up and the
filling of sands begins.
Take necessary measures to control
diseases and pests of desert forests.
 We recommend the development of two
research stations for laboratory studies
for ecological assessment, and possibly
the ecological risks of the Aral Sea’s
dried seabed.
Conduct an annual permanent expe-
dition with the participation of highly
qualified and experienced specialists
and experts, in order to obtain reliable
information and create a database to
conduct monitoring with appropriate
comparisons of previous research anal-
yses.



Results of research conducted in the
second expedition

The second expedition (Fig. 112) covered main-
ly the south-eastern part of the dried seabed.
The survey was conducted from three camps, 14
routes, and 561 observation points. The terrain
on this expedition was hillier and with greater
presence of water factors that disrupted the
normal course of the desert-tolerant vegetation
growing processes.

Conclusions of the second expedition

1. In some places, tamarix and karabarak begin
to dry out due to the lowering of the ground-
water table. In addition to shrubs, fodder crops

such as camelthorn and new species such as
limonium can be found in this area. Along the
asphalt road, good sprouts of garmala (adra-
pan, isirik) are found.

2. In the coastal zone of the Amudarya River,
riparian vegetation such as turanga and jida
(Oleaster) grows.

3. As a result of groundwater levels eleva-
tion and flooding by discharge waters of the
Kokdarya River, more than 90 percent of the
2005 GTZ-funded planting in the nearby areas
had died.

4. The same situation occurred along Kuat Lake.

Recommendations for the second
expedition area









At the Aral section (northern part), at
Djiltyrbas Lake, it is necessary to carry
out afforestation works (saxaul, cher-
kez, kandym and selinum). The terrain
is sandy (mobile sands). In the unfixed
areas, it is advisable to supplement
inter-rows with fodder plants.
In the western part of Djiltyrbas Lake, it
is necessary to supplement the inter-row
saxauls with Richter’s cherkez, kandym
and selinum.
In the northern part of Djiltyrbas Lake
(on the border with Kazakhstan), it is
advisable to carry out afforestation
works on the saline parts in a expedient
way by sowing and planting tamarix and
karabarak. The area is not fixed.
In the southern part of Djiltyrbas Lake,
it is advisable to carry out afforestation
works with the use of sowing of fodder
plants, as the area has been used for a
long time by livestock farming on the
basis of five wells.

 On the eastern part of the collector

KS-3 to Djiltyrbas Lake, it is advisable to

176

Fig. 107. Examples of “Tigroviy Hvost” (Tiger’s Tail) vegetation

177

Fig. 108. Vegetation along the cliff

178

Fig. 109. Sliced furrows

Fig. 110. Saxaul disease identification

179

Fig. 111. Photos of the first expedition

180







carry out afforestation works. The terrain
is poorly fixed with desert plants and is
exposed to wind erosion.
In the eastern part of Kuat Lake (start-
ing from Dariyabay wells to Chimbay
wells, from Burovaya road and down
to Terbenbes Island), it is advisable to
supplement the inter-row planting and
sowing of fodder crops.
To the north of Kuat Lake, saxaul shrubs
are prone to diseases (powdery mildew).
Shrubs have stunted growth. It is nec-
essary to carry out planting and sowing
of Richter’s cherkez. The results of the
survey have shown that cherkez is more
resistant to various diseases.
In the north of the terrain up to the
border with Kazakhstan mobile sands
are weakly fixed. Considering the fact
that in some places the soils are highly
saline (the end of Kokdarya), it is neces-
sary to sow and plant more salt-tolerant
plants (tamarix-grass, karabarak). The
use of aviation is recommended since
the terrain is difficult to access.

There is no need to carry out afforestation
along the banks of the Kokdarya, since the right
and left banks from the ‘Kabakly Ata’ cemetery to
the final part of the Kokdarya are overgrown with
tamarix and karabarak. The terrain is impassable.

Along the banks of Togyzarkan and Kytay
Kazgan, afforestation must be carried out by
sowing fodder plants. The terrain is poorly fixed,
and there are sporadic specimens of shrubs.

The eastern part up to the border with
Kazakhstan and the whole northern part is not
fixed. Large-scale afforestation with the use of
various planting technologies is required.

Based on the daily review of expedition
routes, the distribution of various species in the
zone of each expedition was determined and a
generalisation of the results of the quantitative
account of the different tree crops sowing states
was made.

As one can see in Table 30, the total area cov-
erage in the zone of the first expedition is 32
percent, while for the second it is more than 60
percent. The increase in percentage is due to the
greater watering of the zone of the second expe-
dition. Meanwhile saxaul prevails in both zones.

Summary of quantitative analysis of rocks in dendrological survey

Table 30.

Surface coverage expert evaluation, %

Expedition

Saxaul

Total

18,8

36,2

In good
condition

12,7

30,0

I

II

Hydrophilous:
rushes, reeds

Tamarix,
karabarak

Sliced furrows

6,2

18,5

12,9

15,5

23,9

12,0

181

6.5.3 Results of the new forest crops
survey

The results of the study of new plantings
showed that in the winter-spring period of
2018-2019, work was carried out on sowing for-
est crops and other desert plants on the area
of 461,000 hectares (Fig. 113).

To date, the seeds sown out by the AN-2 air-
craft on an area of 250,000 hectares resulted in
unevenly dispersed sprouts. On average, their
number was from 300 to 2,000 pcs per 1 hect-
are (according to the rules of creation of forest
plantations in the desert zone, the area is con-
sidered forested when the number of plants is
300-500 pcs).

On an area of 3,000 hectares (in the ‘Ahantai’
territory) on gypsiferous and strongly saline
soils, the seeds were sown by hang-glider. At
present no sprouts have been detected, but
there are seeds on the soil surface (according
to scientists, saxaul seeds can keep their ger-
mination for 2 years).

In strongly saline soils

(solonchaks),
seedlings of tamarix and saltwort belanger
(karabarak) were planted. The rooting ability
of these 10 plants was 3-4 pcs (30-35 percent),
while the upper part of some seedlings was dry
and the lower part was wet, which allows us to
expect their further growth.

Saxaul seedlings were planted on the ter-
ritory of 15,400 hectares in sandy and medi-
um saline soils. At the same time, on average
5-8 pcs of every 10 seedlings have taken root in
some plots (5-58 percent), whereas on strong-
ly saline acid soils, 1-2 pcs (10-20 percent) of
plants have taken root.

For the crops sown by means of agricultur-
al machinery on the area of 119,400 hectares,
sprouts in 10 m2 on sandy soils were 55-60 pcs,
on medium and weakly saline soils were 15-25
pcs, and on gypsiferous soils no sprouts were
found.

According to the results of preliminary mon-
itoring, scientists positively assessed the state
of seed and seedling plants.

Certain works were completed to provide
the disaster area with water suitable for live-
stock farming development, and to enable the
attraction and reproduction of flora and fauna
of the region.

To date, water has been obtained from 41
wells, including 16 in the Aral Sea area, 17 in
Kazakdarya settlement of the Muynak region
and 8 in the Takhtakupyr region. The drilling
and rehabilitation processes for nine wells
have been completed.

Prepared wells are equipped with a hy-
drant control device and devices for livestock
watering.

To prevent transport of sands along 93.5 ki-
lometres, reed protective strips were built with
a total area of 1,244 m3.

6.5.4 General recommendations

The dried part of the Aral Sea bed is charac-
terised by typical desert vegetation types. Sandy
(psammophilous) and solonchak (halophilous)
types are predominant. Elements of Tugai vege-
tation are typical for the Amudarya River delta.
Peculiar landscape reed beds are observed. They
are formed in most cases during the depression
of hydrophilous annual saltwort vegetation. As a
rule, they are short-lived and degrade as exces-
sive moisture reserves are depleted in soils.

Within the dried bays and the southern part
of the Aral Sea bed, we recorded 64 species of
higher plants, including representatives of 47
genera and 17 families. These included 1 species
of tree, 18 species of bushes, 4 species of semi-
shrubs, 18 species of perennial grass, and 22
species of annual grass.

All plant species growing on the dried part
of the Aral Sea bed can be divided into three

182

Fig. 112. Conducting the second expedition

183

groups according to the condition of the total
number of individuals in the cenopopulations,
i.e., life span, number, age structure, and disper-
sal intensity.

1. Progressive cenopopulations

2. Regressive cenopopulations

3. Local cenopopulations

The latter are characterised by stenotopicity,
narrow tolerance and, consequently, adaptability
to a narrow range of environmental factors. The
eugalophilous annual plant, glasswort, is con-
fined to clay marsh coastal solonchaks. It inhab-
its the seabed even before it is completely dry.
Its seeds grow better in an aquatic environment.

Saltwort reaches its greatest development
within the 1st-2nd year of seabed drainage.
Later, in the 4th-5th year of seabed drainage, it
dies off due to intensive desertification of soils.
It continues to renew on the newly dried seabed
areas. From the point of view of phytomeliora-
tion, such species have no special importance.

Regressive cenopopulations can be repre-
sented by numerous individuals. However, they
are characterised by a weak or complete ab-
sence of seed regeneration, the predominance
of old-age and dead individuals. They can bear
fruit normally, but they do not have ecological
conditions for seed regeneration. Such are the
cenopopulations of tamarix, reed and other hy-
gro-mesophilous plants.

Progressive cenopopulations are character-
ised by all age groups, intensive seed regen-
eration and dispersal. These are black saxaul,
leafless eremosparton, jujugum species, sandy
astragalus and others. They are promising for
phytomelioration of the dried part of the Aral
Sea bed, and deserted cones of the Amudarya
River.

Phytomeliorants

Eremosparton leafless – Eremosparton aphyl-
lum Fisch et Меу of the legume family. Tall shrub
2-4 metres high, psammophyte, euxerophyte,
characteristic representative of mobile, weakly
fixed desalinated sands.

Eremosparton in the southern part of the
Aral Sea bed was first recorded in 1989, in the
Kabanbai area, on mobile sands with salinity not
exceeding 0.2-0.25 percent. At present, here and
in adjacent areas, such as Vozrojdeniya Island,
there are fairly well-developed fruiting individu-
als. The number of individuals of Eremosparton
varies in the range of 5-8 specimen/100m2, and
bear fruit in summer.

Black saxaul – Haloxylon aphyllum / Minkw /
Ijin from the family of Marecchiaceae - tree or
tall shrub up to 3-4 metres high, euxerophyte,
eugalophyte, phreatophyte, characteristic repre-
sentative of sandy, clay and solonchak deserts.

On the dried part of the Aral Sea bed, black
saxaul is a fairly widespread plant. It is repre-
sented by all age groups. On the western part
of the dried Adjibay Bay, there are rather dense
thickets with a height of 3-4 metres. Black sax-
aul tends to expand its territory, in which saxaul
numbers fluctuate within a wide range of 1-20
specimen/100 m2. Seeds mature in autumn.

Calligonum (juzgun) species – Calligonum
Sp.Sp., of the buckwheat family. Juzgun species
are shrubs, characteristic representatives main-
ly of slightly saline and desalinised sands. About
15 species are characteristic to the Aral Sea
region. Of these, about 8-10 species are found
in the dried part of the Aral Sea bed on weakly
fixed saline sand dunes. They are usually con-
fined to slightly fixed saline sand bodies and are
characterised by close ecological features. They
bear fruit in summer.

184

Fig. 113. Volumes of performed works ‘Fall 2019 - Spring 2020’

185

For phytomelioration purposes, juzgun (“Head
of Medusa”), a powerful shrub 2-3 metres high, is
most often used. Experiments carried out by em-
ployees of SredAzNIILKh (Koksharova & Isakov,
1985) on the phytomelioration of the drained
Rybatsky and Adjibay bays with the use of this
species gave positive results. Other species of
juzgun can be also used with the same success:
leafless, Aral, flat-bristle, bristle-shaped, scale-
shaped, tree-shaped and others.

Astragalus sandus – Astragalus ammoden-
dron Bunge, from the legume family, is a shrub
50-120 centimetres high, psammophyte and eu-
xerophyte. It is widespread on the dried part of
the Aral Sea bed. This species of astragalus is
more numerous in the former coastal zone of the
sea, where the soil is composed of desalinised
and weakly consolidated, gypsiferous sands.
The number of plants is 1-2 specimen/100m2. It
bears fruit in summer.

Richter’s Solyanka, Cherkez – Salsolarichteri
/ Moq / Kar.exLitv., a shrub of 1-2 metres in
height, psammophyte, euxerophyte, a character-
istic representative of the vegetation of weakly
fixed sandy deserts.

Cherkez is absent in natural vegetation. It was
introduced on the dried part of the Rybatsky and
Adjibay bays, and on the deserted cones of the
Amudarya outlet by employees of SredAzNIILKh
(Koksharova & Isakov, 1985) at the beginning
of the 1980s. The experiments were successful.
The plants reached 1.2-1.7 metres in height and
bear fruits abundantly every year. They began to
disperse by self-seeding. Richter’s cherkez is a
valuable fodder plant, fruiting in autumn.

Solyanka Palecki, Cherkez – Salsola paletzki-
ana Litv, from the family Marecchiaceae, shrub
with a height of 1-3 metres, psammophyte, eux-
erophyte, one of the characteristic plants of de-
salinised, weakly fixed sands.

This species of cherkez in terms of biolo-
gy and ecology is very similar to the preceding
plant. The main difference between them is that

the latter has assimilative shoots that are two or
more times longer than those of the former. In
addition, the Palatsky’s cherkez in natural con-
ditions is widespread in the southern regions of
Karakalpakstan, whereas it is not found in the
vegetation of the dried part of the Aral Sea bed
and the bordering areas of the Aral Sea region.

Paletskiy’s cherkez was introduced on the
dried Rybatsky and Adjibay bays and deserted
cones of the Amudarya outlet simultaneously
with Richter’s cherkez at the beginning of the
1980s by employees of SredAzNIILKh. Here the
plants took root, reached a height of 1-2 metres,
bear fruit annually, and disperse by self-seed-
ing. It fruits abundantly in autumn every year. It
is a valuable fodder plant.

Solyanka orientalna, Keireuk – Salsola ori-
entalis S.GGmel is a valuable fodder plant. The
shrub is 30-60 centimetres in height, and is
widespread in the gypsum and clay deserts of
the Aral Sea region. It is not found in the natural
vegetation of the dried part of the Aral Sea bed.

Keireuk for phytomeliorative purposes was
introduced on the drained Rybatsky Bay, by
the sowing of seeds by the employees of the
Institute of Botany of the Academy of Sciences
of RUz and the Institute of Bioecology of KKO
of the Academy of Sciences of Ruz, in the late
1980s (Kabulov, 1997). So far a few bushes have
managed to grow. However, they bear fruit abun-
dantly every year. It can be supposed that this
species will be promising in slightly saline and
desalinised loamy and clayey areas of the dried
bays of the Aral Sea.

Tree saltwort, Axar – Salso ladendroides Pall.,
from the family Marecchiaceae is a semi-shrub
80-120 centimetres high, a mesophilic, halo-
philous plant, widely distributed in slightly to
medium saline areas of dried coastal spills and
lakes. Fruits abundantly each year. Seeds ripen
in autumn.

Teresken

– Geratodoideseveresmaniana
/ Satchegl. Ex Losinsk / Botsch.et Ikonn, is a

186

semi-shrub of the Mare family with a height of
60-120 centimetres. It is a valuable fodder plant.
In nature, it is widespread on desalinised sands
and weakly-medium saline sandy loam and loam
areas.

Teresken is absent in the natural vegetation
of the dried part of the Aral Sea bed. For phy-
tomelioration purposes, it was introduced on the
dried Rybatsky Bay by sowing seeds in the late
1980s (Kamalov, 1995; Kamalov & Aschurmetov,
1998).

Currently there are fruiting individuals here,
which, although slow, are spreading out. Fruiting
in the fall.

Wormwood sandy, Kum joussan – Artemisia
schernieviana Bess, of the Compositae family,
characteristic representative of sandy deserts, is
a semi-shrub 50-90 centimetres high.

It settled on the dried part of the Aral Sea bed
in the early 1990s and we had planted it for the
first time on the western part along the weakly
fixed sands in the Kabanbai area. It bears fruits
in autumn.

Aristida pinnate, Selinum, Urgashy Seleu –
Stipagrostis Pennata / Trin / Winter, from the
cereals family is a perennial bushy grass, 30-60
centimetres high, a typical representative of
slightly saline and desalinised weakly fixed sand
dune sands, and a fodder plant.

Selinum settled on the dried part of the sea-
bed in the early 1980s. It is widespread on sand
dunes everywhere. The number of adult individ-
uals (families) of selinum in some cases reaches
10-12 specimens/100m2. It bears fruit in summer.

Camelthorn, Yantak, Jantak – Alhagi pseu-
dalnagi / Bieb / Fisch, is a perennial plant of
the legume family, 30-80 centimetres in height,
a hemixerophyte and phreatophyte. It is wide-
spread in desalinised and slightly saline clay
and loam territories, as well as on low-powdered
sands underlain by clay soils with slightly saline

groundwater. Valuable forage, honey-bearing
and medicinal plant. Bears fruit in summer.

For phytomelioration purposes, annual halo-
philous plants such as Fomin’s swan, bassia, ser-
pentine sorrel and others, which are widespread
in the dried part of the Aral Sea bed, can also be
used.

The success of phytomelioration of the
dried part of the Aral Sea bed and the desert-
ed Amudarya River delta is largely determined
by the right choice of seed sowing and plant-
ing technology. On clay and loamy areas, seed
sowing and planting of plants can be carried
out through traditional methods like harrowing,
on sand and moisture accumulating furrows.
Whereas with sandy soils, maximum precau-
tions should be taken as even a small mechan-
ical impact on the soil can cause large negative
phenomena such as intensive deflation, and the
aeolian export of saline dust.

Many years of experience in phytoreclama-
tion of deserts show that the autumn months
are the most favourable for sowing seeds of the
above phytoreclamation agents. When sowing
in spring, it is possible to obtain satisfactory
results only under certain conditions with sow-
ing seeds subjected to special treatment, such
as stratification and scarification. However, the
planting of seedlings and cuttings should pref-
erably be carried out in spring, as winter drought
in the Aral Sea region contributes to their mass
death due to desiccation.

Seeds should preferably be harvested from
plants growing on the dried bottom of the Aral
Sea. Seeds of plants growing on this territory
during their formation undergo the necessary
adaptation to the harsh soil and climatic con-
ditions. On the territory of the dried seabed’s
areas of the Rybatsky and Adjibay bays, in areas
of “French planting”, Akpetkey and Akhantay, and
around Djiltyrbas Lake, the necessary amount of
seeds of saxaul, cherkez, jugun and other phy-
tomeliorants can be harvested.

187

6.5.5 Prospective measures to im-
prove phyto- and forest-reclamation
works

Cutting of sand furrows. During the examina-
tion of the territory, it was found that in early au-
tumn, sand-filled furrows were cut to a depth of
40 centimetres using a furrow-cutting tool with
a slotting tool designed by the Laboratory of
Protective Afforestation and Forest Reclamation
of the Research Institute of Silviculture and
Forestry. While simultaneously cutting the fur-
row, a slot was also cut to a depth of 40 cen-
timetres with the help of the slotting tool. In
some places, the same sand-filled furrows were
cut but without the crevice. The physical objec-
tive of the first variant was that moisture at the
expense of winter-spring precipitation was col-
lected in the furrow and penetrated into the slot,
forming a reservoir of moisture which the plant
could use during the whole vegetation period.
Through the second variant, moisture was col-
lected only in a furrow 40 centimetres deep. At
the same depth in summer in temperatures of 50
°С, the sand completely dried out, and accord-
ingly all the moisture evaporated, distinct from
the first option wherein the main moisture was
collected in the available slot. As saxaul has a
deep root system, it uses moisture accumulated
in the slot, while in the second variant, the sax-
aul experiences a serious lack of moisture which
leads to the death of the plant. At the same time
it should be noted that during the planting of
seedlings with the help of a planting machine,
the coulter strips the sand in the sand furrow
to a depth of 30 centimetres, forming a planting
slot where the seedling is planted. Studies have
shown that in the second year after planting in
a furrow with a crevice, the safety of saxaul is
85 percent (plant height of 95 centimetres and
crown diameter of 110 centimetres), and in a
furrow where the slot has not been made, the
safety is over 50 percent (plant height 51 cen-
timetres and crown diameter 64 centimetres).

Thus, if moisture is in the upper horizons and
in summer and evaporates leading to the partial
death of plants, developed technology with the
slotter ensures the moisture will be available to
plants throughout the growing season. After five
years when the plants enter the fruiting stage,
the seeds spread throughout the area by wind
will accordingly be protected from the deflation
processes.

Harvest of forest seeds, their ac-
counting and forecasting

Harvest of forest seeds. Forest seed yield re-
fers to the amount of forest seed produced in a
particular year per hectare of plantation.

Forestry authorities should systematically
conduct rudimentary phenological observations
and seed harvest records to determine the ex-
pected yield and organize the harvesting of
fruits, strobiles and seeds of trees and shrubs.

Phenological observations and accounting of
fruiting are conducted on trial plots, which are
established in each category of forest seed plan-
tations intended for harvesting seeds (perma-
nent forest seed plots (PFSP), temporary forest
seed plots (TFSP), forest seed plantations, forest
cutting plots, and others). For this purpose, all
the above categories of forest seed plantations
are divided into relatively homogeneous groups
of sites in terms of composition, structure, age,
growing conditions, and condition, and one
sample plot is established in each of them. At
the same time, permanent test areas of 0.25
hectare in size are established in the PFSP and
forest seed plantations, and temporary areas of
0.1- 0.5 hectare in size are established in other
categories, so that each area contains at least
100 trees of the monitored species.

Counting the expected yield of seeds is car-
ried out by determining the numbers of flowers,
ovaries, and ripening fruits visible to the naked
eye or through binoculars during mass flowering

188

(Phase I), mass ovary formation (Phase II) and
before the beginning of seed ripening (Phase III).

Organization of a permanent forest
seed base

A forest seed base is organized to ensure
regular procurement of forest seeds with high
hereditary and sowing qualities. In forestry, the
seed base of highly productive natural planta-
tions and forest crops is selected, as well as spe-
cially formed and artificially created forest seed
plots and plantations designed for seed harvest-
ing. The seed base in the state forest institutions
is organized considering the current need in for-
est seeds, and the creation of a necessary seed
reserve.

The selection inventory is carried out during
forest management or special surveys of ma-
ture, ripening, deficient and middle-aged stands.
Trees are divided into three categories including
plus, normal, and minus.

The plus stands are the most highly produc-
tive, high quality and stable trees in the given
forest and vegetation conditions and are sin-
gled out as seed reserves. They are subjected
to a continuous selection inventory of plus-size
trees. They are not included in the cutting area
and are not subject to harvesting. Negative-
growth trees are cut down as part of care. The
plus-size stands are used to produce seeds of
improved selection qualities.

Normal stands are stands of high and medi-
um productivity, being good and average qual-
ity for given growing conditions. Seeds can be
harvested from plus and normal trees of normal
breeding value.

Minus stands are plantations of poor quality,
low productivity for the given silvicultural con-
ditions, with a large number of minus trees. It
is forbidden to collect seeds from minus stands.

According to the ‘Rules of attestation and
accounting of selection and genetic objects in
areas of the state forest fund’, verification of se-
lection and genetic objects, which include plus
trees, is performed by a specialised organization
which establishes a commission by the order of
the management.

Attestation commissions shall determine the
compliance of selected objects with the estab-
lished requirements. Passports with attached
schematic plans of their locations are prepared
for the certified objects, and information on
them is noted in forest management materials
and submitted to the state register of plus and
elite trees, and included in the consolidated list
of plus plantations of the Republic. The certified
plus trees in nature are marked on the trunk at
the height of 1.3 metres with a ring, 10 centime-
tres wide, painted in white oil paint. Elite trees
are additionally marked with a red ring. The
white ring is marked with a double number, with
the numerator according to the state register,
and the denominator according to the farm.

Forest seed plantations

Forest seed plantations (FSP) are specially
created plantations designed for mass harvest-
ing of valuable hereditary seeds of local and in-
troduced species over a long period of time.

A distinction is made between the first and
second order of FSP. The first ones are used to
breed progeny of plus trees, are selected by
phenotype, and not verified by seed progeny.
They are created for the evaluation of genetic
qualities of the clones presented on them, and
for the mass procurement of selection-improved
seeds.

Plantations of the second order are created
from the seeds of elite trees that have confirmed
their genetic value in the test crops.

189

Permanent and temporary forest
seed plots

Permanent forest seed plots (PFSP) are high-
ly productive and of high quality for the corre-
sponding forest types, natural plantations, or
crops of known origin (from local seeds). They
are specially formed and designed to produce
selection-valuable seeds over a long period
of time. For their creation, forest plots are se-
lected in normal to more valuable plantations
of 1 to 3 assigned growth classes, and in ex-
tremely severe conditions, dry and stony forest
types, assigned to a 4th growth class.

6.6. Landscape assessment with re-
mote sensing

This chapter of the book describes the assess-
ment of spectral separability of some classes in
order to recognise the landscape in the studied
area (classes including water, hydromorphic, sa-
linity, sandy soils, vegetation and others). The
basic principle of the remote sensing method is
the reflectance or absorbance of objects in dif-
ferent spectral ranges. The reflected radiation as
a function of wavelength is called the spectral
characteristic of the surface. The main purpose
of spectral separability estimation is a visual or
automatic comparison of spectral brightness
curves determining the reflectivity of different
groundcover objects. The test sites were select-
ed in the most characteristic areas for the stud-
ied landscape.

Water surface, shallow water, some-
times with a cover of reeds (Classes 1
and 2)

Fig. 114 (a, b) shows the averaged values of
water reflectance in different spectral bands of
Landsa -8 OLI for different months of 2019-2020.
As a rule, water is reflected only in the range of
visible light (blue, green, red). Since water has

almost no reflection in the infrared range (NIR,
SWIR; Fig. 114a), water surfaces without any plants
will be clearly marked as dark areas (low pixel
values) in the images (Fig. 114 c, e). Consequently,
in all satellite images, water appears quite dif-
ferent from other surfaces. However, with the
appearance of aquatic plants (Phragmites aus-
tralis, Chara fragilis, Lemna, Potamogéton and
others) on the surface of water (Fig. 114 d, f), the
reflection coefficient increases in the near infra-
red range (NIR; Fig. 114 b).

Solonchak (Classes 4 and 5)

The spectral reflectance characteristics of
wet-coastal and crust-puffed solonchak are
presented in Fig. 115 (a and b, respectively). The
value of the spectral reflectance coefficient for
both types of solonchak varies during the year
depending on moisture content, and in all cases,
was maximal in the near-infrared region (NIR).
However, the reflectance decreases sharply in
the two short infrared wavelengths (SWIR1 and
SWIR2) in the marine solonchak class due to the
absorption of solar radiation by the wet sands/
ground (Fig. 115a). For crusted puffed solon-
chak, due to the white tint of the salts on the
land surface, the coefficients in the SWIR1 and
SWIR2 channels vary within the visible spectrum
coefficient (Fig. 115b). Therefore, saline soils with
a surface salt crust have comparatively higher
values of the reflectance coefficient than wet
solonchak.

Plain (with shell rocks) and dune
sands without vegetation or with
sparse shrubs (Classes 8 and 9)

The spectral reflectance characteristics of
plain (with shells) and dune sands without vege-
tation or with sparse shrubs are presented in Fig.
116 (a and b) respectively. The reflection coeffi-
cient values are significantly higher in all wave
spectra in the plain sand class (Fig. 116a) due to

190

Fig. 114. Water reflectance in different Landsat 8 OLI spectral channels for March-October 2019-2020 without
plant coverage (a, c, e; Class 1) and with plants (b, d, f; Class 2)

Note: Images (c, d) are from Google Earth, while photos (e, f) are from field research expeditions
in 2019-2020.

191

Fig. 115. Reflection coefficient of solonchaks in different Landsat 8 OLI spectral channels for March-October
2019-2020: Wet-coastal solonchak (a, c, e; Class 4) and crust-puffed without plant cover (b, d, f; Class 5)

Note: Images (c, d) are from Google Earth, while photos (e, f) are from field research expeditions in 2019-
2020.

192

Fig. 116. Reflection coefficient of sands in different Landsat 8 OLI spectral channels
for March-October 2019-2020: Plain sands (with shell) (a, c, e; Class 4) and dune sands without vegetation or
with sparse shrubs(b, d, f; Class 5)

Note: Images (c, d) are from Google Earth, while photos (e, f) are from field research expeditions
in 2019-2020.

193

the white tint of the shells on the ground surface
compared to the dune sands (Fig. 116b). However,
these coefficients hardly change throughout the
year, especially in the case of dune sands.

Fine bumpy sands (weakly fixed) with
sparse communities of wormwood,
shrubs and crops (Class 10)

The reflection coefficient curves of shallow
hilly sands (weakly fixed) with saxaul and shrub
crops are shown in Fig. 117(a) and Fig. 117(b), re-
spectively. The value of the spectral reflectance
for the sands with saxaul crops is similar to that
for the plain sands (Fig. 117a and Fig. 116a). This
is due to the fact that the old French planting
of black saxaul (Haloxylon aphyllum Iljin.) is at
Test Polygon #33 (Expedition Points in 2019 - T.
619-620), scattered (Sr) with a design cover of
25-35 percent, damaged by powdery mildew and
locusts (Fig. 118), solonchak with white calcium
salt crystals (limestone) on the surface sands
and small shell rocks (4-20 millimetres) in some
places. The coefficients of shallow hilly sands
with tamarix cover are different and have the
form of a polynomial curve (Fig. 117b), which is
characteristic of the green plant.

Meadows on alluvial plains (reedy,
mixed grass-cereals) and desertify-
ing hydromorphic cereals-halophytic
mixed grasses with shrubs (Classes
13 and 14)

The reflection coefficient curves for meadow
on alluvial plains (reedy, mixed grass-cereals)
and desertifying hydromorphic cereals-halo-
phytic mixed grasses with shrubs are shown in
Fig. 119(a) and Fig. 119(b), respectively. Spectral
reflectance coefficients for meadow on alluvial
plains have two different values: (1) gradually in-
creasing from Band1 (coastal) to Band6 (SWIR1),
and slightly decreasing in Band7 (SWIR2). The

curves have a polynomial function in March-
August (Fig. 119a), associated with coverage by
vegetation of low height (15-40 centimetres),
at times damaged by animals - Phragmites
australis (common reed), Alhagi pseudalhagi
(camelthorn), Tamarix hispida Willd. (Tamarix pu-
bescent); (2) Coefficient values change insignifi-
cantly in all channels, especially in September-
October, curves show presence of moisture, as
the site is occasionally flooded (during the visit
of the first expedition it was covered with water -
25-30 percent, wet soil - 30-35 percent and plants
- 30-40 percent) (quite abundant - Sor1) (Fig.
119d). The desertification coefficients of hydro-
morphic cereals-halophytic-grasses with reed
cover are different and have the form of a poly-
nomial curve (Fig. 119b). This is explained by the
fact that the site is located in the southern part
of the Muynak pond and is occasionally water-
logged, covered with new, post-fire Phragmites
australis (common reed) with a design cover of
80-90 percent (Shora solonchak 3 Fig. 119е).

Desert shrub and shrub-saxaul (des-
ert forests/artificial plantations)
(Classes 16 and 17)

The spectral reflectance curves of the desert-
ifying shrub and shrub-saxaul (desert forest/ar-
tificial plantations) sites are shown in Fig. 120(a)
and Fig. 120(b), respectively. The coefficients for
desertifying shrub plants in the near-infrared
region (NIR) are significantly lower compared to
well-developed shrub/saxaul plants (Fig. 120(a)
and Fig. 120(b), respectively). This can be ex-
plained by the fact that the area with deserti-
fying shrubs is located in the Takyr area along
the Amudarya River, where the soil is sandy-silty
and extremely dry. There is a strong drought due
to the drying of the Amudarya River, with the
present vegetation consisting of Tamarix hisp-
ida Willd. (Tamarix pubescent) and Haloxylon
aphyllum Iljin. (Black saxaul), with the remaining
green being 8-10 percent (Sol) (Fig. 120d). At the

194

Fig. 117. Reflection coefficient of fine-hilly sands in different Landsat 8 OLI spectral channels for March-
October 2019-2020: With saxaul crops (a, c, e) and with sparse shrubs – tamarix (b, d, f)

195

same time, the shrub-saxaul site has abundant
riparian forest cover with Tamarix hispida Willd.
(Tamarix pubescent) and Halostachys belangeri-
ana Botsch. (Halostachys belangeriana Botsch.),
90-100 percent (Soc) (Fig. 120e).

Based on this assessment, the German part-
ners from Map Tailor Geospatial Consulting
were able to determine which landscapes could
be classified based on the images with differ-
ent spectral characteristics (water, sands, so-
lonchaks and forest), and which objects were
similar in parameters, but could be misleading
(damaged saxaul, desertifying shrubs, and oth-

ers). Consequently the more careful selection of
reference sites and expert control of automatic
interpretation (for instance supervised classifi-
cation, Chapter 6.7) were carried out.

Sometimes objects with good benchmarks
can often be classified falsely in automatic
mode, so visual interpretation by specialists is
necessary. Therefore field data, GPS points, anal-
ysis of Landsat spectral data with differences in
reflection coefficients of different objects, and
spectral indices were used to model the land
cover of the studied area.

Fig. 118. Saxauls damaged by powdery mildew and locustsat Test Polygon # 33.
Expedition Points in 2019 - T. 619-620
(Photo as of 2 October 2019, showing 8-10 dead locustsunder the saxaul bushes)

196

Fig. 119. Reflection coefficient of meadows on alluvial plains and desertifying hydromorphic in different
Landsat 8 OLI spectral channels for March-October 2019-2020: With shrubs (a, c, e) and with reeds (b, d, f)

197

Fig. 120. Reflection coefficient of desertifying shrub and shrub-saxaul thickets in different spectral channels
Landsat 8 OLI for March-October 2019-2020:With drying (a, c, e) and with abundant shrub cover (b, d, f)

198

6.7. Assessment of land cover and soil erosion risks in the
Aralkum based on Earth Observation data

6.7.1. Background and purpose of this
document

The overall objective of this study is to anal-
yse the landscape change of the Aralkum Desert
from 2006 to the research undertaken in 2019-
2020. This assessment is based on the analysis
of Earth Observation (EO) satellite data. It is ac-
companied by an assessment of environmental
hazard changes in terms of aeolian/wind ero-
sion, one of the main sources of dust storms in
the region. The land cover and environmental
hazard maps help decision makers plan forest
plantings by providing information on erosion
risk. This document presents the data, tested
methods and gives recommendations for their
use. In addition, it provides recommendations
and practical conclusions regarding the use of
the developed tools not only for defining plan-
tation sites, but also for monitoring them. It
should be noted that this paper focuses on the
presentation of the data and methodology used
to analyse land cover maps based on satellite
images.

6.7.2. Research area

In the literature, the surface area of the Aral
Sea in 1960 was usually reported as being be-
tween 67,000 and 68,000 km2, depending on the
data source and the methodology used to esti-
mate the area (Létolle et al., 2007; Micklin, 2010).
Estimates based on satellite data (Löw et al.,
2013) showed that the landscape changed dra-
matically in a period of about a decade (2000-
2008). While in 2000 the Aral Sea and smaller
water bodies covered a huge part of the studied
area, by 2008 they had significantly decreased,

leaving behind only small water bodies, such
as the Rybatsky, Djiltyrbas and Sudochie lakes,
which were preserved from drying out due to
artificial embankments. The vegetation cover is
characterised by the current primary succession
on the dried seabed.

The Aral Sea basin is characterised by a high-
ly continental climate with cold winters and hot
summers. The average annual temperature in
the southern part (at the ‘Muynak’ weather sta-
tion in Uzbekistan, 59.02° E, 43.47° N) is 11.7 °С,
the annual precipitation is 60 to 140 millimetres,
but with high variability. In the northern part (the
Aral Sea weather station in Kazakhstan, 61.67°E,
46.78°N) the mean annual temperature is 7.8°С,
while the mean annual precipitation is 141 mil-
limetres. Potential annual evaporation rates of
800-1,100 millimetres in the northern part and
1,000-1,300 millimetres in the southern part are
characteristic (Breckle et al., 2012).

Technically, the studied area includes two
separate polygons in the Uzbek part of the
Aralkum Desert, i.e., the Aral Sea shoreline from
about 1960 (Fig. 121). These two selected poly-
gons roughly correspond to the area where two
field studies were conducted in 2019-2020, re-
spectively (Chapter 6.7.4.1). The area of these two
polygons:


Polygon #1 studied area (visited in 2019),
of about 0.65 million hectares.
Polygon #2 studied area (visited in 2020),
of about 0.60 million hectares.



Two polygons of the studied area are shown,
with the Landsat 8 image taken in October 2019
shown in the background.

199

6.7.3. Goals

The main objectives of this study are to:


Create two land cover maps for 2006 and
2019-2020, respectively;



Create two environmental risk maps in
terms of soil erosion risk based on two
land cover maps, and;

 Develop a quantitative assessment of
the change in land cover area and the
area at risk of erosion based on these
maps.

Fig. 121. The Uzbek part of the Aralkum Desert, for instance the area
within the Aral Sea shoreline of around 1960

200

6.7.4. Data sets used

6.7.4.1. Ground control data

The key data set for this study was an exhaus-
tive set of ground control data obtained during
field visits to Aralkum. The purpose of this data is
to calibrate and validate the algorithms that cre-
ate land cover maps based on satellite images
(see Chapter 6.7.5.3). A team of specialists from
SIC ICWC, as well as the International Innovation
Center of the Aral Sea Region under the President
of the Republic of Uzbekistan
(IICP), the
Karakalpak Hydrogeological Expedition, and the
Institute of Bioorganic Chemistry of the Academy
of Sciences of Uzbekistan visited the Uzbek part
of Aralkum for the first time in October 2019, and
for the second time in June 2020. The team col-
lected information on the land cover at different
sampling points (Fig. 122).

Photographs and GPS points were taken at
each site. In addition, a complete set of land
cover characteristics such as vegetation cover
and soil composition or properties were record-
ed at each sampling point (Tables 31 and 32).

Sampling points contain information on 17
different land cover classes (Tables 31 and 32).
More detailed information about the fieldwork
and sampling strategy is presented in chapter
5.2.

6.7.4.2. Satellite data

Satellite data is the basis for analysis to cre-
ate subject-related maps containing information
about the land cover of the Aralkum Desert in
different years. Images from the Landsat 5 and
8 missions for 2006 and 2019-2020, respectively,
were used to create the maps.

For 2019 and 2006 we used 47 and 26 images
for 4 Landsat fragments, respectively (tracks 161-
162, lines 29-30) from August through October
of each year. For 2020 we used 33 images from
4 Landsat fragments (tracks 161-162, lines 29-30).
Some fragments only partially covered the two

studied zones but were used to fill in the gaps
and achieve full coverage within each polygon of
the studied zone.

They were processed to obtain surface re-
flectance and were acquired from the U.S.
Geological Survey (USGS) Global Archive and
the Earth Resources Observation Center Science
Data System (EROS).

The

2019

dataset

included

Landsat
8 Operational Land Imager (OLI) data. This ready-
to-analyse dataset (USGS Landsat 8 Surface
Reflectance Tier 1) is an atmospherically correct-
ed surface reflectance from Landsat 8 OLI / TIRS
sensors. These images contain five visible and
near-infrared (VNIR) bands and two short-wave
infrared (SWIR) bands processed to obtain an or-
tho-rectified surface reflectance image, and two
thermal infrared (TIR) bands processed to obtain
an ortho-rectified brightness temperature image
(Table 12, Chapter 5.4).

The data were atmospherically corrected
by the USGS using LaSRC and include a cloud,
shadow, water, and snow mask created with
CFMASK, as well as a saturation mask of each
pixel. The strips of collected data are pack-
aged in overlapping “frames” covering approx-
imately 170 x 183 kilometres of standardised
coordinate grid (https://landsat.gsfc.nasa.gov/
the-worldwide-reference-system/).

The 2006 dataset included data from the
Landsat 5 Thematic Mapper (TM). This ready-
to-analyse dataset (USGS Landsat 5 Surface
Reflectance Tier 1) is an atmospherically cor-
rected surface reflectance from Landsat 5 TM
sensors. These images contain four visible and
near-infrared (VNIR) and two short-wave in-
frared (SWIR) bands processed to produce or-
tho-rectified surface reflectance, and one ther-
mal infrared (TIR) band processed to produce
ortho-rectified brightness temperature images.

The VNIR and SWIR bands have a resolution of
30 metres per pixel. These data have been atmo-
spherically corrected with LEDAPS and include

201

a cloud, shadow, water, and snow mask created
with CFMASK, as well as a pixel saturation mask.
The strips of collected data are packed into over-

lapping “frames” covering approximately 170 x
183 kilometres of standardised coordinate grid.

Fig. 122. Sampling points in the southern Aralkum during the two field visits in 2019 and 2020.

202

Table 31

Summary table, point descriptions 2019

203

Summary table, point descriptions 2020

Table 32.

Point_id

date time gps_id

alt

class

coverage

description

Dried karabarak (1 photo), jingyl

Dried karabarak, takyry (1 photo), jingyl

Dried karabarak (1 photo), jingyl

Dried karabarak, saxaul, appears jingyl

Tamarix drying out, trampled by cattle

Yantak, jingyl, green

Dried tamarix, salted

Dried tamarix, salted

Dried tamarix, salted

Dried tamarix, salted. saxaul rare

Dried tamarix, salted

Karabarak, sveda dries out, tamarix 60-70
cm, takyr soil

Karabarak, sveda dries out, tamarix 60-70
cm, takyr soil

Saline soil

Jingyl, turangul (tree), takyrs, sands

Jingyl, turangul (tree), takyrs, sands

Salted, tamarix, isyricum

Tamarix tall

Amber, tamarix green

Amber, reed, wet soil, covered with grasses

Yantak, reed, jingyl, climacoptera grasses

Tamarix after the fire, reeds

Tamarix, reed, amber

Tamarix, reed, amber

Tamarix, reed, amber

1

2

3

4

4а

5

6

7

8

9

10

11

12

13

14

14а

15

16

17

18

19

20

21

22

23

31.5

31.5

31.5

31.5

31.5

31.5

31.5

31.5

31.5

31.5

31.5

6:20

6:25

6:28

6:30

6:34

6:45

6:47

6:49

6:50

6:52

6:54

1596

1597

1598

1599

57.5497

57.90842

59.15299

57.42653

1600

54.83256

1601

1602

1603

1604

1605

1606

56.22124

55.1508

57.39928

53.75542

56.4446

57.02411

31.5

6:57

1607

50.52042

31.5

7:04

1608

51.46349

31.5

31.5

31.5

31.5

31.5

31.5

31.5

31.5

31.5

31.5

31.5

31.5

7:16

7:20

7:25

7:35

7:37

7:40

7:43

7:45

7:53

7:55

7:57

7:58

1609

56.68664

1610

1611

1612

1613

1614

1615

1616

1617

1618

1619

55.36214

53.29633

55.53936

50.78876

50.4669

51.37117

51.70303

49.47135

50.68083

48.82779

1620

51.75824

15

16

16

16

16

14

16

16

16

16

16

15

15

5

17

17

16

16

15

13

14

15

15

15

15

30

10

7

5

10

70

10

7

10

15

15

25

18

5

40

40

7

15

48

80

60

30

30

40

45

204

The notation of classes according to field data and the degree of ecological hazard assigned to
each land cover class. Distribution of land cover classes according to the degree of ecological
hazard, namely the degree of erosion risk (Dukhovny et al., 2008)

Table 33.

Ecological
hazard
level

Number of sampling
points
(1st expedition,
October 2019)

Number of
sampling points
(2nd expedition,
June 2020)

Class
ID

Description

1.1 (1)

Water surface

1.2 (2)

Shallows, sometimes with reeds

Water

Solonchak

2.1 (3)

Marsh without vegetation or with Saltwort
communities

2.2 (4)

2.3 (5)

2.4 (6)

2.5 (7)

Wet coastal with seashells, sometimes
with isolated specimens of sarsazan and
saltwort

Cork-puffed and cork without vegetation,
sometimes with single specimens of
shrubs (karabarak, tamarix)

Solonchak with overblown sandy
cover with sparse swan and selinum
communities

Saltwort solonchak of closed depressions
without vegetation, sometimes framed by
sarsazanites

Sands

3.1 (8)

Plains (with shell rocks) without
vegetation or with sparse shrubs (saxaul,
tamarix)

3.2 (9)

Dunes without vegetation

3.3 (10)

3.4 (11)

3.5 (12)

Shallow-hilly (weakly fixed) with sparse
communities of wormwood, shrubs, and
selinum crops

Hilly and hilly-ridgy without vegetation
and weakly fixed.

Hilly, hilly-ridgy fixed with ephemeral
wormwood-shrub communities

II

II

I

I

III

IV

I

IV

IV

IV

III

II

Deltaic and accumulative plains

4.1 (13)

Meadows on alluvial plains (reedy, mixed
grass-cereals) on alluvial-meadow,
swamp-meadow and meadow-bog soils

I

205

25

10

1

0

40

162

3

89

2

20

33

303

2

2

10

0

0

15

34

7

51

8

47

4

66

30

Class
ID

4.2 (14)

4.3 (15)

Description

Deserted hydromorphic cereal-
halophytic-grasses with shrubs

Shrub thickets (halophytic: tamarix,
karabarak)

4.4 (16) Desert shrublands

4.5 (17)

Shrub/saxaul (desert forests/artificial
plantations)

Ecological
hazard
level

Number of sampling
points
(1st expedition,
October 2019)

Number of
sampling points
(2nd expedition,
June 2020)

II

I

III

I

118

280

274

54

34

126

80

18

6.7.5. Methods

The methodology consists of several succes-
sive steps. First, ground control data were pre-
pared (Chapter 6.7.5.1) and some pre-process-
ing had to be applied to the satellite images
(see Chapter 6.7.5.2). The classifier algorithm
was then calibrated based on the prepared
ground control data and the pre-processed
images, and land cover maps for 2006 and
2019/2020 respectively, were created (Chapter
6.7.5.3). Two land cover maps were translated
into designated ecological risk areas (Chapter
6.7.5.4). Finally, an accuracy assessment was
carried out to assess the quality of the maps,
as well as a quantitative assessment of the land
cover and ecological risk zones for both years
of observation based on the maps (Chapters
6.7.5.5 and 6.7.5.6).

6.7.5.1. Pre-processing of ground control
data

The final class conventions used in the
mapping consisted of 10 instead of 17 classes
(Table 34). Some classes, such as plain, dune
and shallow hilly (3.1, 3.2 and 3.3), contain land
cover characteristics that cannot be uniquely
distinguished on satellite images. As a conse-
quence, their spectral signatures looked very
similar and initial tests showed that the clas-
sifier algorithms could not distinguish some
classes well enough. Therefore, we combined

several of the classes (Fig. 123). In addition to
the ground survey benchmark data, additional
selection points were taken for some classes
on the screen because it was difficult to enter
these landscapes during the 2019-2020 expedi-
tions: Water/1.1., Shallow Water/1.2. and Marsh
Soils/2.1.; this was done through the visual in-
terpretation of Landsat imagery. Some drop-
off points or samples that were represented by
mixed pixels were removed. In addition, wet-
soil/2.2 class locations were not available and
could not be highlighted on the screen, and as
a result this class was skipped.

At the same time, despite a large set of
ground and screen samples, the total data
set was partially unbalanced. For instance,
the number of control locations by land cover
classes was unevenly distributed. This is ex-
plained by the fact that the area was not com-
pletely accessible.

In the context of supervised classifica-
tion, unbalanced calibration samples are
often compensated by adding more elements
(oversampling) or by removing elements (un-
der-sampling) from a sample, to obtain a more
balanced set of calibration data. In this study,
the R software (in the DMwR package, version
0.4.1) applied a method of resampling synthe-
sised minorities (SMOTE) (Chawla et al., 2002)
to create synthetic calibration samples for a
smaller class so that the training class fraction

206

Fig. 123. Multispectral land cover class signatures in the 2019 ground control data and Landsat 8 OLI images
from October 2019

takes their native location into account. The
basic idea of SMOTE is to artificially generate
new samples of the smaller class using boot-
strapping and k-nearest neighbours. As a hy-
brid method, SMOTE offers both over-sampling
of the smaller class and under-sampling of the
larger class.

The final number of samples is shown in

Table 34.

6.7.5.2. Satellite imagery pre-processing

The percentage of areas for each image af-
fected by cloud cover or cloud shadow (pixels
without data) was calculated based on the mask
function (Fmask) algorithm (Zhu & Woodcock,
2012), which combines cloud cover and cloud

shadow areas into a separate class. Images with
the percentage of pixels without data greater
than 90 percent and images without orthorecti-
fication, based on their metadata, were skipped
(not loaded).

Clouds and haze were subsequently removed
by evaluating data quality assessment layers
(which contain pixel quality attributes generat-
ed by the CFMASK algorithm) in Landsat Level
1 products. Pixels marked as (i) cloud shadow,
(ii) cloud and (iii) high confidence cloud and pin-
nate clouds were removed.

The median reflectance band values for each
observation year (2006 and 2019/2020) were
then calculated for two periods including (i)
Period-1 from May to July, and (ii) Period-2 from

207

Final land cover map conventions, the land cover maps contain 10 classes, and the number of
samples represents the final sample after various cross-checks

Table 34.

Source
ID of the
classes

New
ID

1.1 (1)

1.2 (2)

2.1 (3),
2.5 (7)

2.4 (6)

3.1 (8),
3.2 (9),
3.3 (10)

2.3 (5),
3.4 (11)

1

2

3

6

10

11

4.1 (13)

13

3.5 (12),
4.2 (14)

4.4 (16)

4.3 (15),
4.5 (17)

14

16

17

Description

Water surface

Shallows, sometimes with reeds

Marsh and shora solonchak soils without
vegetation or with communities of
saltwort, partially visible salt crusts

Solonchak with overblown sandy cover with
sparse swan and selinum communities

Plains (with shell rocks) without vegetation
or with sparse shrubs (saxaul, tamarix),
dunes without vegetation, shallow hilly
(weakly fixed) with sparse communities of
wormwood, shrubs and selinum crops

Crusty-puffy and crusty without vegetation,
sometimes with isolated specimens of
bushes (karabarak, tamarix), hilly and hilly-
ridgy without vegetation and weakly fixed

Meadows on alluvial plains (reedy, mixed
grass-cereals) on alluvial-meadow, swamp-
meadow and meadow-bog soils

Hilly, hilly-ridgy fixed with ephemeral
wormwood-shrub communities,
desertifying hydromorphic cereals-
halophytic grasses with shrubs

Desert-bushy

Shrubby thickets (halophytic: tamarix,
karabarak), shrubby saxaul (desert forests/
artificial plantations)

The number of
ground points and
locations on the
screen in 2019 and
2020 together

Number of SMOTE
sample points in
2019 and 2020
together

48

22

44

196

180

92

58

521

354

478

112

132

127

566

600

247

139

1,416

1,001

1,292

208

Landsat strips and derivatives used to create maps of land cover - each set of derivatives was
calculated twice, once for Period-1 from May to July, and again for Period-2 from August to October

Title

Description

Number of
derivatives
(2 periods)

Links

Table 35.

• Median values of reflectivity for two periods

6 * 2

• Luminance level median values over two periods
• Green level median values over two periods
• Median values of humidity for two periods

Normalized
Relative Vegetation
Index (NDVI)

• Median values of NDVI for two periods
• Minimum values of NDVI for two periods
• Maximum values of NDVI for two periods
• Standard deviation of NDVI values for two periods

Spectral finite
elements

• Median values of bare soil by two periods
• Median values of vegetation by two periods
• Median values of water by two periods

3 *2

4 *2

3 *2

(Kauth and
Thomas,
1976)

(Rouse et
al., 1974)

(Bullock et
al., 2020)

Landsat B1-B7
multispectral
bands

Tasselled Cap
Indices

August to October. In this way, gaps resulting
from previous cloud masking were temporarily
filled (Griffiths et al., 2019).

Landsat data have multispectral bands that
allow differentiation of different land cover
classes. To increase the degree of class separa-
tion, a complete set of the following derivatives
from satellite images (predicator variables for
the classifier algorithm) was calculated:

Landsat multispectral bands

To have comparable input data for supervised
image classification, only the multispectral bands
that exist in both TM and OLI sensors were re-
tained, including blue, green, red, near-infrared,
and two shortwave infrared bands (6 bands).

Tasselled Cap

The Tasselled Cap Transformation (TCT) is a
method commonly used in land cover mapping
or other classification projects (Kauth & Thomas,

1976). It uses a linear combination of satellite im-
agery bands and a specialised coefficient matrix
to create an n-band image with the first three
bands containing most of the useful information,
similar to the Principal Component Method. The
first three bands created usually represent bright-
ness, green level and humidity. The coefficient
matrix (Baig et al., 2014) (Crist & Cicone, 1984),
which is unique to each sensor, is based on image
statistics and empirical observations.

Normalized Relative Vegetation Index

The Normalized Relative Vegetation Index
(NDVI) is an index of plant green mass or pho-
tosynthetic activity and is one of the most com-
monly used vegetation indices (Rouse et al., 1974).
Vegetation indices are based on the observation
that different surfaces reflect different types of
light differently. Specifically, photosynthetically
active vegetation absorbs most of the red light
hitting it, while reflecting most of the near-infra-
red light. Vegetation that is dead or under stress

209

reflects more red light and less infrared. Similarly,
surfaces without vegetation have a much more
uniform reflection coefficient across the en-
tire light spectrum. By taking the ratio of red to
near-infrared from a remotely sensed image, we
can determine the greenness index of the vege-
tation. The Normalized Relative Vegetation Index
(NDVI) is probably the most common of these ra-
tios for vegetation.

NDVI is calculated on a pixel-by-pixel basis as
the normalised difference between the red and
near-infrared bands of the image:

composition of mixed pixels. Thus, the definition
of land cover classes and the selection of suit-
able finite elements for each of these classes
play a major role in MESMA. Finite elements de-
rived from the real image are usually preferred,
since in this case no calibration between the se-
lected finite elements and the measured spectra
is needed.

In this study, the following three general class-
es of land cover were defined as finite elements:

Vegetation


 Bare soil
 Water

Where

NIR is the value of the near-infrared range

for the cell,

The multispectral signatures that define the
end elements are derived by selecting pixels
from the 2019 Landsat images and using GPS
ground control data (Chapter 6.7.4.1).

RED is red range value for the raster cell.

6.7.5.3. Creating land cover maps

Spectral finite elements
Endmember

Multiple

Spectral Mixture
Analysis (MESMA) is a method for estimating the
proportion of each pixel covered by a series of
known cover types – in other words, determining
the likely composition of each pixel in an image
(Dennison & Roberts, 2003). Pixels containing
multiple cover types are called mixed pixels.
“Pure” pixels contain only one feature or class.
For example, a mixed pixel may contain vege-
tation, bare soil and soil crust. Subpixel anal-
ysis methods determine the constituent parts
of mixed pixels by predicting the fraction of a
pixel that belongs to a particular class or feature
based on the spectral characteristics of its final
elements. Brightness is converted into fractions
of spectral end members that correspond to fea-
tures on the ground.

Spectral finite elements are “pure” spectra
corresponding to each of the land cover class-
es. Ideally, the spectral finite elements make up
most of the spectral variability of the image and
serve as the basis for determining the spectral

We used the Random Forest (RF) classifier
(Breiman, 2001) in the “R” programming language
(implemented in the “Random Forest” package,
version 4.6-14) to classify input data (see pre-
vious chapter) and map land cover classes. RF
generates a set of decision trees by construct-
ing random samples with substitutions from the
training data and determining the best partition
at each node of the decision tree, considering
the maximum number of randomly selected fea-
tures (maximum attributes). We tested different
parameter ranges for a number of trees and the
maximum number of features and finally used
200 trees and 10 percent of the input features
considered in each partitioning to parameterise
the RF classification models. We trained the RF
model for the combined input data for 2019 and
2020 to improve the accuracy of the maps. We
then applied the calibrated model to classify the
input data in 2006, 2019 (Polygon #1 only), and
2020 (Polygon #2 only) to create land cover maps
for these two years.

210

Fig. 124. Examples of calculation of some input features for land cover maps

211

6.7.5.4. Creating environmental risk maps

Environmental risk was defined as the risk
of soil erosion, according to a previous study
(Dukhovny et al., 2008). To map the risks the land
cover classes were classified into four different
risk classes (Table 33).

6.7.5.5. Accuracy assessment

Quality, defined as the accuracy of land cover
maps, was assessed using standard imprecision
matrices (Congalton, 1991). Control data (Chapter
6.7.5.1) were used to assess the overall accuracy
of classification and classification by class. The
main goals of the validation are to provide a
brief assessment of the accuracy of each map-
ping product. Following the standard computa-
tion-based approach, the classification maps are
validated by calculating inaccuracy matrices (the
‘error matrix’ as show in Table 36) (Congalton,
1991; Foode, 2002). This is a feature-conjuga-
tion matrix (where m is the number of classes)
between a random sample of field indicators
(which should be more reliable than the classifi-
cation and thus considered true values) and the
corresponding classified pixels.

The common element of the matrix n_ij is the
number of pixels with correct class i and class on

map j, and the frequency of ground observations
and observations on the map are given by the
edge values of rows and columns, respectively.
Using the error matrix, various values can be cal-
culated to estimate the classification accuracy:
 Overall accuracy (OA) (the share of correctly
classified pixels) is calculated by dividing the
sum of the values on the main diagonal by
the total number of pixels:

 Constructor accuracy (PA, skip errors) for
each class is calculated by dividing the
diagonal element by the total number in the
row and gives for each class the probability
of correct classification, and its complement,
the weight of off-diagonal elements, is the
skip error (the proportion of that class that
is not mapped):

 • The user accuracy (UA, validity errors) for

each class is calculated by dividing the diag-
onal element by the total number in the col-
umn and gives, for each class, the probability

Elements of the inaccuracy matrix

Table 36.

1

n11

Class

1

i

m

n
o
i
t
a
d

i
l
a
V

)
l
o
r
t
n
o
c
d
n
u
o
r
g

,
.

.

g
e
(

Total

Prediction (e.g., map classification)

j

i

m

Sum.

nii

nmm

n(i+)

n

nij

n+j

212

that a pixel on the map actually represents
that category on the ground. Its complement
is the validity error (points misclassified in
that class):

 The F1-measure is also calculated for each
class. It is a weighted average between
Accuracy and Completeness. Accuracy is the
ratio of correctly predicted positive observa-
tions to the total number of positively pre-
dicted observations. High Accuracy refers to
the low proportion of incorrectly predicted
positive observations (i.e., false positives). In
turn, Completeness (sensitivity) is the ratio
of correctly predicted positive observations
to total observations in the actual class.

6.7.5.6. Assessment of land cover area

The most direct method for estimating land
cover area from a classified image is based on
multiplying the number of pixels in maps classi-
fied as one class by the pixel size. It can be rec-
ommended as a standard methodology for esti-
mating area in a monitoring tool, and it is almost
the only one practiced in remote sensing (RS)
(FAO, 2015). However, discrepancies can occur in
area estimation due to omissions or map errors
(Gallego et al., 2008). To estimate the proportion
of land cover classes, the map was re-projected
to UTM-40N.

6.7.6. Results

The description of the results is broken down
into three areas: (i) the quality (accuracy) of the
land cover map in 2019, (ii) land cover status and
change between 2006 and 2019, and (iii) asso-
ciated changes in environmental risk areas (in
terms of erosion risk). Note that the results are
focused on the Uzbek part of the Aral Sea, con-
sidering its original size in 1960.

6.7.6.1. Evaluation of the accuracy of the
random forest classifier

An evaluation of the accuracy of the 2019 land
cover map showed that the overall classification
accuracy was 0.88 (lower confidence limit 0.87,
upper confidence limit 0.89).

According to the F1 measure, the most accu-
rately mapped land cover categories were Class-
1: water (0.98), Class-13: grassland/reeds (0.91),
Class-3: marsh and shora solonchak soils (0.98),
and Class-2: shallow water. The least accurately
identified classes were Class-10: Plains (0.84) and
Class-11: Desert Crusty-Puffy and Crusty Soils.

According to the inaccuracy matrix (Table 38),
Class-14: hilly, hilly-ridgy weakly fixed, Class-16:
desertifying shrublands, and Class-17: shrub
thickets, are often mislabelled by the RF classi-
fier. According to field sampling, all classes are
characterised to some degree by the presence of
shrubs. As for the composition of these classes
(vegetation, soils), smooth transitions exist be-
tween classes, making it difficult for the classifi-
er model to make a clear distinction.

Overall, the accuracy assessment shows that

the quality of the maps is high.

6.7.6.2. Classification of land cover

Two annual land cover maps with ten land
cover classes in each were created, one for 2006
(Fig. 125) and one for 2019 (Fig. 126). When com-
paring the two maps, the drying of the eastern
part of the Aral Sea becomes apparent. In 2006
shallow water covered the eastern part, but by
2019 the water had almost completely receded,
leaving behind a salt desert consisting mostly
of marsh and shora solonchak and other solon-
chak soils. The western water body was affected
to a lesser extent, and a narrow strip of marsh
and shora solonchak emerged near the eastern
shore of the western Aral Sea.

213

Evaluating the accuracy of the random forest classifier model based on the combined
2019/2020 benchmark data

Table 37.

y
c
a
r
u
c
c
A

e
r
u
s
a
e
m

r
e
t
a
W

:
1

s
n
i
a
l
P

:

0
1

y
t
s
u
r
C

:
1
1

d
n
a
y
f
f
u
p

t
u
o
h
t
i
w
y
t
s
u
r
c

n
o
i
t
a
t
e
g
e
v

User Accuracy

1.00

0.85

Builder
accuracy

F1

0.97

0.84

0.98

0.84

0.89

0.76

0.82

/
s
w
o
d
a
e
M

:

3
1

s
d
e
e
R

0.94

0.89

0.91

-
y
l
l
i
h

,

y
l
l
i

H

:

4
1

y
l
k
a
e
w

,

y
g
d
i
r

.

d
e
x
fi

t
r
e
s
e
D

:

6
1

s
d
n
a
l
b
u
r
h
s

,

y
r
e
b
b
u
r
h
S

:
7
1

s
t
e
k
c
i
h
t

r
e
t
a
w
w
o
l
l
a
h
S

:

2

s
k
a
h
c
n
o
l
o
S

:

6

0.87

0.88

0.87

0.86

0.85

1.00

0.90

0.86

0.87

0.86

0.91

0.86

0.86

0.93

0.91

s
l
i
o
s

d
n
a
h
s
r
a
M

:

3

k
a
h
c
n
o
l
o
s
a
r
o
h
s

0.98

0.97

0.98

Table 38.

Inaccuracy matrix to estimate the accuracy of the random forest classifier based on the combined
control data for 2019/2020

n
o
i
t
c
i
d
e
r
P

Classes

1

10

11

13

14

16

17

2

6

3

1

59

0

0

0

2

0

0

0

0

0

10

0

233

0

0

20

13

8

0

5

0

11

0

9

90

0

10

2

1

0

6

1

16

17

0

5

0

0

21

423

43

0

0

0

0

7

5

0

42

25

572

0

5

0

2

0

0

1

0

0

2

3

57

3

0

6

0

7

4

0

6

3

3

0

243

3

0

0

0

0

0

2

0

0

0

0

65

Control

14

0

12

1

4

650

23

40

0

7

0

13

0

1

0

63

0

1

6

0

0

0

214

Fig. 125. Land cover in Aralkum in 2006

215

Fig. 126. Land cover in Aralkum in 2019

216

Fig. 127. Environmental risks in Aralkum in 2006

217

6.7.6.3. Environmental risk maps

6.7.7. Discussion

Each category on the land cover maps can
be translated into environmental hazard class-
es in terms of wind erosion risk. This informa-
tion is critical for understanding the spatial and
temporal dynamics of areas at risk of erosion.
Finally, this information is useful for identify-
ing new locations for afforestation, for instance
those with the highest erosion risk. Figs. 127 and
128 show environmental risk maps for 2006 and
2019, respectively.

6.7.6.4. Summary of land cover changes and
environmental hazards

With the retreat of the Aral Sea between 2006
and 2019, a wide swath of land appeared on the
outer edge of the new shoreline in 2019 (Figs.
125 and 126). In particular saline soils emerged,
greatly increasing the environmental hazards in
these locations across three categories (Fig. 129).
In contrast, the sites south of the dried seabed,
which were already uncovered in 2006, saw a
partial improvement in the ecological situation
(in terms of erosion risk). This can be partly ex-
plained by the continuation of plant growth suc-
cession and the emergence of shrub vegetation
communities.

As one can see from the maps, in 2006, avail-
able forest plantations were carried out in some
places mostly characterised by high environ-
mental hazards, such as ‘IV (High)’ (Fig. 127). In
2019, their hazard status decreased significantly,
mostly to category ‘II (Low)’ (Fig. 128).

Evaluation of the maps for two different years
allowed for a quantitative assessment of chang-
es in land cover area and ecological hazard.
Tables 39 and 40 summarise the change in land
cover area, and Tables 41 and 42 summarise the
change in ecological hazard zones.

This study developed a methodology based
on Earth Observation (EO) to map and quanti-
fy land cover conditions in different years. It is
based on open satellite data, and the method-
ology has been calibrated and validated against
collected field reference data.

The proposed method is innovative in that
it improves existing mapping strategies used in
the Aralkum Desert by using machine learning
algorithms and multi-temporal satellite data
as inputs. Regarding the input data, the choice
of different vegetation indices and spectral de-
composition adds value by increasing the clas-
sification accuracy compared to using only the
Landsat multispectral bands.

Unfortunately, the previous map of land use
and land cover from 2006 created by a past proj-
ect (Dukhovny et al., 2008) could not be used in
this assessment because the method could not
be replicated and control data for 2006 were not
available. However, based on the method used
in this study, this gap could be filled, and the
method provides a basis for scaling it to larger
regions and different years.

Creating temporal composites contributes
to this spatial and temporal “portability” of
the technological process, because it removes
the burden of searching for cloudless images
and creates comparable input data for differ-
ent years. For example, by using the proposed
strategy two sets of input data can be created
for different years, specifically 2006, 2019 and
2020, which have similarly different temporal at-
tributes. This is a prerequisite for applying the
classifier algorithm, which was calibrated for
one year (2019-2020), to classify the composite
for another year (2006). It should be noted that
due to the lack of benchmark data for 2006, the
map of land use and land cover created as part
of this study could not be validated through ac-
curacy assessment.

218

Fig. 128. Environmental risks in Aralkum in 2019

219

Fig. 129. Changes in environmental hazard classes from 2006 to 2019, with positive values indicating an
increase in the level of environmental hazard, and negative values indicating a decrease

220

Table 39.

Areas of land cover categories within the technical studies area in 2006 and 2019,
in the Polygon #1 research area

ID
source
class
(New
ID)

Description

Area (ha) in
2019

1.1 (1) Water surface

1 614.33

1.2 (2)

Shallow water, sometimes with reeds

11.25

% of
area of
technical
study in
2019

Area (ha)
in 2006

% of
area of
technical
study in
2006

Diffe-
rence
2019-
2006

0.25

0.00

2 747.61

1 202.58

0.42

0.18

-1 133.28

-1 191.33

2.1 (3)

Marshes without vegetation or with
communities of saltwort

2.3 (5),
3.4 (11)

Crusty-puffy and crusty, without
vegetation, sometimes with isolated
specimens of shrubs (karabarak,
tamarix), hilly and hilly-ridgy without
vegetation and weakly fixed

2.4 (6)

Solonchak with overblown sandy
cover with sparse communities of
goosefoot and saltwort

3.1 (8),
3.2 (9),
3.3 (10)

Plains (with shell rocks) without
vegetation or with sparse shrubs
(saxaul, tamarix), dunes without
vegetation, shallow hilly (weakly
fixed) with sparse communities of
wormwood, shrubs and selinum crops

3.5 (12),
4.2 (14)

Hilly, hilly-ridgy weakly fixed with
ephemeral wormwood-shrub
communities, desertifying,
hydromorphic cereals-halophytic-
miscellaneous grasses with shrubs

4.1 (13)

Meadows on alluvial plains (reedy,
mixed grass and cereals) on alluvial-
meadow, swamp-meadow and
meadow-swamp soils

4.3 (15),
4.5 (17)

Shrub thickets (halophytic: tamarix,
karabarak), shrub-saxaul (desert
forests/artificial plantations)

1 456.83

0.22

62 746.20

9.60

-61 289.37

246 080.97

37.67

186
826.41

28.60

59 254.56

33 210.27

5.08

116 324.37

17.81

-83 114.10

68 454.27

10.48

120
684.42

18.47

-52 230.15

2 369.25

0.36

680.31

0.10

1 688.94

136 871.55

20.95

89 370.81

13.68

47 500.74

67 908.33

10.39

35 004.69

5.36

32 903.64

4.4 (16) Desert shrublands

95 308.92

14.59

37 699.56

5.77

57 609.36

Total area

653 285.97

100.00

653
285.97

100.00

221

Table 40.

Areas of land cover categories within the technical studied area in 2006 and 2020,
in the Polygon #2 research area

ID
source
class
(New
ID)

Description

Area (ha) in
2020

1.1 (1) Water surface

8 254.17

1.2 (2)

Shallow water, sometimes with reeds

1 020.06

% of
area of
technical
study in
2020

Area (ha)
in 2006

% of
area of
technical
study in
2006

Diffe-
rence
2020-
2006

1.38

0.17

7 717.59

3 238.20

1.29

0.54

536.58

-2 218.14

2.1 (3)

Marsh without vegetation or with
communities of saltwort

2.3 (5),
3.4 (11)

Crusty-puffy and crusty, without
vegetation, sometimes with isolated
specimens of shrubs (karabarak,
tamarix), hilly and hilly-ridgy without
vegetation and weakly fixed

2.4 (6)

Solonchak with overblown sandy
cover with sparse communities of
goosefoot and saltwort

3.1 (8),
3.2 (9),
3.3 (10)

Plains (with shells) without vegetation
or with sparse shrubs (saxaul,
tamarix), dunes without vegetation,
shallow hilly (weakly fixed) with
sparse communities of wormwood,
shrubs and selinum crops

3.5 (12),
4.2 (14)

Hilly, hilly-ridgy weakly fixed with
ephemeral wormwood-shrub
communities, desertifying,
hydromorphic cereals-halophytic-
miscellaneous grasses with shrubs

4.1 (13)

Meadows on alluvial plains (reedy,
mixed grass and cereals) on alluvial-
meadow, swamp-meadow and
meadow-swamp soils

4.3
(15),
4.5 (17)

Shrub thickets (halophytic: tamarix,
karabarak), shrub-saxaul (desert
forests/artificial plantations)

417.87

0.07

61 529.49

10.31

-61 111.62

103 379.67

17.33

49 574.34

8.31

53 805.33

31 469.67

5.28

151 947.54

25.47

-120 477.87

22 970.79

3.85

47 771.91

8.01

-24 801.12

34 538.13

5.79

13 507.02

2.26

21 031.11

225 349.38

37.78

189 518.94

31.77

35 830.44

105 190.29

17.63

34 873.56

5.85

70 316.73

4.4 (16) Desert shrublands

63 961.20

10.72

36 864.63

6.18

27 096.57

Total area

596 551.23

100.00

596 551.23

100.00

222

Areas of environmental hazard categories in 2006 and 2019, in the Polygon #1 research area

Table 41.

Environmental
Hazard Class

Description

Area (ha)
in 2019

% of area
of technical
study in 2019

Area (ha) in
2006

% of area
of technical
study in 2006

I

II

III

IV

Not available

99 135.99

Low

138 497.13

Medium

136 362.60

High

279 291.24

15.17

21.20

20.87

42.75

101 126.10

93 321.00

155 689.10

303 150.80

15.48

14.28

23.83

46.40

Total area

653 285.97

100.00

653 285.97

100.00

Difference
2019-2006

-1 990.11

45 176.13

-19 326.50

-23 859.56

Table 42.

Areas of environmental hazard categories in 2006 and 2020, in the Polygon #2 research area

Environmental
Hazard Class

Description

Area (ha)
in 2020

98 917.20

Not
available

Low

234 623.60

Medium

128 161.10

High

134 849.30

% of area
of technical
study in 2020

Area (ha) in
2006

% of area
of technical
study in 2006

Difference
2020-2006

16.58

39.33

21.48

22.60

111 901.14

200 474.73

82 645.47

201 521.88

18.76

33.61

13.85

33.78

-12 983.94

34 148.87

45 515.63

-66 672.58

I

II

III

IV

Total area

596 551.23

100.00

596 551.23

100.00

596 551.23

6.7.8. Recommendations and practi-
cal conclusions
 This method can be extended so that it can
be fully used to map 17 land cover classes
and related ecological hazards, both for
other years and for the Aralkum Desert
(Uzbek part) as a whole. To this end, we rec-
ommend continuing ground expeditions to
collect relevant information in the field and
using Earth Observation (EO) satellite images
to identify possible afforestation sites. In
particular we suggest supplementing the
existing control data with additional expe-

ditions to cover places where fewer samples
were taken and to be able to classify all 17
initial land cover classes (we classified ten
classes in this study). It is recommended that
the north-eastern, northern and north-west-
ern parts of the studied area should be tar-
geted to achieve spatially balanced samples.
 According to this methodology, maps of the

land cover and the associated environmental
hazard (in terms of wind erosion risk) have
been produced. This information can be used
to spatially identify regions where measures
to reduce wind erosion should be imple-

223

mented, for example, through the planting of
shrublands (forest plantations).

 We propose to use and further extend the

step determines where environmental condi-
tions are favourable for afforestation.
 Using Earth Observation (EO) satellites to

already developed methodology to address
other relevant stages of the project manage-
ment cycle in the context of afforestation of
the dried Aral Sea bed (Fig. 130):

 The use of satellite Earth Observation (EO) in
combination with other relevant geodata to
map the environmental and meteorological
conditions that determine the suitability of
land for afforestation (land suitability). This

monitor the development of existing or new
afforestation areas. In addition to Landsat,
other open satellite data, such as Sentinel
from the Copernicus Earth Observation
programme and very high-resolution sat-
ellite data, should be combined. This step
will provide information on the success of
already conducted afforestation.

Fig. 130. Conceptual scheme of integrated forest plantation planning and monitoring based on Earth
Observation and other geodata

224

7 Discussion

7.1. Changing the soil cover and its environmental hazards

The soil cover of the dried seabed is an indi-

cator of environmental stability.

In the classification of soils, the name and
properties of a particular soil variety area in-
cluded in an assessment of environmental
stability. The map of 2020 identifies 50 soil dif-
ferences. All soil varieties fit within the charac-
terization of risk classes developed and adopted
in 2005 and included in the book published in
2008 (Dukhovny et al., 2008).

There is some brief information about the
principles of the 17 classes and their association
into risk groups. In terms of soil coverage, the en-
vironmental risk group primarily includes sand
massifs, such as barchans, dunes, sand hills if
they are loose or weakly consolidated, and soils
covered with a sand plume.

Solonchaks are ranked in the order of environ-
mental risk, including hydromorphic solonchaks
(excessively hydromorphic, semi-hydromorphic
and moderately hydromorphic), semi-automor-
phic and automorphic soils.

Hydromorphic solonchaks become danger-
ous when they dry out as the leaching regime of
marsh solonchaks changes to the habitual wa-
ter-salt regime, salt accumulates in the surface
horizons, a salt crust is formed, and the salt is
carried over long distances by the wind.

The most susceptible to erosion among the
semi-hydromorphic and semi-automorphic so-

lonchaks are puffed, crust-puffed solonchaks.
The puffed solonchak has a powdery top layer
which is a source of dust and salts. The crust-
puffed solonchaks become a source of dust and
salts when the crust is destroyed. Such solon-
chaks are active producers of salts carried by the
wind outside the Aral Sea basin.

Overgrowing solonchaks with artificial plant-
ings or self-overgrowth, lowers the ecological
hazard and significantly reduces it when solon-
chaks transition to desert-sandy soils.

Desert-sandy soils are mostly formed on the
layered soils of alluvial-marine deposits of the
Amudarya avandelta and lake-marine deposits
of the Adjibay and Djiltyrbas bays, and often
have sorted, fine fractional particles. Being sub-
jected to mechanical destruction, they become
erosion-hazardous.

Studies of soil cover have determined the di-
rection of soil formation and the time required
for transition from one soil variety to another
(Sektimenko, 1991; Dukhovny et al., 2008).

It is known that marsh and wet solonchaks
have uniform salt distribution along the profile
and chloride salinity in the first period of drying.
With drying, salts accumulate in the upper hori-
zons (Fig. 131). Over time and with the lowering
of the water table, marsh solonchaks transform
into hydromorphic and then into automorphic
and desert-sandy soils (Fig. 132 and 133).

226

The above example is a classical scheme of
soil transformation in the Aral Sea, and its clas-
sification from hydromorphic to automorphic.

The overall process of soil change is influ-
enced by local effects. The main one is periodic
moistening from water sources of bays, rivers
and collectors. Another impact is siltation, which
makes adjustments in the assessment of the
ecological risk of soil cover.

Fig. 134 shows the distribution of salts across
the profile of a semi-hydromorphic solonchak

section 5(2), in which the soil profile is non-sa-
line due to desalinisation. The soil becomes
more hazardous in the environmental risk as-
sessment due to the transfer of sand.

Soil flooding from bays also has an impact. In
this case, desertified saxaul shrub forests may
be in the ecological risk group.

The results of studies show that flooding of
the area can have both positive and negative
effects. It is shown that the flooding of saxaul,
causing the soil to become supersaturated with

Fig. 131. Salt distribution (TDS, percentage) in the profile of a moderatehydromorphic solonchak, section 18

Fig. 132. Salt distribution (TDS, percentage) in the profile of a strong-crust, automorphic solonchak, section 29

227

water, leads to a diseased plant and its subse-
quent death as observed near Djiltyrbas Bay.

The change of karabarak vegetation to saxaul
when the soil dries out cannot be regarded as
desertification.

The study of soil cover through a comparison
of soil conditions over a number of years con-
cludes that soil conditions, despite the seem-

ingly “wild” part of the land (the dried seabed),
are largely subjected to positive and negative
anthropogenic influences.

In the Muynak area, there is little of the pro-
tected natural soil cover left. The presence of
more than 45 drilling rigs and their access roads
causes soil destruction. An example of this neg-
ative impact is evident in the area of old saxaul
plantings north of Rybatsky Bay. Although fa-

Fig. 133. Salt distribution (TDS, percentage) in the profile of desert-sandy soil, section 30

Fig. 134. Salt distribution (TDS, percentage) in the profile
of a semi-hydromorphic sandy solonchak, section 5(2)

228

vourable conditions have been created to pre-
serve the soil and forest planting, machines con-
tinuously shuttling from well to well destroy the
already strengthened soils under the plantings.

In the area of the Kazakhdarya, meadow-allu-
vial soils change into solonchaks due to changes
in the channel of the Amudarya River, associat-
ed with the operation of the Mejdurechenskaya
Dam.

In the Djiltyrbas zone, being a zone of planta-
tions of four forestry farms, the anthropogenic
impact is positive. But even here desertification
is manifested, which is associated with cata-
strophic drainage of the East Sea, the active
movement of sand, and the overlapping of soils
with sandy covers.

The results (Tables 43 and 44) of soil surveys
from 1990, 2005-2006, and the 2019-2020 expedi-

tions were used to identify the general course of
the processes.

The comparison was made in the borders of
the studied areas. During the period from 1990 to
2020, there was a significant decrease in hydro-
morphic solonchaks by 15.1 percent due to the
development of aridization process and, accord-
ingly, an increase in automorphic solonchaks by
14.6 percent, a decrease in the groundwater table
and a transition of hydromorphic soils into their
automorphic analogues, zonal soil formation
and sanding. Since 2006, hydromorphic charac-
ter is maintained more or less steadily due to
periodic flooding of every 5-7 years. The forma-
tion of desert-sandy soils takes place, which is a
positive sign. The increase of sand cover (Tables
43 and 44) indicates intensification of the ero-
sion processes on the dried bed.

Table 43.

Change in soil cover in 1990 and 2020

Soils

Hydromorphic and semi-hydromorphic

Automorphic and semi-automorphic

Desert-sandy

Sand

Desert grassland

1990

72,7

10,90

16,4

% of the total study area

2020

Changes, %

57,5

16,3

5,7

19,9

0,6

-15,1

5,4

5,7

3,5

0,6

Table 44.

Change in soil cover in 2006 and 2020

Soils

Hydromorphic and semi-hydromorphic

Automorphic and semi-automorphic

Desert-sandy

Sand

Desert grassland

% of the total study area

2020

Changes, %

57,5

16,3

5,7

19,9

0,6

1,2

-2,2

3,1

10,6

-12,7

2006

56,3

18,4

2,6

9,3

13,4

229

All examples show that the dried seabed is
an unstable ecological system that needs to be
studied. Given the dynamism of the processes
occurring on the dried seabed, continuous mon-

itoring is necessary not only to know the current
situation, but also to learn how to manage the
processes and develop a strategy for preserving
the unique laboratory of soil formation.

7.2. Measures to reduce the negative effects of the
desiccation of the Aral Sea

As indicated earlier, the drying up of the Aral
Sea has not only led to the monotonous devel-
opment of desertification in an area deprived
of water sources but has also increased salinity.
This result affected the ecosystem of lake sys-
tems, and in addition it affected the development
of agriculture (livestock and fish farming), the
health of the local population, and eco-tourism.

In practice there are three processes happen-
ing here, including the draining of the sea bot-
tom, desertification on the former sea bottom,
and anthropogenic influences. Anthropogenic
factors are both beneficial and detrimental. On
the one hand, they try to help nature preserve
the delta and overcome desertification by af-
forestation, while they also allow uncontrolled
or poorly-controlled technogenic processes to
cause damage to the protected nature.

The first phenomenon of the drying seabed
is that the territory that has emerged from
under the water cover has lost its hydromorphic
features. As its shore edge is removed and the
water table decreases, the seabed gradually ac-
quires more and more signs of aridization and
desertification. However, it is during this period,
as shown by studies of past expeditions, that
biological and microbiological processes begin
to develop on this former barren parent base,
resulting in the process of soil formation and
the creation of possible productivity (Stulina
G., Verkhovtseva N., & Gorbacheva M., 2019).
Practically in this part of the territory, there is a
competition between the growing self-protective
forces of nature aimed at productivity and the

creation of fertility, and the destructive forces
of desertification, amplified by arid climate con-
ditions. At the same time, as aeolian deflation
forms barchans and dunes, appearing as if being
a destructive factor itself, this may actually play
a positive role at the initial stage of the sea level
emergence and the drying of coastal solonchaks.
By forming a small layer of sandy cover, they will
have a positive effect on the establishment of
emerging vegetation, and especially the devel-
opment of self-overgrowth. From this moment,
there is a possibility of humankind’s positive im-
pact on nature by starting the timely processing
of coastal solonchaks with the device of sand-
filled furrows, but at the same time, not allowing
for the beginning of the formation of barchans
by using reed cage devices.

The most important role of humans is to or-
ganize the strict regulation of this new desert’s
use. The destruction of the natural equilibrium
must not be allowed, but instead the develop-
ment of two main areas of landscape stabilisa-
tion must be undertaken with the afforestation
of the desert area, while sustaining the partially
unstable area of the former delta which is under
the influence of the inflow of river water and
partial discharges from collectors.

It is crucial to maintain the constancy of grow-
ing conditions. In the process of expeditions, nu-
merous facts of saxaul dying due to hydromorphic
conditions and on the other hand the drying out
of moisture-loving vegetation in the long-term
absence of watering were observed. Here, den-
drological measures can do little. However, the

230

attention of operational agencies, by both water
and land managements to create and maintain
certain conditions is very important. This applies
equally to preventing the destruction of terrain
and forest plantations by vehicles and road con-
struction, which destroy plants that have already
taken root and disturb the stabilised terrain. The
exploration and production works of oil and gas
wells, numbering more than 50, require special
attention. Each well leads to the destruction of
the relief on at least 2-3 hectares. Although all
contracts with oil and gas production and explo-
ration stipulate mandatory conditions for relief
restoration and compensation for environmen-
tal protection measures, nevertheless the ef-
fectiveness of these actions on the part of both
executive organizations and local and environ-
mental organizations is not visible.

Based on the above principles and summaris-
ing the results of the two expeditions, it seems
advisable to focus the attention of governmental,
specialized and local bodies on the implementa-
tion of the following actions and measures:

1. The primary goal, based on the tasks set
by the Government based on the initiatives of
President Sh. Mirziyoyev, is the management of
the dried and drained seabed and the Aral Sea
cost.

To that end:

1.1 To entrust the general management of the
designated territory to the Government of
Karakalpakstan, delegating Karakalpakstan to
conduct control of permissions and monitoring
activities in this territory.

1.2 Assign responsibilities:

a. Responsibility for sustainable water supply
should be entrusted to the Ministries of Water
Resources of Uzbekistan and Karakalpakstan.
These responsibilities include the Amudarya
River delta, the complex of reservoirs fed from
the Mejdurechenskaya Reservoir, the drain-
age water protection zone and Sudochie Lake,

as well as the right bank collector, Djiltyrbas,
Kokdarya and Kazakhdarya, and all collectors
discharging water into the Aral Sea region based
on the agreement with the ‘Amudarya’ Basin
Water Association.

b. Responsibility for the development and ob-
servance of certain strict rules of protection
of the natural complex of the Aralkum Desert
should be entrusted to the State Committee of
Ecology of Uzbekistan and Karakalpakstan, de-
claring Aralkum a protected area, paying special
attention to the conservation of landscape and
plantations, and to monitor all companies’ proj-
ects that can harm nature conservation.

c. To entrust the planning and implementation
of forest plantations in strict accordance with
the zoning of the territory on the sustainability
of zonal forest plantations, care of forest plan-
tations, and phyto-control to the State Forestry
Committee of the Republic of Uzbekistan.

d. To entrust control over the development, use
and maintenance of pastures, as well as the
maintenance of wells on pasture stands, to the
Ministry of Agriculture of the Republic together
with Goskomgeologiya.

1.3 Thanks to UNDP funding, the monitoring of
the dried seabed resumed after ten years. In
combination with remote sensing, this allowed
for the coverage of 1,249,000 hectares of the
dried seabed out of 2.7 million hectares that are
inside Uzbekistan’s territory. The data of the ex-
pedition turned out to be much more productive
than the previous ones in terms of the informa-
tion collected about the changes taking place in
the surveyed area. They revealed a definite de-
crease in the percentage of the ecological risk
zone, although they found the need to increase
the volume of research in order to clarify the
attributes in 6 of the available 17 classes. GIS-
RS specialists also require expanding research.
They suggest “supplementing existing bench-
mark data with additional expeditions to cover
locations where fewer samples were taken, and

231

to be able to classify all 17-source land cover
classes by targeting the north-east, north and
north-west parts of the study area to achieve
spatially balanced samples.” This will provide a
complete picture of the dried seabed on the ter-
ritory of Uzbekistan and give a working tool to all
organizations responsible for the management
of the territory. This will also allow for a unified
cartographic basis for their work in comparison
with the dynamics of ten years ago. In the fu-
ture, it is recommended to conduct one ground
expedition per year, selecting the terrain where
remote measurements will detect the maximum
changes.

2. It is proposed to use the developed method-
ology of combined remote sensing observations
to address other relevant stages of the territory
management cycle of afforestation of the Aral
Sea’s dried seabed:

a. To map the environmental and meteorologi-
cal conditions that determine the suitability of
land for afforestation (land suitability). This step
determines where environmental conditions are
favourable for afforestation.

b. To monitor the development of existing or new
afforestation areas. The developed methodology
uses combinations of other open satellite data,
such as Sentinel and very high- resolution sat-
ellite data, in addition to Landsat. This step will
provide information on the status of the already
conducted afforestation.

3. It is proposed to make an inventory of all
available water wells with their division into
those suitable for pasture water supply, and
separately, those with hot water for balneologi-
cal purposes. Organize the arrangement of wells
and their target use for certain needs based on
this data.

4. In order to create a guaranteed water supply
to the delta and maintain the hydromorphic
component of sustainable development of the
dried seabed, switch the discharge of collec-
tor-drainage water of the Khorezm Oasis from

the Daryalyk collector to the Amudarya River
delta.

5. In order to prevent the unauthorised construc-
tion of local roads, it is necessary to develop and
approve a plan for the construction of blacktop
roads in the Aral Sea region and on the dried
seabed, to stabilise the routes of traffic in the
area based on the identifying of the most visited
places.

6. In the territory under consideration, there are
a large number of dilapidated and abandoned
buildings and premises previously operated by
forest farmers, anglers, pasture farms and sci-
entific stations. It is necessary to instruct the
local authorities of the Muynak, Karauzyak,
Kungrad and Takhtakupyr districts to conduct
an inventory of these buildings, together with
the Government of Karakalpakstan, and to de-
termine their intended use. Practical solutions
could be for the organization of tourist routes,
and where there are working wells nearby, for
shepherds or the development of health centres.

7. According to the recommendations of the bot-
anist of the expedition, it is advisable to orga-
nize the collection and processing of medicinal
plants, which are rich in the flora of the Aralkum
Desert. It is necessary to entrust the Ministry of
Health of Uzbekistan and Uzpharmprom to or-
ganize a factory of medicinal plants in Muynak.

8. Special attention should be given to the
study of self-overgrowing processes. During the
past expeditions, it was found that the area of
self-overgrowing covered 200,000 hectares and
a little less than the preserved artificial plan-
tations were registered. Now the area of new
self-overgrown plantations is again 160,000 hect-
ares, since the last expeditions of less than ten
years ago). The results of determining the risk
classes of ecological assessment, given below,
at the same time caught the above-mentioned
value of self-overgrowing and gave an opportu-
nity to compare it with the indicators of remote
measurements.

232

Assessment of the dried seabed for 2019-2020

№ expedition

Risk class

Degree of environmental risk

Area, %

I

Total

Self-overgrowth

II

Total

Self-overgrowth

I

II

III

IV

I

II

III

IV

N/A

Low

Medium

High

N/A

Low

Medium

High

16,9

30,2

30,3

22,4

16,6

25,2

30,7

34,0

9,42

10.7

Table 45.

Thousand
ha

110,36

192,29

197,95

146,33

653,285

96,6

150,33

183,14

202,83

56,20

596,55

64,3

Fig. 135. Points of the 2019 expedition:
Т. 619-620

Fig. 136. Points of the 2020 expedition:
Т. 207-211

Description of
location: Haloxylon aphyllum
Iljin. (black Saxaul, previously planted by French
company), abundance characteristic - scattered
(Sp) with 25-35 percent coverage, damaged by
locusts (photo of 2 October 2019 where dead locusts
under saxaul can be seen)

saxual,

Description of location: Haloxylon aphyllum Iljin.
(black
self-overgrowing), abundance
characteristic - scattered (Sr) with coverage of 15-
25 percent, damaged by powdery mildew (photo of
4 June 2020 where dried branches of 4–5-year-old
Saxaul are visible)

233

9. It is necessary to strengthen work on plant
protection (use of pesticides/biopesticides)
against pests, insects, and diseases (such as
locusts and powdery mildew). Currently, the
Government of Uzbekistan pays special atten-
tion to the afforestation of the dried bed of the
Aral Sea by bringing the forest area to 1.2 mil-
lion hectares. However, the expeditions we
conducted in 2019-2020 show that locusts and
powdery mildew damage the old self-overgrown
saxauls that exist.

10. One of the measures to mitigate the negative
impact of the environmental crisis in the Aral
Sea region is to maintain the system of natural
water bodies in the Aral Sea water area, as indi-
cated in the Strategy for the Transition to a Green
Economy for the 2019-2030 Period. Phase II of
the project ‘Creation of small local water bodies
in the Amudarya River delta is being implement-
ed. This requires continuous systematic mon-
itoring of phenomena and processes occurring
in the territory of local water bodies of the Aral
Sea, the results of which will justify management
decisions to ensure environmental security and
socio-economic stability of the region.

11. Our work on monitoring the drained seabed
in 2005-2011 and 2019-2020 with the participa-
tion of the International Innovation Center of the
Aral Sea Region (IICAS) under the President of
the Republic of Uzbekistan, allows for the imme-
diate construction of a Geographic Information
System (GIS). The GIS will be based on available
materials of a 1.2 million hectare area, and will
be completed after another three expeditions on
the remaining 1.5 million hectares. The proposed
system could become a reliable instrument of
the IICP and serve as the basis and guide for any
events and innovations that will be held in this
region under the orchestration of the IICP.

This system should include following GIS

layers:
 Population, residential areas, and townships
with indicators of demographics, welfare and
economic dynamics;

 Roads, power lines and communications;
 Past and current sector activities with re-

flection of distribution zones (including fish
farming, irrigation, muskrat breeding, grazing,
growing medicinal plants and the extraction
of medicinal crustaceans, and mining);

 Geomorphology;
 Soil layers and the formation of the

soil-forming process;

 Landscapes in their dynamics in conjunction
with the retreat and hesitation of the sea,
results of remote monitoring of water bodies
and wetlands carried out by SIC ICWC, risk
maps and aeolian or salt degradation;

 Botany and afforestation;
 Hydrogeological reports with indicators of

clusters and rows of wells, their operational
indicators, and levels of ground and under-
ground waters.

Using this system, IICP will be able to perform
a recommendatory role, and coordinate devel-
oping innovations in the Aral Sea region, for both
pre-existing industries (fish farming, muskrat
breeding, animal husbandry, mining, production
of local building materials) and new industries
(greenhouses, medicinal plants, balneological
treatment, and others). It will not only be pos-
sible to organize training for local residents, but
also for those from beyond who will be interest-
ed in participating in this innovation process. It
is recommended that development attract large
investors and profit-making organizations, rath-
er than small start-up projects (although their
contribution is not excluded).

234

8 Conclusions

1. Thanks to the funding of two expeditions
for the monitoring of the dried seabed in 2019-
2020, it became possible to resume, after almost
a decade’s break, the work in observing and
collecting data on landscape, soil, vegetation,
ground and surface water conditions in the area
covering about 40 percent of the dried seabed
on the Uzbek site of the former seabed, partic-
ularly 1,200,000 hectares of its south-west and
south-east parts.

2. Two complex expeditions were organized
by SIC ICWC with the involvement of special-
ists from the International Innovation Center of
the Aral Sea Region under the President of the
Republic of Uzbekistan. In addition, the expedi-
tions were joined by scientists from the Institute
of Organic Chemistry and the permanent expe-
dition of Uzhydroingeo in Karakalpakstan, with
the participation of remote sensing specialists
from the German company Map Tailor. All this
allowed for a comprehensive assessment of the
territory from geomorphological, hydrogeolog-
ical, landscape, soil, ecological, dendrological
and botanical points of view, as well as a com-
parison with the results of the previous expedi-
tions in 2006-2010.

3. The systematic approach to the assess-
ment of the observed phenomena and chang-
es allowed us to characterise the dual process
of transformation of the dried seabed and the
emerging ecological situation, as presented in
Chapter 7.2., and to determine the need to or-

ganize a strict regulation of the system of use of
this new desert. At the same time, the require-
ments of this regulation are formulated not to
allow the destruction of the natural equilibri-
um, but to help in the development of two main
areas of landscape stabilisation, notably affor-
estation of the dry cost and in parallel, ensuring
the sustainability in the partially unstable area
of the former delta, which is under the influence
of the inflow of river water and to some extent
collector discharges. For this purpose, it is pro-
posed to create a system of management of the
dried and drained seabed and the Aral Sea re-
gion, assigning responsibility for individual ele-
ments of management to relevant organizations
of Uzbekistan and Karakalpakstan.

4. Considering that the total area of dried
seabed on the territory of the republic is al-
most 3 million hectares, it is urgently necessary,
starting from the spring of 2021, to organize a
similar comprehensive ground and remote sens-
ing study of the remaining area with the spec-
ification of indicators of some six classes that
are difficult to determine from space. For 2022
it could be organized to complete the mapping
of the entire territory for the development and
management of the dried seabed. The primary
task is to identify risk zones and a programme of
protective forest plantations to prevent the ex-
pansion of risk zone. In future works, it is neces-
sary to pay attention to the development of rec-
ommendations on the use of all available wells

235

for water supply, balneology and pastoralism,
and the development of desert tourism through
the reconstruction and repair of existing dilapi-
dated buildings.

troduce this practice into mandatory activities of
the International Innovation Center of the Aral
Sea Region under the President of the Republic
of Uzbekistan.

5. It is necessary to organize permanent mon-
itoring of the indicators of sustainability of the
Aralkum Desert and the Aral Sea region natural
complex, through year-round space observa-
tions (including the use of drones to survey the
Aralkum Desert’s inaccessible places), and the
conducting of surveys of ecologically unstable
zones at least once a year. It is necessary to in-

6. This study developed a methodology based
on Earth Observation (EO) satellite from space to
map and quantify land cover conditions in dif-
ferent years. The proposed method is innovative
in that it improves existing mapping strategies
in the Aralkum Desert by using machine learning
algorithms and multi-temporal satellite data as
inputs.

236

References

1 ch.

1 Kuznetsov N.T., Gorodetskaya M.E., Gerasimov I.P. (1980). Current Problems of Research

on the Aral Sea Problems, Izvestia of the USSR Academy of Sciences, Geographic Series, 5.

2 Gorodetskaya M.E., Kes A.I. (1986). Topography of the Aral Sea borderlands in the light
of economic development perspectives. Problems of Desert Development, Academy of
Sciences of Turkmenistan, No. 3.

3 Kurochkina L.Y., Kuznetsov N.T. (1986). Ecological aspects of anthropogenic desertification

in the Aral Sea region. Problems of Desert Development, No. 5.

4 Zaletaev V.S., Novikova N.M., Kuksa V.I. (1992). Some ecological aspects of the Aral

problem. Water resources, 18.5.

5 Bortnik V.N. Kuksa V.I., Tsitsyarin A.G. (1992). Status, possible future of the Aral Sea. Post-

Soviet Geography, 33.5

6 Rafikov A.A., Tetyukhin G.F. “Decreases in the level of the Aral Sea and changes in natural

conditions of the Amudarya lower reaches”, 1981.

7 The condition of the soil cover of the Aral region in connection with the drainage of the

Aral Sea. Prof. D.S. Sattarov. Sattarov D.S., Sektimenko V.E., Popov V.G., 1993.

8 Kabulov S.K. Changes in desert phytocenosis under aridization (the Aral Sea region case).

“FAN”, Tashkent. 1990.

9 Assessment of socio-economic consequences of ecological disaster - drying up of the

Aral Sea. (2001), (2004), SIC ICWC brochure.

10 V.A. Dukhovny, P. Navratil, I. Ruziev, G. Stulina, Ye. Roschenko “Comprehensive remote

sensing and ground-based studies of the dried Aral Sea bed” Tashkent, 2008.

2.3

11 Climate Variability in Central Asia / Edited by Muminov F.A., Nagamova S.I. - Tashkent:

Glavgidromet of Uzbekistan, 1995. - 216 с.

12 Spectorman T.Yu. Dynamics of aridity indicators of the territory of Uzbekistan in
connection with climate change. / Information on Uzbekistan’s fulfilment of its
obligations under UNFCCC. Bulletin N 5. - Tashkent: SANIGMI, 2002. pp. 57-64.

13 Spectorman T.Y., Nikulina S.P. Climate monitoring, assessment of climate changes on the
territory of the Republic of Uzbekistan. / Information on implementation by Uzbekistan
of its commitments under UN FCCC. Bulletin N 5. - Bulletin N 5. Tashkent: SANIGMI, 2002.
pp. 17-25.

14 Sensitivity studies with the regional climate model REMO, D. Jacob & R. Podzun

Meteorology and Atmospheric Physics volume 63, pp. 119-129 (1997).

237

2.6.

15 Rubanov I.V. Lake-soil salt accumulation in Uzbekistan (continental halogenesis).

Tashkent, Publishing House “FAN”, USSR, 1977.

16 Chalov P.I. Dating by nonequilibrium uranium. Frunze, Publishing House “Ilim”, 1968.

17 Weinsberg I.G., Ulst V.G., Roze V.K. On ancient shorelines and fluctuations of the Aral Sea.

Vopros Chetv. Geol.VI, Riga, Publishing house “Zinate”, 1972.

18 Brodskaya N.G. Bottom sediments and sedimentation processes in the Aral Sea.

Proceedings of the Institute of Geological Sciences of the USSR Academy of Sciences, vol.
115, Geology Series, 1952.

19 Sektemenko V.E., Tairov T.M., Naumov A.N. Soil cover and soil conservation measures in

the zone of the dried bottom of the Aral Sea. Tashkent: Fan. - 1991. 15с.

20 G. Stulina, V. Sektimenko “The Chance in soil cover on the exposed bed of Aral Sea”,

ELSEVIER, 47, 2004, pp. 121-125.

4.2

21 Klimentov P.P. et al. “Methodology of Hydrogeological Investigations”, Vysshaya Shkola,

Moscow 1978, pp. 408.

5.1

22 Lo C.P., Yeung A.K., 2004. Concepts and Techniques of Geographic Information Systems.
Published by Prentice Hall of India, P. Limit, 110001 New Delhi, ISBN: 81-203-2230-4, pp.
492.

23 Campbell J.B., 1996. Introduction to Remote Sensing. 2nd Edition, The Guilford Press, New

York, ISBN-13: 978-1572300415, pp. 622.

24 Kozoderov V.V., Kondranin T.V., 2008. Methods of estimation of soil-vegetation condition

from the data of optical systems of remote aerospace sensing. MIPT Publishing House,
Moscow, pp. 222.

25 Lopez R.D., Frohn R.C., 2017. Remote Sensing for Landscape Ecology: New Metric

Indicators. 2nd Edition, CRS Press, ISBN: 9781351648752, pp. 269.

5.2

26 Congalton, R.G., 1991. A review of assessing the accuracy of classifications of remotely

sensed data. Remote Sens. Environ. 37, pp. 35-46.

27 Stupin V. P., 2011. Analysis of opportunities of using the Google Earth data for monitoring

the dynamics of morphosystems of the zone of influence of the Angara cascade of
reservoirs. Vestnik ISTU №8 (55), pp. 46-54.

28 EROS, 2015. Landsat 8 (L8) data user’s handbook. LSDS-1574, Version 1.0. Earth Resources

Observation and Science (EROS) Center in Sioux Falls, Greenbelt, Maryland, pp. 98.

5.5

29 Theiler J., Gisler G., 1997. A contiguity-enhanced k-means clustering algorithm for
unsupervised multispectral image segmentation. Proc SPIE 3159, pp. 108-118.

238

30 Forgy E., 1965. Cluster analysis of multivariate data: efficiency vs. interpretability of

classifications. Biometrics 21: pp. 768.

31 Rubin J., 1967. Optimal classification into groups: An approach for solving the taxonomy

problem. J. Theoretical Biology 15, pp. 103-144.

32 Rouse J.W., Haas R.H., Schell J.A., Deering D.W., 1973. Monitoring vegetation systems in the
great plains with ERTS. In: Third ERTS Symposium, NASA SP-351, vol. 1, NASA, Washington,
DC, pp. 309-317.

33 Immitzer et al., 2016. First Experience with Sentinel-2 Data for Crop and Tree Species

Classifications in Central Europe. Remote Sens. 2016, 8, pp. 166.

34 Jensen J.R., 2004. Remote Sensing of the Environment: An Earth Resource Perspective.
2nd Edition, Published by Pearson Education, Indian Reprint, 110092 Delhi, ISBN: 81-
7808-823-1, pp. 544.

35 SIC ICWC., 2008. Complex remote sensing and ground surveys of the dried bed of the Aral

Sea, ed. by Prof. V.A. Dukhovny. Tashkent, ISBN: 9965-32-616-9, pp. 190.

6.3

36 Akjigitova N.I. Halophilic vegetation of Central Asia and its indicative properties.

Tashkent: Fan, 1982. 192 с.

37 Bykov B.A. Geobotany. - Alma-Ata: Nauka, 1953. - С. 5-29.

38 Bykov B.A. Geobotany. The third edition. - Alma-Ata: Nauka, 1978. - С. 3-21.

39 Lavrenko E.M. Main regularities of plant communities and ways of their study / Field

geobotany. - Moscow - L.: Publishing House of Academy of Sciences of USSR, 1959. -
VOL.I. - pp. 13-70.

40 Yaroshenko P.D. Geobotany. - M.-L.: Publishing House of the Academy of Sciences of the

USSR, 1961. - 476 с.

41 Nitsenko A.A. Plant association and plant community as primary objects of geobotanical

research. - Leningrad: Nauka, 1971. - 184 с.

42 Shelyag-Sosonko Y.R., Krisachenko V.S., Movchan Y.I. Methodology of geobotany. - Kyiv:

Naukova Dumka, 1991. - 272 с.

43 Vegetation of Uzbekistan and the ways of its rational exploitation. - Tashkent: Fan, 1972. -

Volume II. - pp. 404.

44 Zakirov K.Z., Zakirov P.K. Experience of vegetation typology of the globe by example of

Central Asia. - Toshkent: Fan, 1978. - 56 с.

45 Drude P. Handbuch der Pflanzengeographie. - Stuttgart. 1907. – pp. 10.

6.5

46 Koksharova N.E. et al. On forest reclamation of the dried bottom of the Aral Sea.

Problems of Desert Development, No. 5, 1985.

47 Kabulov S.K. Changes in desert phytocenosis under aridization conditions (the Aral Sea

region case) // Tashkent, 1990.

239

6.7

48 Baig, M.H.A., Zhang, L., Shuai, T., Tong, Q., 2014. Derivation of a tasselled cap

transformation based on Landsat 8 at-satellite reflectance. Remote Sens. Lett. 5, pp.
423–431. https://doi.org/10.1080/2150704X.2014.915434.

49 Breckle, S.W., Wucherer, W., Dimeyeva, L.A., Ogar, N.P., 2012. Aralkum - A Man-Made

Desert: The Desiccated Floor of the Aral Sea (Central Asia), Ecological Studies 218. Berlin,
Heidelberg. https://doi.org/DOI 10.1007/978-3-642-21117-1_6.

50 Breiman, L., 2001. Random forests. Mach. Learn. 45, pp. 5–32.

51 Bullock, E.L., Woodcock, C.E., Olofsson, P., 2020. Monitoring tropical forest degradation

using spectral unmixing and Landsat time series analysis. Remote Sens. Environ. 238, pp.
0–1. https://doi.org/10.1016/j.rse.2018.11.011.

52 Chawla, N. V., Bowyer, K.W., Hall, L.O., Kegelmeyer, W.P., 2002. SMOTE: Synthetic minority
over-sampling technique. J. Artif. Intell. Res. 16, pp. 321–357. https://doi.org/10.1613/
jair.953.

53 Ongalton, R.G., 1991. A review of assessing the accuracy of classifications of remotely

sensed data. Remote Sens. Environ. 37, pp. 35–46.

54 Crist, E.P., Cicone, R.C., 1984. A Physically-Based Transformation of Thematic Mapper Data
– The TM Tasselled Cap. IEEE Trans. Geosci. Remote Sens. 22, pp. 256–263. https://doi.
org/10.1109/TGRS.1984.350619.

55 Dennison, P.E., Roberts, D.A., 2003. Endmember selection for multiple endmember
spectral mixture analysis using endmember average RMSE. Remote Sens. Environ.
https://doi.org/10.1016/S0034-4257(03)00135-4.

56 Dukhovny , V.A., Navratil, P., Ruziev, I., Stulina, G., Roschenko, Y., 2008. Comprehensive

remote sensing and ground-based studies of the dried Aral Sea bed. Scientific-
Information Center ICWC, Tashkent.

57 FAO, 2015. Cost-Effectiveness of Remote Sensing for Agricultural Statistics in Developing

and Emerging Economies - Technical Report Series GO-09-2015.

58 Foody, G.M., 2002. Status of land cover classification accuracy assessment. Remote Sens.

Environ. 80, 185–201. https://doi.org/10.1016/S0034-4257(01)00295-4.

59 Gallego, J.F., Craig, M., Michaelsen, J., Bossyns, B., Fritz, S., 2008. Best practices for crop
area estimation with remote sensing, Ispra: Joint Research Center. Ispra. https://doi.
org/10.2788/31835.

60 Griffiths, P., Nendel, C., Hostert, P., 2019. Intra-annual reflectance composites from

Sentinel-2 and Landsat for national-scale crop and land cover mapping. Remote Sens.
Environ. 220, 135–151. https://doi.org/10.1016/j.rse.2018.10.031.

61 Kauth, R.J., Thomas, G.S., 1976. The Tasselled Cap -- A Graphic Description of the Spectral-
Temporal Development of Agricultural Crops as Seen by LANDSAT, in: Proceedings of
Symposium on Machine Processing of Remotely Sensed Data. Purdue University, West
Layette, pp. 4B41-4B51.

240

62 Létolle, R., Micklin, P., Aladin, N., Plotnikov, I., 2007. Uzboy and the Aral regressions:

A hydrological approach. Quat. Int. 173, 125–136. https://doi.org/10.1016/j.
quaint.2007.03.003.

63 Löw, F., Navratil, P., Kotte, K., Schöler, H.F., Bubenzer, O., 2013. Remote-sensing-based

analysis of landscape change in the desiccated seabed of the Aral Sea - A potential tool
for assessing the hazard degree of dust and salt storms. Environ. Monit. Assess. 185.
https://doi.org/10.1007/s10661-013-3174-7.

64 Micklin, P., 2010. The past, present, and future Aral Sea. Lakes Reserv. Res. Manag. 15,

193–213. https://doi.org/10.1111/j.1440-1770.2010.00437.x.

65 Rouse, J.W., Haas, R.H., Schell, J.A., Deering, D.W., 1974. Monitoring vegetation systems in

the Great Plains with ERTS, in: Freden, S.C., Mercanti, E.P., Becker, M.A. (Eds.), Proceedings
of the Earth Resources Technology Satellite Symposium NASA SP-351. NASA, Washington,
DC, pp. 309−317.

66 Zhu, Z., Woodcock, C.E., 2012. Object-based cloud and cloud shadow detection in Landsat
imagery. Remote Sens. Environ. 118, pp. 83–94. https://doi.org/10.1016/j.rse.2011.10.028.

67 Stulina G., Verkhovtseva N., Gorbacheva M. (2019). Composition of the Microorganism
Community Found in the Soil Cover on the Dried Seabed of the Aral Sea. Journal of
Geoscience and Environment Protection, 7, pp. 1-23.

241

The joint UNDP and UNESCO Programme on “Addressing the urgent human insecurities
in the Aral Sea region through promoting sustainable rural development”
is funded by the UN Multi-Partner Human Security Trust Fund
for the Aral Sea region (MPHSTF) in Uzbekistan.

UNDP’s assistance to Uzbekistan seeks to achieve common interrelated objectives, including
supporting the Government in accelerating reforms in the field of sustainable economic
development, good governance, adaptation to climate change and environmental protection.

This publication was prepared as part of the joint UNDP and UNESCO Programme on “Addressing
the urgent human insecurities in the Aral Sea region through promoting sustainable rural
development”.

The views and conclusions expressed in this publication are those of the authors and do not
necessarily reflect the views of the United Nations and its agencies, including the UNDP, or UN
member states.

© United Nations Development Programme, 2020.

Uzbekistan, 100029, Tashkent, T. Shevchenko Street, 4
Tel.: (99878) 1203450
Fax: (99878) 1203485
Website: www.uz.undp.org


