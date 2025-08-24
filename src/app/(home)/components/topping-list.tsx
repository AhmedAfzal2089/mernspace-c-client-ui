import React, { startTransition, useEffect, useState } from "react";
import ToppingCard from "./topping-card";
import { Topping } from "@/lib";
import { useSearchParams } from "next/navigation";

const ToppingList = ({
  selectedToppings,
  handleCheckBoxCheck,
}: {
  selectedToppings: Topping[];
  handleCheckBoxCheck: (topping: Topping) => void;
}) => {
  const searchParams = useSearchParams();
  const [toppings, setToppings] = useState<Topping[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const toppingResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/catalog/toppings?tenantId=${searchParams.get("restaurantId")}`
      );

      const json = await toppingResponse.json();

      if (Array.isArray(json.data)) {
        const normalizedToppings = json.data.map((topping: any) => ({
          ...topping,
          id: topping._id, // ✅ Normalize _id to id
        }));

        setToppings(normalizedToppings);
      } else {
        console.error("Invalid toppings response:", json);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="mt-6">
      <h3>Extra toppings</h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {toppings.map((topping) => {
          return (
            <ToppingCard
              topping={topping}
              key={topping.id}
              selectedToppings={selectedToppings}
              handleCheckBoxCheck={handleCheckBoxCheck}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ToppingList;
