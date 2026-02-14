# Supabase Setup for Chat-RAG (pgvector)

This guide walks through setting up the Supabase vector store for the RAG pipeline.

## 1. Enable pgvector Extension

Open the **SQL Editor** in your Supabase Dashboard and run:

```sql
create extension if not exists vector;
```

## 2. Create the `documents` Table

```sql
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(768),
  created_at timestamptz default now()
);

-- Index for fast similarity search (IVFFlat or HNSW)
create index on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
```

> **Why 768 dimensions?** The `text-embedding-004` model from Google produces 768-dimensional vectors.

## 3. Create the `match_documents` RPC Function

```sql
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
$$;
```

## 4. (Optional) Insert Sample Documents

```sql
-- You can insert documents with pre-computed embeddings.
-- In practice, use a script that calls the embedding API first.
insert into documents (content, metadata, embedding)
values (
  'React is a JavaScript library for building user interfaces.',
  '{"source": "docs", "topic": "react"}'::jsonb,
  -- Replace with a real 768-dim vector from text-embedding-004
  array_fill(0, ARRAY[768])::vector
);
```

## 6. Sample Test Data

Use this script to populate your database with dummy data to test the UI and search logic before you have real embeddings.

```sql
-- Insert a few documents with distinct semi-random vectors
insert into documents (content, metadata, embedding)
values
(
  'React is a UI library for components.',
  '{"topic": "react"}'::jsonb,
  (select array_agg(0.1 + random()*0.01) from generate_series(1, 768))::vector
),
(
  'Supabase is a Backend-as-a-Service.',
  '{"topic": "supabase"}'::jsonb,
  (select array_agg(0.5 + random()*0.01) from generate_series(1, 768))::vector
),
(
  'Gemini is a multimodal AI model.',
  '{"topic": "gemini"}'::jsonb,
  (select array_agg(0.9 + random()*0.01) from generate_series(1, 768))::vector
);
```

You can now test your `ChatRag` component. While the AI response might still show an error if your Gemini key isn't set, the **Backend** similarity search (`match_documents`) will now return context from these rows.
