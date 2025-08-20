import React, { startTransition, useEffect, useState } from "react";
import ToppingCard from "./topping-card";
import { Topping } from "@/lib";

const ToppingList = async ({selectedToppings, handleCheckBoxCheck}:{selectedToppings:Topping[],handleCheckBoxCheck:(topping:Topping)=>void }) => {
  const [toppings, setToppings] = useState<Topping[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalog/toppings?tenantId=9`
        );
        const json = await response.json();

        if (Array.isArray(json.data)) {
          setToppings(json.data); // ✅ Only set the toppings array
        } else {
          console.error("Expected array in json.data, got:", json.data);
          setToppings([]);
        }
      } catch (error) {
        console.error("Error fetching toppings:", error);
        setToppings([]);
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
}

export default ToppingList;
