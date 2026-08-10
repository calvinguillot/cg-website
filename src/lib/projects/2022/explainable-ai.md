# Explainable AI — Master's Thesis (MEng)

_2022 | Aalto University & FCAI, Espoo, Finland_

Master's thesis for MEng in Automation Engineering. Funded by Aalto University and FCAI (Finnish Center for AI). Published at RBCDSAI FCAI Conference on Deployable AI 2022.

Developed an interactive Human-in-the-Loop system to improve the interpretability of deep learning models. Users rated the sensibility of explanations (1–10) produced for individual image classifications by a VGG-16 network. Ratings fed back into a Bayesian Optimization loop that proposed new hyperparameters for three modules: the VGG-16 classifier, the Felzenszwalb image segmentator, and the SHAP explainer. Results showed that higher-rated explanation hyperparameters generally improved explainability without degrading classifier accuracy in the training set.

_Technologies: Python, PyTorch, VGG-16 (CNN), SHAP (Explainable AI), Bayesian Optimization, Felzenszwalb segmentation, user experience research._
_Paper: [aaltodoc.aalto.fi](https://aaltodoc.aalto.fi/items/4b0abcff-324c-438d-9e86-2bcaf8e7c798)_
