import Dashboard from "./components/Dashboard";
import CreateAccountForm from "./components/CreateAccountForm";

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

async function getPortfolio(): Promise<Portfolio | null> {
  const response = await fetch(
    "http://localhost:8080/api/accounts/1/portfolio",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}
async function getPortfolioHistory(): Promise<PortfolioSnapshot[]> {
  const response = await fetch(
    "http://localhost:8080/api/accounts/1/portfolio/history",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load portfolio history");
  }

  return response.json();
}


export default async function Home() {
  const portfolio = await getPortfolio();

  if (!portfolio) {
    return <CreateAccountForm />;
  }

  const history = await getPortfolioHistory();

  return (
    <Dashboard
      portfolio={portfolio}
      history={history}
    />
  );
}