# How Machines Learn What Words Mean

### A brief history of embeddings — from psychology labs to modern AI

*This started as a conversation over beers. One of us has a psych PhD and made the bold claim that the AI technique powering modern search, recommendation engines, and ChatGPT-style tools is really just a fancy descendant of something psychologists figured out over a century ago. Naturally, this demanded further investigation (and another round). What follows is the thread we pulled on.*

---

## The Core Idea

Imagine you survey 10,000 people and collect dozens of measurements: height, weight, shoe size, income, years of education, credit score, number of siblings, grip strength...

Most of these aren't independent. Height correlates with shoe size. Education correlates with income. There's *hidden structure* underneath the raw numbers — a smaller set of underlying factors (physical build, socioeconomic status) that explain most of what you're seeing.

**The insight:** you can compress messy, high-dimensional data into a compact representation that captures what actually matters. That compact representation is, essentially, an embedding.

This is the whole game. Everything that follows is just increasingly clever ways of doing this compression.

---

## Act I: The Psychologists (1900s–1960s)

### Factor Analysis — Spearman, 1904

Charles Spearman noticed that students who scored well on one type of test tended to score well on others. He proposed that a single hidden factor — *general intelligence* (g) — explained much of the variation across different test scores.

This was **factor analysis**: take a bunch of observed measurements, and mathematically extract the smaller set of latent (hidden) factors driving them. You never directly measure "general intelligence" or "physical build," but the math reveals they're there.

### Principal Component Analysis (PCA)

PCA is the mechanical workhorse version of this idea. Given a big spreadsheet of data, PCA finds the axes along which the data varies the most, then projects everything onto fewer dimensions. It's the "smoosh it down" technique — and it's still used constantly today in data science.

**The takeaway:** by the mid-20th century, researchers had the mathematical tools to say *"these 50 measurements are really driven by 5 underlying factors."* Compress the 50 into 5, and you've built an embedding — you just didn't call it that yet.

---

## Act II: Words as Numbers (1950s–2013)

Here's where it gets interesting for language.

### "You shall know a word by the company it keeps" — J.R. Firth, 1957

A linguist named Firth proposed that the meaning of a word is defined by how it's used — specifically, what other words tend to appear nearby. "Cat" shows up near "fur," "purr," "pet," and "whiskers." So does "kitten." "Spaceship" does not.

This is called **distributional semantics**, and it's a beautifully simple idea: meaning comes from context.

### Turning That Insight Into Math

Researchers started counting. Scan a huge pile of text, build a giant table of how often each word appears near every other word. Each word becomes a row in this table — a very long list of numbers. Words that appear in similar contexts get similar rows.

The problem? These rows are enormous and sparse (mostly zeros). So researchers applied the same compression trick from Act I.

### Latent Semantic Analysis (LSA) — Late 1990s/2000s

Take that giant co-occurrence table and apply a technique called SVD (a close cousin of PCA) to compress it down. Each word goes from a sparse row of 100,000 numbers to a dense vector of maybe 300 numbers.

This worked surprisingly well. Words with similar meanings ended up close together in this compressed space. It was factor analysis applied to language — the "latent factors" were something like topics or semantic dimensions.

### Word2Vec — 2013 (The Breakthrough)

A team at Google took a different approach: instead of counting co-occurrences and compressing, they trained a small neural network to *predict* a word from its neighbors (or vice versa). The byproduct of this training was a dense vector for every word — an embedding.

Word2Vec was the "holy shit" moment. The vectors it produced captured relationships so well that you could do *arithmetic with meaning*:

> **king** − **man** + **woman** ≈ **queen**

> **Paris** − **France** + **Japan** ≈ **Tokyo**

This wasn't programmed. It emerged from the structure of language itself. Same underlying principle — compress observed patterns to find latent structure — but dramatically more powerful because neural networks could capture nonlinear relationships that PCA couldn't.

### GloVe — 2014

Stanford's GloVe (Global Vectors) combined the best of both worlds: it used co-occurrence statistics *and* neural network training. Another strong embedding method, same era.

---

## Act III: Context Changes Everything (2017+)

All the methods above share one critical limitation: **each word gets exactly one embedding, forever.**

"Bank" (the side of a river) and "bank" (where you deposit money) get the *same* vector. The model has no way to distinguish them. This is obviously a problem.

### Attention Is All You Need — 2017

A landmark paper from Google introduced the **Transformer** architecture. The key innovation: when processing a sequence of words, every word's representation is informed by *every other word in the sequence*. The model dynamically adjusts what "bank" means based on whether the sentence is about rivers or finances.

This is the architecture behind GPT, BERT, Claude, and essentially all modern AI language models.

### Modern Embedding Models

Today's embedding models (like the Amazon Titan model we've been experimenting with) are descendants of this Transformer lineage. You feed in an entire sentence, paragraph, or document, and the model returns a single dense vector that captures the *contextual meaning* of the whole input.

These vectors power:
- **Semantic search** — find documents by meaning, not just keyword matching
- **Recommendation systems** — "people who liked this also liked..."
- **RAG (Retrieval-Augmented Generation)** — how ChatGPT-style tools pull in relevant knowledge
- **Clustering and classification** — automatically grouping similar items

---

## The Through-Line

Every step in this history is the same fundamental bet:

> **High-dimensional observable data has lower-dimensional hidden structure, and you can learn to compress into that structure.**

What changed over time was the *data* and the *compression method*:

| Era | Data | Method | Result |
|-----|------|--------|--------|
| 1900s | Test scores, surveys | Factor analysis / PCA | Latent psychological factors |
| 2000s | Word co-occurrence counts | SVD / matrix factorization | Semantic word vectors |
| 2013 | Raw text (billions of words) | Shallow neural networks | Word2Vec — meaning as arithmetic |
| 2017+ | Full sentences and documents | Transformers (deep neural networks) | Context-aware embeddings |

The psychologists had the right idea in 1904. It just took a century of better data, faster computers, and cleverer algorithms to apply it to language at scale.

---

## A Quick Demo

To make this tangible, we embedded three words using Amazon's Titan model and measured how "close" they are in embedding space (using cosine similarity — essentially, how much do these vectors point in the same direction?):

| Pair | Similarity |
|------|-----------|
| "cat" ↔ "kitten" | 0.44 |
| "cat" ↔ "spaceship" | 0.15 |
| "kitten" ↔ "spaceship" | 0.10 |

The model has never been told that cats and kittens are related. It learned this from the structure of language — the same distributional hypothesis Firth described in 1957. Words that appear in similar contexts end up near each other in embedding space.

Spearman would be proud.

## A More Practical Demo: Ticket Similarity

The cat/kitten example is cute, but here's where it gets useful. We took 10 fictional (but realistic) engineering tickets — a mix of performance work, React bugs, CI/CD tasks, and design updates — and embedded each ticket's summary.

The model instantly clusters them by *meaning*, not by keywords:

- The three **perf tickets** (lazy-loading, render-blocking CSS, responsive images) land near each other
- The three **React hook bugs** (useMemo, useEffect) cluster together
- The **CI/CD and monitoring** tickets group up
- The **design/styling** tickets pair off

Then we asked a plain English question — *"performance optimization for web page loading"* — and the model ranked all 10 tickets by relevance. The perf tickets floated to the top, even though none of them literally contain the phrase "performance optimization."

This is **semantic search**: finding things by meaning rather than keyword matching. It's how modern search engines, recommendation systems, and AI assistants retrieve relevant information. And it's built on the exact same foundation — compress observed data into a dense space where similar things are close together.

The psychologists just used test scores. We're using ticket summaries. Same math, different century.

---

*Written up after the beers wore off. Any errors are the IPA's fault.*
