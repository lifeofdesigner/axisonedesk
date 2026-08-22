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
          id: string
          name: string
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
          id?: string
          name: string
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
          id?: string
          name?: string
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
      create_organization_with_owner: {
        Args: { org_business_type: string; org_name: string; org_slug: string }
        Returns: string
      }
      current_org_ids: { Args: never; Returns: string[] }
      has_permission: {
        Args: { permission_key: string; target_org_id: string }
        Returns: boolean
      }
    }
    Enums: {
      inventory_transaction_direction: "in" | "out"
      inventory_transaction_source:
        | "adjustment"
        | "transfer"
        | "sale"
        | "purchase_receipt"
      member_status: "invited" | "active" | "suspended"
      organization_status: "active" | "trialing" | "past_due" | "canceled"
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
      inventory_transaction_direction: ["in", "out"],
      inventory_transaction_source: [
        "adjustment",
        "transfer",
        "sale",
        "purchase_receipt",
      ],
      member_status: ["invited", "active", "suspended"],
      organization_status: ["active", "trialing", "past_due", "canceled"],
      stock_adjustment_type: ["increase", "decrease", "transfer"],
    },
  },
} as const
