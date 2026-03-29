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

## Getting Started

```bash
bun install
bun run hello
```

Embeds three terms via Titan v2 and prints cosine similarities — two will be close, one will be distant:

```
Cosine similarities:
  "cat" <-> "kitten": 0.4376
  "cat" <-> "spaceship": 0.1539
  "kitten" <-> "spaceship": 0.0974
```

Requires AWS credentials with Bedrock access in `us-east-1`.
