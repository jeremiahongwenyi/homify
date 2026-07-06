"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCategory } from "@/store/productSlice";
import { type CategoryId } from "@/types/product";
import { CategoryBar } from "@/components/products/CategoryBar";
import { ProductCatalog } from "@/components/products/ProductCatalog";


function ProductsPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as CategoryId | null;
  const { selectedCategory } = useAppSelector((state) => state.products);

  // Sync URL params with Redux state on mount only
  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      dispatch(setCategory(categoryParam));
    } else if (!categoryParam && selectedCategory !== "all") {
      // Reset to all if no category param and state is not all
      dispatch(setCategory("all"));
    }
  }, [categoryParam]);

  const handleCategoryChange = (category: CategoryId) => {
    console.log("category", category);
    dispatch(setCategory(category));

    if (category === "all") {
      router.push("/products");
    } else {
      router.push(`/products?category=${category}`);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <div className="bg-secondary/50 py-8 md:py-12 px-4">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Shop Furniture
          </h1>
          <p className="text-muted-foreground">
            Browse our curated collection of beautiful furniture for your home
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-b border-border sticky top-16 md:top-20 bg-background z-40">
        <div className="container">
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />
        </div>
      </div>

      {/* Products Catalog with Filters */}
      <div className="container py-8 md:py-12">
        <ProductCatalog />
      </div>

     
    </main>
  );
}

const ProductsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
};

export default ProductsPage;
