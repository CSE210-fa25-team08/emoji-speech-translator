from strands import Agent
from strands_tools import handoff_to_user

# Import custom packages
from src.backend.config import BEDROCK_MODEL
from src.backend.utils import load_system_prompt
from src.backend.Translation import Translation

class Translator(Agent):
    """
    A translator agent that is responsible for translating emojis to natural language and vice-versa.
    """
    
    def __init__(self):
        super().__init__(
            model=BEDROCK_MODEL,
            system_prompt=load_system_prompt("translator_prompt.md"),
            tools=[handoff_to_user]
        )
        
        return
    
def main():
    """
    Main function to run and test the Translator Agent
    """
    
    try:
            
        # Create the Translator Agent
        agent = Translator()
        
        while True:
            
            # Complete handoff to user (stops agent execution)
            userInput = agent.tool.handoff_to_user(
                message="Please enter your input (or '\\quit' to exit):",
                breakout_of_loop=False
            )

            # Extract and clean the user input
            userInput = userInput['content'][0]['text']\
                            .replace('User response received: ', '')\
                            .strip()
                
            # Check if user wants to quit
            if userInput == "\\quit":
                print("Goodbye!")
                break
            
            # Pass the user input as a new prompt to the agent,
            # and retrieve the response in a pydantic model
            translation = agent.structured_output(
                Translation,
                userInput
            )
            
            # Print the final output
            print(translation)
        
    except Exception as e:
        print(f"Error in main: {e}")

    return

if __name__ == "__main__":
    main()