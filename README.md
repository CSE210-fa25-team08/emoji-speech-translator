# Emoji-Speech Translator

**A web-app for translating emojis to natural language and vice-versa**

---

## Overview

The **Emoji-Speech Translator** is an AI-powered web application that performs **bidirectional translation** between **GenZ emoji patterns** and **natural language text**.

It helps bridge generational and cultural gaps in digital communication by providing human-like understanding of emoji usage, modern slang, and tone in conversations.

---

## Key Features

* **Emoji → Speech**: Translates complex emoji sequences into expressive natural language, capturing tone and context.
* **Speech → Emoji**: Converts sentences into relevant and culturally aligned emoji patterns.
* **GenZ Slang Understanding**: Interprets modern slang such as *“no cap” 🧢*, *“periodt” 💅*, and meme-style expressions.
* **Context-Aware Translation**: Considers tone, platform (texting, social media), and emotional nuance.
* **Structured Responses**: Returns translation results in a consistent JSON format for programmatic use.

---

## System Design

The project follows a modular structure with separation of concerns between app logic, configuration, and deployment.

```
.
├── Dockerfile                 # Docker build configuration
├── k8s/                       # Kubernetes manifests for deployment
│   ├── config.yaml
│   ├── deployment.yaml
│   ├── ingress.yaml
│   ├── managed-cert.yaml
│   └── service.yaml
├── src/                       # Application source code
│   ├── server.py              # FastAPI server entrypoint
│   ├── translator.py          # Core translation logic
│   ├── Translation.py         # Structured translation agent
│   ├── utils.py               # Helper utilities
│   ├── config.py              # Configuration handling
│   ├── translator_prompt.md   # LLM prompt defining translation behavior
│   └── emoji_speech_translator.egg-info/
├── pyproject.toml             # Project metadata and build config
├── requirements.txt           # Python dependencies
├── README.md
└── LICENSE
```

---

## Tech Stack

* **Language**: Python 3.13
* **Framework**: FastAPI
* **Containerization**: Docker
* **Orchestration**: Kubernetes (GKE recommended)
* **LLM Integration**: Uses system prompt defined in `translator_prompt.md`
* **Managed Certificate**: Google Managed SSL for HTTPS traffic

---

## 🚀 Running the Application

### 1. Build Docker Image

```bash
docker build -t emoji-speech-translator .
```

### 2. Run Locally

```bash
docker run -p 8080:8080 emoji-speech-translator
```

The service will start on `http://localhost:8080`.

### 3. Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```

Ensure that:

* `managed-cert.yaml` defines your domain certificate.
* `ingress.yaml` routes traffic to the service correctly.

---

## Translation API

### Endpoint

`POST /translate`

### Request Format

```json
{
  "mode": "emoji-to-speech" | "speech-to-emoji",
  "text": "💀💀💀"
}
```

### Response Format

```json
{
  "emoji": "💀💀💀",
  "speech": "I'm dead — that's hilarious or unbelievably funny"
}
```

---

## Examples

### Example 1 — Emoji → Speech

**Input**

```json
{ "mode": "emoji-to-speech", "text": "😭😭😭" }
```

**Output**

```json
{
  "emoji": "😭😭😭",
  "speech": "Crying so hard — emotionally overwhelmed or deeply moved"
}
```

### Example 2 — Speech → Emoji

**Input**

```json
{ "mode": "speech-to-emoji", "text": "I'm so tired" }
```

**Output**

```json
{
  "emoji": "😩💤",
  "speech": "I'm so tired"
}
```

---

## Developer Notes

* The translation logic is prompt-based and can integrate with any LLM API supporting structured responses.
* The prompt specification is defined in [`src/translator_prompt.md`](src/translator_prompt.md).
* To extend slang coverage or add new emoji patterns, modify `translator.py` or enrich the system prompt.

---

## License

This project is licensed under the [MIT License](./LICENSE).

