# X-Ray Vision Intelligent Assistant for Cancer Detection

[[focal_point:salome.nakazwe@undp.org]]

[[year:2025]]

[[type:solution]]

[[sdgs:3. Good health and well-being]]
[[sdgs:10. Reduced innequalities]]
[[sdgs:11. Sustainable cities and communities]]
[[thematic_areas:artificial intelligence]]
[[thematic_areas:health]]
[[thematic_areas:network]]
[[thematic_areas:diagnosis]]
[[thematic_areas:computer vision]]
[[country:Zambia]]
[[latlng:-13.460110018365599,27.7742123347968]]
[[gender:female]]

> Title of the innovation

X-Ray Vision Intelligent Assistant for Cancer Detection

> Images


![Missing alt text](https://undp-accelerator-labs.github.io/Archive_SDG_Commons_2025_01/blobs/solutions/b90c8692-0598-468f-acbd-698ff6f5cad5.png)


> Brief description of the innovation

In recent years, neural network artificial intelligence models, specifically computer vision neural models, have achieved superhuman performance across popular computer vision benchmarks such as ImageNet and MNIST. The great improvements that have been made in research have not yet translated into value in our health system. Currently, a lot of people with suspected breast cancer have to wait in a long waiting queue before receiving a diagnosis. This is because of a high doctor-to-patient ratio. Here, we leverage state-of-the-art deep neural models to develop a state-of-the-art neural cancer detection model to work as an assistant to the doctor in breast cancer detection via x-rays. We choose x-rays because they are widely available across hospitals. Our model also outputs its confidence in the predictions that can be used by the doctor to measure the reliability of the prediction.

> Do you have a prototype for your innovation?

- yes

> Commercial Viability of the Innovation

Our computer vision models will be used to assist doctors in diagnosing breast cancer.  To allow the doctors to interpret the model's predictions, our models output confidence in its prediction. The prediction only takes a few milliseconds. Thus, the neural models can handle thousands of x-ray images per hour. This enables the doctor to attend to a lot of patients in the shortest period of time. Thus value is created for both doctors and their respective hospitals; and the patients at large. We will be able to get revenue through subscription or pay-as-go partnerships with hospitals.
The challenge prize will allow us in several ways:
1. Making partnerships with the hospitals/Doctors: This will allow us to demonstrate the effectiveness of our models and to get direct feedback on the custom requirements of each hospital.
2. Acquire more training data: The current dataset used is quite small. We were able to achieve outstanding performance through data augmentation. Our models can still benefit from additional training data. Including local x-ray images will also adapt our models to a diverse set of x-ray resolutions. This will make our models more robust.
3. Buy GPU's for serving our models: We relied on google collaboratory GPU's for training our models. However, we cannot use Google Collab for serving our models in hospitals due to the time limitations of the Google Collab resource. Therefore, there is a need to acquire GPU's to serve these models. 
4. Develop Android and iOS Apps: Currently, we only provide a web interface to our models. The challenge prize will allow us to develop Android and iOS apps.

> Technical Feasibility

We implement a deep convolution neural network built on top of the well-known ResNet models. The model was trained on a publicly available breast cancer dataset. To improve the model's performance, we augmented the training set with related x-ray images. This boosted the performance by more than 10%. We leveraged Google Collaboratory for training our model via 20 epochs. 
To serve the model, we wrap it inside a flask API. Flask is a python web framework. Our initial design allows the user to upload an image, and in return, they receive the model's prediction about the existence or the absence of breast cancer in the image. The predictions are accompanied by the model's confidence, which makes them more interpretable.

> Anticipated Social Impact

The doctor can then go through x-ray images much faster, allowing people to get their results in the shortest possible time. This will create value for both doctors and their respective hospitals and the patients at large.

> Additional image(s)


![Missing alt text](https://undp-accelerator-labs.github.io/Archive_SDG_Commons_2025_01/blobs/solutions/d6fba727-5893-4a29-be9e-0e5bcfca7d2f.png)

![Missing alt text](https://undp-accelerator-labs.github.io/Archive_SDG_Commons_2025_01/blobs/solutions/e3b47e40-76dc-4c45-bba9-9ee64b13b58e.png)


> Name of the Innovator

Prudence Kavumba

> Age

- 19-35

> Note

Thematic area tags generated using: Maarten Grootendorst, KeyBERT: Minimal keyword extraction with BERT. 2020, https://doi.org/10.5281/zenodo.4461265.
