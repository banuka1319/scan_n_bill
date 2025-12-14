import React, { useState } from 'react';
import { ReceiptData } from '../types';
import { Download, Copy, Check, Calendar, ShoppingBag, DollarSign } from 'lucide-react';

interface DataSheetProps {
  data: ReceiptData;
}

const DataSheet: React.FC<DataSheetProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const downloadCSV = () => {
    const headers = ["Description", "Category", "Quantity", "Unit Price", "Total Price"];
    const rows = data.items.map(item => [
      `"${item.description.replace(/"/g, '""')}"`,
      `"${item.category || ''}"`,
      item.quantity,
      item.unitPrice,
      item.totalPrice
    ]);
    
    // Add summary rows
    rows.push([]);
    rows.push(["Subtotal", "", "", "", data.totalAmount - data.taxAmount]);
    rows.push(["Tax", "", "", "", data.taxAmount]);
    rows.push(["Grand Total", "", "", "", data.totalAmount]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bill_${data.merchantName.replace(/\s+/g, '_').toLowerCase()}_${data.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    const headers = ["Description", "Category", "Quantity", "Unit Price", "Total Price"];
    const rows = data.items.map(item => [
      item.description,
      item.category || '',
      item.quantity.toString(),
      item.unitPrice.toString(),
      item.totalPrice.toString()
    ]);

    // Create tab-separated string for spreadsheet pasting
    const tsvContent = [
      headers.join("\t"),
      ...rows.map(r => r.join("\t")),
      "",
      ["Subtotal", "", "", "", (data.totalAmount - data.taxAmount).toFixed(2)].join("\t"),
      ["Tax", "", "", "", data.taxAmount.toFixed(2)].join("\t"),
      ["Grand Total", "", "", "", data.totalAmount.toFixed(2)].join("\t")
    ].join("\n");

    try {
      await navigator.clipboard.writeText(tsvContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full animate-fade-in-up">
      {/* Meta Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="bg-emerald-100 p-3 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Merchant</p>
                <h3 className="text-lg font-bold text-slate-900 truncate" title={data.merchantName}>{data.merchantName}</h3>
            </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</p>
                <h3 className="text-lg font-bold text-slate-900">{data.date || "N/A"}</h3>
            </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="bg-amber-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</p>
                <h3 className="text-lg font-bold text-slate-900">{data.currency} {data.totalAmount.toFixed(2)}</h3>
            </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Itemized Breakdown</h2>
        <div className="flex space-x-2">
            <button 
                onClick={downloadCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm"
            >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
            </button>
            <button 
                onClick={copyToClipboard}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm ${
                    copied 
                    ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy for Sheets"}</span>
            </button>
        </div>
      </div>

      {/* The Sheet */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                <th className="px-6 py-4">Item Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Qty</th>
                <th className="px-6 py-4 text-right">Unit Price</th>
                <th className="px-6 py-4 text-right">Total</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {data.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.description}</td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {item.category || "General"}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-mono">{item.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-slate-900">{item.totalPrice.toFixed(2)}</td>
                </tr>
                ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                    <td colSpan={3}></td>
                    <td className="px-6 py-3 text-right text-slate-500 font-medium">Subtotal</td>
                    <td className="px-6 py-3 text-right font-mono text-slate-700">{(data.totalAmount - data.taxAmount).toFixed(2)}</td>
                </tr>
                <tr>
                    <td colSpan={3}></td>
                    <td className="px-6 py-3 text-right text-slate-500 font-medium">Tax</td>
                    <td className="px-6 py-3 text-right font-mono text-slate-700">{data.taxAmount.toFixed(2)}</td>
                </tr>
                <tr className="bg-slate-100/50">
                    <td colSpan={3}></td>
                    <td className="px-6 py-4 text-right text-slate-900 font-bold">Grand Total</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-blue-600 text-base">{data.currency} {data.totalAmount.toFixed(2)}</td>
                </tr>
            </tfoot>
            </table>
        </div>
      </div>
      
      {data.summary && (
         <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-start">
            <span className="font-semibold mr-2">AI Summary:</span> {data.summary}
         </div>
      )}
    </div>
  );
};

export default DataSheet;
