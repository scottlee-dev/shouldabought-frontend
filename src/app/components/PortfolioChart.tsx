"use client";

import { useMemo, useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type PortfolioSnapshot = {
    id: number;
    accountId: number;
    totalValue: number;
    recordedAt: string;
};

type PortfolioChartProps = {
    history: PortfolioSnapshot[];
};

type Range = "1W" | "1M" | "3M" | "1Y" | "ALL";

function formatDate(value: string) {
    const date = new Date(value);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

function formatMoney(value: number) {
    return `$${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export default function PortfolioChart({
    history,
}: PortfolioChartProps) {
    const [range, setRange] = useState<Range>("1M");

    const filteredHistory = useMemo(() => {
        if (range === "ALL") {
            return history;
        }

        const now = new Date();
        const start = new Date(now);

        if (range === "1W") {
            start.setDate(now.getDate() - 7);
        }

        if (range === "1M") {
            start.setMonth(now.getMonth() - 1);
        }

        if (range === "3M") {
            start.setMonth(now.getMonth() - 3);
        }

        if (range === "1Y") {
            start.setFullYear(now.getFullYear() - 1);
        }

        return history.filter(
            (snapshot) => new Date(snapshot.recordedAt) >= start
        );
    }, [history, range]);

    const data = filteredHistory.map((snapshot) => ({
        date: formatDate(snapshot.recordedAt),
        value: Number(snapshot.totalValue),
    }));

    return (
        <div>
            <div className="mb-6 flex gap-2">
                {(["1W", "1M", "3M", "1Y", "ALL"] as Range[]).map(
                    (option) => (
                        <button
                            key={option}
                            onClick={() => setRange(option)}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                                range === option
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                        >
                            {option}
                        </button>
                    )
                )}
            </div>

            {data.length === 0 ? (
                <div className="flex h-80 items-center justify-center text-gray-400">
                    No portfolio history for this period.
                </div>
            ) : (
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 20,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#E5E7EB"
                            />

                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#6B7280",
                                    fontSize: 12,
                                }}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#6B7280",
                                    fontSize: 12,
                                }}
                                tickFormatter={(value) =>
                                    `$${Number(value).toLocaleString()}`
                                }
                                domain={["auto", "auto"]}
                            />

                            <Tooltip
                                formatter={(value) => [
                                    formatMoney(Number(value)),
                                    "Portfolio Value",
                                ]}
                                labelStyle={{
                                    color: "#111827",
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#2563EB"
                                strokeWidth={3}
                                dot={{
                                    r: 4,
                                    fill: "#2563EB",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}