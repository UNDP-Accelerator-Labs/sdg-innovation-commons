# Re-thinking Tourism in Zanzibar: How Artificial Intelligence is Creating Value in the Industry

[[type:blog]]

[[source:https://www.undp.org/tanzania/blog/re-thinking-tourism-zanzibar-how-artificial-intelligence-creating-value-industry]]

[Original article published here](https://www.undp.org/tanzania/blog/re-thinking-tourism-zanzibar-how-artificial-intelligence-creating-value-industry)


[[year:2023]]

[[date:2023-02-21T00:00:00.000Z]]

[[continent:Africa]]

[[country:Tanzania]]



Skip to main content
Tanzania
WHO WE ARE
WHAT WE DO
OUR IMPACT
GET INVOLVED
Global
Search
HOME
TANZANIA
BLOG
RE-THINKING TOURISM IN ZANZIBAR: HOW ARTIFICIAL INTELLIGENCE IS CREATING VALUE IN THE INDUSTRY
Re-thinking Tourism in Zanzibar: How Artificial Intelligence is Creating Value in the Industry
FEBRUARY 21, 2023
"Digital technology has transformed the way we live, work, and relate to each other. Now, it is transforming tourism. We need to continue to work together to maximize the opportunities and minimize the challenges that tourism can bring to communities and destinations and make tourism a driver of positive change for all." Zurab Pololikashvili, Secretary-General of the United Nations World Tourism Organization (UNWTO)
Participants in the AI4CI Conference at Hamad Bin Khalifa University in Doha, Qatar, in 2022
UNDP Tanzania
In the world of tourism, online reviews can make or break a business. Understanding customer feedback is crucial for businesses to improve their services and increase customer satisfaction. The UNDP Accelerator Lab Tanzania has been working on using Natural Language Processing (NLP) models to analyze compliments and complaints in the tourism sector by mining online text data from popular booking websites
The UNDP Accelerator Lab Tanzania was invited to the Artificial Intelligence for Collective Intelligence (AI4CI) workshop in the summer of 2022. The technical sessions brought together development actors from around the world and leading minds in the field of data science to advance UNDP's work on leveraging collective intelligence to inform sustainable development. AI4CI was co-organized by the United Nations Development Programme (UNDP) Accelerator Labs, UNDP Innovation in the Arab States, and the Qatar Computing Research Institute's Social Computing Department (QCRI). The Tanzania lab presented its work on using natural language processing model to understand compliments and complaints in the tourism sector by mining online text data from popular booking websites. A series of two experiments focused on quantitative and qualitative web-based data from private and public tourist attractions, which focused on the extraction and application of data analytics methods to clean, annotate, analyze, interpret, and visualize data from popular tourist websites to collect feedback from visitors visiting the Zanzibar islands of Unguja and Pemba. The experiments were done in collaboration with machine learning engineers from Xsense AI, a company based in Dar es Salaam, Tanzania. This blog provides a brief overview of the entire technical process.
Data Collection

The TripAdvisor and booking.com websites were used as sources for the data collection exercise. Ethical web scraping techniques were used to collect texts that represented tourist reviews on a subject (an attraction or service).
Web Scrapping Process

Python programming was first used to scrape data from websites using the Selenium and Beautiful Soup packages. However, we noted significant challenges that hindered our data collection process using Python, as it was slow even when using multi-threading techniques. Additional complexities were observed from the web pages we were scraping, which were highly dynamic, making the Selenium web drivers fail to identify web elements of interest at this time.
Then we combined the Node.js and GoLang programming languages. In web pages where reviews were few and there was less pagination, Node.js performed well, but became problematic in pages with 1000+ reviews (30 + review pages) as it is hard for it to perform asynchronous operations. In such cases, Go was our preferred data scraping language because it was designed with multi-threading at its core and can handle multiple requests at once. At the end of the scrapping exercise, we managed to collect more than 600,000 reviews on both websites.

Text Classification

Based on a preliminary analysis done over the extracted dataset, we were able to determine the type of classification approach to be used in the work. We had 600,000 rows of unlabeled data that needed to go through a two-stage text classification process, first to determine whether a review was positive or negative, and then to classify that review in which service category (location, internet, cleanliness, staff, food, comfort, value for money) it belonged.

We decided to classify the reviews using a deep learning sentiment analysis approach. A deep learning approach would enable the work to analyze the dataset in an unsupervised learning manner. NLP applications typically require large amounts of labeled data in all the classes that need to be classified to achieve high performance. Even with the 600K+ data we had, this was not achievable, especially in the service category. Hence, we used "transfer learning," a technique in deep learning common to computer vision and NLP tasks that uses pre-trained weights from language models to make predictions over your datasets after fine-tuning.

Sentiment Analysis with Transformer Models

NLP tasks have been commonly implemented with recurrent neural network (RNN) architectures such as long short-term memory (LSTM) and gated recurrent units (GRU). Regardless of their powerful capabilities in modeling sequences, they still suffer from information loss over long sentences due to their word-by-word sequential processing. Using these models for sentiment analysis in this work would be challenging and complex. We therefore chose Transformer models, which discard recurrence in RNNs and instead use self-attention mechanisms in their architecture to create powerful language models.

DistillBERT, a pre-trained transformer model from a family of BERT models pre-trained on English with a dataset consisting of 11,038 unpublished books and English Wikipedia, was used in this work. It recorded a 91.3 glue test result on the sequence classification task for predicting polarity (negative or positive).

End-to-end modeling process

First, the reviews are tokenized and represented as one-hot vectors called token encodings. These token encodings are converted to token embeddings, which are vectors living in a lower-dimensional space. The token embeddings are then passed through the encoder block layers to yield a hidden state for each input token. We then down streamed the language model to perform a classification task that outputs two labels (positive and negative).

Zero-Shot-Learning Process
At this stage of the analysis, the first stage of the sentiment analysis has been achieved, as each review has been labelled with either a positive or negative label. In identifying the service category (location, internet, cleanliness, staff, food, comfort, and value for money) a particular review belonged to, a second stage of sentiment analysis had to be done. Here, we performed a multi-label sentiment analysis using a zero-shot learning process, which can work with unlabeled data. In the zero-shot learning process, a model that has already been trained, in this case DistillBERT, is used to predict the review's label or sentiment without any fine-tuning.

Heat map visualization
We needed to create a graphical description of the outputs we had produced from our two-stage sentiment analysis. Since we had collected the geographical location information (longitude and latitude) of each review, we then visualized each review's sentiment using a heat map to understand the spatial distribution of tourists' reviews in each service category, which can be significant for intervention purposes in Zanzibar. The number of data points in each review led us to decide to use a heat map to display the information.

The results of the two experiments were shared with the Zanzibar Tourism Commission for further consideration. At the time of this writing, UNDP and the commission were in the process of hiring a consultant to create an AI model that will be owned by the government. The model will generate real-time feedback on online compliments and complaints from tourists visiting the islands. The results should help the government improve the experience of tourists in Zanzibar.

Lessons learned and conclusion:
The experiments conducted highlighted the importance of utilizing data analytics methods for extracting insights from online feedback. By using Natural Language Processing models to look at both quantitative and qualitative data from popular tourist websites, the lab was able to learn more about how people felt when they went to private and public tourist attractions on the islands of Unguja and Pemba, which are part of the Zanzibar archipelago.

One of the major insights gained from this work is the value of using NLP algorithms to analyze large volumes of unstructured data. By pulling out sentiment, finding key topics, and visualizing patterns in the data, businesses and governments in the tourism industry can learn a lot about how customers feel about their experiences and make decisions based on the data to improve their services.

Another important lesson learned is the significance of cleaning and annotating data to ensure accurate analysis. Cleaning and annotating the data was a very important technical step that made the NLP algorithm more accurate and decreased the chance that the analysis would be biased.

Finally, the collaboration between the UNDP Accelerator Lab, Xsense AI, and technical inputs from experts from the Two Sigma Data Clinic, Accern, and the QCRI of the Hamad Bin Khalifa University (HBKU) highlighted the importance of partnerships in achieving effective data analytics. With the help of machine learning engineers, the lab was able to come up with a more thorough and effective way to collect, analyste, interepret and visualize data using Ai methods.
Missed our previous blog? Please click here.

Written by:
Peter Nyanda, Team Lead, UNDP Accelerator Lab, Tanzania
Deogtatias Mzurikwao, Director and researcher at Xsense AI in Tanzania
Asa Kalonga, Machine Learning Engineer, Xsense Ai, Tanzania
Daniel Mlabwa, Information Management Specialist, UNDP Tanzania

Special thanks to:
Ms. Hafsa Mbamba, the Executive Secretary, Zanzibar Commission for Tourism
United Nations
Development Programme
WHO WE ARE
About Us
Funding and Delivery
Legal Framework
Our Team
WHAT WE DO
Our Focus
Sustainable Development Goals
OUR IMPACT
News Centre
Projects
Publications
Blogs
GET INVOLVED
Careers
Procurement
Report Fraud, Abuse, Misconduct
Submit social or environmental complaint
Scam Alert
Terms of Use
© 2023 United Nations Development Programme


