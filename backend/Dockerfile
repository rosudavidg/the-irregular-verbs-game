# Python3.8 docker image
FROM python:3.8

# Change workid
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy source files
COPY src/ .

# Run server
CMD ["python", "./server.py"]
