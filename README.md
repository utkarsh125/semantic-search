# Semantic Search Engine

## Overview

I built this project to understand the core retrieval abstractions used throughout the LangChain ecosystem. *The goal was to learn how documents are processed, embedded, indexed, and retrieved using semantic similarity search.*

This project follows the concepts introduced in [LangChain's Knowledge Base tutorial](https://docs.langchain.com/oss/python/langchain/knowledge-base) and implements them in **typescript** using **bun** instead of **python**.

The system allows me to:
* Load documents from a PDF
* Split large documents into smaller chunks
* Generate embeddings using Cohere
* Store embeddings in a vector index
* Retrieve semantically relevant chunks for a query

**The project is intentionally focused on retrieval and semantic search. It does not include a language model generation step and therefore is not a Retrieval-Augmented Generation (RAG) application.**

However, the retrieval pipeline implemented here serves as the foundation upon which a RAG system could later be built.

Through this project, I gained a practical understanding of:
* Documents and document loaders
* Text splitting strategies
* Embedding models
* Vector indexes
* Similarity search
* Retrievers
* Knowledge base construction

These concepts form the retrieval layer used by many modern AI applications and search systems.
