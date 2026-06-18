export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
        };
        Relationships: [];
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          status?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          campaign_id: string | null;
          name: string;
          source_url: string | null;
          image_url: string | null;
          price: number | null;
          currency: string;
          description: string | null;
          ai_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          campaign_id?: string | null;
          name: string;
          source_url?: string | null;
          image_url?: string | null;
          price?: number | null;
          currency?: string;
          description?: string | null;
          ai_score?: number | null;
        };
        Update: {
          campaign_id?: string | null;
          name?: string;
          source_url?: string | null;
          image_url?: string | null;
          price?: number | null;
          currency?: string;
          description?: string | null;
          ai_score?: number | null;
        };
        Relationships: [];
      };
      affiliate_links: {
        Row: {
          id: string;
          user_id: string;
          product_id: string | null;
          platform: string | null;
          original_url: string | null;
          affiliate_url: string;
          clicks: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id?: string | null;
          platform?: string | null;
          original_url?: string | null;
          affiliate_url: string;
          clicks?: number;
        };
        Update: {
          product_id?: string | null;
          platform?: string | null;
          original_url?: string | null;
          affiliate_url?: string;
          clicks?: number;
        };
        Relationships: [];
      };
      contents: {
        Row: {
          id: string;
          user_id: string;
          campaign_id: string | null;
          product_id: string | null;
          type: string;
          title: string | null;
          body: string | null;
          status: string;
          ai_provider: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          campaign_id?: string | null;
          product_id?: string | null;
          type: string;
          title?: string | null;
          body?: string | null;
          status?: string;
          ai_provider?: string | null;
        };
        Update: {
          campaign_id?: string | null;
          product_id?: string | null;
          type?: string;
          title?: string | null;
          body?: string | null;
          status?: string;
          ai_provider?: string | null;
        };
        Relationships: [];
      };
      ai_jobs: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          job_type: string;
          status: string;
          input: Json | null;
          output: Json | null;
          error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          job_type: string;
          status?: string;
          input?: Json | null;
          output?: Json | null;
          error?: string | null;
        };
        Update: {
          provider?: string;
          job_type?: string;
          status?: string;
          input?: Json | null;
          output?: Json | null;
          error?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
