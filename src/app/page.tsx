"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTxStore } from "@/app/store/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { currencyFormat } from "@/lib/utils";

const currencies = [
  { label: "IDR", value: "IDR" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
];
const incomeCats = ["Salary", "Bonus", "Gift", "Other"];
const outcomeCats = ["Food", "Transport", "Rent", "Shopping", "Bills", "Other"];

export default function HomePage() {
  const { data: session } = useSession();
  const { profileKey, transactions, add, remove, clear, switchProfile } =
    useTxStore();
  const [currency, setCurrency] = useState("IDR");
  useEffect(() => {
    if (session?.user?.email) switchProfile(session.user.email);
  }, [session, switchProfile]);
  const [inAmount, setInAmount] = useState("");
  const [inCat, setInCat] = useState(incomeCats[0]);
  const [outAmount, setOutAmount] = useState("");
  const [outCat, setOutCat] = useState(outcomeCats[0]);
  const [cards, setCards] = useState<any | null>(null);
  const displayTx = useMemo(
    () => transactions.filter((t) => t.currency === currency),
    [transactions, currency]
  );

  async function refreshOverview() {
    const res = await fetch("/api/overview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactions: displayTx, currency }),
    });
    const j = await res.json();
    setCards(j);
  }
  useEffect(() => {
    refreshOverview(); /* eslint-disable-next-line */
  }, [transactions, currency]);

  const onAddIncome = () => {
    const amt = Number(inAmount);
    if (Number.isFinite(amt) && amt > 0) {
      add({ type: "income", category: inCat, amount: amt, currency });
      setInAmount("");
    }
  };
  const onAddOutcome = () => {
    const amt = Number(outAmount);
    if (Number.isFinite(amt) && amt > 0) {
      add({ type: "outcome", category: outCat, amount: amt, currency });
      setOutAmount("");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Overview</h1>
          <p className="text-sm text-neutral-500">
            Profile: <span className="font-medium">{profileKey}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            options={currencies}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
          <Button variant="ghost" onClick={clear}>
            Clear
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {cards ? (
          <>
            <MetricCard
              title={cards.balance.label}
              value={cards.balance.value}
              currency={cards.balance.currency}
            />
            <MetricCard
              title={cards.totalIncome.label}
              value={cards.totalIncome.value}
              currency={cards.totalIncome.currency}
            />
            <MetricCard
              title={cards.totalOutcome.label}
              value={cards.totalOutcome.value}
              currency={cards.totalOutcome.currency}
            />
            <MetricCard
              title={cards.savings.label}
              value={cards.savings.value}
              currency={cards.savings.currency}
            />
            <AdviceCard text={cards.advice.text} />
          </>
        ) : (
          <p className="text-sm text-neutral-500">No data yet…</p>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Category</Label>
                <Select
                  options={incomeCats.map((c) => ({ label: c, value: c }))}
                  value={inCat}
                  onChange={(e) => setInCat(e.target.value)}
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  placeholder="0"
                  inputMode="numeric"
                  value={inAmount}
                  onChange={(e) => setInAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3">
              <Button onClick={onAddIncome}>Add Income</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Outcome</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Category</Label>
                <Select
                  options={outcomeCats.map((c) => ({ label: c, value: c }))}
                  value={outCat}
                  onChange={(e) => setOutCat(e.target.value)}
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  placeholder="0"
                  inputMode="numeric"
                  value={outAmount}
                  onChange={(e) => setOutAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3">
              <Button onClick={onAddOutcome}>Add Outcome</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-500">
              <tr>
                <th className="py-2">Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {displayTx.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="py-2 capitalize">{t.type}</td>
                  <td>{t.category}</td>
                  <td>{currencyFormat(t.amount, t.currency)}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="text-right">
                    <Button variant="ghost" onClick={() => remove(t.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {displayTx.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-neutral-500">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  currency,
}: {
  title: string;
  value: number;
  currency: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">
        {currencyFormat(value, currency)}
      </CardContent>
    </Card>
  );
}
function AdviceCard({ text }: { text: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advice</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-neutral-600 dark:text-neutral-300">
        {text}
      </CardContent>
    </Card>
  );
}
