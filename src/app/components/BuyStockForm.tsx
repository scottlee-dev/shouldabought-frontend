"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyStockForm() {
  const router = useRouter();

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          quantity: Number(quantity),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setSymbol("");
      setQuantity("");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Buy failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6"
    >
      <h2 className="text-xl font-semibold">Buy Stock</h2>

      <div className="mt-5 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Symbol"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none"
          required
        />

        <input
          type="number"
          step="any"
          placeholder="Quantity"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-white px-6 py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Buying..." : "Buy"}
        </button>
      </div>
    </form>
  );
}