## Bridging generations w/ emojis

# Overview

The Emoji-Speech Translator is a web application that translates between **emoji expressions** and **natural language**—in both directions. The goal is to bridge communication gaps across generations by promoting understanding between varying levels of emoji literacy.  
It leverages **Large Language Models (LLMs)** to perform contextual translations that capture tone, humor, and nuance beyond literal interpretation.

---

# Objectives

* Enable **emoji-to-speech** and **speech-to-emoji** translation.  
* Capture **contextual meaning** rather than literal replacements.  
* Provide an **accessible, fun, and educational tool** for digital communication.

---

# System Design

## Architecture Overview

* **Frontend:**   
  * A lightweight, responsive web interface that allows users to input either emojis or plain text and view the translated result.   
  * It supports a toggle between two modes: **emoji-to-text**, **text-to-emoji**.   
  * A simple fallback “vanilla translation” model ensures degradation when the backend model service is unavailable.  
* **Backend:**   
  * A FastAPI-based microservice that connects to foundation models via AWS Bedrock APIs.  
* **Infrastructure:**   
  * Hosted backend containerized and deployed on **Google Kubernetes Engine (GKE)**.

## System Flow

The request-response lifecycle is illustrated below:

(I think it will be better if we provide some screenshots)

1. **User Input:** The user enters either emojis or plain text and selects the desired translation direction.  
2. **Frontend Request:** 

3. **Backend Processing & Model Invocation:**   
   1. The FastAPI backend validates the payload, determines the translation mode, and formulates a structured prompt for the model.  
   2. The backend sends the prompt to **AWS Bedrock Claude,** receiving the interpretation notes.  
4. **Response Delivery:** 

| {"emoji":"𓇼 ⋆.˚ 𓆉 𓆝 𓆡⋆.˚ 𓇼","speech":"Ocean vibes and peaceful beach energy \- feeling serene and connected to nature"} |
| :---- |

| {"emoji":"😊👍","speech":"happy smile thumbs up"} |
| :---- |

---

# Model Evaluation and Selection

## Initial Experimentation

Our first iteration involved testing the **Hugging Face model** [Elixpo/Emoji-Contextual-Translator](https://huggingface.co/Elixpo/Emoji-Contextual-Translator), trained on \~10,000 samples.  
However, it exhibited overfitting and lacked generalization to unseen emoji combinations. We also investigated the dataset that the model was trained on and found it did not look like the type of data that we expected from our end users.

## LLM Adoption

Next, we evaluated **ChatGPT** and **Claude** for contextual translation:

* **ChatGPT:** Provided high accuracy and fluency, especially with emerging emoji slang.  
* **Claude (via AWS Bedrock):** Delivered competitive quality, faster inference, and flexible cost control.

While we were happy with ChatGPT, using their APIs without a request limitation required us to pay a one-time subscription fee of $20 to avail their Plus version with exponentially increasing costs for their more high-end subscriptions.

We transitioned to AWS Bedrock due to:

* **Multi-model flexibility:** Easily switch between foundation models without changing backend logic.  
* **Cost efficiency:** Pay-per-token model more suitable for prototype-scale usage.  
* **Infrastructure alignment:** Seamless integration with other AWS services for scalability.

---

# Implementation Details

## Frontend

* **Stack:** HTML, CSS, JavaScript  
* **Design Notes:**  
  * Simple, accessible interface with “lovable” UX.  
  * Toggle for translation direction (emoji ↔ text).  
  * Display contextual explanations (e.g., tone or slang meaning).

## Backend

* **Stack:** Python, FastAPI, Uvicorn, Dotenv, YAML  
* **Features:**  
  * REST API for translation requests  
  * Modular integration layer for different LLM endpoints  
  * Environment variable management for API keys  
* **Deployment:** Containerized via Docker, hosted on **GKE**.

## Test

---

# DevOps & Infrastructure

* **Model Hosting:** AWS Bedrock (Claude)  
* **Containerization:** Docker  
* **Deployment:** Google Kubernetes Engine (GKE)  
* **Monitoring & Logging:** k9s for insights into Kubernetes deployments

---

# Testing & Evaluation

* Tested multiple LLMs for translation fidelity, tone preservation, and ambiguity handling.  
* Compared outputs across sample sets of 100 emoji-text pairs.  
* Conducted manual validation for cultural and generational interpretation accuracy.

---

# References

* [Elixpo/Emoji-Contextual-Translator – Hugging Face](https://huggingface.co/Elixpo/Emoji-Contextual-Translator)  
* AWS Bedrock Documentation  
* Anthropic Claude API Documentation  
* OpenAI ChatGPT API Docs

