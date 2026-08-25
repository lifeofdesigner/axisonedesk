export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_prompt_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          label: string
          template: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          label: string
          template?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          label?: string
          template?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      ai_providers: {
        Row: {
          connected_at: string | null
          docs_url: string | null
          is_connected: boolean
          key: string
          label: string
          models: Json
          notes: string | null
        }
        Insert: {
          connected_at?: string | null
          docs_url?: string | null
          is_connected?: boolean
          key: string
          label: string
          models?: Json
          notes?: string | null
        }
        Update: {
          connected_at?: string | null
          docs_url?: string | null
          is_connected?: boolean
          key?: string
          label?: string
          models?: Json
          notes?: string | null
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          cost_usd: number
          created_at: string
          id: string
          input_tokens: number
          model: string | null
          org_id: string | null
          output_tokens: number
          prompt_template_key: string | null
          provider_key: string | null
          user_id: string | null
        }
        Insert: {
          cost_usd?: number
          created_at?: string
          id?: string
          input_tokens?: number
          model?: string | null
          org_id?: string | null
          output_tokens?: number
          prompt_template_key?: string | null
          provider_key?: string | null
          user_id?: string | null
        }
        Update: {
          cost_usd?: number
          created_at?: string
          id?: string
          input_tokens?: number
          model?: string | null
          org_id?: string | null
          output_tokens?: number
          prompt_template_key?: string | null
          provider_key?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_usage_logs_provider_key_fkey"
            columns: ["provider_key"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["key"]
          },
        ]
      }
      announcements: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: string
          is_active: boolean
          severity: string
          starts_at: string
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          severity?: string
          starts_at?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          severity?: string
          starts_at?: string
          title?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json
          org_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          org_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          org_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_resources: {
        Row: {
          capacity: number
          created_at: string
          deleted_at: string | null
          id: string
          name: string
          org_id: string
          resource_type: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          deleted_at?: string | null
          id?: string
          name: string
          org_id: string
          resource_type?: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string
          org_id?: string
          resource_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_resources_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          customer_id: string | null
          deleted_at: string | null
          ends_at: string
          id: string
          notes: string | null
          org_id: string
          resource_id: string | null
          starts_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          ends_at: string
          id?: string
          notes?: string | null
          org_id: string
          resource_id?: string | null
          starts_at: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          ends_at?: string
          id?: string
          notes?: string | null
          org_id?: string
          resource_id?: string | null
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "booking_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string
          deleted_at: string | null
          description: string
          icon: string
          id: string
          name: string
          org_id: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          deleted_at?: string | null
          description?: string
          icon?: string
          id?: string
          name: string
          org_id: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          deleted_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_redemptions: number | null
          times_redeemed: number
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          times_redeemed?: number
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          times_redeemed?: number
          valid_until?: string | null
        }
        Relationships: []
      }
      customer_notes: {
        Row: {
          author_id: string
          body: string
          created_at: string
          customer_id: string
          id: string
          org_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          customer_id: string
          id?: string
          org_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          customer_id?: string
          id?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_notes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          name: string
          org_id: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          name: string
          org_id: string
          phone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          name?: string
          org_id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          created_at: string
          customer_id: string | null
          deleted_at: string | null
          expected_close_date: string | null
          id: string
          org_id: string
          owner_id: string | null
          stage: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          expected_close_date?: string | null
          id?: string
          org_id: string
          owner_id?: string | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title: string
          updated_at?: string
          value?: number
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          expected_close_date?: string | null
          id?: string
          org_id?: string
          owner_id?: string | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          title?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      factorymvp_activity_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string
          business_id: string
          created_at: string
          entity_label: string | null
          entity_type: string
          id: string
          summary: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name: string
          business_id: string
          created_at?: string
          entity_label?: string | null
          entity_type: string
          id?: string
          summary: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string
          business_id?: string
          created_at?: string
          entity_label?: string | null
          entity_type?: string
          id?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "factorymvp_activity_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "factorymvp_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      factorymvp_business_users: {
        Row: {
          business_id: string
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "factorymvp_business_users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "factorymvp_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      factorymvp_businesses: {
        Row: {
          alert_email: string | null
          created_at: string
          favicon_url: string | null
          id: string
          logo_url: string | null
          name: string
          primary_color: string
        }
        Insert: {
          alert_email?: string | null
          created_at?: string
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string
        }
        Update: {
          alert_email?: string | null
          created_at?: string
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string
        }
        Relationships: []
      }
      factorymvp_contact_requests: {
        Row: {
          business_name: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
        }
        Relationships: []
      }
      factorymvp_deliveries: {
        Row: {
          business_id: string
          delivered_at: string | null
          destination: string | null
          dispatched_at: string | null
          driver: string | null
          eta: string | null
          id: string
          order_id: string | null
          status: string
        }
        Insert: {
          business_id: string
          delivered_at?: string | null
          destination?: string | null
          dispatched_at?: string | null
          driver?: string | null
          eta?: string | null
          id?: string
          order_id?: string | null
          status?: string
        }
        Update: {
          business_id?: string
          delivered_at?: string | null
          destination?: string | null
          dispatched_at?: string | null
          driver?: string | null
          eta?: string | null
          id?: string
          order_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "factorymvp_deliveries_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "factorymvp_businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factorymvp_deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "factorymvp_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      factorymvp_employees: {
        Row: {
          business_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          role: string
          status: string
          task_assigned: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          role: string
          status?: string
          task_assigned?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          role?: string
          status?: string
          task_assigned?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "factorymvp_employees_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "factorymvp_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      factorymvp_inventory: {
        Row: {
          business_id: string
          category: string | null
          id: string
          item_name: string
          quantity: number
          reorder_threshold: number
          unit: string
          unit_cost: number
          updated_at: string
        }
        Insert: {
          business_id: string
          category?: string | null
          id?: string
          item_name: string
          quantity?: number
          reorder_threshold?: number
          unit?: string
          unit_cost?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          category?: string | null
          id?: string
          item_name?: string
          quantity?: number
          reorder_threshold?: number
          unit?: string
          unit_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "factorymvp_inventory_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "factorymvp_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      factorymvp_orders: {
        Row: {
          business_id: string
          created_at: string
          customer_name: string
          due_date: string | null
          id: string
          notes: string | null
          order_number: string
          part_name: string
          quantity: number
          status: string
          unit_price: number
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_name: string
          due_date?: string | null
          id?: string
          notes?: string | null
          order_number: string
          part_name: string
          quantity?: number
          status?: string
          unit_price?: number
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_name?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          part_name?: string
          quantity?: number
          status?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "factorymvp_orders_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "factorymvp_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      factorymvp_payments: {
        Row: {
          amount: number
          business_id: string
          customer_name: string
          due_date: string | null
          id: string
          order_id: string | null
          paid_at: string | null
          status: string
        }
        Insert: {
          amount: number
          business_id: string
          customer_name: string
          due_date?: string | null
          id?: string
          order_id?: string | null
          paid_at?: string | null
          status?: string
        }
        Update: {
          amount?: number
          business_id?: string
          customer_name?: string
          due_date?: string | null
          id?: string
          order_id?: string | null
          paid_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "factorymvp_payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "factorymvp_businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factorymvp_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "factorymvp_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string
          default_enabled: boolean
          description: string
          id: string
          key: string
          module_key: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_enabled?: boolean
          description: string
          id?: string
          key: string
          module_key?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_enabled?: boolean
          description?: string
          id?: string
          key?: string
          module_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      files: {
        Row: {
          bucket: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          filename: string
          folder: string
          id: string
          mime_type: string | null
          org_id: string | null
          path: string
          size_bytes: number | null
          uploaded_by: string | null
        }
        Insert: {
          bucket?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          filename: string
          folder?: string
          id?: string
          mime_type?: string | null
          org_id?: string | null
          path: string
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Update: {
          bucket?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          filename?: string
          folder?: string
          id?: string
          mime_type?: string | null
          org_id?: string | null
          path?: string
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transactions: {
        Row: {
          created_at: string
          direction: Database["public"]["Enums"]["inventory_transaction_direction"]
          id: string
          occurred_at: string
          org_id: string
          product_id: string
          quantity: number
          source: Database["public"]["Enums"]["inventory_transaction_source"]
          source_id: string | null
        }
        Insert: {
          created_at?: string
          direction: Database["public"]["Enums"]["inventory_transaction_direction"]
          id?: string
          occurred_at?: string
          org_id: string
          product_id: string
          quantity: number
          source?: Database["public"]["Enums"]["inventory_transaction_source"]
          source_id?: string | null
        }
        Update: {
          created_at?: string
          direction?: Database["public"]["Enums"]["inventory_transaction_direction"]
          id?: string
          occurred_at?: string
          org_id?: string
          product_id?: string
          quantity?: number
          source?: Database["public"]["Enums"]["inventory_transaction_source"]
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          invoice_number: string
          notes: string | null
          org_id: string
          paid_at: string | null
          status: string
          stripe_invoice_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          notes?: string | null
          org_id: string
          paid_at?: string | null
          status?: string
          stripe_invoice_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          org_id?: string
          paid_at?: string | null
          status?: string
          stripe_invoice_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_channels: {
        Row: {
          config: Json
          is_connected: boolean
          key: string
          label: string
        }
        Insert: {
          config?: Json
          is_connected?: boolean
          key: string
          label: string
        }
        Update: {
          config?: Json
          is_connected?: boolean
          key?: string
          label?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          metadata: Json
          org_id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          org_id: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          org_id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          actor_id: string | null
          created_at: string
          description: string
          id: string
          order_id: string
          org_id: string
          type: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          description: string
          id?: string
          order_id: string
          org_id: string
          type: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          description?: string
          id?: string
          order_id?: string
          org_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_events_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total: number | null
          order_id: string
          org_id: string
          product_id: string | null
          product_name: string
          quantity: number
          sku: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total?: number | null
          order_id: string
          org_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          sku: string
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number | null
          order_id?: string
          org_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          sku?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          order_id: string
          org_id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          order_id: string
          org_id: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          order_id?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_notes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_notes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          deleted_at: string | null
          discount_amount: number
          fulfillment_status: Database["public"]["Enums"]["order_fulfillment_status"]
          id: string
          order_number: number
          org_id: string
          payment_status: Database["public"]["Enums"]["order_payment_status"]
          shipping_amount: number
          subtotal: number
          tax_amount: number
          total: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          discount_amount?: number
          fulfillment_status?: Database["public"]["Enums"]["order_fulfillment_status"]
          id?: string
          order_number: number
          org_id: string
          payment_status?: Database["public"]["Enums"]["order_payment_status"]
          shipping_amount?: number
          subtotal?: number
          tax_amount?: number
          total?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          discount_amount?: number
          fulfillment_status?: Database["public"]["Enums"]["order_fulfillment_status"]
          id?: string
          order_number?: number
          org_id?: string
          payment_status?: Database["public"]["Enums"]["order_payment_status"]
          shipping_amount?: number
          subtotal?: number
          tax_amount?: number
          total?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_feature_flags: {
        Row: {
          enabled: boolean
          flag_id: string
          org_id: string
          updated_at: string
        }
        Insert: {
          enabled: boolean
          flag_id: string
          org_id: string
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          flag_id?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_feature_flags_flag_id_fkey"
            columns: ["flag_id"]
            isOneToOne: false
            referencedRelation: "feature_flags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_feature_flags_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          invited_by: string | null
          joined_at: string | null
          org_id: string
          role_id: string
          status: Database["public"]["Enums"]["member_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          org_id: string
          role_id: string
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          org_id?: string
          role_id?: string
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          business_type: string
          created_at: string
          currency: string
          deleted_at: string | null
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          slug: string
          status: Database["public"]["Enums"]["organization_status"]
          stripe_customer_id: string | null
          timezone: string
          updated_at: string
        }
        Insert: {
          business_type: string
          created_at?: string
          currency?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          slug: string
          status?: Database["public"]["Enums"]["organization_status"]
          stripe_customer_id?: string | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          business_type?: string
          created_at?: string
          currency?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["organization_status"]
          stripe_customer_id?: string | null
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          description: string | null
          id: string
          key: string
          module_key: string
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          module_key: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          module_key?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          id: string
          is_active: boolean
          key: string
          module_limits: Json
          name: string
          price_monthly: number
          price_yearly: number
          seat_limit: number | null
        }
        Insert: {
          id?: string
          is_active?: boolean
          key: string
          module_limits?: Json
          name: string
          price_monthly: number
          price_yearly: number
          seat_limit?: number | null
        }
        Update: {
          id?: string
          is_active?: boolean
          key?: string
          module_limits?: Json
          name?: string
          price_monthly?: number
          price_yearly?: number
          seat_limit?: number | null
        }
        Relationships: []
      }
      platform_admins: {
        Row: {
          granted_at: string
          granted_by: string | null
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          accent_color: string
          active_ai_provider: string | null
          ai_assistant_enabled: boolean
          ai_default_model: string | null
          default_company_logo_url: string | null
          favicon_url: string | null
          id: boolean
          logo_url: string | null
          maintenance_message: string | null
          maintenance_mode: boolean
          platform_name: string
          primary_color: string
          secondary_color: string
          support_email: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string
          active_ai_provider?: string | null
          ai_assistant_enabled?: boolean
          ai_default_model?: string | null
          default_company_logo_url?: string | null
          favicon_url?: string | null
          id?: boolean
          logo_url?: string | null
          maintenance_message?: string | null
          maintenance_mode?: boolean
          platform_name?: string
          primary_color?: string
          secondary_color?: string
          support_email?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string
          active_ai_provider?: string | null
          ai_assistant_enabled?: boolean
          ai_default_model?: string | null
          default_company_logo_url?: string | null
          favicon_url?: string | null
          id?: boolean
          logo_url?: string | null
          maintenance_message?: string | null
          maintenance_mode?: boolean
          platform_name?: string
          primary_color?: string
          secondary_color?: string
          support_email?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_settings_active_ai_provider_fkey"
            columns: ["active_ai_provider"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["key"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          org_id: string
          product_id: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          product_id: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          product_id?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          name: string
          org_id: string
          price_delta: number
          product_id: string
          quantity: number
          sku: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          org_id: string
          price_delta?: number
          product_id: string
          quantity?: number
          sku: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          org_id?: string
          price_delta?: number
          product_id?: string
          quantity?: number
          sku?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string
          category_id: string | null
          cost_price: number
          created_at: string
          deleted_at: string | null
          description: string
          id: string
          location: string
          name: string
          org_id: string
          quantity: number
          reorder_point: number
          selling_price: number
          sku: string
          stock_status: string | null
          supplier_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          barcode?: string
          category_id?: string | null
          cost_price?: number
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: string
          location?: string
          name: string
          org_id: string
          quantity?: number
          reorder_point?: number
          selling_price?: number
          sku: string
          stock_status?: string | null
          supplier_id?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          barcode?: string
          category_id?: string | null
          cost_price?: number
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: string
          location?: string
          name?: string
          org_id?: string
          quantity?: number
          reorder_point?: number
          selling_price?: number
          sku?: string
          stock_status?: string | null
          supplier_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          locale: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          locale?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          locale?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          line_total: number | null
          org_id: string
          product_id: string | null
          product_name: string
          purchase_order_id: string
          quantity: number
          sku: string
          unit_cost: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total?: number | null
          org_id: string
          product_id?: string | null
          product_name: string
          purchase_order_id: string
          quantity: number
          sku: string
          unit_cost?: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number | null
          org_id?: string
          product_id?: string | null
          product_name?: string
          purchase_order_id?: string
          quantity?: number
          sku?: string
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          expected_date: string | null
          id: string
          notes: string | null
          org_id: string
          status: string
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          expected_date?: string | null
          id?: string
          notes?: string | null
          org_id: string
          status?: string
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          expected_date?: string | null
          id?: string
          notes?: string | null
          org_id?: string
          status?: string
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: string
          is_system_role: boolean
          name: string
          org_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_system_role?: boolean
          name: string
          org_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_system_role?: boolean
          name?: string
          org_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          org_id: string
          staff_id: string
          starts_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          org_id: string
          staff_id: string
          starts_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          org_id?: string
          staff_id?: string
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string | null
          full_name: string
          hire_date: string | null
          hourly_rate: number | null
          id: string
          org_id: string
          phone: string | null
          role_title: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          org_id: string
          phone?: string | null
          role_title?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          org_id?: string
          phone?: string | null
          role_title?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_adjustments: {
        Row: {
          created_at: string
          from_location: string | null
          id: string
          notes: string
          org_id: string
          performed_by: string | null
          product_id: string
          quantity: number
          reason: string
          resulting_quantity: number
          to_location: string | null
          type: Database["public"]["Enums"]["stock_adjustment_type"]
        }
        Insert: {
          created_at?: string
          from_location?: string | null
          id?: string
          notes?: string
          org_id: string
          performed_by?: string | null
          product_id: string
          quantity: number
          reason: string
          resulting_quantity: number
          to_location?: string | null
          type: Database["public"]["Enums"]["stock_adjustment_type"]
        }
        Update: {
          created_at?: string
          from_location?: string | null
          id?: string
          notes?: string
          org_id?: string
          performed_by?: string | null
          product_id?: string
          quantity?: number
          reason?: string
          resulting_quantity?: number
          to_location?: string | null
          type?: Database["public"]["Enums"]["stock_adjustment_type"]
        }
        Relationships: [
          {
            foreignKeyName: "stock_adjustments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          org_id: string
          plan_id: string
          seats: number
          status: string
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          org_id: string
          plan_id: string
          seats?: number
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          org_id?: string
          plan_id?: string
          seats?: number
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          contact_name: string
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          name: string
          org_id: string
          phone: string
          updated_at: string
        }
        Insert: {
          contact_name?: string
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          name: string
          org_id: string
          phone?: string
          updated_at?: string
        }
        Update: {
          contact_name?: string
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          name?: string
          org_id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      support_ticket_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          is_internal: boolean
          ticket_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          is_internal?: boolean
          ticket_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          created_by: string
          id: string
          org_id: string
          priority: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          created_by: string
          id?: string
          org_id: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          created_by?: string
          id?: string
          org_id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      timesheets: {
        Row: {
          created_at: string
          hours_worked: number
          id: string
          notes: string | null
          org_id: string
          staff_id: string
          work_date: string
        }
        Insert: {
          created_at?: string
          hours_worked: number
          id?: string
          notes?: string | null
          org_id: string
          staff_id: string
          work_date: string
        }
        Update: {
          created_at?: string
          hours_worked?: number
          id?: string
          notes?: string | null
          org_id?: string
          staff_id?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "timesheets_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      adjust_stock: {
        Args: {
          p_notes?: string
          p_org_id: string
          p_product_id: string
          p_quantity: number
          p_reason: string
          p_to_location?: string
          p_type: Database["public"]["Enums"]["stock_adjustment_type"]
        }
        Returns: {
          barcode: string
          category_id: string | null
          cost_price: number
          created_at: string
          deleted_at: string | null
          description: string
          id: string
          location: string
          name: string
          org_id: string
          quantity: number
          reorder_point: number
          selling_price: number
          sku: string
          stock_status: string | null
          supplier_id: string | null
          unit: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "products"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_order: {
        Args: {
          p_customer_id: string
          p_discount_amount?: number
          p_items: Json
          p_org_id: string
          p_shipping_amount?: number
          p_tax_amount?: number
        }
        Returns: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          deleted_at: string | null
          discount_amount: number
          fulfillment_status: Database["public"]["Enums"]["order_fulfillment_status"]
          id: string
          order_number: number
          org_id: string
          payment_status: Database["public"]["Enums"]["order_payment_status"]
          shipping_amount: number
          subtotal: number
          tax_amount: number
          total: number | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_organization_with_owner: {
        Args: { org_business_type: string; org_name: string; org_slug: string }
        Returns: string
      }
      current_org_ids: { Args: never; Returns: string[] }
      factorymvp_is_super_admin: {
        Args: { target_business_id: string }
        Returns: boolean
      }
      factorymvp_user_business_ids: { Args: never; Returns: string[] }
      get_platform_organization: { Args: { p_org_id: string }; Returns: Json }
      has_permission: {
        Args: { permission_key: string; target_org_id: string }
        Returns: boolean
      }
      is_platform_admin: { Args: { p_user_id: string }; Returns: boolean }
      list_platform_organizations: {
        Args: never
        Returns: {
          business_type: string
          created_at: string
          deleted_at: string
          id: string
          member_count: number
          name: string
          plan_name: string
          slug: string
          status: Database["public"]["Enums"]["organization_status"]
        }[]
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_entity_id: string
          p_entity_type: string
          p_metadata?: Json
          p_org_id: string
        }
        Returns: undefined
      }
      notify_org_members: {
        Args: {
          p_body: string
          p_exclude_user_id?: string
          p_org_id: string
          p_title: string
          p_type: string
        }
        Returns: undefined
      }
      platform_ai_usage_summary: {
        Args: never
        Returns: {
          call_count: number
          provider_key: string
          total_cost_usd: number
          total_input_tokens: number
          total_output_tokens: number
        }[]
      }
      platform_archive_organization: {
        Args: { p_org_id: string }
        Returns: undefined
      }
      platform_clear_org_flag_override: {
        Args: { p_flag_id: string; p_org_id: string }
        Returns: undefined
      }
      platform_create_role: {
        Args: { p_name: string; p_org_id: string; p_permission_ids: string[] }
        Returns: {
          created_at: string
          id: string
          is_system_role: boolean
          name: string
          org_id: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "roles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      platform_dashboard_stats: { Args: never; Returns: Json }
      platform_grant_admin: { Args: { p_user_id: string }; Returns: undefined }
      platform_list_ai_providers: {
        Args: never
        Returns: {
          connected_at: string | null
          docs_url: string | null
          is_connected: boolean
          key: string
          label: string
          models: Json
          notes: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "ai_providers"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      platform_list_audit_logs: {
        Args: { p_limit?: number }
        Returns: {
          action: string
          actor_id: string
          actor_name: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          metadata: Json
          org_id: string
          org_name: string
        }[]
      }
      platform_list_coupons: {
        Args: never
        Returns: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_redemptions: number | null
          times_redeemed: number
          valid_until: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "coupons"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      platform_list_invoices: {
        Args: never
        Returns: {
          amount: number
          created_at: string
          due_date: string
          id: string
          invoice_number: string
          notes: string
          org_id: string
          org_name: string
          paid_at: string
          status: string
        }[]
      }
      platform_list_org_roles: {
        Args: { p_org_id: string }
        Returns: {
          id: string
          is_system_role: boolean
          name: string
          permission_ids: string[]
        }[]
      }
      platform_list_permissions: {
        Args: never
        Returns: {
          description: string | null
          id: string
          key: string
          module_key: string
        }[]
        SetofOptions: {
          from: "*"
          to: "permissions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      platform_list_plans: {
        Args: never
        Returns: {
          id: string
          is_active: boolean
          key: string
          module_limits: Json
          name: string
          price_monthly: number
          price_yearly: number
          seat_limit: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "plans"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      platform_list_tickets: {
        Args: never
        Returns: {
          assigned_to_name: string
          category: string
          created_at: string
          created_by_name: string
          id: string
          message_count: number
          org_id: string
          org_name: string
          priority: string
          status: string
          subject: string
          updated_at: string
        }[]
      }
      platform_list_users: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_platform_admin: boolean
          memberships: Json
        }[]
      }
      platform_restore_organization: {
        Args: { p_org_id: string }
        Returns: undefined
      }
      platform_revoke_admin: { Args: { p_user_id: string }; Returns: undefined }
      platform_set_ai_provider_connected: {
        Args: { p_is_connected: boolean; p_key: string; p_notes?: string }
        Returns: undefined
      }
      platform_set_flag_default: {
        Args: { p_enabled: boolean; p_flag_id: string }
        Returns: undefined
      }
      platform_set_member_status: {
        Args: {
          p_member_id: string
          p_org_id: string
          p_status: Database["public"]["Enums"]["member_status"]
        }
        Returns: undefined
      }
      platform_set_org_flag_override: {
        Args: { p_enabled: boolean; p_flag_id: string; p_org_id: string }
        Returns: undefined
      }
      platform_set_organization_status: {
        Args: {
          p_org_id: string
          p_status: Database["public"]["Enums"]["organization_status"]
        }
        Returns: undefined
      }
      platform_update_ai_settings: {
        Args: {
          p_active_provider: string
          p_default_model: string
          p_enabled: boolean
        }
        Returns: undefined
      }
      platform_update_org_branding: {
        Args: { p_logo_url: string; p_org_id: string; p_primary_color: string }
        Returns: undefined
      }
      platform_update_role_permissions: {
        Args: { p_permission_ids: string[]; p_role_id: string }
        Returns: undefined
      }
      platform_update_subscription: {
        Args: {
          p_current_period_end: string
          p_org_id: string
          p_plan_id: string
          p_seats: number
          p_status: string
        }
        Returns: undefined
      }
      platform_update_ticket: {
        Args: {
          p_assigned_to: string
          p_priority: string
          p_status: string
          p_ticket_id: string
        }
        Returns: undefined
      }
      platform_upsert_ai_prompt_template: {
        Args: {
          p_description: string
          p_key: string
          p_label: string
          p_template: string
        }
        Returns: {
          created_at: string
          description: string | null
          id: string
          key: string
          label: string
          template: string
          updated_at: string
          updated_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "ai_prompt_templates"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      platform_upsert_coupon: {
        Args: {
          p_code: string
          p_discount_type: string
          p_discount_value: number
          p_id: string
          p_is_active: boolean
          p_max_redemptions: number
          p_valid_until: string
        }
        Returns: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_redemptions: number | null
          times_redeemed: number
          valid_until: string | null
        }
        SetofOptions: {
          from: "*"
          to: "coupons"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      platform_upsert_invoice: {
        Args: {
          p_amount: number
          p_due_date: string
          p_id: string
          p_invoice_number: string
          p_notes: string
          p_org_id: string
          p_status: string
        }
        Returns: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          invoice_number: string
          notes: string | null
          org_id: string
          paid_at: string | null
          status: string
          stripe_invoice_id: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "invoices"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      platform_upsert_plan: {
        Args: {
          p_id: string
          p_is_active: boolean
          p_key: string
          p_module_limits: Json
          p_name: string
          p_price_monthly: number
          p_price_yearly: number
          p_seat_limit: number
        }
        Returns: {
          id: string
          is_active: boolean
          key: string
          module_limits: Json
          name: string
          price_monthly: number
          price_yearly: number
          seat_limit: number | null
        }
        SetofOptions: {
          from: "*"
          to: "plans"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      receive_purchase_order: {
        Args: { p_org_id: string; p_purchase_order_id: string }
        Returns: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          expected_date: string | null
          id: string
          notes: string | null
          org_id: string
          status: string
          supplier_id: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "purchase_orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_order_status: {
        Args: {
          p_fulfillment_status?: Database["public"]["Enums"]["order_fulfillment_status"]
          p_order_id: string
          p_org_id: string
          p_payment_status?: Database["public"]["Enums"]["order_payment_status"]
        }
        Returns: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          deleted_at: string | null
          discount_amount: number
          fulfillment_status: Database["public"]["Enums"]["order_fulfillment_status"]
          id: string
          order_number: number
          org_id: string
          payment_status: Database["public"]["Enums"]["order_payment_status"]
          shipping_amount: number
          subtotal: number
          tax_amount: number
          total: number | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_platform_settings: {
        Args: { p_updates: Json }
        Returns: {
          accent_color: string
          active_ai_provider: string | null
          ai_assistant_enabled: boolean
          ai_default_model: string | null
          default_company_logo_url: string | null
          favicon_url: string | null
          id: boolean
          logo_url: string | null
          maintenance_message: string | null
          maintenance_mode: boolean
          platform_name: string
          primary_color: string
          secondary_color: string
          support_email: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "platform_settings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      deal_stage: "lead" | "qualified" | "proposal" | "won" | "lost"
      inventory_transaction_direction: "in" | "out"
      inventory_transaction_source:
        | "adjustment"
        | "transfer"
        | "sale"
        | "purchase_receipt"
      member_status: "invited" | "active" | "suspended"
      order_fulfillment_status:
        | "unfulfilled"
        | "partially_fulfilled"
        | "fulfilled"
        | "cancelled"
      order_payment_status: "unpaid" | "partially_paid" | "paid" | "refunded"
      organization_status:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "suspended"
        | "archived"
      stock_adjustment_type: "increase" | "decrease" | "transfer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      deal_stage: ["lead", "qualified", "proposal", "won", "lost"],
      inventory_transaction_direction: ["in", "out"],
      inventory_transaction_source: [
        "adjustment",
        "transfer",
        "sale",
        "purchase_receipt",
      ],
      member_status: ["invited", "active", "suspended"],
      order_fulfillment_status: [
        "unfulfilled",
        "partially_fulfilled",
        "fulfilled",
        "cancelled",
      ],
      order_payment_status: ["unpaid", "partially_paid", "paid", "refunded"],
      organization_status: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "suspended",
        "archived",
      ],
      stock_adjustment_type: ["increase", "decrease", "transfer"],
    },
  },
} as const
