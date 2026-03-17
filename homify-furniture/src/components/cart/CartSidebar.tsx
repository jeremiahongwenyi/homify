"use client";

import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/hooks";
import { formatPrice } from "@/data/products";
import Link from "next/link";
import { toast } from "sonner";
import { CheckOutAuthDialog } from "@/components/auth/CheckOutAuthDialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartSidebar() {
  const router = useRouter()
  const { items, total, isOpen, closeCart, updateQuantity, removeItem } =
    useCart();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  if (!isOpen) return null;

  const proceedToCheckOut = ()=>{
    if(isAuthenticated){
      closeCart()
      router.push('/checkout')
    } else {
      setShowAuthDialog(true)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0  bg-foreground/50 z-50 animate-fade-in"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-100 bg-background z-50 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-xl font-semibold">Your Cart</h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start shopping to add items to your cart
            </p>
            <Button onClick={closeCart} asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 bg-card p-3 rounded-lg"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-primary font-semibold text-sm mt-1">
                      {formatPrice(item.product.price)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-lg">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping calculated at checkout
              </p>
              <Button className="w-full" size="lg" onClick= {proceedToCheckOut}>
                {/* Proceed to Checkout */}
                {/* <Link href="/products" onClick={closeCart}> */}
                  Proceed to Checkout
                {/* </Link> */}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={closeCart}
                asChild
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>

            <div>
              <CheckOutAuthDialog
                open={!isAuthenticated && showAuthDialog}
                onOpenChange={setShowAuthDialog}
                onAuthenticated={() => {
                  setIsAuthenticated(true);
                  setShowAuthDialog(false);
                }}
              ></CheckOutAuthDialog>
            </div>
          </>
        )}
      </div>
    </>
  );
}
