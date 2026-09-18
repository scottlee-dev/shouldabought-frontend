"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type TradeType = "buy" | "sell";
type InputMode = "quantity" | "amount";

export default function TradeForm() {

    const router = useRouter();

    const [tradeType, setTradeType] =
        useState<TradeType>("buy");

    const [inputMode, setInputMode] =
        useState<InputMode>("quantity");

    const [symbol, setSymbol] = useState("");
    const [value, setValue] = useState("");

    const [loading, setLoading] = useState(false);


    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setLoading(true);

        try {

            const body =
                inputMode === "quantity"
                    ? {
                        symbol: symbol
                            .trim()
                            .toUpperCase(),

                        quantity: Number(value),
                    }
                    : {
                        symbol: symbol
                            .trim()
                            .toUpperCase(),

                        cashAmount: Number(value),
                    };


            const response = await fetch(
                `/api/${tradeType}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(body),
                }
            );


            if (!response.ok) {

                const error =
                    await response.text();

                throw new Error(error);
            }


            setSymbol("");
            setValue("");

            router.refresh();

        } catch (error) {

            console.error(error);

            alert(
                tradeType === "buy"
                    ? "Buy failed."
                    : "Sell failed."
            );

        } finally {

            setLoading(false);

        }
    }


    return (

        <div>

            {/* BUY / SELL */}
            <div className="mb-6 flex rounded-xl bg-gray-100 p-1">

                <button
                    type="button"
                    onClick={() =>
                        setTradeType("buy")
                    }
                    className={`flex-1 rounded-lg px-4 py-2 font-semibold ${
                        tradeType === "buy"
                            ? "bg-white shadow-sm"
                            : "text-gray-500"
                    }`}
                >
                    Buy
                </button>


                <button
                    type="button"
                    onClick={() =>
                        setTradeType("sell")
                    }
                    className={`flex-1 rounded-lg px-4 py-2 font-semibold ${
                        tradeType === "sell"
                            ? "bg-white shadow-sm"
                            : "text-gray-500"
                    }`}
                >
                    Sell
                </button>

            </div>


            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* SYMBOL */}
                <div>

                    <label className="mb-2 block text-sm font-medium text-gray-600">
                        Symbol
                    </label>

                    <input
                        type="text"
                        value={symbol}
                        onChange={(event) =>
                            setSymbol(
                                event.target.value
                            )
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 uppercase outline-none focus:border-blue-500"
                        required
                    />

                </div>


                {/* QUANTITY / AMOUNT SELECTOR */}
                <div>

                    <label className="mb-2 block text-sm font-medium text-gray-600">
                        Order By
                    </label>


                    <div className="flex rounded-xl bg-gray-100 p-1">

                        <button
                            type="button"
                            onClick={() => {
                                setInputMode(
                                    "quantity"
                                );

                                setValue("");
                            }}
                            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                                inputMode ===
                                "quantity"
                                    ? "bg-white shadow-sm"
                                    : "text-gray-500"
                            }`}
                        >
                            Quantity
                        </button>


                        <button
                            type="button"
                            onClick={() => {
                                setInputMode(
                                    "amount"
                                );

                                setValue("");
                            }}
                            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                                inputMode ===
                                "amount"
                                    ? "bg-white shadow-sm"
                                    : "text-gray-500"
                            }`}
                        >
                            Amount
                        </button>

                    </div>

                </div>


                {/* VALUE */}
                <div>

                    <label className="mb-2 block text-sm font-medium text-gray-600">
                        {inputMode === "quantity"
                            ? "Quantity"
                            : "Amount ($)"}
                    </label>


                    <input
                        type="number"
                        step="any"
                        min="0"
                        value={value}
                        onChange={(event) =>
                            setValue(
                                event.target.value
                            )
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                        required
                    />

                </div>


                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full rounded-xl px-6 py-3 font-semibold text-white transition disabled:opacity-50 ${
                        tradeType === "buy"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                    }`}
                >

                    {loading
                        ? "Processing..."
                        : tradeType === "buy"
                            ? "Buy Stock"
                            : "Sell Stock"}

                </button>

            </form>

        </div>
    );
}