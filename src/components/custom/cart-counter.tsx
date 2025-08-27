"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const CartCounter = () => {
  const searchParams = useSearchParams();
  const value = useAppSelector((state) => state.cart.cartItems);
  return (
    <>
      <div className="relative">
        <Link href={`/cart?restaurantId=${searchParams.get("restaurantId")}`}>
          <ShoppingBasket className="hover:text-primary" />
        </Link>
        <span className="absolute -top-3 -right-3 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-white font-bold">
          {value.length}
        </span>
      </div>
    </>
  );
};

export default CartCounter;
