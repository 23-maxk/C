import React, { useEffect, useRef, useState } from "react";
import { Estimate } from "./EstimateCreator";
import { findEstimateByToken, upsertEstimate } from "../utils/db";

interface EstimatePublicViewProps {
  token: string;
  onClose: () => void;
}

export default function EstimatePublicView({ token, onClose }: EstimatePublicViewProps) {
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [signerName, setSignerName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!token) return;
    const est = findEstimateByToken(token);
    if (!est) {
      alert("Estimate not found or link expired.");
      onClose();
      return;
    }
    // Mark Viewed (first time)
    if (est.status === "Sent" || est.status === "Pending") {
      est.status = "Viewed";
      est.viewedAt = new Date().toISOString();
      upsertEstimate(est);
    }
    setEstimate({ ...est });
  }, [token, onClose]);

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true);
    draw(e);
  };
  const endDraw = () => setDrawing(false);
  const draw = (e: any) => {
    if (!drawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const getPos = (ev: any) => {
      const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
      const y = (ev.touches ? ev.touches[0].clientY : ev.clientY) - rect.top;
      return { x, y };
    };
    const { x, y } = getPos(e);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x, y, 1.2, 0, 2 * Math.PI);
    ctx.fill();
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleSign = () => {
    if (!estimate || !canvasRef.current) return;
    if (!signerName.trim()) {
      alert("Please type your full name.");
      return;
    }
    const signatureDataUrl = canvasRef.current.toDataURL("image/png");

    const signed: Estimate = {
      ...estimate,
      status: "Signed",
      signerName,
      signedAt: new Date().toISOString(),
      signatureDataUrl,
    };
    upsertEstimate(signed);
    setEstimate(signed);
    alert("Thank you. Your estimate has been signed.");
  };

  if (!estimate) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
          Estimate {estimate.id}
        </h1>
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          For: <strong>{estimate.customerName}</strong> — Date: {estimate.date}
        </div>
        
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            estimate.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
            estimate.status === 'Sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
            estimate.status === 'Viewed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          }`}>
            {estimate.status}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="p-3 border border-gray-200 dark:border-gray-600 text-left">#</th>
                <th className="p-3 border border-gray-200 dark:border-gray-600 text-left">Item</th>
                <th className="p-3 border border-gray-200 dark:border-gray-600 text-left">Description</th>
                <th className="p-3 border border-gray-200 dark:border-gray-600 text-right">Qty</th>
                <th className="p-3 border border-gray-200 dark:border-gray-600 text-right">Price</th>
                <th className="p-3 border border-gray-200 dark:border-gray-600 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {estimate.items.map((it, idx) => (
                <tr key={it.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3 border border-gray-200 dark:border-gray-600">{idx + 1}</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-600 font-medium">{it.name}</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-600">{it.description}</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-600 text-right">{it.qty}</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-600 text-right">${it.price.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-600 text-right font-medium">
                    ${(it.price * it.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          <div className="text-right space-y-2">
            <div className="text-gray-600 dark:text-gray-400">
              Subtotal: <span className="font-medium text-gray-900 dark:text-white">${estimate.subtotal.toFixed(2)}</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Tax: <span className="font-medium text-gray-900 dark:text-white">${estimate.tax.toFixed(2)}</span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2">
              Total: ${estimate.total.toFixed(2)}
            </div>
          </div>
        </div>

        {estimate.customerNote && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Notes</h3>
            <p className="text-blue-800 dark:text-blue-200">{estimate.customerNote}</p>
          </div>
        )}

        {estimate.status !== "Signed" ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sign & Accept Estimate</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Your full name *
              </label>
              <input
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Signature *
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={180}
                  className="w-full bg-white cursor-crosshair"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
              </div>
              <div className="flex justify-between mt-2">
                <button
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={clearSignature}
                >
                  Clear Signature
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Draw your signature above
                </p>
              </div>
            </div>

            <button
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              onClick={handleSign}
            >
              Sign & Accept Estimate
            </button>
          </div>
        ) : (
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-lg mt-6">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <strong>Estimate Signed</strong>
                <p className="text-sm">
                  Signed by <strong>{estimate.signerName}</strong> on{" "}
                  {new Date(estimate.signedAt!).toLocaleString()}
                </p>
              </div>
            </div>
            
            {estimate.signatureDataUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Signature:</p>
                <img 
                  src={estimate.signatureDataUrl} 
                  alt="Customer Signature" 
                  className="border border-green-200 dark:border-green-800 rounded max-w-xs"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}