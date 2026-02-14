-- Enable pgvector
create extension if not exists vector;

-- FIX: The error "different vector dimensions 768 and 3072" implies your DB expects 3072.
-- We must thoroughly clear the old schema.

-- 1. DROP EVERYTHING related to the old schema.
-- The "CASCADE" option ensures that if the function depends on the table, it gets dropped too.
DROP TABLE IF EXISTS documents CASCADE;

-- Drop any lingering functions with various signatures just in case
DROP FUNCTION IF EXISTS match_documents(vector(3072), float, int);
DROP FUNCTION IF EXISTS match_documents(vector(3072), float4, int);
DROP FUNCTION IF EXISTS match_documents(vector(3072), float8, int);
DROP FUNCTION IF EXISTS match_documents(vector(768), float, int);
DROP FUNCTION IF EXISTS match_documents;

-- 2. Create Table with 768 Dimensions (Gemini Standard)
create table documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(768), 
  created_at timestamptz default now()
);

-- Index for performance
create index on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 3. Recreate Search Function (768)
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

-- 4. Insert Test Data to verify it works
insert into documents (content, metadata, embedding)
values
(
  'React is a library for building user interfaces.',
  '{"topic": "react"}'::jsonb,
  (select array_agg(0.1) from generate_series(1, 768))::vector
);
