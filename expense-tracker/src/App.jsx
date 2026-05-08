import React, { useState, useEffect, useMemo } from "react";

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses-data");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "Food",
    amount: "",
    note: "",
  });

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Education",
    "Health",
    "Travel",
    "Other",
  ];

  useEffect(() => {
    localStorage.setItem("expenses-data", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    const newExpense = {
      id: Date.now(),
      ...form,
      amount: Number(form.amount),
    };

    setExpenses([newExpense, ...expenses]);

    setForm({
      date: new Date().toISOString().split("T")[0],
      category: "Food",
      amount: "",
      note: "",
    });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const grouped = {};

    expenses.forEach((expense) => {
      const month = expense.date.slice(0, 7);
      grouped[month] = (grouped[month] || 0) + expense.amount;
    });

    return Object.entries(grouped).sort((a, b) =>
      b[0].localeCompare(a[0])
    );
  }, [expenses]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h1 className="text-4xl font-bold mb-2">Personal Expense Tracker</h1>
          <p className="text-gray-500">
            Track daily and monthly expenses locally in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Add Expense</h2>

            <div className="space-y-4">
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="w-full border rounded-xl p-3"
              />

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full border rounded-xl p-3"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                className="w-full border rounded-xl p-3"
              />

              <textarea
                placeholder="Note"
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
                className="w-full border rounded-xl p-3"
              />

              <button
                onClick={addExpense}
                className="w-full bg-black text-white rounded-xl p-3 font-semibold hover:opacity-90"
              >
                Add Expense
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>

            <div className="space-y-4">
              <div className="bg-gray-100 rounded-2xl p-4">
                <p className="text-gray-500">Total Expenses</p>
                <h3 className="text-3xl font-bold">
                  ₹ {totalExpense.toLocaleString()}
                </h3>
              </div>

              <div className="bg-gray-100 rounded-2xl p-4">
                <p className="text-gray-500">Total Entries</p>
                <h3 className="text-3xl font-bold">{expenses.length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Monthly Summary</h2>

            <div className="space-y-3">
              {monthlyData.length === 0 ? (
                <p className="text-gray-500">No monthly data available.</p>
              ) : (
                monthlyData.map(([month, total]) => (
                  <div
                    key={month}
                    className="flex justify-between bg-gray-100 rounded-xl p-4"
                  >
                    <span className="font-medium">{month}</span>
                    <span className="font-bold">
                      ₹ {total.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Expenses</h2>

          <div className="overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Date</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Note</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan="5">
                      No expenses added.
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="border-b">
                      <td className="p-3">{expense.date}</td>
                      <td className="p-3">{expense.category}</td>
                      <td className="p-3 font-semibold">
                        ₹ {expense.amount}
                      </td>
                      <td className="p-3">{expense.note}</td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="text-red-500 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
