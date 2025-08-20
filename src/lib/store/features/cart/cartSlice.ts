import { Product, Topping } from "@/lib";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  product: Product;
  chosenConfiguration: {
    priceConfiguration: {
      [key: string]: string;
    };
    selectedToppings: Topping[];
  };
}

export interface CartState {
  cartItems: CartItem[] | [];
}

const initialState: CartState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, actions: PayloadAction<CartItem>) => {
      return {
        cartItems: [
          ...state.cartItems,
          {
            product: actions.payload.product,
            chosenConfiguration: actions.payload.chosenConfiguration,
          },
        ],
      };
    },
  },
});

//Action creators are generated for each case reducer function

export const {addToCart} = cartSlice.actions;
export default cartSlice.reducer;
