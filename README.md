# Embeddings Workshop

Hands-on exploration of embedding models (Amazon Titan, etc.) — how they work, when they fail, and how to use them well.

## Goals

- Build intuition for what embeddings capture (and don't)
- Compare models: dimensions, similarity behavior, domain performance
- Explore practical patterns: search, clustering, classification, RAG retrieval

## Stack

- **Runtime:** Bun
- **Models:** Amazon Titan Embeddings v2 (via Bedrock), others TBD
- **Viz:** TBD (likely D3 or Observable)

## Experiments

Requires AWS credentials with Bedrock access in `us-east-1`.

```bash
bun install
```

### 1. Hello Embeddings

```bash
bun run hello
```

Embeds three terms via Titan v2 and prints cosine similarities — two will be close, one will be distant:

```
Cosine similarities:
  "cat" <-> "kitten": 0.4376
  "cat" <-> "spaceship": 0.1539
  "kitten" <-> "spaceship": 0.0974
```

### 2. JIRA Ticket Similarity

```bash
bun run jira
```

Embeds 10 fictional JIRA ticket summaries and finds which tickets are most/least similar. Then runs a natural language query ("performance optimization for web page loading") and ranks tickets by relevance — a mini semantic search engine over a backlog.

```
Top 5 most similar ticket pairs:

  0.8432  PROJ-101: Perf: Lazy-load hero image on landing page
           PROJ-102: Perf: Remove render-blocking CSS from above-the-fold content

  0.8107  PROJ-201: Bug: useMemo dependency array missing in CartProvider
           PROJ-202: Bug: useMemo returns stale value in UserProfileContext
  ...

Query: "performance optimization for web page loading"

Most relevant tickets:

  0.5813  PROJ-103: Perf: Add srcset to product image component for responsive loading
  0.5127  PROJ-101: Perf: Lazy-load hero image on landing page
  0.4986  PROJ-102: Perf: Remove render-blocking CSS from above-the-fold content
```

## Docs

- [History of Embeddings](docs/history-of-embeddings.md) — accessible explainer from factor analysis to transformers
