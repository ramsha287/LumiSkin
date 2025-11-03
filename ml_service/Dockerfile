# Use a smaller base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy only essential files first (for caching)
COPY requirements.txt .

# Install dependencies efficiently
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app (excluding large/unnecessary files)
COPY . .

# Optional: prevent Python from buffering logs (for Render logs)
ENV PYTHONUNBUFFERED=1

# Run Uvicorn server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
