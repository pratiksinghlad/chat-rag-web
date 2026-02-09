/**
 * Database Types
 *
 * This file contains TypeScript types for the Supabase database.
 * In a production app, you would generate these types using:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 */

export interface Database {
  public: {
    Tables: {
      // Add your table types here when you have database tables
      // Example:
      // profiles: {
      //   Row: {
      //     id: string;
      //     created_at: string;
      //     email: string;
      //     full_name: string | null;
      //     avatar_url: string | null;
      //   };
      //   Insert: {
      //     id: string;
      //     email: string;
      //     full_name?: string | null;
      //     avatar_url?: string | null;
      //   };
      //   Update: {
      //     email?: string;
      //     full_name?: string | null;
      //     avatar_url?: string | null;
      //   };
      // };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
