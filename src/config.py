from dotenv import load_dotenv
from strands.models.openai import OpenAIModel
from strands.models import BedrockModel

# Load the environment variables
load_dotenv()

# FM to invoke
# MODEL_ID = "gpt-4o"
MODEL_ID = "global.anthropic.claude-sonnet-4-20250514-v1:0"

# Instantiate the OpenAI model
# OPENAI_MODEL = OpenAIModel(
#     client_args={
#         "api_key": os.getenv("OPENAI_API_KEY"),
#     },
#     # **model_config
#     model_id=MODEL_ID,
#     params={
#         "max_tokens": 1000,
#         "temperature": 0.7,
#     }
# )

# Instantiate the Bedrock model
BEDROCK_MODEL = BedrockModel(
    model_id=MODEL_ID,
    temperature=0.3,
    top_p=0.8,
)