"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAccountForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [initialCash, setInitialCash] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);

        try {
            const response = await fetch("/api/accounts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    initialCash: Number(initialCash),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create account");
            }

            router.refresh();

        } catch (error) {
            console.error(error);
            alert("Failed to create portfolio.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#F9F7F5] px-6 py-16 text-gray-900">
            <div className="mx-auto max-w-xl">

                <p className="text-sm font-semibold tracking-widest text-gray-500">
                    SHOULDABOUGHT
                </p>

                <h1 className="mt-3 text-4xl font-bold">
                    Create your portfolio
                </h1>

                <p className="mt-3 text-gray-500">
                    Enter your starting balance to get started.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-10 rounded-2xl bg-white p-8 shadow-sm"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-medium text-gray-600">
                            Starting Cash
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={initialCash}
                            onChange={(event) => setInitialCash(event.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Portfolio"}
                    </button>
                </form>

            </div>
        </main>
    );
}