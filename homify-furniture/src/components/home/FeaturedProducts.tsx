import  ProductGrid from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import  Link  from "next/link";
import { ArrowRight } from "lucide-react";


export  default function FeaturedProducts() {

  return (
    <section className="py-16 px-4  md:py-24">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Featured Collection
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Handpicked pieces that blend timeless design with modern comfort
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* <ProductGrid /> */}
      </div>
    </section>
  );
}
