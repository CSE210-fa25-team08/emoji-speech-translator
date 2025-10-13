# Base Image
FROM python:3.11-slim

# Prevent Python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory inside the container
WORKDIR /app

# Install system dependencies and Python packages
COPY requirements.txt pyproject.toml ./
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && \
    pip install --upgrade pip && \
    pip install -r requirements.txt && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy source code
COPY src/ ./src

# Expose the port to serve the web server from
EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "src.server:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
    