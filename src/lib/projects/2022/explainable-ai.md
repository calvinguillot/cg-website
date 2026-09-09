# Explainable AI — Master's Thesis (MEng)

2022 | Python

This was my master thesis project for my MEng Degree in Automation and Computer Science. The project was funded by Aalto University and FCAI.

Artificial Intelligence methods, especially the fields of deep-learning and other neural network based architectures have seen an increasing amount of development and deployment over the last decade. These architectures are especially suited to learning from large volumes of labelled data, and even though we know how they are constructed, they turn out to be equivalent to black boxes when it comes to understanding the basis upon which they produce predictions, especially as size of the network increases.

![Explainable AI](../../../assets/2022/lulo_shap_example.webp)

Explainable AI (xAI) methods aim to disclose the key features and values that influence the prediction of black-box classifiers in a manner that is understandable to humans. In this project, the first steps are taken towards developing an interactive xAI system that places a human in the loop; here, a user’s ratings on the sensibility of explanations of individual classifications are used to iteratively find Hyperparameters of the neural net classifier (VGG-16), image segmentator (Felzenszwalb), and xAI (SHAP), to improve the sensibility of the explanations produced without affecting classification accuracy of the classifier in the training set. The users are asked to rate the sensibility of explanation from 1-10. The rating from the users is fed back to the Bayesian optimization algorithm that suggests new Hyperparameters values for the classifier, segmentator, and SHAP modules.

The results of the user study suggests that the Hyperparameters which produced higher ratings on explanations tended to also improve the explainability of the images, thus generally improving the explainability for the image class. Improvement in the out-of-sample accuracy of the classifier (for the same class) was observed in some scenarios, but this still needs more comprehensive evaluation. More sensitive queries for the users, explore a variety of xAI methods, a variety of datasets, as well as conduct larger-scale experiments with users would be required to jointly improve explanations of multiple classes.

You can find the thesis [here.](https://aaltodoc.aalto.fi/items/4b0abcff-324c-438d-9e86-2bcaf8e7c798)
