import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CouponCodeData, CouponVerifyData } from "@/lib";
import { useAppSelector } from "@/lib/hooks";
import { verifyCoupon } from "@/lib/http/api";
import { getItemTotal } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";
//todo: move to this to server, and calculate according to your business rules
//TODO: error handling the the coupon if invalid coupon comes in then reset to before
const TAXES_PERCENTAGE = 18;
const DELIVERY_CHARGES = 100;
const OrderSummary = ({
  handleCouponCodeChange,
}: {
  handleCouponCodeChange: (code: string) => void;
}) => {
  const searchParams = useSearchParams();
  const cart = useAppSelector((state) => state.cart.cartItems);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountError, setDiscountError] = React.useState("");
  const couponCodeRef = useRef<HTMLInputElement>(null);

  const subTotal = useMemo(() => {
    return cart.reduce((acc, curr) => {
      return acc + curr.qty * getItemTotal(curr);
    }, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return Math.round((subTotal * discountPercentage) / 100);
  }, [subTotal, discountPercentage]);

  const taxesAmount = useMemo(() => {
    const amountAfterDiscount = subTotal - discountAmount;
    return Math.round((amountAfterDiscount * TAXES_PERCENTAGE) / 100);
  }, [subTotal, discountAmount]);
  const grandWithDiscountTotal = React.useMemo(() => {
    return subTotal - discountAmount + taxesAmount + DELIVERY_CHARGES;
  }, [subTotal, discountAmount, taxesAmount, DELIVERY_CHARGES]);

  const grandWithoutDiscountTotal = React.useMemo(() => {
    return subTotal + taxesAmount + DELIVERY_CHARGES;
  }, [subTotal, taxesAmount, DELIVERY_CHARGES]);

  const { mutate } = useMutation({
    mutationKey: ["couponCode"],
    mutationFn: async () => {
      if (!couponCodeRef.current?.value) {
        throw new Error("Coupon code is required");
      }

      const restaurantId = searchParams.get("restaurantId");
      if (!restaurantId) {
        throw new Error("Restaurant ID is missing");
      }
      const data: CouponCodeData = {
        code: couponCodeRef.current!.value,
        tenantId: searchParams.get("restaurantId")!,
      };

      const resp = await verifyCoupon(data).then((res) => res.data);
      return resp;
    },
    //this is the data which server sends to us
    onSuccess: (data: any) => {
      if (!data || typeof data.valid !== "boolean") {
        setDiscountPercentage(0);
        return;
      }

      if (data.valid) {
        setDiscountError("");
        handleCouponCodeChange(
          couponCodeRef.current ? couponCodeRef.current.value : ""
        );
        setDiscountPercentage(data.discount);
      } else {
        setDiscountError("Coupon is invalid");
        handleCouponCodeChange("");
        setDiscountPercentage(0);
      }
    },
  });
  const handleCouponValidation = (e: React.MouseEvent) => {
    // for stopping the form submission on clicking the apply
    e.preventDefault();
    mutate();
  };
  return (
    <Card className="w-2/5 border-none h-auto self-start">
      <CardHeader>
        <CardTitle>Order summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 pt-6">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-bold">&#8360; {subTotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Taxes</span>
          <span className="font-bold">&#8360; {taxesAmount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Delivery charges</span>
          <span className="font-bold">&#8360; {DELIVERY_CHARGES}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Discount</span>
          <span className="font-bold">&#8360; {discountAmount}</span>
        </div>
        <hr />
        <div className="flex items-center justify-between">
          <span className="font-bold">Order total</span>
          <span className="font-bold flex flex-col items-end">
            <span
              className={discountPercentage ? "line-through text-gray-400" : ""}
            >
              &#8360; {grandWithoutDiscountTotal}
            </span>
            {discountPercentage ? (
              <span className="text-green-700">
                &#8360; {grandWithDiscountTotal}
              </span>
            ) : null}
          </span>
        </div>
        {discountError && <div className="text-red-500">{discountError}</div>}
        <div className="flex items-center gap-4">
          <Input
            id="coupon"
            name="code"
            type="text"
            className="w-full"
            placeholder="Coupon code"
            ref={couponCodeRef}
          />
          {/* todo:add loading for button */}
          <Button onClick={handleCouponValidation} variant={"outline"}>
            Apply
          </Button>
        </div>

        <div className="text-right mt-6">
          <Button>Place order</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
