import React, { useMemo, useState } from "react";
import { X } from "lucide-react";

// --- Types you can move to a central types.ts later ---
export type LineItem = {
  id: string;
  name: string;
  description: string;
  uom: string;
  qty: number;
  materialCost: number;   // your cost
  markup: number;         // percent, e.g. 20 = 20%
  price: number;          // sell price (auto or manual)
  taxRate: number;        // percent
};

export type EstimateStatus = "Pending" | "Sent" | "Viewed" | "Signed";

export type Estimate = {
  id: string;
  token: string;                   // public share token
  customerId: number | string;
  customerName: string;
  date: string;
  items: LineItem[];
  customerNote?: string;
  internalNote?: string;
  subtotal: number;
  tax: number;
  total: number;
  status: EstimateStatus;
  sentAt?: string;
  viewedAt?: string;
  signedAt?: string;
  signerName?: string;
  signatureDataUrl?: string;       // base64 canvas image
};

type CustomerLite = {
  id: number | string;
  name: string;
  email?: string;
};

type Props = {
  isOpen: boolean;
  customer: CustomerLite;
  onClose: () => void;
  onSave: (estimate: Estimate) => void;
};

const emptyItem = (): LineItem => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  uom: "items",
  qty: 1,
  materialCost: 0,
  markup: 0,
  price: 0,
  taxRate: 0,
});

export default function EstimateCreator({
  isOpen,
  customer,
  onClose,
  onSave,
}: Props) {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<LineItem[]>([emptyItem(), emptyItem(), emptyItem()]);
  const [customerNote, setCustomerNote] = useState("");
  const [internalNote, setInternalNote] = useState("");

  // auto calculate price & totals
  const computedItems = useMemo(() => {
    return items.map((it) => {
      const base = it.materialCost * it.qty;
      const sell = it.price > 0 ? it.price : base * (1 + it.markup / 100);
      const amount = sell * it.qty;
      return { ...it, price: sell, _amount: amount };
    });
  }, [items]);

  const { subtotal, tax, total } = useMemo(() => {
    const sub = computedItems.reduce((s, it) => s + it._amount, 0);
    const tx = computedItems.reduce(
      (s, it) => s + it._amount * (it.taxRate / 100),
      0
    );
    return { subtotal: round2(sub), tax: round2(tx), total: round2(sub + tx) };
  }, [computedItems]);

  function round2(n: number) {
    return Math.round(n * 100) / 100;
  }

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const handleSave = () => {
    const estimate: Estimate = {
      id: `EST-${new Date().getTime()}`,
      token: crypto.randomUUID(),          // <— new
      customerId: customer.id,
      customerName: customer.name,
      date,
      items: computedItems.map(({ _amount, ...rest }: any) => rest),
      customerNote,
      internalNote,
      subtotal,
      tax,
      total,
      status: "Pending",
    };

    onSave(estimate);
    onClose();
  };

  if (!isOpen) return null;

  // VERY SIMPLE modal overlay (Tailwind classes used, swap for your CSS)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-6xl rounded shadow-lg p-6 relative">
        <button
          className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
          onClick={onClose}
        >
          <X />
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          Create Estimate — {customer.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
          <label className="block text-sm font-medium mb-1">Estimate Date</label>
            <input
              type="date"
              className="w-full border rounded px-2 py-1 dark:bg-neutral-800"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Add these dropdowns later when you wire catalogs/templates */}
          <div>
            <label className="block text-sm font-medium mb-1">Supplier Catalog</label>
            <select className="w-full border rounded px-2 py-1 dark:bg-neutral-800">
              <option>None</option>
              <option>Beacon Roofing Supply</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Design Template</label>
            <select className="w-full border rounded px-2 py-1 dark:bg-neutral-800">
              <option>None</option>
              <option>Metal Reroof Template</option>
              <option>Shingle Template</option>
            </select>
          </div>
        </div>

        {/* Line items table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-800">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Item Name</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">UoM</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Mtl Cost</th>
                <th className="p-2 border">Markup %</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Tax %</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {computedItems.map((it, idx) => (
                <tr key={it.id}>
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">
                    <input
                      className="w-full border rounded px-1 py-0.5 dark:bg-neutral-800"
                      value={it.name}
                      onChange={(e) => updateItem(it.id, { name: e.target.value })}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      className="w-full border rounded px-1 py-0.5 dark:bg-neutral-800"
                      value={it.description}
                      onChange={(e) =>
                        updateItem(it.id, { description: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      className="w-full border rounded px-1 py-0.5 dark:bg-neutral-800"
                      value={it.uom}
                      onChange={(e) => updateItem(it.id, { uom: e.target.value })}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      className="w-full border rounded px-1 py-0.5 dark:bg-neutral-800"
                      value={it.qty}
                      onChange={(e) =>
                        updateItem(it.id, { qty: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      className="w-full border rounded px-1 py-0.5 dark:bg-neutral-800"
                      value={it.materialCost}
                      onChange={(e) =>
                        updateItem(it.id, { materialCost: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      className="w-full border rounded px-1 py-0.5 dark:bg-neutral-800"
                      value={it.markup}
                      onChange={(e) =>
                        updateItem(it.id, { markup: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      className="w-full border rounded px-1 py-0.5 dark:bg-neutral-800"
                      value={round2(it.price)}
                      onChange={(e) =>
                        updateItem(it.id, { price: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      className="w-full border rounded px-1 py-0.5 dark:bg-neutral-800"
                      value={it.taxRate}
                      onChange={(e) =>
                        updateItem(it.id, { taxRate: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td className="p-2 border text-right">
                    ${round2(it._amount).toFixed(2)}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      className="text-red-600"
                      onClick={() => removeItem(it.id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={11} className="p-2">
                  <button
                    className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 rounded"
                    onClick={addItem}
                  >
                    + Add item
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer Note</label>
            <textarea
              className="w-full border rounded px-2 py-1 h-24 dark:bg-neutral-800"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Internal Note</label>
            <textarea
              className="w-full border rounded px-2 py-1 h-24 dark:bg-neutral-800"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col md:flex-row justify-end gap-6 text-right mb-6">
          <div>
            <div>Subtotal: <strong>${subtotal.toFixed(2)}</strong></div>
            <div>Tax: <strong>${tax.toFixed(2)}</strong></div>
            <div className="text-xl">Total: <strong>${total.toFixed(2)}</strong></div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Save Estimate
          </button>
        </div>
      </div>
    </div>
  );
}