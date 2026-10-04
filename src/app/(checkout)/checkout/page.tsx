import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <h1 className="sr-only">Finalizar compra</h1>
      <CheckoutFlow />
    </>
  );
}
