# Use the official Python image as a base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /code

# Install system dependencies including OpenSSL and PostgreSQL client
RUN apt-get update && \
    apt-get install -y openssl postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Generate SSL certificate
RUN openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"

# Install dependencies
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code to the container
COPY . /code/

# Copy and set permissions for the entrypoint script
COPY entrypoint.sh /code/
RUN chmod +x /code/entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/code/entrypoint.sh"]

# Expose port 8000 for the application
EXPOSE 8000

# Default command to run the Django server
CMD ["python", "manage.py", "runsslserver", "0.0.0.0:8000", "--certificate", "/code/cert.pem", "--key", "/code/key.pem"]
