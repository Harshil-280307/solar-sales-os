"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bill, setBill] = useState("");
  const [result, setResult] = useState(null);

  const calculate = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/calculate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bill: Number(bill),
        }),
      }
    );

    const data = await res.json();
    setResult(data);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/save-lead`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          bill,
          system_size: data.system_size,
          annual_savings: data.annual_savings,
        }),
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto">

      <div className="mb-8">
        <h1 className="text-4xl text-white font-bold">
          Solar Proposal Calculator
        </h1>

        <p className="text-white mt-2">
          Generate solar proposals instantly.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="grid md:grid-cols-3 gap-4">

          <input
            className="border p-3 rounded-lg"
            placeholder="Customer Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Monthly Bill"
            value={bill}
            onChange={(e) =>
              setBill(e.target.value)
            }
          />

        </div>

        <button
          onClick={calculate}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Generate Proposal
        </button>
      </div>

      {result && (
        <div className="mt-8">

          <div className="grid md:grid-cols-4 gap-4">

            <div className="bg-white shadow rounded-xl p-4">
              <h3>System Size</h3>
              <p className="text-2xl font-bold">
                {result.system_size} kW
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-4">
              <h3>Cost</h3>
              <p className="text-2xl font-bold">
                ₹{result.cost}
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-4">
              <h3>Savings</h3>
              <p className="text-2xl font-bold">
                ₹{result.annual_savings}
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-4">
              <h3>Payback</h3>
              <p className="text-2xl font-bold">
                {result.payback_years} yrs
              </p>
            </div>

          </div>

          <div className="bg-white mt-6 p-6 rounded-xl shadow">
          <Line
            data={{
              labels: Array.from(
                { length: 10 },
                (_, i) => `Year ${i}`
              ),
              datasets: [
                {
                  label: "Net Savings",
                  data: Array.from(
                    { length: 10 },
                    (_, i) =>
                      i === 0
                        ? -result.cost
                        : i * result.annual_savings - result.cost
                  ),
                  borderColor: "#2563eb",
                  borderWidth: 2,
                },
              ],
            }}
          />
          </div>

        </div>
      )}
    </div>
  );
}