import os
from dotenv import load_dotenv
from strands.models.openai import OpenAIModel

# Load the environment variables
load_dotenv()

# FM to invoke
MODEL_ID = "gpt-4o"

# Instantiate the OpenAI model
OPENAI_MODEL = OpenAIModel(
    client_args={
        "api_key": os.getenv("OPENAI_API_KEY"),
    },
    # **model_config
    model_id=MODEL_ID,
    params={
        "max_tokens": 1000,
        "temperature": 0.7,
    }
)
