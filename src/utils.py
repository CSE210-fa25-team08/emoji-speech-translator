from importlib.resources import files

def load_system_prompt(prompt_file: str) -> str | None:
    """
    Load the system prompt from the given file.

    Args:
        prompt_file: The name of the prompt file to load

    Returns:
        The system prompt from the given file
    """
    
    # Load the system prompt from the given file
    try:
        return files("src").joinpath(prompt_file).read_text(encoding="utf-8")
    except FileNotFoundError as e:
        print(f"Error: Prompt file {prompt_file} not found: {e}")
    except Exception as e:
        print(f"Error loading prompt file {prompt_file}: {e}")
    
    return None