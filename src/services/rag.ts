/**
 * RAG Pipeline Orchestrator
 *
 * Coordinates the full Retrieval-Augmented Generation flow:
 * 1. Embed the user query
 * 2. Search Supabase for similar documents
 * 3. Format the context
 * 4. Generate the final response
 */

import { supabase } from '@/lib/supabase';
import { generateEmbedding, generateChatResponse } from '@/services/gemini';
import type { SupabaseDocument, RagContext } from '@/types/chat';
import { RAG_CONFIG } from '@/types/chat';

/**
 * Execute the full RAG pipeline for a user message.
 * Returns the AI-generated response string.
 */
export async function executeRagPipeline(userMessage: string): Promise<string> {
  // Step 1: Vectorize the user query
  const embedding = await generateEmbedding(userMessage);

  // Step 2: Search for similar documents in Supabase
  const documents = await searchDocuments(embedding);

  // Step 3: Build the context from retrieved documents
  const context = formatContext(documents);

  // Step 4: Generate the response with context-augmented prompt
  return generateChatResponse(userMessage, context.formattedContext);
}

/** Call the match_documents RPC on Supabase to perform cosine similarity search */
async function searchDocuments(
  queryEmbedding: number[]
): Promise<SupabaseDocument[]> {
  // Supabase client rpc typing requires explicit arg types for non-trivial function signatures
  const { data, error } = await (supabase.rpc as CallableFunction)('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: RAG_CONFIG.MATCH_THRESHOLD,
    match_count: RAG_CONFIG.MATCH_COUNT,
  });

  if (error) {
    console.warn('Supabase vector search failed, proceeding without context:', (error as { message: string }).message);
    return [];
  }

  if (!data || !Array.isArray(data)) {
    return [];
  }

  return (data as Record<string, unknown>[]).map((row) => ({
    id: String(row.id ?? ''),
    content: String(row.content ?? ''),
    metadata: (row.metadata as Record<string, string>) ?? {},
    similarity: Number(row.similarity ?? 0),
  }));
}

/** Format retrieved documents into a single context string for the LLM */
function formatContext(documents: SupabaseDocument[]): RagContext {
  if (documents.length === 0) {
    return { documents, formattedContext: '' };
  }

  const formattedContext = documents
    .map(
      (doc, idx) =>
        `[Document ${idx + 1}] (similarity: ${doc.similarity.toFixed(3)})\n${doc.content}`
    )
    .join('\n\n');

  return { documents, formattedContext };
}
