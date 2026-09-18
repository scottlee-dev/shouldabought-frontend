"use client";

import { useMemo, useState } from "react";
import TradeForm from "./TradeForm";
import PortfolioChart from "./PortfolioChart";

type Holding = {
    symbol: string;
    quantity: number;
    currentPrice: number;
    marketValue: number;
    averageCost: number;
    gainLoss: number;
    gainLossPercentage: number;
    accountPercentage: number;
};

type Portfolio = {
    cash: number;
    totalValue: number;
    totalGainLoss: number;
    realizedGainLoss: number;
    holdings: Holding[];
};

type PortfolioSnapshot = {
    id: number;
    accountId: number;
    totalValue: number;
    recordedAt: string;
};

type DashboardProps = {
    portfolio: Portfolio;
    history: PortfolioSnapshot[];
};

type SortKey =
    | "symbol"
    | "currentPrice"
    | "quantity"
    | "gainLoss"
    | "marketValue";

type SortDirection = "asc" | "desc";

function money(value: number) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

function quantity(value: number) {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
    });
}

export default function Dashboard({
    portfolio,
    history,
}: DashboardProps) {

    const [tradeOpen, setTradeOpen] = useState(false);

    const [activeTab, setActiveTab] =
        useState<"summary" | "positions">("summary");

    const [sortKey, setSortKey] =
        useState<SortKey>("symbol");

    const [sortDirection, setSortDirection] =
        useState<SortDirection>("asc");

    function handleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDirection(
                sortDirection === "asc" ? "desc" : "asc"
            );
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    }

    function sortArrow(key: SortKey) {
        if (sortKey !== key) {
            return "";
        }

        return sortDirection === "asc" ? " ↑" : " ↓";
    }

    const sortedHoldings = useMemo(() => {
        return [...portfolio.holdings].sort((a, b) => {

            let result: number;

            if (sortKey === "symbol") {
                result = a.symbol.localeCompare(b.symbol);
            } else {
                result = a[sortKey] - b[sortKey];
            }

            return sortDirection === "asc"
                ? result
                : -result;
        });
    }, [portfolio.holdings, sortKey, sortDirection]);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#F9F7F5] text-gray-900">

            {/* TRADE DRAWER */}
            <aside
                className={`fixed left-0 top-0 z-20 h-screen w-96 bg-white shadow-xl transition-transform duration-300 ${tradeOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                    <h2 className="text-xl font-bold">
                        Trade
                    </h2>

                    <button
                        onClick={() => setTradeOpen(false)}
                        className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                    >
                        ✕
                    </button>

                </div>

                <div className="p-6">
                    <TradeForm />
                </div>
            </aside>


            {/* MAIN CONTENT */}
            <main
                className={`min-h-screen transition-all duration-300 ${tradeOpen ? "ml-96" : "ml-0"
                    }`}
            >
                <div className="mx-auto max-w-6xl px-6 py-10">


                    {/* HEADER */}
                    <header className="mb-10">

                        <button
                            onClick={() => setTradeOpen(true)}
                            className="mb-8 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-700"
                        >
                            + Trade
                        </button>

                        <p className="text-sm font-semibold tracking-widest text-gray-500">
                            SHOULDABOUGHT
                        </p>

                        <h1 className="mt-2 text-4xl font-bold">
                            Investment Dashboard
                        </h1>


                        {/* TABS */}
                        <div className="mt-8 border-b border-gray-300">

                            <div className="flex gap-10">

                                <button
                                    onClick={() =>
                                        setActiveTab("summary")
                                    }
                                    className={`border-b-4 px-1 pb-4 text-lg font-medium transition ${activeTab === "summary"
                                            ? "border-blue-600 text-gray-900"
                                            : "border-transparent text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Summary
                                </button>

                                <button
                                    onClick={() =>
                                        setActiveTab("positions")
                                    }
                                    className={`border-b-4 px-1 pb-4 text-lg font-medium transition ${activeTab === "positions"
                                            ? "border-blue-600 text-gray-900"
                                            : "border-transparent text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Positions
                                </button>

                            </div>

                        </div>

                    </header>


                    {/* SUMMARY */}
                    {activeTab === "summary" && (

                        <div className="mt-8 grid gap-6 lg:grid-cols-[3fr_7fr]">

                            {/* LEFT SUMMARY */}
                            <section className="rounded-2xl bg-white p-8 shadow-sm">

                                <div>

                                    <p className="text-sm font-medium text-gray-500">
                                        Total Portfolio Value
                                    </p>

                                    <p className="mt-2 text-4xl font-bold tracking-tight">
                                        {money(portfolio.totalValue)}
                                    </p>

                                </div>

                                <div className="mt-8 space-y-6 border-t border-gray-100 pt-6">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Cash
                                        </p>

                                        <p className="mt-1 text-xl font-semibold">
                                            {money(portfolio.cash)}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Invested Value
                                        </p>

                                        <p className="mt-1 text-xl font-semibold">
                                            {money(
                                                portfolio.totalValue -
                                                portfolio.cash
                                            )}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Total Gain / Loss
                                        </p>

                                        <p
                                            className={`mt-1 text-xl font-semibold ${portfolio.totalGainLoss > 0
                                                    ? "text-green-600"
                                                    : portfolio.totalGainLoss < 0
                                                        ? "text-red-600"
                                                        : "text-gray-900"
                                                }`}
                                        >
                                            {money(
                                                portfolio.totalGainLoss
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </section>


                            {/* RIGHT CHART */}
                            <section className="rounded-2xl bg-white p-8 shadow-sm">

                                <div>

                                    <h2 className="text-xl font-semibold">
                                        Portfolio Performance
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Portfolio value over time
                                    </p>

                                </div>

                                <div className="mt-6">
                                    <PortfolioChart history={history} />
                                </div>

                            </section>

                        </div>
                    )}


                    {/* POSITIONS */}
                    {activeTab === "positions" && (

                        <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">

                            <div className="border-b border-gray-100 px-6 py-5">

                                <h2 className="text-xl font-semibold">
                                    Positions
                                </h2>

                            </div>


                            <div className="overflow-x-auto">

                                <table className="w-full text-left">

                                    <thead className="bg-gray-50 text-sm text-gray-500">

                                        <tr>

                                            <th
                                                onClick={() =>
                                                    handleSort("symbol")
                                                }
                                                className="cursor-pointer select-none px-6 py-4 hover:text-gray-900"
                                            >
                                                Symbol
                                                {sortArrow("symbol")}
                                            </th>


                                            <th
                                                onClick={() =>
                                                    handleSort("currentPrice")
                                                }
                                                className="cursor-pointer select-none px-6 py-4 hover:text-gray-900"
                                            >
                                                Price
                                                {sortArrow("currentPrice")}
                                            </th>


                                            <th
                                                onClick={() =>
                                                    handleSort("quantity")
                                                }
                                                className="cursor-pointer select-none px-6 py-4 hover:text-gray-900"
                                            >
                                                Quantity
                                                {sortArrow("quantity")}
                                            </th>


                                            <th
                                                onClick={() =>
                                                    handleSort("gainLoss")
                                                }
                                                className="cursor-pointer select-none px-6 py-4 hover:text-gray-900"
                                            >
                                                Total Gain / Loss
                                                {sortArrow("gainLoss")}
                                            </th>


                                            <th
                                                onClick={() =>
                                                    handleSort("marketValue")
                                                }
                                                className="cursor-pointer select-none px-6 py-4 hover:text-gray-900"
                                            >
                                                Current Value
                                                {sortArrow("marketValue")}
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {sortedHoldings.map(
                                            (holding) => (

                                                <tr
                                                    key={holding.symbol}
                                                    className="border-t border-gray-100"
                                                >

                                                    <td className="px-6 py-5 font-semibold">
                                                        {holding.symbol}
                                                    </td>


                                                    <td className="px-6 py-5">
                                                        {money(
                                                            holding.currentPrice
                                                        )}
                                                    </td>


                                                    <td className="px-6 py-5">
                                                        {quantity(
                                                            holding.quantity
                                                        )}
                                                    </td>


                                                    <td
                                                        className={`px-6 py-5 ${holding.gainLoss > 0
                                                                ? "text-green-600"
                                                                : holding.gainLoss < 0
                                                                    ? "text-red-600"
                                                                    : ""
                                                            }`}
                                                    >
                                                        {money(
                                                            holding.gainLoss
                                                        )}
                                                    </td>


                                                    <td className="px-6 py-5 font-medium">
                                                        {money(
                                                            holding.marketValue
                                                        )}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </section>

                    )}

                </div>

            </main>

        </div>
    );
}