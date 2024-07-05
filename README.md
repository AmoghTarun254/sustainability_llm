# sustainability_llm
A basic chatbot interface that uses Pathway RAG pipelines and a fine-tuned GPT-3.5-turbo-0125 model to answer questions pertaining to sustainability and related frameworks.

# What are sustainability frameworks?
Sustainability frameworks are structured approaches and sets of guidelines designed to help organizations, governments, and individuals manage and measure their environmental, social, and economic impacts. These frameworks provide a systematic way to integrate sustainability into decision-making processes and operations, ensuring that activities support long-term ecological balance, social equity, and economic viability.Here are some key aspects and examples of sustainability frameworks:

**UN Sustainable Development Goals (SDGs)**: A set of 17 global goals established by the United Nations to address various sustainability challenges by 2030. The goals cover areas such as poverty, inequality, climate change, environmental degradation, and peace and justice.

**Global Reporting Initiative (GRI)**: Provides comprehensive sustainability reporting standards that help organizations measure and communicate their economic, environmental, and social impacts. The GRI standards are widely used for sustainability reporting and disclosure.

**ISO 14001**: An international standard for environmental management systems. It provides a framework for organizations to manage their environmental responsibilities systematically and improve their environmental performance.

# Need for this model and use-cases

This chatbot can be used to teach enthusiasts about the tenets of sustainability and sustainable technologies.

This implementation could help enterprises in managing their sustainability initiatives, investments, and impacts in a streamlined manner. 

# Table of content
- [Pipeline Organization](#Pipeline-Organization)
- [Tech Stack involved in this project](#Tech-Stack-involved-in-this-project-and-how-it-works)
- [How to run the project](#How-to-run-the-project)
- [Using the app](#Query-the-documents)

## Pipeline Organization
This folder contains several objects:
- `app.py`, the application code using Pathway and written in Python;
- `config.yaml`, the file containing configuration stubs for the data sources, the OpenAI LLM model, and the web server.
- `requirements.txt`, the dependencies for the pipeline.
- `Dockerfile`, the Docker configuration for running the pipeline in the container;
- `.env`, a short environment variables configuration file where the OpenAI key must be stored;
- `data/`, a folder with relevant files on sustainability.

## Tech Stack involved in this project and how it works

The backend comprises a RAG pipeline from PathwayLLM, specifically, their [demo-question-answering pipeline](https://github.com/pathwaycom/llm-app/tree/main/examples/pipelines/demo-question-answering). The data folder has been loaded with six comprehensive PDFs on sustainability measures and reporting frameworks in the context of climate, finance, etc. The corresponding chunk embeddings from the PDFs are loaded into an in-memory vector store, courtesy of Pathway's RAG pipeline.
The backend hosts a server at port **8000** on your local machine.

The frontend comprises React.js which hosts a server at port **3000** on your local machine. The frontend communicates to the backend via an API call and procures vector embeddings relevant to the user's query. The vector embeddings are then sent to a GPT-3.5-turbo-0125 model that has been fine-tuned on multiple files pertaining to sustainainability, comprising 1224 prompt-completion pairs and 290000 tokens. This model receives the relevant embeddings from the RAG pipeline and uses them as context to generate an answer which is then relayed to the user. Vanta.js has also been used to make the user-interface aesthetically pleasing. 

## How to run the project

### Running the Backend

#### OpenAI API Key Configuration

This example relies on the usage of OpenAI API, which is crucial to perform the embedding part.

**You need to have a working OpenAI key stored in the environment variable OPENAI_API_KEY**.

Please configure your key in a `.env` file by providing it as follows: `OPENAI_API_KEY=sk-*******`. You can refer to the stub file `.env` in this repository, where you will need to paste your key instead of `sk-*******`.

#### Composing a Docker image and running it inside a container

Ensure that you have Docker Desktop installed on your device and set up with valid credentials.

In order to let the pipeline get updated with each change in local files, you need to mount the folder onto the docker. The following commands show how to do that.

```bash
# Make sure you are in the right directory.
cd demo-question-answering

# Build the image in this folder
docker build -t rag .

# Run the image, mount the `data` folder into image and expose the port `8000`
docker run -v "${PWD}/data:/app/data" -p 8000:8000 rag
```
Make sure that you have atleast 8 GB of free space before building the Docker image.




