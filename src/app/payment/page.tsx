import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  CircleX,
  LayoutDashboard,
  Store,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import CartCleaner from "../checkout/components/cartCleaner";

const Payment = ({
  searchParams,
}: {
  searchParams: { success: string; orderId: string; restaurantId: string };
}) => {
  const isOrderSuccess = searchParams.success === "true";
  return (
    <>
      {isOrderSuccess && <CartCleaner />}
      <div className="flex flex-col items-center gap-4 w-full mt-12">
        {isOrderSuccess ? (
          <>
            <CheckCircle2 size={80} className="text-green-500" />
            <h1 className="text-2xl font-bold text-center">
              Order Placed Successfully
            </h1>
            <p className="text-base font-semibold -mt-2">
              Thank you for your order.
            </p>
          </>
        ) : (
          <>
            <CircleX size={80} className="text-red-500" />
            <h1 className="text-2xl font-bold text-center">
              Payment has been Failed
            </h1>
            <p className="text-base font-semibold -mt-2">Please Try Again</p>
          </>
        )}
        {isOrderSuccess && (
          <Card className="w-1/3 mt-6">
            <CardHeader>
              <CardTitle className="flex items-start text-lg justify-between">
                <div className="flex items-center gap-3">
                  <Store size={35} className="text-primary" />{" "}
                  <span>Your order information</span>
                </div>
                <Badge className="text-base px-4" variant={"secondary"}>
                  Confirmed
                </Badge>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 ">
                <LayoutDashboard size={20} />
                <h2 className="text-base font-medium">Order reference:</h2>
                <Link
                  href={`/order-status/${searchParams.orderId}?restaurantId=${searchParams.restaurantId}`}
                  className="underline"
                >
                  {searchParams.orderId}
                </Link>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <LayoutDashboard size={20} />
                <h2 className="text-base font-medium">Payment Status:</h2>
                <span>Paid</span>
              </div>
            </CardContent>
          </Card>
        )}
        {isOrderSuccess ? (
          <Button asChild className="mt-6">
            <Link
              href={`/order-status/${searchParams.orderId}?restaurantId=${searchParams.restaurantId}`}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} className="text-white" />
              <span>Go to Order Status Page</span>
            </Link>
          </Button>
        ) : (
          <Button asChild className="mt-6">
            <Link
              href={`/checkout?restaurantId=${searchParams.restaurantId}`}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} className="text-white" />
              <span>Go to Checkout</span>
            </Link>
          </Button>
        )}
      </div>
    </>
  );
};

export default Payment;
