import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { Suspense } from "react";
import ProductCard from "./product-card";
import { Category, Product } from "@/lib";
import { Skeleton } from "@/components/ui/skeleton";

const ProductList = async () => {
  // this will work concurrently , at same
  const [categoryResponse, productResponse] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/api/catalog/categories`),
    fetch(
      `${process.env.BACKEND_URL}/api/catalog/products?perPage=100&tenantId=6`,
      {
        next: {
          revalidate: 3600, // 1 hour
        },
      }
    ),
  ]);

  if (!categoryResponse.ok || !productResponse.ok) {
    throw new Error("Failed to fetch categories or products");
  }

  const [categories, products]: [Category[], { data: Product[] }] =
    await Promise.all([categoryResponse.json(), productResponse.json()]);
  return (
    <>
      <section>
        <div className="container py-12">
          {" "}
          <Tabs defaultValue={categories[0]._id}>
            <TabsList>
              {categories.map((category) => {
                return (
                  <TabsTrigger
                    key={category._id}
                    value={category._id}
                    className="text-md"
                  >
                    {category.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {categories.map((category) => {
              return (
                <TabsContent key={category._id} value={category._id}>
                  <div className="grid grid-cols-4 gap-6 mt-6">
                    {" "}
                    {products.data
                      .filter(
                        (product) => product.category._id === category._id
                      )
                      .map((product) => (
                        <ProductCard product={product} key={product._id} />
                      ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default ProductList;
