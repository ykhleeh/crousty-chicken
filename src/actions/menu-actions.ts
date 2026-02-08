"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Product,
  ProductCategory,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/product";

// ============================================
// Public Read Functions
// ============================================

/**
 * Get all products, optionally filtered by category
 */
export async function getProducts(
  category?: ProductCategory
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}

/**
 * Get available products only (for public site)
 */
export async function getAvailableProducts(
  category?: ProductCategory
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching available products:", error);
    return [];
  }

  return data || [];
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data;
}

// ============================================
// Admin CRUD Functions
// ============================================

/**
 * Create a new product
 */
export async function createProduct(
  input: CreateProductInput
): Promise<{ product: Product | null; error: string | null }> {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { product: null, error: "Not authenticated" };
  }

  // Get max sort_order for this category
  const { data: maxOrderData } = await supabase
    .from("products")
    .select("sort_order")
    .eq("category", input.category)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const newSortOrder = (maxOrderData?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...input,
      sort_order: input.sort_order ?? newSortOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    return { product: null, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/order");
  revalidatePath("/admin/menu");

  return { product: data, error: null };
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<{ product: Product | null; error: string | null }> {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { product: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    return { product: null, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/order");
  revalidatePath("/admin/menu");

  return { product: data, error: null };
}

/**
 * Delete a product
 */
export async function deleteProduct(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get the product to delete its image if it exists
  const { data: product } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  // Delete the product
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }

  // Delete associated image if it exists and is in our storage
  if (product?.image_url?.includes("menu-images")) {
    await deleteProductImage(product.image_url);
  }

  revalidatePath("/");
  revalidatePath("/order");
  revalidatePath("/admin/menu");

  return { success: true, error: null };
}

/**
 * Toggle product availability
 */
export async function toggleProductAvailability(
  id: string
): Promise<{ product: Product | null; error: string | null }> {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { product: null, error: "Not authenticated" };
  }

  // Get current availability
  const { data: current } = await supabase
    .from("products")
    .select("is_available")
    .eq("id", id)
    .single();

  if (!current) {
    return { product: null, error: "Product not found" };
  }

  // Toggle it
  const { data, error } = await supabase
    .from("products")
    .update({ is_available: !current.is_available })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling availability:", error);
    return { product: null, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/order");
  revalidatePath("/admin/menu");

  return { product: data, error: null };
}

/**
 * Reorder products within a category
 */
export async function reorderProducts(
  category: ProductCategory,
  orderedIds: string[]
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Update each product's sort_order
  const updates = orderedIds.map((id, index) =>
    supabase.from("products").update({ sort_order: index + 1 }).eq("id", id)
  );

  try {
    await Promise.all(updates);
    revalidatePath("/");
    revalidatePath("/order");
    revalidatePath("/admin/menu");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error reordering products:", error);
    return { success: false, error: "Failed to reorder products" };
  }
}

// ============================================
// Image Upload Functions
// ============================================

/**
 * Upload a product image to Supabase Storage
 */
export async function uploadProductImage(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { url: null, error: "Not authenticated" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { url: null, error: "No file provided" };
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    return { url: null, error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." };
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return { url: null, error: "File too large. Maximum 5MB." };
  }

  // Generate unique filename
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  // Use admin client for storage operations
  const adminSupabase = createAdminClient();

  const { error: uploadError } = await adminSupabase.storage
    .from("menu-images")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return { url: null, error: uploadError.message };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = adminSupabase.storage.from("menu-images").getPublicUrl(filename);

  return { url: publicUrl, error: null };
}

/**
 * Delete a product image from Supabase Storage
 */
export async function deleteProductImage(
  url: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Extract filename from URL
  const match = url.match(/menu-images\/(.+)$/);
  if (!match) {
    return { success: false, error: "Invalid image URL" };
  }

  const filename = match[1];

  // Use admin client for storage operations
  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase.storage
    .from("menu-images")
    .remove([filename]);

  if (error) {
    console.error("Error deleting image:", error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
