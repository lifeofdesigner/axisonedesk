/**
 * Placeholder Supabase database types.
 *
 * Once a live Supabase project exists and the migrations in supabase/migrations
 * have been applied, regenerate this file with:
 *
 *   pnpm supabase gen types typescript --project-id <project-ref> > src/core/supabase/database.types.ts
 *
 * Do not hand-edit the generated version — this file is a minimal stand-in so the
 * typed Supabase client compiles before the real schema is provisioned.
 */
export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: {
      create_organization_with_owner: {
        Args: {
          org_name: string;
          org_slug: string;
          org_business_type: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
  };
}
