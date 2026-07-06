"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppSelector } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { type Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { FilterControls } from "./FilterControls";
import { PaginationControls } from "./PaginationControls";
import { Loader2 } from "lucide-react";
import EmptyState from "./EmptyState";

export function ProductCatalog() {
  const {
    selectedCategory,
    sortBy,
    priceRange,
    inStockOnly,
    searchQuery,
    viewMode,
    currentPage,
    itemsPerPage,
  } = useAppSelector((state) => state.products);

  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);

  // Fetch all products
  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => api.getProducts(),
  });

  // if(allProducts.length === 0) return

  // Filter and sort products
  const filteredProducts = useMemo(() => {

    if (!Array.isArray(allProducts)) return [];
    
    let filtered = allProducts;
    console.log ('Am in filtered products')
    
    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      console.log('search by query', searchQuery);
      
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) 
          // ||p.description?.toLowerCase().includes(query),
      );
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
            console.log('search by inStockOnly', inStockOnly, priceRange);
    }

    // Sort
    if (sortBy === "price-asc") {
      console.log('ascending'); 
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      console.log('Descending');
      
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }


    if(priceRange) {
      if(priceRange.min === 0 && priceRange.max === 10000 ) filtered = filtered;
      else filtered = filtered.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
      console.log('search by priceRange', priceRange);
    }
    console.log('my filtered list', filtered);

    return filtered;
  }, [allProducts, selectedCategory, searchQuery, inStockOnly, sortBy, priceRange]);

  // Pagination calculations
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Get paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Update accumulated products for infinite scroll
  useEffect(() => {
    if (viewMode === "infinite") {
      setAccumulatedProducts((prev) => {
        if (currentPage === 1) {
          return paginatedProducts;
        }
        // Avoid duplicates
        const existingIds = new Set(prev.map((p) => p.id));
        const newProducts = paginatedProducts.filter(
          (p) => !existingIds.has(p.id),
        );
        return [...prev, ...newProducts];
      });
    }
  }, [paginatedProducts, viewMode, currentPage]);

  // Get products based on view mode
  const displayProducts =
    viewMode === "infinite" ? accumulatedProducts : paginatedProducts;

  const hasMore = currentPage < totalPages;

  return (
    <div>
      {/* Filter Controls */}
      <FilterControls totalResults={filteredProducts.length} />

      {/* Loading State */}
      {isLoading && (
        <div className="py-8 px-4 flex justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading products...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProducts.length === 0 && <EmptyState />}

      {/* Products Grid */}
      {!isLoading && filteredProducts.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Infinite scroll loading indicator */}
          {viewMode === "infinite" && hasMore && (
            <div className="py-8 px-4 flex justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more products...</span>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          <PaginationControls
            totalPages={totalPages}
            hasMore={hasMore}
            isLoadingMore={false}
          />
        </>
      )}
    </div>
  );
}
