import BuyStockForm from "./components/BuyStockForm";
import SellStockForm from "./components/SellStockForm";

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

async function getPortfolio(): Promise<Portfolio> {
  const response = await fetch("http://localhost:8080/api/accounts/1/portfolio", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load portfolio");
  }

  return response.json();
}

function money(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default async function Home() {
  const portfolio = await getPortfolio();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10">
          <p className="text-sm font-medium text-gray-400">SHOULDABOUGHT</p>

          <h1 className="mt-2 text-4xl font-bold">
            Investment Dashboard
          </h1>

          <p className="mt-3 text-gray-400">
            Track the investments you wish you had made.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Portfolio Value</p>
            <p className="mt-2 text-3xl font-bold">
              {money(portfolio.totalValue)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Cash</p>
            <p className="mt-2 text-3xl font-bold">
              {money(portfolio.cash)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Total Gain / Loss</p>
            <p className="mt-2 text-3xl font-bold">
              {money(portfolio.totalGainLoss)}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 px-6 py-5">
            <h2 className="text-xl font-semibold">Holdings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-gray-400">
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4">Symbol</th>
                  <th className="px-6 py-4">Shares</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Market Value</th>
                  <th className="px-6 py-4">Gain / Loss</th>
                </tr>
              </thead>

              <tbody>
                {portfolio.holdings.map((holding) => (
                  <tr
                    key={holding.symbol}
                    className="border-b border-gray-800 last:border-0"
                  >
                    <td className="px-6 py-5 font-semibold">
                      {holding.symbol}
                    </td>

                    <td className="px-6 py-5">
                      {holding.quantity}
                    </td>

                    <td className="px-6 py-5">
                      {money(holding.currentPrice)}
                    </td>

                    <td className="px-6 py-5">
                      {money(holding.marketValue)}
                    </td>

                    <td className="px-6 py-5">
                      {money(holding.gainLoss)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <BuyStockForm />
        <SellStockForm />
      </div>
    </main>
  );
}