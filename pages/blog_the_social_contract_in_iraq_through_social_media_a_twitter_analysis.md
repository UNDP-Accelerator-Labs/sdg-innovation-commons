# The Social Contract in Iraq Through Social Media: A Twitter Analysis

[[type:publications]]

[[source:https://www.undp.org/iraq/publications/social-contract-iraq-through-social-media-twitter-analysis]]

[Original article published here](https://www.undp.org/iraq/publications/social-contract-iraq-through-social-media-twitter-analysis)


[[year:2022]]

[[date:JUNE 1, 2022]]

[[continent:Asia]]

[[country:Iraq]]



The Social Contract
in Iraq through Social
Media: A Twitter
Analysis

May 2022

TABLE OF CONTENTS

Foreword

Acknowledgements

executive summAry

1. methodology

1.1. Conceptual framework

1.1.1. Core grievances

1.1.2. Future outlook

1.1.3. Key groups and disaggregation

1.2. The technical design of Iraq’s Twitter data listening tool

1.2.1. Taxonomy preparation

1.2.2. Data cleaning, data pipeline preparation and collection

1.3. Data privacy and protection concerns and methodological limitations

2. context oF irAq

2.1 The scope of social media use in Iraq: trends and highlights

2.2 Snapshot of the Iraqi Twittersphere since 2018

3. key Findings oF the Big dAtA AnAlysis

3.1 Key topics and temporal trends

3.2 Core grievances: key priorities and temporal trends

3.2.1 Security

3.2.2 Corruption

3.2.3 Services

3.2.4 The economy

3.2.5 Governance

3.3 Core grievances on Iraqi Twitter across groups

3.3.1 Do Iraqi women and men hold different priorities for the social contract?

3.3.2 Do Iraqi women and men have similar views on the future?

4

5

6

8

8

8

8

8

9

9

9

10

12

12

13

14

14

16

16

18

19

20

21

23

23

26

3.3.3 Do the Arabic- and Kurdish-speaking Iraqi communities converge on priorities
for the social contract?

28

3.3.4 Core grievances in youth-related content

4. conclusions: key sociAl contrAct priorities

reFerences

endnotes

Page 2

32

34

35

39

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

FIGURES AND TABLES

Figure 1: The use of social media platforms to engage on political issues

Figure 2: Demographics of Twitter users, January 2018 to June 2021

Figure 3: Frequency and percentage of core grievances across 3,414,430 tweets

Figure 4: Temporal trends in expressing core grievances

Figure 5: Temporal trends in sentiment/perceptions around the future of Iraq

Figure 6: Temporal trends in security-related content

12

13

14

15

16

16

Figure 7: Temporal trends in security-related content, December 2019 to January 2020 17

Figure 8: Temporal trends in security-related content, March 2020

Figure 9: Temporal trends in security-related content, May to June 2020

Figure 10: Temporal trends in corruption-related content

Figure 11: Temporal trends in services-related content

Figure 12: Temporal trends in economy-related content

Figure 13: Temporal trends in governance-related content

Figure 14: Temporal trends in content on legitimacy and trust

Figure 15: Temporal trends in content on legitimacy and trust, October to November
2020

17

18

19

19

21

21

22

23

Figure 16: Breakdown in the volume of content on core grievances by sex, percentage 23

Figure 17: Breakdown of content on core grievances by sex, percentage

Figure 18: Temporal trends in core grievances by sex

Figure 19: Sentiment/perception of the future by sex, percentage

Figure 20: Temporal trends in sentiment/perception by sex

Figure 21: Variables shaping outlook by sex, percentage

Figure 22: Breakdown of content produced per core grievances across language
groups, percentage

Figure 23: Breakdown of core grievance dimensions by language group, percentage

24

26

28

28

29

30

31

Figure 24: Frequency and percentage of core grievances among 53,081 youth-related
tweets

33

Table 1: Frequency and shares of tweets with a future outlook

15

Page 3

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

FOREWORD

This study is part of an attempt to better understand the Iraqi people and their ambitions for the social
contract. Recognizing the importance of social media networks in voicing preferences and opinions, it
sought to capture how these platforms, especially Twitter, could reveal trends that might contribute to
reimagining the social contract. Analysis of over 76 million tweets, an exercise that became the largest
United Nations artificial intelligence study to date, yielded findings presented on the following pages.

This research adds to ongoing conversations on the future of Iraq aimed at catalysing further reflections
on realizing a stronger, more equitable social contract. This study is part of overall analysis of the social
contract in 2021.

Page 4

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
ACKNOWLEDGEMENTS

The United Nations Development Progamme (UNDP) would like to thank Barbara-Anne Krijgsman as
the lead coordinator for research on the social contract. Farah Choucair led the conceptualization and
design of big data modelling to generate insights on the perceptions of Iraqis using Twitter. She co-
authored this paper, along with Vivienne Badaan, who served as the principal data investigator and
main author, Bahia Halawi as the big data scientist and Kamaran Palani as the researcher on Kurdish
affairs.

Special thanks go to UN Global Pulse, which provided continuous support to ensure access to Twitter
data per agreed rules and regulations, to the Stockholm International Peace Research Institute (SIPRI)
team and to all those who participated in the conceptualization of the research framework. Great
appreciation also goes to the wider UNDP Iraq team for its support in producing this document.

UNDP is the leading United Nations organization fighting to end the injustice of poverty, inequality
and climate change. Working with our broad network of experts and partners in 170 countries, we help
nations to build integrated, lasting solutions for people and planet.

Learn more at undp.org or follow @UNDP.

Page 5

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

EXECUTIVE SUMMARY

In 2021, the United Nations Development Programme (UNDP) in Iraq and the Stockholm International
Peace Research Institute (SIPRI) launched the project ‘Reimagining a New Social Contract in Iraq’. It
sought to explore how Iraqis envision the social contract and to propose policy recommendations for
bridging the gap between the current social contract and desires for a better future. To capture the
diverse perceptions of all groups and communities making up Iraq’s rich social fabric, this process used
a multisource and multimethod framework of data collection and analysis. The exercise included desk-
based research of literature in Arabic and English, primary quantitative and qualitative data from 36
focus group discussions between April and June 2021, social media surveys rolled out in June and July
2021, and big data analysis of 76.8 million tweets from Twitter users in Iraq from January 2018 to June
2021. By June 2021, the number of active Twitter users had reached 882,556.

The analysis and findings in this paper are the outcome of mining the full data set of Twitter users,
tracking the volume of content around core grievances and listening to conversations related to these
grievances and perceptions of the future. Considering that Twitter data mining captures the views of no
more than 2 percent of the population and 3.6 percent of the connected population, it is important to
interpret the findings in a conservative manner. This must consider that Twitter is usually preferred by
elites, reflecting the views of those who are connected and socially empowered to express themselves
on social media. Even so, the findings are highly relevant to reimagining the social contract in Iraq, given
that elites often influence the perceptions of the rest of the population. More importantly, Twitter data
allow us to observe real-time trends.

In total, 3,495,058 tweets discussed core grievances—3,229,105 in Arabic, 52,216 in the Kurdish
language and 129,109 in other languages, mainly English. Of all the content produced on core
grievances, 48 percent was about security-related concerns, 20 percent about governance, 16
percent about corruption, 14 percent about services and 2 percent about the economy. Analysis
showed that when cross-referencing grievances, 19.6 percent of security-related tweets, 16.2 percent of
governance-related tweets, 15.3 percent of tweets on corruption and 8.3 percent of tweets on services
also addressed the economy. This indicates that the economy is a major concern but discussion on it
tends to shift towards factors obstructing it. When tweeting about the economy, Iraqi Twitter users were
mainly concerned with unemployment and job security (53 percent of total tweets on the economy),
state resources and oil revenues (18 percent) and networks of patronage (17 percent).

The October 2019 protests catalysed citizens to tweet about security and corruption and critique the
status quo. When tweeting about security, Iraqis seemed concerned with the Islamic State (31 percent),
violence and crime (22 percent), and militias, including paramilitary groups (19 percent). Iraqis were
least likely to tweet about trust (7 percent), security sector reform (6 percent) and domestic violence (2
percent). Despite a few peaks in content on corruption prior to the demonstrations, content around all
facets of corruption reached its highest volume after October 2019. When tweeting about corruption,
Iraqis mainly dwelled on the economic cost (49 percent) and the need to advance accountability and
transparency (41 percent).

The COVID-19 pandemic has clearly shifted priorities. When tweeting about services, Twitter users
primarily related concerns around COVID-19 (88 percent), followed by the costs of services (7 percent)
and electricity (5 percent). The most prominent peak in the volume of tweets related to services occurred
in September 2020, when a record increase in COVID-19 cases tipped Iraq’s total over 250,000. In the

Page 6

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

pre-COVID 19 period, Iraqis were mainly preoccupied with the high costs of services, especially for
electricity and health.

Tweets by women and men seemed to converge on a general set of core grievances but with
divergent priorities that are important to consider in reimagining the social contract. Whereas men
and women were aligned on most security and economy-related issues, when tweeting about corruption,
women were more likely to discuss the economic cost along with accountability and transparency. Men
tweeted more about corruption in the justice system, the link to sectarianism and the pervasiveness
of corruption. With services, women were more likely than men to discuss the cost. Finally, in terms of
governance, women vocalized concerns about political fragmentation and ethnocentric divisions more
than men, who tweeted more about legitimacy and distrust in the Government.

Arabic-speaking and Kurdish-speaking Twitter users both emphasized security as the main
grievance, yet this was more pronounced among the latter. Security was the most prevalent core
grievance in youth-related content, with 56 percent touching on security-related concerns, 16 percent
on governance, 13 percent on corruption, 9 percent on services and 6 percent on the economy.

One of the most important findings was that Iraqi Twitter users were much more likely to tweet
about core grievances shaping the present than the future. Twitter users may be so preoccupied
with present concerns that they cannot think about the future. In total, only 21,425 tweets expressed a
future outlook, with 55 percent discussing factors shaping the future, 40 percent expressing positive
or negative sentiments and only 5 percent demonstrating a willingness to take action to influence the
future.

Page 7

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
1. METHODOLOGY

1.1. Conceptual framework

The big data listening tool used to develop this study was based on a conceptual framework devised
by SIPRI, based on in-depth analysis of core grievances and dynamics around the social contract in Iraq.
The framework is outlined below.

1.1.1. Core grievances

SIPRI identified five broad categories of core grievances related to the social contract in Iraq, namely:
security, encompassing physical security, representation of various population groups in the security
apparatus1 and perceptions of which aspects of security the State most urgently needs to address;
corruption or the privileged allocation of resources, positions and opportunities as well as illicit activities
by political elites and their networks for exclusive group gains; the State’s provision of essential services
such as electricity, water and sanitation, and health care; the economy, with a particular focus on the
availability of employment for all segments of society; and governance or the population’s feeling of
being rightfully represented within the political system, and perspectives on whether or not the system
is fit for purpose.

Each core grievance was subdivided into a set of topics providing more nuance to better capture the
specificities of how Iraqi citizens communicate their priorities and concerns on social media. The details
are in Annex 1.

1.1.2. Future outlook

The main goal of the study was to investigate how Iraqis reimagine the social contract and their priorities
and concerns. Big data provided insights on how active Twitter users in Iraq perceive the future of their
country, and their future as individuals and members of different communities. Three key subdimensions
were examined: perceptions and sentiment, the willingness to take action and variables shaping outlook.

For perceptions and sentiment, the focus was on whether Twitter users, when discussing the future
of Iraq, are hopeful, positive and optimistic, or hopeless, negative and pessimistic. Examining the
willingness to take action looked at language indicating the propensity of users to be active agents
and participants in social change. Variables that shape future outlook were reviewed with a focus
on expectations related to leadership or awaiting a leader, collective action and popular movements,
external pressure and/or foreign intervention or divine intervention.

1.1.3. Key groups and disaggregation

Considering the complexity and richness of the Iraqi social fabric, it was important to analyse whether
various social groups converge or diverge around key priorities for a reimagined social contract. Various
limitations under the current legal agreement between UN Global Pulse 2 and Twitter, however, meant it
was only possible to disaggregate data based on the following group criteria:

• Women and men: A username-based approach was applied to identify the sex of users and look
at similarities and differences in core grievances and future outlook between women and men.

Page 8

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

A substantive number of users remained genderless either due to the inability to label them or
because accounts were associated with institutions, corporations, etc.

• Arabic- and Kurdish-speaking populations: As the Kurdish-speaking population is an important
group in Iraq, the language of tweets was used as a proxy to compare Arabic- and Kurdish-speaking
populations.

• Youth: Iraq is a very young country with nearly half the population under age 19. With young people
driving recent popular protests, studying the social contract must therefore consider their views.
Data from Twitter do not provide metadata on user age given privacy-related limitations so the
study used youth-focused content as a proxy.

1.2. The technical design of Iraq’s Twitter data listening tool

Designing a Twitter data listening tool involved three steps: taxonomy preparation based on the
conceptual framework, data cleaning, and data pipeline preparation and collection. These steps are
outlined below.

1.2.1. Taxonomy preparation

To collect data relevant to the conceptual framework, a taxonomy was built with key terms and phrases
in formal Arabic, Iraqi dialects and Kurdish. It reflected each core grievance and subdimensions of these
as well as subdimensions of a future outlook. The taxonomy was based on three rounds of building
keywords. The first round developed a dictionary of the most frequent keywords in tweets. The second
round reviewed inputs from questionnaires completed by UNDP Arabic and Kurdish speakers to
identify specific words and phrases used by Iraqis in general in expressing their opinions, emotions or
perceptions around various issues. Twenty-six questionnaires were returned, which aided in developing
context- and language-specific dictionaries that guided the listening tool.

The third round aggregated responses by core grievances and their subdimensions that were tested on
Twitter. Words and phrases that yielded hits were retained. Ones that were too personal and not general
enough to yield any results were discarded. Following that, a list of keywords and their synonyms was
generated and tested on Twitter, with those that yielded hits retained. This list was then translated and
the Kurdish language and again tested on Twitter. Finally, the Arabic and Kurdish lists were used as the
basis for data collection (see Annex Compendium).

1.2.2. Data cleaning, data pipeline preparation and collection

This section highlights the methodology for preparing the data set using the UN Global Pulse interface,
which is accessible only to UN organizations. It features a set of exhaustive and useful operators that
make filtering tweets more powerful and accessible.

Step 1: Data identification and collection

This collected the full volume of tweets from all Twitter users physically tweeting from Iraq (the structure
of the database does not allow the capture of perceptions of Iraqis tweeting outside the country). Tweets
were collected from historical data over 1,015 days—from January 2018 to June 2021 (see Annex 6).
Data collection yielded a total of 76,863,907 tweets, a sample size that positions this research among
the leading big data analytical initiatives by the United Nations.

Page 9

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

Step 2: Data cleaning and preparation
Step 2: Data cleaning and preparation

Identifying user sex: Since Twitter offers no metadata on user sex, a distinction was drawn based on
Identifying user sex: Since Twitter offers no metadata on user sex, a distinction was drawn based on
user first names. Each user’s full name was first cleaned by removing diacritics and non-alphabetic
user first names. Each user’s full name was first cleaned by removing diacritics and non-alphabetic
characters. Based on a database of Arabic and Kurdish names by sex,3 the list of users was classified by
characters. Based on a database of Arabic and Kurdish names by sex,3 the list of users was classified by
sex. This resulted in classifying only 53 percent of users. The rest were labelled genderless.
sex. This resulted in classifying only 53 percent of users. The rest were labelled genderless.

Classifying tweets by core grievances and future outlook: The full body of over 76 million tweets
Classifying tweets by core grievances and future outlook: The full body of over 76 million tweets
was classified according to the taxonomy dictionaries developed by the big data team. Each tweet
was classified according to the taxonomy dictionaries developed by the big data team. Each tweet
was first cleaned by removing diacritics and non-alphabetic characters, transforming tweet letters to
was first cleaned by removing diacritics and non-alphabetic characters, transforming tweet letters to
lowercase when applicable, normalizing the ‘Alef’, and removing El- and Al- (ال) from the beginning of
lowercase when applicable, normalizing the ‘Alef’, and removing El- and Al- (ال) from the beginning of
every word. The same steps were applied to the core grievances and future outlook dictionaries. Next,
every word. The same steps were applied to the core grievances and future outlook dictionaries. Next,
each tweet was analysed for the number of keywords per core grievance and future outlook dimension
each tweet was analysed for the number of keywords per core grievance and future outlook dimension
and subdimension. Finally, tweets were classified by dimension or subdimension based on the largest
and subdimension. Finally, tweets were classified by dimension or subdimension based on the largest
number of relevant keywords.
number of relevant keywords.

Identifying tweets with youth content: As identifying young users was not possible, the listening tool
Identifying tweets with youth content: As identifying young users was not possible, the listening tool
examined content focused on youth-related topics and that very explicitly mentioned ‘youth’ or key
examined content focused on youth-related topics and that very explicitly mentioned ‘youth’ or key
words around youth. Tweets containing the keywords بﺎﺑﺷ (youth), بﺎﺷ (young man) or ﺔﺑﺎﺷ (young
words around youth. Tweets containing the keywords
(young
woman) were collected and data cleaning strategies applied. Tweets with at least one of these three
woman) were collected and data cleaning strategies applied. Tweets with at least one of these three
key terms were retained and analysed as youth-focused content.
key terms were retained and analysed as youth-focused content.

Identifying word frequencies around core grievances during key events: A list of key events during
Identifying word frequencies around core grievances during key events: A list of key events during
the time frame under review was generated. Arabic and Kurdish tweets on core grievances posted
the time frame under review was generated. Arabic and Kurdish tweets on core grievances posted
at the time of these specific events, and during the seven days before and seven days after them,
at the time of these specific events, and during the seven days before and seven days after them,
were classified separately for analysis on peaks in volume or content. The tweets were further cleaned
were classified separately for analysis on peaks in volume or content. The tweets were further cleaned
and tokenized, and single letter words were excluded. Then, unigrams (one-word sequences or most
and tokenized, and single letter words were excluded. Then, unigrams (one-word sequences or most
frequent words), bigrams (two-word sequences) and trigrams (three-word sequences) in every tweet
frequent words), bigrams (two-word sequences) and trigrams (three-word sequences) in every tweet
were identified and the results grouped by date, sex, language and key words. The frequency of
were identified and the results grouped by date, sex, language and key words. The frequency of
each uni/bi/trigram was aggregated, and those with a total frequency per event of less than 100 were
each uni/bi/trigram was aggregated, and those with a total frequency per event of less than 100 were
excluded.
excluded.

1.3. Data privacy and protection concerns and methodological limitations
1.3. Data privacy and protection concerns and methodological limitations

The big data analytical model designed for this research project was aligned with the UN Personal
The big data analytical model designed for this research project was aligned with the UN Personal
Data and Protection Principles (2018)4 as well as ethical data use guidelines5 (see also Annex 5). As
Data and Protection Principles (2018)4 as well as ethical data use guidelines5 (see also Annex 5). As
such, the analytical framework avoids exposing individuals or groups. It hides cluster IDs and does not
such, the analytical framework avoids exposing individuals or groups. It hides cluster IDs and does not
define groups based on identities that might be discriminatory. Since data privacy concerns prohibit
define groups based on identities that might be discriminatory. Since data privacy concerns prohibit
the analysis of trends and relationships at the user and tweet levels, the study relies on trends and
the analysis of trends and relationships at the user and tweet levels, the study relies on trends and
frequencies rather than individual tweets or individual users.
frequencies rather than individual tweets or individual users.

Additional limitations are as follows.
Additional limitations are as follows.

• Elitism of the Iraqi Twitter population and the digital divide: Twitter users represent a very limited
• Elitism of the Iraqi Twitter population and the digital divide: Twitter users represent a very limited
segment of Iraqi society compared to other platforms such as Facebook and Instagram. This
segment of Iraqi society compared to other platforms such as Facebook and Instagram. This
segment is often seen as the elite of the country, albeit a very socially active element concerned
segment is often seen as the elite of the country, albeit a very socially active element concerned
with the news. This means that this analysis is not necessarily representative of the country as a
with the news. This means that this analysis is not necessarily representative of the country as a
whole. Additional considerations involve the digital divide in access to the Internet. Disadvantaged
whole. Additional considerations involve the digital divide in access to the Internet. Disadvantaged
segments of society like women, the elderly, the less educated and lower-income individuals
segments of society like women, the elderly, the less educated and lower-income individuals
are less likely to use the Internet than their male, younger, higher-educated and higher-income
are less likely to use the Internet than their male, younger, higher-educated and higher-income
counterparts. Even when access is available, underprivileged or vulnerable groups might not feel
counterparts. Even when access is available, underprivileged or vulnerable groups might not feel

Page 10
Page 10

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
safe in freely expressing themselves given that power dynamics in the non-virtual world influence
expression online.

• Fake accounts, bots and content manipulation: Fake and bot accounts are a widespread
phenomenon on Twitter, although recently the company has become more focused on tracking
the ‘behaviour’ of an account. This refers to the degree to which it is causing „malicious use of
automation to undermine and disrupt the public conversation, like trying to get something to trend;
artificial amplification of conversations on Twitter, including through creating multiple or overlapping
accounts; and generating, soliciting, or purchasing fake engagements.”6 This study developed lists
of active users, especially around events important to Iraq, which automatically limits bots.

• Coordinated messaging and online political campaigns: Since political groups use Twitter for
propaganda, the research attempted to identify collective messaging aimed at hijacking specific
hashtags or content.

• Disaggregated analysis and social network analysis: Since United Nations and Twitter privacy
policies do not allow analysis that exposes vulnerable groups or individuals or attempts an identity-
based assessment of Twitter data, the research method tried to investigate intergroup dynamics
across cities and groups to overarching research on social constituencies, such as youth, women,
etc.

Page 11

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
2. CONTEXT OF IRAQ

Before looking into content generated by the Iraqi Twittersphere, and how this relates to core
grievances and perceptions of the future, it is important to consider Iraq’s social media context, the level
of interconnectedness and the digital divide.

2.1 The scope of social media use in Iraq: trends and highlights

In Iraq, mobile subscriptions reached 94.9 percent (per 100 inhabitants) in 2019, up from 64.4 percent
in 2009.7 Over the same period, the percentage of households with Internet reached 58.8 percent,
up from 10 percent in 2009.8 Amid increased investment in and access to improved information and
communications technology infrastructure, social networks have created a platform for people to
express their views and opinions.

Among the 21 million active social media users in Iraq, Facebook is the leading social media platform
with 17 million users. Instagram and Snapchat are in second and third place, respectively, and Twitter
comes in fourth place with 1.28 million users.9 According to the 2020 Arab Opinion Index, Iraq ranks first
in terms of using social media platforms to interact with political issues, where 37 percent of respondents
stated that they access social media platforms several times a day to engage in political discussions
(Figure 1).10

Figure 1: The use of social media platforms to engage on political issues

Average

22

Saudi Arabia
Average
Jordan
Saudi Arabia
Morocco
Jordan
Kuwait
Morocco
Algeria
Kuwait
Palestine
Algeria
Lebanon
State of Palestine
Qatar
Lebanon
Tunisia
Qatar
Mauritania
Tunisia
Egypt
Mauritania
Sudan
Egypt
Iraq
Sudan

0

Iraq

12

13

15

15

15

16

13

22

25

35

36

37

37

20

40

60

80

100

120

Daily/many times a day

Weekly/several times a week

Less than once a week

Never

No answer

Source: The 2020 Arab Opinion Index.

Page 12

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
Since Iraqis seem to increasingly use social media platforms for political expression, dynamics within the
society are likely to be mirrored or reflected there. Big data, particularly from social media and artificial
intelligence technologies, can therefore be used to better understand attitudes, practices, concerns
and perceptions of issues related to the social contract. Analysis of Twitter discourse around the social
contract has generated timely and relevant insights on how discussions and priorities shift considering
specific events and across user groups (e.g., female and male users, and Arabic- and Kurdish-speaking
users). This approach is more cost effective than traditional data collection.

2.2 Snapshot of the Iraqi Twittersphere since 2018

Based on the full Twitter database accessed through the UN Global Pulse interface, reflecting real-time
daily data from active accounts over the period from 10 January 2018 to 30 June 2021, there were
882,556 unique Twitter users in Iraq. Of them, 699,805 (79 percent) were Arabic-speaking and 27,371 (3
percent) were Kurdish-speaking.

These users produced 76,863,907 tweets, an average of 87 per user, during the research time frame.
Among the Arabic-speaking users, 301,481 users (43 percent) were classified as male and 74,771 users
(11 percent) as female. Although male users outnumbered female ones, the latter seemed more active,
with an average of 112 tweets per female user compared to 69 tweets per male user (Figure 2).

Figure 2: Demographics of Twitter users, January 2018 to June 2021

882,556 total users

76,863,907 total tweets

Arabic-speaking

699,805 users

Kurdish-speaking

27,371 users

Female

74,771 users

Male

301,481

Female

2,989

Male

12,531

Page 13

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

3. KEY FINDINGS OF THE BIG DATA ANALYSIS

3.1 Key topics and temporal trends

Of all core grievances, security featured most often in tweets during the research period. In total,
3,495,058 tweets discussed core grievances—3,229,105 were in Arabic, 52,216 in the Kurdish language
and 129,109 in other languages, mainly English. Among these tweets, 48 percent were linked to security,
20 percent to governance, 16 percent to corruption, 14 percent to services and only 2 percent to the
economy (Figure 3).

Figure 3: Frequency and percentage of core grievances across 3,414,430 tweets

685,388

135,679

471,884

547,045

1,655,062

Security, 47%

Corruption, 16%

Services, 13%

Economy, 4%

Governance, 20%

A closer look at the study period highlights the catalytic impact of the October 2019 protests, with a
dramatic increase in the expression of core grievances (Figure 4). This increase was evident for all
core grievances except the economy. It built until just before the demonstrations and continued to
escalate after that point. This suggests several underlying issues: the importance of social media as a
tool to express grievances and dissent; the potential for social media to serve as an organizing platform
for collective action and engaged citizenship; and the increased use of social media when in-person
demonstrations become riskier or less safe, especially given security crackdowns and the pandemic.

Page 14

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

Figure 4: Temporal trends in expressing core grievances

Twitter users were much more likely to tweet about core grievances shaping the present than the
future. This suggests that users may be so preoccupied with current concerns that they do not think
much about the future. In total, only 21,425 tweets (less than 1 percent) had a future outlook, compared
to 3,495,058 tweets (over 99 percent) on core grievances in the present. Among the former, 55 percent
discussed factors shaping the future, 40 percent expressed positive or negative sentiments and only 5
percent demonstrated a willingness to take action to influence the future (Table 1).

Table 1: Frequency and shares of tweets with a future outlook

Future outlook

Frequency of tweets

Percentage

1.

2.

3.

Perception/sentiment

Willingness to take action

Variables shaping outlook

Total

8,479

1,145

11,801

21,425

39.58

5.34

55.08

100

When discussing the future, Iraqis on Twitter were evenly split between having a more positive and
hopeful outlook and a more negative and hopeless one, up until October 2020. Hopeful content
slightly increased after the 2019 demonstrations. By October and November 2020, however, after the
anniversary of the protests, a sharp peak in hopelessness and negativity emerged, possibly driven by
the lack of tangible outcomes and a continued deterioration in living conditions (Figure 5). Another peak
in hopelessness occurred in April 2021.

Page 15

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
Figure 5: Temporal trends in sentiment/perceptions around the future of Iraq

Sentiment-Perception

Hopeful/Positive/Optimistic

Hopeless/Negative/Pessimistic

J
A
N
2
0
1
8

A
P
R
2
0
1
8

M
A
Y
2
0
1
8

J
U
N
2
0
1
8

J
U
L
2
0
1
8

S
E
P
2
0
1
8

O
C
T
2
0
1
8

J
A
N
2
0
1
9

M
A
R
2
0
1
9

M
A
Y
2
0
1
9

J
U
N
2
0
1
9

J
U
L
2
0
1
9

A
U
G
2
0
1
9

S
E
P
2
0
1
9

O
C
T
2
0
1
9

N
O
V
2
0
1
9

D
E
C
2
0
1
9

J
A
N
2
0
2
0

F
E
B
2
0
2
0

M
A
R
2
0
2
0

A
P
R
2
0
2
0

M
A
Y
2
0
2
0

J
U
N
2
0
2
0

J
U
L
2
0
2
0

A
U
G
2
0
2
0

S
E
P
2
0
2
0

O
C
T
2
0
2
0

N
O
V
2
0
2
0

D
E
C
2
0
2
0

J
A
N
2
0
2
1

F
E
B
2
0
2
1

M
A
R
2
0
2
1

A
P
R
2
0
2
1

J
U
N
2
0
2
1

3.2 Core grievances: key priorities and temporal trends

3.2.1 Security

Twitter users most frequently tweeted about security (1,110,677 tweets or 47.35 percent of the total
on core grievances). They primarily relayed content on the Islamic State (31 percent); violence and crime
(22 percent); militias, including paramilitary groups (19 percent) and legitimate state security forces (13
percent). Iraqis were least likely to tweet about trust (7 percent), security sector reform (6 percent) and
domestic violence (2 percent). An examination of temporal trends demonstrated key peaks and periods
of interest (Figure 6).

Figure 6: Temporal trends in security-related content

Security

Legitimate force
Militias
Security sector reform
Perceptions toward IS
Violence and crime
Domestic violence
Trust

J
A
N
2
0
1
8

A
P
R
2
0
1
8

M
A
Y
2
0
1
8

J
U
N
2
0
1
8

J
U
L
2
0
1
8

S
E
P
2
0
1
8

O
C
T
2
0
1
8

J
A
N
2
0
1
9

M
A
R
2
0
1
9

M
A
Y
2
0
1
9

J
U
N
2
0
1
9

J
U
L
2
0
1
9

A
U
G
2
0
1
9

S
E
P
2
0
1
9

O
C
T
2
0
1
9

N
O
V
2
0
1
9

D
E
C
2
0
1
9

J
A
N
2
0
2
0

F
E
B
2
0
2
0

M
A
R
2
0
2
0

A
P
R
2
0
2
0

M
A
Y
2
0
2
0

J
U
N
2
0
2
0

J
U
L
2
0
2
0

A
U
G
2
0
2
0

S
E
P
2
0
2
0

O
C
T
2
0
2
0

N
O
V
2
0
2
0

D
E
C
2
0
2
0

J
A
N
2
0
2
1

F
E
B
2
0
2
1

M
A
R
2
0
2
1

A
P
R
2
0
2
1

J
U
N
2
0
2
1

Page 16

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

The first peak in content around security occurred from December 2019 to January 2020 (Figure 8). The
second, with qualitatively different content, took place in March 2020 (Figure 9), and the third appeared
between May and June of 2020 (Figure 10). These peaks all coincided with specific security-related
incidents.

Figure 7: Temporal trends in security-related content, December 2019 to January 2020

Security

Legitimate force
Militias
Security sector reform
Perceptions toward IS
Violence and crime
Domestic violence
Trust

1
5
-
D
E
C
-
2
0
1
9

1
7
-
D
E
C
-
2
0
1
9

1
9
-
D
E
C
-
2
0
1
9

2
1
-
D
E
C
-
2
0
1
9

2
3
-
D
E
C
-
2
0
1
9

2
5
-
D
E
C
-
2
0
1
9

2
7
-
D
E
C
-
2
0
1
9

2
9
-
D
E
C
-
2
0
1
9

3
1
-
D
E
C
-
2
0
1
9

0
2
-
J
A
N
-
2
0
2
0

0
4
-
J
A
N
-
2
0
2
0

0
6
-
J
A
N
-
2
0
2
0

0
8
-
J
A
N
-
2
0
2
0

1
0
-
J
A
N
-
2
0
2
0

1
2
-
J
A
N
-
2
0
2
0

1
4
-
J
A
N
-
2
0
2
0

Figure 8 tracks security content from 1-31 March 2020, which saw the highest peak in content related
to trust in the security forces. Dissecting this trend reveals peaks on 22 and 28 March, when the
Government enforced a nationwide lockdown and travel restrictions to contain COVID-19.11 Mobilizing
the security apparatus to support public health apparently inspired public trust.

Figure 8: Temporal trends in security-related content, March 2020

Security

Legitimate force
Militias
Security sector reform
Perceptions toward IS
Violence and crime
Domestic violence
Trust

0
1
-

M
A
R
-
2
0
2
0

0
3
-
M
A
R
-
2
0
2
0

0
5
-
M
A
R
-
2
0
2
0

0
7
-
M
A
R
-
2
0
2
0

0
9
-
M
A
R
-
2
0
2
0

1
1
-

M
A
R
-
2
0
2
0

1
3
-
M
A
R
-
2
0
2
0

1
5
-
M
A
R
-
2
0
2
0

1
7
-
M
A
R
-
2
0
2
0

1
9
-
M
A
R
-
2
0
2
0

2
1
-

M
A
R
-
2
0
2
0

2
3
-
M
A
R
-
2
0
2
0

2
5
-
M
A
R
-
2
0
2
0

2
7
-
M
A
R
-
2
0
2
0

2
9
-
M
A
R
-
2
0
2
0

3
1
-

M
A
R
-
2
0
2
0

Page 17

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
Figure 9: Temporal trends in security-related content, May to June 2020

Security

Legitimate force
Militias
Security sector reform
Perceptions toward IS
Violence and crime
Domestic violence
Trust

1
5
-
M
A
Y
-
2
0
2
0

1
8
-
M
A
Y
-
2
0
2
0

2
1
-

M
A
Y
-
2
0
2
0

2
4
-
M
A
Y
-
2
0
2
0

2
7
-
M
A
Y
-
2
0
2
0

-

3
0
M
A
Y
-
2
0
2
0

0
2
-
J
U
N
-
2
0
2
0

0
5
-
J
U
N
-
2
0
2
0

0
8
-
J
U
N
-
2
0
2
0

1
1
-
J
U
N
-
2
0
2
0

1
4
-
J
U
N
-
2
0
2
0

1
7
-
J
U
N
-
2
0
2
0

2
0
-
J
U
N
-
2
0
2
0

2
3
-
J
U
N
-
2
0
2
0

2
6
-
J
U
N
-
2
0
2
0

2
9
-
J
U
N
-
2
0
2
0

3.2.2 Corruption

When tweeting about corruption (263,135 tweets or 15.65 percent of the total on core grievances),
Iraqis primarily referred to its economic cost (49 percent) as well as accountability and transparency
issues (41 percent). They were least likely to tweet about the justice system and impunity (5 percent),
the link with sectarianism (5 percent) and the spread of corruption (0.7 percent).

An examination of temporal trends found Twitter users were much more likely to produce corruption-
related content after the October 2019 protests (Figure 10), despite a few peaks prior to the
demonstrations. The protests seemed to catalyse online dissent with citizens critiquing the status
quo.

A clear peak in discussions about the economic costs of corruption appeared in August 2020. On
26 August, Jeanine-Hennis Plasschaert, Special Representative of the UN Secretary-General for Iraq,
reported to the UN Security Council that “corruption remains endemic, and its economic cost untold
as it continues to steal desperately needed resources from the everyday Iraqi, eroding investor
confidence.”12 It is not clear whether this speech and subsequent media coverage had a ripple effect but
the Iraqi Twittersphere around this period lit up with these concerns.

Page 18

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

Figure 10: Temporal trends in corruption-related content

Corruption

Degree of spread
Link to sectarianism
Accountability and
transparency
Justice system and impunity
Economic cost

J
A
N
2
0
1
8

M
A
Y
2
0
1
8

J
U
L
2
0
1
8

O
C
T
2
0
1
8

M
A
R
2
0
1
9

J
U
N
2
0
1
9

A
U
G
2
0
1
9

O
C
T
2
0
1
9

D
E
C
2
0
1
9

F
E
B
2
0
2
0

A
P
R
2
0
2
0

J
U
N
2
0
2
0

A
U
G
2
0
2
0

O
C
T
2
0
2
0

D
E
C
2
0
2
0

F
E
B
2
0
2
1

A
P
R
2
0
2
1

3.2.3 Services

When tweeting about services (444,039 tweets or 13.5 percent of the total on core grievances),
Twitter users primarily produced content related to COVID-19 (88 percent), followed by the costs of
services (7 percent), electricity (5 percent) and water (1 percent). Compared to these dimensions, tweets
about health care in general (608 in total), the fairness of distribution (105) and satisfaction with services
(2) were negligible. Most health-care discussions may have centred on the pandemic rather than broader
concerns about health care since data collection significantly overlapped with the pandemic.

The most prominent peak in tweets on services occurred in September 2020, with a record increase
in COVID-19 cases, tipping over 250,000, and authorities warning on 4 September that hospitals might
completely lose control of the situation.13 In a contradictory vein, Iraqi authorities eased COVID-19
restrictions on 8 September.14 These events stimulated the sharpest upswing in COVID-19-related content.

Figure 11: Temporal trends in services-related content

Services

Water and sanitation
Electricity
Healthcare
COVID-19
Cost of services
Fairness of distribution
Services-Satisfaction

J
A
N
2
0
1
8

M
A
Y
2
0
1
8

J
U
L
2
0
1
8

O
C
T
2
0
1
8

M
A
R
2
0
1
9

J
U
N
2
0
1
9

A
U
G
2
0
1
9

O
C
T
2
0
1
9

D
E
C
2
0
1
9

F
E
B
2
0
2
0

A
P
R
2
0
2
0

J
U
N
2
0
2
0

A
U
G
2
0
2
0

O
C
T
2
0
2
0

D
E
C
2
0
2
0

F
E
B
2
0
2
1

A
P
R
2
0
2
1

Page 19

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

3.2.4 The economy

Iraqi Twitter users were least likely to produce content related to the economy compared to other
core grievances (135,679 tweets or 3.88 percent of the total on core grievances). This low share is
explored in greater depth in Box 1. Users mostly generated content related to unemployment and job
security (53 percent), state resources and oil revenues (18 percent), networks of patronage (17 percent)
and aid (12 percent). They were least likely to tweet on economic justice (0.8 percent) and women’s
economic empowerment (0.3 percent). As with other core grievances, the volume of content about
the economy increased exponentially after the October 2019 demonstrations. This was especially so
around unemployment and job security, state resources, and networks of patronage and aid.

Box 1: Cross-tagging economy-related tweets

The Iraqi economy and population are both struggling. As such, one might anticipate frequent
tweets on economy-related grievances. This is clear in Part 3 of Wave IV of the Arab Barometer
Survey conducted in 2021, where 58 percent and 29.3 percent of Iraqis surveyed evaluated
the current economic situation as very bad and bad, respectively (the survey is available at
https://www.arabbarometer.org/survey-data/data-analysis-tool/).

The low level of economy-related tweets in this current study may reflect the methodology,
where a tweet containing economy-related content could be classified under ‘governance’ or
‘corruption’ if it contained more governance or corruption-related words. A deeper look into the
cross-labelling of economy-related tweets found that of the total tweets with economy-related
key words, 19.6 percent were labelled under security, 16.2 percent under governance, 15.3
percent under corruption and 8.3 percent under services. Only 40.6 percent of economy-
related tweets were predominantly about the economy as a core grievance. The rest
discussed economic issues but focused more on factors such as governance, corruption and
security that hold back the economy.

Some interesting peaks in content on the economy appeared in June 2020, August to September 2020
and February 2021, mostly on unemployment and job security. In late June 2020, Iraq’s Parliament
passed a law authorizing the Government to borrow US $18 billion as a stopgap measure for the
country’s financial deficit,15 which could have triggered economy-related content. The only peak in
content on women’s economic participation appeared in December 2019, when UN Women released
a report16 on women’s access to employment. Key findings were widely circulated on Twitter and likely
stimulated further discussion.

Page 20

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
Figure 12: Temporal trends in economy-related content

Economy

Unemployment and job security
Networks of patronage
State resources
Aid
Economic justice
Women economic participation

J
A
N
2
0
1
8

M
A
Y
2
0
1
8

J
U
L
2
0
1
8

O
C
T
2
0
1
8

M
A
R
2
0
1
9

J
U
N
2
0
1
9

A
U
G
2
0
1
9

O
C
T
2
0
1
9

D
E
C
2
0
1
9

F
E
B
2
0
2
0

A
P
R
2
0
2
0

J
U
N
2
0
2
0

A
U
G
2
0
2
0

O
C
T
2
0
2
0

D
E
C
2
0
2
0

F
E
B
2
0
2
1

A
P
R
2
0
2
1

3.2.5 Governance

In terms of governance (685,388 tweets or 19.61 percent of the total on core grievances), most users
produced content on representation (65 percent), followed by political fragmentation (18 percent),
ethnocentric divisions (9 percent), discrimination and marginalization (4 percent), and issues of
legitimacy and trust (3 percent). Some subdimensions generated less content, such as Iraqi identity
(12,377 tweets, 1.8 percent), identity politics (only 272 tweets, 0.04 percent), power-sharing (0.4 percent)
and satisfaction with governance (0.18 percent). The last was captured via content related to the lack
of legitimacy and trust in governmental bodies, implicitly indicating dissatisfaction with governance.
As with all other core grievances, content around governance issues exponentially increased after the
October 2019 demonstrations.

Figure 13: Temporal trends in governance-related content

Governance

Power-sharing
Governance-Satisfaction
Political fragmentation
Identity politics
Representation
Ethnocentric division
Discrimination and
marginalization
Legitimacy and trust
Iraqy Identity

J
A
N
2
0
1
8

M
A
Y
2
0
1
8

J
U
L
2
0
1
8

O
C
T
2
0
1
8

M
A
R
2
0
1
9

J
U
N
2
0
1
9

A
U
G
2
0
1
9

O
C
T
2
0
1
9

D
E
C
2
0
1
9

F
E
B
2
0
2
0

A
P
R
2
0
2
0

J
U
N
2
0
2
0

A
U
G
2
0
2
0

O
C
T
2
0
2
0

D
E
C
2
0
2
0

F
E
B
2
0
2
1

A
P
R
2
0
2
1

Page 21

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

Interesting peaks in discourse around representation, paralleled by simultaneous increases in
discussions around political fragmentation and ethnocentric division, were evident during May 2018,
with parliamentary elections; November-December 2019, when Prime Minister Adel Abdul Mahdi
resigned and Parliament approved the resignation followed by a new electoral law; and May 2020,
when Parliament confirmed Mustafa Al-Kadhimi as the new Prime Minister.

Every peak around representation was followed, temporally, by a peak around legitimacy and trust.
Most discourse highlighted the lack of legitimacy of governing bodies and officials and the lack of trust
in the electoral and representative processes.

Content on illegitimacy and lack of trust in governance has been rising since 2018 (Figure 14). By
October 2019, as anti-government protests were mobilizing and getting traction,17 content on mistrust
in representative bodies was booming. This suggests that the Iraqi Twittersphere reflects public
sentiment around the legitimacy of the Government.

Mistrust dips at some points, indicating trigger events that may restore some semblance of trust. One
example was in March 2020, around the withdrawal of Mohammad Tawfiq Allawi as Prime Minister
designate after a vote of no-confidence from Parliament,18 the suspension of anti-government protests
due to the pandemic and the nationwide lockdown to contain the pandemic.19 The data at hand do
not make a clear-cut link to these events but the nature of the content and the overlap with the events
suggest causality. Another large dip in trust appeared in November 2020, a month that witnessed a
renewal of anti-government protests and repression of protests by police and military forces.20 A closer
examination of the period between 1 October and 30 November demonstrates consistent levels of
content about mistrust and the illegitimacy of governmental bodies, except on 15 October (Figure 15),
with a peak of 2,415 tweets.

Figure 14: Temporal trends in content on legitimacy and trust

J
A
N
2
0
1
8

A
P
R
2
0
1
8

M
A
Y
2
0
1
8

J
U
N
2
0
1
8

J
U
L
2
0
1
8

S
E
P
2
0
1
8

O
C
T
2
0
1
8

J
A
N
2
0
1
9

M
A
R
2
0
1
9

M
A
Y
2
0
1
9

J
U
N
2
0
1
9

J
U
L
2
0
1
9

A
U
G
2
0
1
9

S
E
P
2
0
1
9

O
C
T
2
0
1
9

N
O
V
2
0
1
9

D
E
C
2
0
1
9

J
A
N
2
0
2
0

F
E
B
2
0
2
0

M
A
R
2
0
2
0

A
P
R
2
0
2
0

M
A
Y
2
0
2
0

J
U
N
2
0
2
0

J
U
L
2
0
2
0

A
U
G
2
0
2
0

S
E
P
2
0
2
0

O
C
T
2
0
2
0

N
O
V
2
0
2
0

D
E
C
2
0
2
0

J
A
N
2
0
2
1

F
E
B
2
0
2
1

M
A
R
2
0
2
1

A
P
R
2
0
2
1

J
U
N
2
0
2
1

Page 22

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

Figure 15: Temporal trends in content on legitimacy and trust, October to November 2020

0
1
-

O
C
T
-
2
0
2
0

0
5
-
O
C
T
-
2
0
2
0

0
7
-
O
C
T
-
2
0
2
0

0
9
-
O
C
T
-
2
0
2
0

1
1
-

O
C
T
-
2
0
2
0

1
3
-
O
C
T
-
2
0
2
0

1
5
-
O
C
T
-
2
0
2
0

1
7
-
O
C
T
-
2
0
2
0

2
3
-
O
C
T
-
2
0
2
0

2
6
-
O
C
T
-
2
0
2
0

-

3
0
O
C
T
-
2
0
2
0

0
5
-
N
O
V
-
2
0
2
0

0
7
-
N
O
V
-
2
0
2
0

-

1
0
N
O
V
-
2
0
2
0

1
2
-
N
O
V
-
2
0
2
0

1
4
-
N
O
V
-
2
0
2
0

1
6
-
N
O
V
-
2
0
2
0

1
8
-
N
O
V
-
2
0
2
0

2
1
-

N
O
V
-
2
0
2
0

2
4
-
N
O
V
-
2
0
2
0

2
6
-
N
O
V
-
2
0
2
0

2
9
-
N
O
V
-
2
0
2
0

3.3 Core grievances on Iraqi Twitter across groups

3.3.1 Do Iraqi women and men hold different priorities for the social contract?

Tweets around each of the core grievances rose and dropped simultaneously for women and men,
indicating a large degree of convergence (Figures 16 and 17). A few instances of divergence arose,
mostly around corruption and governance, where peaks in the volume of tweets appeared to be sharper
among men than women. Some trigger events likely mobilized more extensive discussions among men.
Parallel peaks among women, if at a lower level, indicated that the much smaller but highly active group
of female Twitter users maintains systematic engagement on issues related to Iraq.

Figure 16: Breakdown in the volume of content on core grievances by sex, percentage

Female

Male

Security

49%

48%

Governance

18%

20%

Corruption

16%

16%

Services

14%

13%

Economy

3%

4%

0%

20%

40%

60%

80%

100%

Some gender differences were evident in some core grievances. Whereas men and women tweeted
mostly similar volumes of content on security and the economy, divergence was evident in the
remaining core grievances, especially at the subdimensional levels. When tweeting about corruption,
women were more likely than men to discuss the economic costs along with accountability and
transparency. Men tweeted more about corruption in the justice system, the link to sectarianism and

Page 23

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
the pervasiveness of corruption. On services, women were more likely than men to discuss the cost,
whereas men tweeted more about COVID-19 and water and sanitation. On governance, women vocalized
concerns about political fragmentation and ethnocentric divisions more than men, whereas men to a
greater extent tweeted about legitimacy and trust in government, Iraqi identity, and discrimination and
marginalization.

Although Iraqi women and men converged in general on core grievances, some divergent priorities
are important to consider in reimagining the social contract. For instance, from May to June 2020,
men were discussing security-related concerns on Twitter at a much higher rate than their female
counterparts. Similarly, a spike in male-driven content around corruption was evident in October
2020, the one-year anniversary of the 2019 mobilizations.21 Finally, on governance, two distinct spikes
occurred for men compared to women. The first appeared in May 2018, coinciding with parliamentary
elections with record low turnout. The entire electoral process was perceived as fraudulent, leading to
contested results and a ballot recount, all of which culminated in political uncertainty.22 This inevitably
translated into heightened discussions around governance, especially among male users. Another
distinctive gender-divergent moment appeared on 5 January 2020, when the Iraqi Parliament voted
to oust all foreign troops from the country. Men tweeted intensively around political representation and
Iraqi identity, generating over 1,500 tweets on Iraqi identity on 5 January alone.

Male and female Twitter users seemed to engage on core grievances in a comparable manner over
time (Figure 18). Male users produced more tweets, which could be explained by more male than
female users. The few distinct instances of divergence were driven by key events that appeared to be
stronger priorities for men.

Figure 17: Breakdown of content on core grievances by sex, percentage

Female

Male

Militias

Perceptions
toward IS

Violence and crime

y
t
i
r
u
c
e
S

Domestic violence

Legitimate force

Trust

Security sector
reform

20.5%

19.7%

19.9%

13.4%

18.0%

17.7%

10.7%

12.1%

12.1%

12.2%

11.5%

11.5%

10.5%

10.2%

0%

5%

10%

15%

20%

Page 24

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
Figure 17: Breakdown of content on core grievances by sex, percentage, cont.

Female

Male

n
o
i
t
p
u
r
r
o
C

s
e
c
i
v
r
e
S

y
m
o
n
o
c
E

38.5%

29.8%

Economic cost

Accountability and
Transparency

Justice System
and Impunity

Link to Sectarianism

Degree of Spread

2.6%

7.0%

19.8%

20.1%

23.7%

24.6%

15.1%

18.8%

0%

10%

20%

30%

40%

Cost of Services

Electricity

COVID-19

30.5%

22.9%

15.5%

11.4%

37.6%

62.7%

Water and sanitation

1.6%

9.6%

Healthcare

Fairness of Distribution

1.4%

3.5%

0.1%

3.5%

0%

10%

20%

30%

40%

50%

60%

63.2%

50.7%

Unemployment
and job security

Networks of Patronage

State Resources

15.0%

18.1%

13.2%

18.7%

Aid

7.0%

11.7%

Economic Justice

1.4%

0.6%

Women Economic
Participation

0.2%

0.2%

0%

10%

20%

30%

40%

50%

60%

Page 25

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
Figure 17: Breakdown of content on core grievances by sex, percentage, cont.

34.8%

32.3%

24.4%

19.9%

Female

Male

Representation

Political Fragmentation

Ethnocentric Division

Legitimacy and Trust

Iraqi Identity

Discrimination and
Marginalization

e
c
n
a
n
r
e
v
o
G

14.2%

13.7%

13.5%

12.4%

6.8%

6.8%

4.0%

9.8%

Power Sharing

1.6%

3.2%

Satisfaction

Identity Politics

0.9%
0.8%

0.7%

0.1%

0%

5%

10%

15%

20%

25%

30%

35%

Figure 18: Temporal trends in core grievances by sex

Security

y
c
n
e
u
q
e
r
f

m
u
S

y
c
n
e
u
q
e
r
f

m
u
S

40000

30000

20000

10000

0

20000

15000

10000

5000

0

J
A
N
2
0
1
8

M
A
Y
2
0
1
8

J
U
L
2
0
1
8

O
C
T
2
0
1
8

M
A
R
2
0
1
9

J
U
N
2
0
1
9

A
U
G
2
0
1
9

O
C
T
2
0
1
9

D
E
C
2
0
1
9

F
E
B
2
0
2
0

A
P
R
2
0
2
0

J
U
N
2
0
2
0

A
U
G
2
0
2
0

O
C
T
2
0
2
0

D
E
C
2
0
2
0

F
E
B
2
0
2
1

A
P
R
2
0
2
1

Corruption

J
A
N
2
0
1
8

M
A
Y
2
0
1
8

J
U
L
2
0
1
8

O
C
T
2
0
1
8

M
A
R
2
0
1
9

J
U
N
2
0
1
9

A
U
G
2
0
1
9

O
C
T
2
0
1
9

D
E
C
2
0
1
9

F
E
B
2
0
2
0

A
P
R
2
0
2
0

J
U
N
2
0
2
0

A
U
G
2
0
2
0

O
C
T
2
0
2
0

D
E
C
2
0
2
0

F
E
B
2
0
2
1

A
P
R
2
0
2
1

Page 26

Female

Male

Female

Male

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

Female

Male

Female

Male

Female

Male

y
c
n
e
u
q
e
r
f

m
u
S

y
c
n
e
u
q
e
r
f

m
u
S

y
c
n
e
u
q
e
r
f

m
u
S

40000

30000

20000

10000

0

4000

3000

2000

1000

0

20000

15000

10000

5000

0

Figure 18: Temporal trends in core grievances by sex, cont.

Services

J
A
N
2
0
1
8

M
A
Y
2
0
1
8

J
U
L
2
0
1
8

O
C
T
2
0
1
8

M
A
R
2
0
1
9

J
U
N
2
0
1
9

A
U
G
2
0
1
9

O
C
T
2
0
1
9

D
E
C
2
0
1
9

F
E
B
2
0
2
0

A
P
R
2
0
2
0

J
U
N
2
0
2
0

A
U
G
2
0
2
0

O
C
T
2
0
2
0

D
E
C
2
0
2
0

F
E
B
2
0
2
1

A
P
R
2
0
2
1

Economy

J
A
N
2
0
1
8

M
A
Y
2
0
1
8

J
U
L
2
0
1
8

O
C
T
2
0
1
8

M
A
R
2
0
1
9

J
U
N
2
0
1
9

A
U
G
2
0
1
9

O
C
T
2
0
1
9

D
E
C
2
0
1
9

F
E
B
2
0
2
0

A
P
R
2
0
2
0

J
U
N
2
0
2
0

A
U
G
2
0
2
0

O
C
T
2
0
2
0

D
E
C
2
0
2
0

F
E
B
2
0
2
1

A
P
R
2
0
2
1

Governance

J
A
N
2
0
1
8

M
A
Y
2
0
1
8

J
U
L
2
0
1
8

O
C
T
2
0
1
8

M
A
R
2
0
1
9

J
U
N
2
0
1
9

A
U
G
2
0
1
9

O
C
T
2
0
1
9

D
E
C
2
0
1
9

F
E
B
2
0
2
0

A
P
R
2
0
2
0

J
U
N
2
0
2
0

A
U
G
2
0
2
0

O
C
T
2
0
2
0

D
E
C
2
0
2
0

F
E
B
2
0
2
1

A
P
R
2
0
2
1

Page 27

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

3.3.2 Do Iraqi women and men have similar views on the future?

Overall, Iraqi male and female Twitter users diverged in their sentiments on the future. Iraqi women
were more likely to express hopelessness and negativity (793 tweets) compared to hope and a positive
outlook (519 tweets). Less difference was evident among Iraqi men, with roughly the same number of
hopeless and negative tweets (1,733) and more hopeful and positive ones (1,710). See Figure 19.

Figure 19: Sentiment/perception of the future by sex, percentage

Female

Male

Hopeless/Negative/Pessimistic

Hopeful/Positive/Optimistic

60.4%

39.6%

50.3%

49.7%

0%

20%

40%

60%

Sentiments about the future ebbed and flowed similarly for male and female users over time (Figure
20). Although women expressed hopefulness and optimism consistently less frequently than men, levels
of hopelessness and pessimism were comparable among women and men for most of the time frame
under study. This could indicate that certain events promoted convergence. A spike of hopefulness in
December 2019 occurred after Prime Minister Abdul Mahdi announced his resignation and Parliament
approved it and passed the new electoral law. Another peak among male users came in May 2020 when
Parliament approved Mustafa Al-Kadhimi as the new Prime Minister. High levels of hope in September
2020 may have anticipated the one-year anniversary of the October 2019 protests.

Figure 20: Temporal trends in sentiment/perception by sex

Page 28

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

The aftermath of the one-year anniversary saw a decline in expressions of hope and an increase
in hopelessness for both male and female Twitter users, however. The first large escalation in
hopelessness emerged on 14 November 2020. Another spike arose in April 2021, potentially associated
with Iraq surpassing 1 million COVID-19 cases23 and a massive fire breaking out in the intensive care unit
of the Baghdad hospital,24 which eventually led to the resignation of the health minister.25

Although men and women view leadership as essential for the future of Iraq, they diverged in their
emphasis on it. Female Twitter users stressed leadership to a greater extent. Male users focused more
on external pressure and intervention. While both female and male users viewed collective action and
popular mobilization as equally important for the future, female users underscored it more strongly
than external pressure, whereas male users placed equal importance on collective action and external
pressure. Both males and females often referred to divine intervention or putting the future of Iraq in
the hands of God. Interestingly, female users gave as much emphasis to divine intervention as external
intervention. They focused more on grass-roots and materially tangible variables, such as emerging
leadership from popular movements and collective action.

Figure 21: Variables shaping outlook by sex, percentage

Female

Male

Leadership

Collective Action

External Pressure/Intervention

Divine Intervention

19.8%

20.3%

21.1%

12.7%

11.3%

12.5%

56.2%

46.1%

0%

10%

20%

30%

40%

50%

60%

3.3.3 Do the Arabic- and Kurdish-speaking Iraqi communities converge on priorities for the
social contract?

Since 1991, the Kurdistan Region of Iraq has developed many state-like competencies that have laid
the foundation for the region being a special entity or de facto state within Iraq.26 Kurdish authorities
have engaged in building state-like institutions, and in this process, a parallel social contract has
developed between them and the population.27 When the Iraqi Kurds refer to the government, they
mean the Kurdistan Regional Government and Kurdish institutions.28 For many years, there has been
significant divergence between the region and the rest of Iraq in terms of perceptions, needs, priorities
and demands.29

Arabic- and Kurdish-speaking Twitter users had some level of convergence around social contract
grievances. Both communities seemed to emphasize security-related content most often. The Kurdish-
speaking community in fact did this to a much greater extent than the Arabic-speaking community
(Figure 22), which is interesting given that the Kurdistan Region of Iraq has experienced consistent
stability since 2003.30

Page 29

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

Based on the volume of content, after security, the Arabic-speaking Twitter community put the
greatest importance on governance, corruption, services and the economy. The Kurdish-speaking
community indicated a slightly different order of concerns: services, governance, corruption and the
economy. The Kurdish-speaking community seemed less concerned about governance and corruption,
both robust concerns for the Arabic-speaking community. Both communities had little engagement on
the economy.

Figure 22: Breakdown of content produced per core grievances across language groups, percentage

47.0%

64.7%

Arabic

Kurdish

Security

Governance

Corruption

Services

Economy

19.8%

15.7%

9.7%

8.6%

13.6%

11.8%

4.0%

5.3%

0%

10%

20%

30%

40%

50%

60%

Despite divergences on core grievances, the Arabic- and Kurdish-speaking populations converged
greatly on the subdimensions of security and corruption. They diverged on the main grievances
related to the economy, services and, to an extent, governance (Figure 23). Divergences could be
explained by the fact that the Kurdistan Region of Iraq is highly autonomous, with a context and issues
that vary from those in the rest of Iraq.31 In terms of the economy, the Kurdish-speaking community
produced much less content about unemployment and job security, and much more around aid. The
presence of international organizations and a large number of refugees and internally displaced people
in the region might explain this emphasis.32 The Arabic-speaking community seemed to generate
more content on networks of patronage and state resources, including oil revenues. The increasing
proliferation of different centres of power and their fragmentation and penetration into state institutions33
may explain this preoccupation.

On services, the Kurdish-speaking population was more likely to tweet on electricity and health care; the
Arabic-speaking population focused more on COVID-19 and the fair distribution of services. In terms of
governance, the Arabic-speaking population tweeted more often about political fragmentation, whereas
the Kurdish-speaking population expressed more satisfaction.

Page 30

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

Figure 23: Breakdown of core grievance dimensions by language group, percentage

Arabic

Kurdish

Perceptions toward IS

Militias

Violence and crime

Legitimate force

y
t
i
r
u
c
e
S

Trust

Domestic violence

Security sector reform

19.1%

19.8%

18.5%

19.2%

16.2%

15.7%

13.1%

11.1%

11.9%

11.4%

10.9%

11.9%

10.4%

10.8%

0%

5%

10%

15%

20%

Economic cost

Accountability and
Transparency

Justice System
and Impunity

n
o
i
t
p
u
r
r
o
C

Link to Sectarianism

33.0%

34.0%

23.3%

22.6%

21.8%

21.0%

15.9%

15.1%

Degree of Spread

6.0%

7.3%

0%

5%

10%

15%

20%

25%

30%

35%

Cost of Services

Electricity

COVID-19

Water and sanitation

s
e
c
i
v
r
e
S

Fairness of Distribution

0.2%

Healthcare

1.9%

4.2%

4.8%

12.7%

11.5%

10.8%

36.1%

38.6%

33.0%

24.2%

22.1%

0%

10%

20%

30%

40%

Page 31

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
Figure 23: Breakdown of core grievance dimensions by language group, percentage, cont.

15.3%

18.1%

17.0%

Arabic

Kurdish

Unemployment
and job security

State Resources

8.0%

Networks of
Patronage

4.5%

Aid

10.2%

y
m
o
n
o
c
E

Economic Justice

0.8%

0.3%

Women Economic
Participation

0.3%

0.8%

53.7%

71.1%

0%

10%

20%

30%

40%

50%

60%

70%

34.0%

31.9%

Representation

Political Fragmentation

Ethnocentric Division

e
c
n
a
n
r
e
v
o
G

Legitimacy and Trust

Iraqi Identity

Discrimination and
Marginalization

Power Sharing

Satisfaction

1.2%

Identity Politics

0.4%
0.1%

17.4%

12.6%

14.3%

15.7%

11.1%

14.3%

10.2%

8.1%

7.0%

5.4%

4.4%

6.5%

5.3%

0%

5%

10%

15%

20%

25%

30%

35%

3.3.4 Core grievances in youth-related content

The most prevalent expressions of core grievances in youth-related content were about security.
In total, 55,078 youth-related tweets discussed core grievances, the majority in the Arabic language
(53,079 tweets). Among these, 56 percent were on security-related concerns, 16 percent on governance,
13 percent on corruption, 9 percent on services and 6 percent on the economy (Figure 24).

Page 32

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
Figure 24: Frequency and percentage of core grievances among 53,081 youth-related tweets

9,097

3,268

4,787

7,129

30,797

Security, 56%

Corruption, 13%

Services, 9%

Economy, 6%

Governance, 16%

Youth-related content reflected the same level of engagement on core grievances as the general Iraqi
Twittersphere. This indicates alignment between youth-related and general priorities for Iraq’s social
contract. A couple of key differences included a greater focus on security-related content (58 percent
compared to 48 percent in tweets as a whole) and less content on the rest of the core grievances. Youth-
related tweets around security contained more content around violence and crime (36 percent) and less
content about militias (12 percent) than tweets in general (22 percent and 19 percent, respectively).
In terms of corruption, the volume of youth-related tweets linking sectarianism and corruption (11
percent) was greater than tweets as a whole (5 percent) but the volume of youth-related tweets linking
to accountability and transparency (35 percent) was less than the whole (41 percent). Youth-related
content was greater on the high cost of services (14 percent) but tapered off on COVID-19 (80 percent)
compared to the overall body of tweets at 7 percent and 88 percent, respectively.

In terms of the economy, youth-related tweets contained more content around unemployment (63
percent) and state resources and oil (20 percent) and less content about networks of patronage
(12 percent) and aid (5 percent). For the tweets in general, the shares were 53 percent, 18 percent,
17 percent and 12 percent, respectively. Grievances linked to the economy were the only concerns
suggesting youth have a different order of priorities. This is understandable considering high rates of
youth unemployment at around 36 percent compared to the overall national rate of 16 percent in 2020,34
and the heavy reliance on state resources for public sector employment.

Finally, youth-related tweets on governance were more likely to centre on ethnocentric divisions (13
percent) and the illegitimacy and lack of trust in governance bodies (7 percent) but less likely to dwell on
representation (59 percent) than the general population of tweets (9 percent, 3 percent and 65 percent,
respectively). The order of prevalence in the various subdimensions of governance-related priorities
and grievances was identical in youth-related content and the general population of tweets.

Page 33

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

4 CONCLUSIONS: KEY SOCIAL CONTRACT PRIORITIES

The Twitter listening tool tapped into the content of close to 77 million tweets produced by 882,556
unique users in the Iraqi Twittersphere. The following conclusions summarize findings on key social
contract priorities.

• Of all the tweets around core grievances, 48 percent were about security-related concerns, 20
percent were about governance, 16 percent were about corruption, 14 percent were about services
and a meagre 2 percent were about the economy.

•

Iraqi Twitter users were much more likely to tweet about core grievances shaping their present
compared to their future.

• The protests of October 2019 catalysed Twitter discussions about core grievances, seemingly

activating online dissent.

• Of all the grievances identified, Iraqis produced the largest amount of content on security-related
concerns. Most tweets were about the Islamic State, violence and crime, and militias. Content
predominantly focused on specific security-related events.

• On corruption, Iraqis primarily tweeted about economic costs as well as accountability and

transparency issues.

• On services, Iraqis were primarily concerned about the COVID-19 pandemic, which was unique to

the period for data collection.

•

In terms of governance, users primarily tweeted about representation (elections, representative
bodies, etc.).

• Expressions of illegitimacy and a lack of trust in governance bodies have been rising since 2018.
Starting in October 2019, overt expressions of cynicism and mistrust in representative bodies
boomed and continued to rise.

• Although Iraqi women and men seem to converge on core grievances in general, they hold some

divergent priorities that are important to consider when reimagining the social contract.

• Women were more pessimistic than men in their future outlook, despite both groups showing similar

trends in hope and hopelessness over time.

• Women were more likely than men to emphasize local, grass-roots variables shaping the future of

Iraq, such as emerging leadership and collective action.

• The Arabic- and Kurdish-speaking populations expressed slightly divergent broad and specific
priorities for the social contract, underscoring the need to attend to these variations in a renewed
social contract.

• Youth-related tweets echoed similar grievances and priorities for the social contract as the overall
population, except on economic grievances. This highlighted different economic concerns, such as
around unemployment and the use and management of state resources.

Page 34

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
REFERENCES

Abdul-Zahra, Q. 2019. “Iraq’s Parliament Approves New Election Law Amid Protests.” AP News, 4

December. https://apnews.com/article/e608aeef311759aeeb7483ad3f9f33d5.

———. 2020. “Protesters Attack US Embassy in Baghdad After Airstrikes.” AP News, 1 January. https://
apnews.com/article/us-news-ap-top-news-mark-esper-international-news-north-carolina-
75228a8a607a44863b57021ac33264dc.

Abdullah, S., T. Gray and E. Clough. 2018. “Clientilism: Factionalism in the Allocation of Public Resources
in Iraq after 2003.” Middle Eastern Studies 54(4): 665-682. https://doi.org/10.1080/00263206.2
018.1444607.

Al-Arabiya News. 2020. “Iraq Imposes Nation-Wide Lockdown to Contain Coronavirus.” 22 March. https://
english.alarabiya.net/News/middle-east/2020/03/22/Iraq-imposes-nation-wide-lockdown-to-
contain-coronavirus-

Aldroubi, M. 2021. “Iraq Passes 1 Million Covid-19 Cases.” The National News, 22 April. https://www.

thenationalnews.com/mena/iraq/iraq-passes-1-million-covid-19-cases-1.1208734.

Al-Jazeera. 2020. “Iraqi Forces Raid Iran-Backed Kataib Hezbollah Base, 14 arrested.” 26 June. https://
www.aljazeera.com/news/2020/6/26/iraqi-forces-raid-iran-backed-kataib-hezbollah-base-14-
arrested.

Al-Kli, S. 2020. “Al-Kadhimi and the Kataib Hezbollah Raid.” Middle East Institute. https://www.mei.edu/

publications/al-kadhimi-and-kataib-hezbollah-raid.

Al-Mashareq and AFP. 2021. “Armed Drone Shot Down Over US Embassy in Baghdad.” 7 July. https://

almashareq.com/en_GB/articles/cnmi_am/features/2021/07/06/feature-02.

Al-Ruabie, A. 2020. “Corruption Continues to Threaten Iraq’s Stability.“ Al-Monitor, 7 October. https://

www.al-monitor.com/originals/2020/10/iraq-corruption-protests-economy.html.

Amnesty International. 2021. “Kurdistan Region of Iraq: Arbitrary Arrests and Enforced Disappearance of
Activists and Journalists.” https://www.amnesty.org/en/latest/news/2021/06/kurdistan-region-of-
iraq-arbitrary-arrests-and-enforced-disappearance-of-activists-and-journalists/.

AP News. 2021. “Iraq’s Health Minister Resigns Over Baghdad Hospital Fire.” 4 May. https://apnews.
com/article/baghdad-middle-east-iraq-coronavirus-pandemic-health-be954b623c8b3bfa6d48ff
2df5d35231.

Arab Center Washington DC. 2020. “The 2019-2020 Arab Opinion Index: Main Results in Brief.” http://

arabcenterdc.org/survey/the-2019-2020-arab-opinion-index-main-results-in-brief/.

Arab Weekly. 2020. “Unrest Erupts Anew in Iraq’s Anniversary of Protests.” 11 November. https://

thearabweekly.com/unrest-erupts-anew-iraqs-anniversary-protests.

Bakra, M. J. 2021. “The War at Home: The Need for Internal Security Sector Reform in Iraqi Kurdistan.”
The Middle East Institute. https://www.mei.edu/sites/default/files/2021-06/The percent20War
percent20at percent20Home percent20- percent20The percent20Need percent20for
percent20Internal percent20Security percent20Sector percent20Reform percent20in
percent20Iraqi percent20Kurdistan.pdf.

BBC News. 2019a. “The Iraq Protests Explained in 100 and 500 Words.” 2 December. https://www.bbc.

com/news/world-middle-east-50595212.

———. 2019b. “Iraq Unrest: Parliament Approves PM Abdul Mahdi’s Resignation.” 1 December. https://

www.bbc.com/news/world-middle-east-50619997.

———. 2019c. “US Attacks Iran-Backed Militia bases in Iraq and Syria.” 30 December. https://www.bbc.

com/news/world-middle-east-50941693.

———. 2020. “Qasem Soleimani: US Kills Top Iranian General in Baghdad Air Strike.” 30 January. https://

www.bbc.com/news/world-middle-east-50979463.

———. 2021. “Iraq Covid Hospital Fire: 82 Dead After ‘Oxygen Tank Explodes’.” 25 April. https://www.

bbc.com/news/world-middle-east-56875804.

Page 35

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS

Borger, J. 2020. “US Launched Airstrikes in Iraq in Retaliation for Rocket Attack, Pentagon Confirms.”
The Guardian, 13 March. https://www.theguardian.com/world/2020/mar/13/us-launch-airstrike-
iraq-retaliation-rocket-attack-killed-three-britain.

Bovens, M., T. Schillemans and R. E. Goodin. 2014. “Public Accountability.” The Oxford Handbook of

Public Accountability, M. Bovens and R. E. Goodins, eds.. Oxford University Press.

Costantini, I.. 2020. „The Iraqi Protest Movement: Social Mobilization Amidst Violence and Instability.“

British Journal of Middle Eastern Studies: 1-18.

DataReportal. 2021. “Digital 2021: Iraq.” https://datareportal.com/reports/digital-2021-iraq#:~:text=There
percent20were percent2025.00 percent20million percent20social,total percent20population
percent20in percent20January percent202021.

DW. 2020a. “Iraq: Thousands Rally Calling for US Troop Withdrawal.” 24 January. https://www.dw.com/

en/iraq-thousands-rally-calling-for-us-troop-withdrawal/a-52134547.

———. 2020b. “Iraqi Parliament Votes to Expel US Troops—Awaits Government Approval.” 5 January.
https://www.dw.com/en/iraqi-parliament-votes-to-expel-us-troops-awaits-government-
approval/a-51892888.

———. 2020c. “Iraq’s Prime Minister-Designate Mohammed Allawi Withdraws from Race.” 1 March.
https://www.dw.com/en/iraqs-prime-minister-designate-mohammed-allawi-withdraws-from-
race/a-52601139.

EASO. 2020. EASO Iraq security situation: Country of origin information report, October 2020. https://
reliefweb.int/sites/reliefweb.int/files/resources/10_2020_EASO_COI_Report_Iraq_Security_
situation_0.pdf.

Enabling Peace in Iraq Center. 2020. Iraq Security and Humanitarian Monitor: May 28-June 4, 2020.

https://enablingpeace.org/ishm257/.

Euro News. 2020. “Iraqi Anti-government Activist Shot Dead in Basra, Say Police.” 22 January. https://

www.euronews.com/2020/01/22/iraqi-anti-government-activist-shot-dead-in-basra-say-police.

France 24. 2018. “Iraq Parliament Breaks Deadlock, Elects New Speaker.” 15 September. https://www.
france24.com/en/20180915-iraq-parliament-elects-sunni-lawmaker-mohammed-al-halbousi-
new-speaker-politics.

———. 2020. “Iraq on Total Lockdown Until March 28 over Virus Fears.” 22 March. https://www.france24.

com/en/20200322-iraq-on-total-lockdown-until-march-28-over-virus-fears.

Garda News. 2018. “Iraq: Parliamentary Elections in Kurdistan Region September 30.” 13 August. https://
www.garda.com/crisis24/news-alerts/144996/iraq-parliamentary-elections-in-kurdistan-region-
september-30.

———. 2020a. “Iraq: Anti-government Protests Reported Nationwide.” 7 June. https://www.garda.
com/crisis24/news-alerts/348776/iraq-anti-government-protests-reported-nationwide-june-7-
update-128.

———. 2020b. “Iraq: Authorities Ease COVID-19 restrictions.” 8 September. https://www.garda.
com/crisis24/news-alerts/377066/iraq-authorities-ease-covid-19-restrictions-september-8-
update-50.

———. 2020c. “Iraq: Nationwide Lockdown Implemented March 22.” 23 March. https://www.garda.com/

crisis24/news-alerts/325526/iraq-nationwide-lockdown-implemented-march-22-update-15.

Gunter, M. 2014. Out of Nowhere: The Kurds of Syria in Peace and War. Hurst. https://www.amazon.com/

Out-Nowhere-Kurds-Syria-Peace/dp/184904435X.

Hassoun, A. 2019. “Tara Fares: The Murder of an Instagram Star.” BBC News, 7 March. https://www.bbc.

co.uk/news/resources/idt-sh/tara_fares.

Human Rights Office and United Nations Assistance Mission for Iraq (UNAMI). 2019. Human Rights Special
Report: Demonstrations in Iraq. https://reliefweb.int/sites/reliefweb.int/files/resources/UNAMI
percent20Special percent20Report percent20on percent20Demonstrations percent20in
percent20Iraq_22 percent20October percent202019.pdf.

Human Rights Watch. 2019. “Iraq: Teargas Cartridges Killing Protesters.” https://www.hrw.org/

news/2019/11/08/iraq-teargas-cartridges-killing-protesters.

IAPP. 2018. “White Paper: Building Ethics into Privacy Frameworks for Big Data and AI.”

Page 36

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
ILO (International Labour Organization). 2020. Global Employment Trends for Youth 2020. https://
www.ilo.org/wcmsp5/groups/public/---dgreports/---dcomm/---publ/documents/publication/
wcms_737648.pdf.
———. 2021. ILOSTAT database.
IOM (International Organization for Migration). 2021. Iraq Mission Dashboard. https://iraqdtm.iom.int/

Dashboard.

Iraq Humanitarian Fund and iMMAP. 2020a. “Weekly Explosive Hazard Incidents Flash News.” 14-20 May.
https://www.humanitarianresponse.info/sites/www.humanitarianresponse.info/files/documents/
files/weekly_explosive_incidents_flash_news_14-20_may_2020.pdf.

———. 2020b. “Weekly Explosive Hazard

Incidents Flash News.” 18-24 June. https://www.
humanitarianresponse.info/sites/www.humanitarianresponse.info/files/documents/files/weekly_
explosive_incidents_flash_news_18-24_jun_2020_0.pdf.

Jüde, J. 2017. “Contesting Borders? The Formation of Iraqi Kurdistan‘s De Facto State.” International

Affairs 93(4): 847–863. https://doi.org/10.1093/ia/iix125.

Karaalp, H. 2020. “Iraqi Premier-Designate Al-Zurfi Opts Out of Forming Cabinet.” Anadolu Agency, 9
April. https://www.aa.com.tr/en/middle-east/iraqi-premier-designate-al-zurfi-opts-out-of-forming-
cabinet/1798434.

Mansour, R. 2021. „Networks of Power.“ Chatham House Research Paper. https://www.chathamhouse.

org/sites/default/files/2021-06/2021-02-25-networks-of-power-mansour.pdf.

Mosimann, Y. 2020. “’Corruption remains endemic’ in Iraq: UN rep.” Rudaw, 26 August. https://www.

rudaw.net/english/middleeast/iraq/260820204.

National Institute of Justice. 2021. “Violent crime.” https://nij.ojp.gov/topics/crimes/violent-crime.
OCHA (Office for the Coordination of Humanitarian Affairs). 2021. Humanitarian Needs Overview: Iraq.
https://www.humanitarianresponse.info/en/operations/iraq/document/iraq-2021-humanitarian-
needs-overview-february-2021-en.

Palani, K., J. Khidir, M. Dechesne et al. 2019. “Strategies to Gain International Recognition: Iraqi Kurdistan’s

September 2017 Referendum for Independence.” Ethnopolitics 20(4): 406-427.

Rasheed, Z., T. Varshalomizde and M. Gadzo. 2020. “Iraq May ‘Lose Control’ After Record Coronavirus
Cases.” Al Jazeera, 4 September. https://www.aljazeera.com/news/2020/9/4/iraq-may-lose-
control-after-record-coronavirus-cases-live.

Raz, D. 2020. The Arab World’s Digital Divide. The Arab Barometer. https://www.arabbarometer.

org/2020/09/the-mena-digital-divide/.

REACH. 2019. Iraq: Assessment on Employment and Working Conditions of Conflict-Affected Women
Across Key Sectors. https://reliefweb.int/report/iraq/iraq-assessment-employment-and-working-
conditions-conflict-affected-women-across-key.

Reporters Without Borders. 2020. “Two Iraqi Journalists Shot Dead After Covering Protests in Basra.”

https://rsf.org/en/news/two-iraqi-journalists-shot-dead-after-covering-protests-basra.

Rubin, A. J., and F. Hassan. 2019. “Iraq Protestors Burn Down Iran Consulate in Night of Anger.” The New
York Times, 29 November. https://www.nytimes.com/2019/11/27/world/middleeast/iraqi-protest-
najaf-iran-burn.html.

Safi, M., O. Holmes and G. Abdul-Ahad. 2020. “Iran Launches Missiles at Iraq Airbases Hosting US and
Coalition Troops.” The Guardian, 8 January. https://www.theguardian.com/world/2020/jan/08/
suleimani-assassination-two-us-airbases-in-iraq-hit-by-missiles-in-retaliation.

Twitter. 2021. “Twitter’s Audience Is Hugely Influential—Here’s What It Means for Brands.” https://
marketing.twitter.com/en_gb/insights/twitters-audience-is-hugely-influential-heres-what-it-
means-for-brands.

United Nations. 2018. “Personal Data Protection and Privacy Principles.” https://archives.un.org/sites/
archives.un.org/files/_un-principles-on-personal-data-protection-privacy-hlcm-2018.pdf.
United Nations Iraq. 2021. “Impact of COVID-19 on Environmental Sustainability in Iraq.” https://www.
iq.undp.org/content/iraq/en/home/library/Stabilization/impact-of-covid-19-on-environmental-
sustainability-in-iraq.html.

Page 37

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
UN News. 2020. “Aid to Vulnerable Iraqis May ‘Come to a Complete Halt Within Weeks’.” 16 January.

https://news.un.org/en/story/2020/01/1055462.

UNHCR (United Nations High Commissioner for Refugees). 2021. “Iraq: September 2021.” Fact sheet.
https://reporting-legacy.unhcr.org/sites/default/files/Iraq%20Factsheet%20-%20September%20
2021.pdf.

United States Institute for Peace. 2021. Iraq Faces Major Governance Challenges—Can Decentralization
Help? https://www.usip.org/publications/2021/03/iraq-faces-major-governance-challenges-can-
decentralization-help.

Van Zomeren, M., and A. Iyer. 2009. “Introduction to the Social And Psychological Dynamics Of Collective
Action.” Journal of Social Issues 65(4): 645-660. https://doi.org/10.1111/j.1540-4560.2009.01618.x.
Voller, Y. 2014. The Kurdish Liberation Movement in Iraq: From Insurgency to Statehood. Routledge.
https://www.routledge.com/The-Kurdish-Liberation-Movement-in-Iraq-From-Insurgency-to-
Statehood/Voller/p/book/9780367868338.

Williams, J. 2018. “The Violent Protests in Iraq, Explained.“ Vox, 8 September. https://www.vox.com/
world/2018/9/7/17831526/iraq-protests-basra-burning-government-buildings-iran-consulate-
water.

World Bank. 2015. The Kurdistan Region of Iraq: Assessing the Economic and Social Impact of the
Syrian Conflict and ISIS. https://documents1.worldbank.org/curated/en/579451468305943474/
pdf/958080PUB0Apri0PUBLIC09781464805486.pdf.

———. 2018. Iraq Economic Monitor: Toward Reconstruction, Economic Recovery and Fostering Social
Cohesion. https://openknowledge.worldbank.org/bitstream/handle/10986/30563/130798-WP-
P164676-Iraq-EcoMonitor-Fall-2018-10-12-18-web.pdf?sequence=1&isAllowed=y.

———. 2020a. Iraq Economic Monitor: Protecting Vulnerable Iraqis in the Time of a Pandemic: The Case
for Urgent Stimulus and Economic Reforms. https://openknowledge.worldbank.org/bitstream/
handle/10986/34749/154260.pdf.

———. 2020b. Iraq: Engaging Youth to Rebuild the Social Fabric in Baghdad. https://www.worldbank.

org/en/news/feature/2020/12/02/iraq-engaging-youth-to-rebuild-the-social-fabric-in-baghdad.

———. 2021.

Iraq Economic Monitor: Seizing

for Reforms and Managing
Volatility.
https://documents.worldbank.org/en/publication/documents-reports/
documentdetail/552761621369308685/iraq-economic-monitor-seizing-the-opportunity-for-
reforms-and-managing-volatility.

the Opportunity

For Annexes, please see the separate Compendium.

Page 38

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
ENDNOTES

1
2

3

Research participants spoke broadly of the security forces but security in Iraq is a complex system made up of a myriad of actors with varying duties.
Founded in 2009, UN Global Pulse is the UN Secretary-General’s initiative on big data and artificial intelligence for development, humanitarian action and
peace. In 2016, Twitter and UN Global Pulse announced a partnership to provide the United Nations with access to Twitter’s data tools to support efforts to
achieve the Sustainable Development Goals. This partnership enables innovative uses of Twitter data while protecting the privacy and safety of Twitter users.
To build the most comprehensive database of male and female Arabic names, the research team merged data sets from https://www.kaggle.com/ishivinal/
arabicnames and https://www.kaggle.com/lailamohammed/arabic-names. Next, the team expanded the database by scraping more data from websites with
Arabic names categorized by gender (http://iid-alraid.com/EnOfName/Male.php and http://iid-alraid.com/EnOfName/Female.php). It then compiled names
most commonly used by Iraqi Twitter users after extracting active accounts and filtering the mentioned names. For Kurdish names, three references were
used: Giwi Mukiriani, 2002, nawi kch u kurani kurdi (Kurdish names for girls and boys), Erbil; Nasr Razazi, 1991, new la komali kurdawrida (Names in Kurdish
society), Stockholm; and Diako Hashmi, n.d., nawi kurdi (Kurdish names).
For more information, see United Nations 2018.
For more information, see UN Global Pulse and IAPP 2018.
See: https://blog.twitter.com/en_us/topics/company/2020/bot-or-not.html.
See the International Telecommunication World Telecommunication/ICT Indicators Database at: https://www.itu.int/.
Ibid.
Arab Center Washington DC 2020.

4
5
6
7
8
9
10 About the 2020 Arab Opinion in Index Survey: The sample size ranged between 1,500 and 2,500 respondents in each country and was 50 percent female
and 50 percent male, with 24 percent aged 18-24, 25 percent aged 25-34, 20 percent aged 35-44, 15 percent aged 45-54, and 15 percent aged 55 years and
older. In terms of education levels, 16 percent were illiterate or had limited education, 34 percent had an education below secondary school, 23 percent had
a secondary school education, and 26 percent achieved a level higher than secondary school.
Al-Arabiya News 2020.

Rasheed, Varshalomizde and Gazo 2020.

REACH 2020.

France 24 2020.

11
12 Mosimann 2020.
13
14 Garda News 2020a.
15 Mehdi and Al-Saffar 2020.
16
17 Human Rights Office and UNAMI 2019.
18 DW 2020c.
19
20 Arab Weekly 2020.
21 Al-Ruabie 2020.
22 World Bank Group 2018.
23 Aldroubi 2021.
24 BBC News 2021.
25 AP News 2021.
26 Voller 2014.
27 Palani et al. 2019.
28 Gunter 2014.
29 Voller 2014 and Palani et al. 2019.
30
Jüde 2017.
31 Costantini 2020.
32 UNHCR 2021 and IOM 2021.
33 Mansour 2021.
34 World Bank 2020a.

Page 39

THE SOCIAL CONTRACT IN IRAQ THROUGH SOCIAL MEDIA: A TWITTER ANALYSIS
United Nations Development Programme
Baghdad, Iraq

www.iq.undp.org


