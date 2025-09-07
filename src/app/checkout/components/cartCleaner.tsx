"use client";
import { useAppDispatch } from "@/lib/hooks";
import { clearCart } from "@/lib/store/features/cart/cartSlice";
import React, { useEffect } from "react";

const CartCleaner = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(clearCart());
  }, []);
  return null;
};

export default CartCleaner;
