"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export type Topping = {
  id: string;
  name: string;
  price: number;
  image: string;
  isAvailable: boolean;
};

type PropType = {
  topping: Topping;
  selectedToppings: Topping[];
  handleCheckBoxCheck: (topping: Topping) => void;
};

const ToppingCard = ({
  topping,
  selectedToppings,
  handleCheckBoxCheck,
}: PropType) => {
  const isCurrentSelected = selectedToppings.some(
    // this some fucn will return true if any of the topping have value
    (element) => element.id === topping.id
  );
  return (
    <Button
      onClick={() => {
        handleCheckBoxCheck(topping);
      }}
      variant={"outline"}
      className={cn(
        "flex flex-col h-42 relative",
        isCurrentSelected ? "border-primary" : ""
      )}
    >
      <Image src={topping.image} alt={topping.name} width={80} height={80} />
      <h4>{topping.name}</h4>
      <p>&#8360; {topping.price}</p>
      {isCurrentSelected && (
        <CircleCheck className="absolute top-1 right-1 text-primary" />
      )}
    </Button>
  );
};

export default ToppingCard;
