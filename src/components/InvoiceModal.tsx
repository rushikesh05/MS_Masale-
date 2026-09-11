import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Download, ShieldCheck, CheckCircle, FileText, Sparkles, Building, Phone, Mail, Copy, Check } from 'lucide-react';
import { Order } from '../types';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  language?: 'mr' | 'en';
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
  language = 'mr'
}) => {
  const isMr = language === 'mr';
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const invoiceNumber = order
    ? `AG-${new Date(order.createdAt).getFullYear()}-${order.id.slice(-6).toUpperCase()}`
    : '';
  const subtotal = order ? (order.subtotal || order.totalAmount) : 0;
  const discount = order ? (order.discount || 0) : 0;
  const shippingFee = order ? (order.shippingFee || 0) : 0;
  const grandTotal = order ? order.totalAmount : 0;

  // Calculate GST breakdown (5% total GST on condiments: 2.5% CGST + 2.5% SGST)
  const taxableAmount = Math.round((subtotal - discount) / 1.05);
  const totalGst = (subtotal - discount) - taxableAmount;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;

  // Generate self-contained standalone HTML for Print & Download
  const generateInvoiceHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${invoiceNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Tiro+Devanagari+Marathi&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #ffffff;
      color: #1c1917;
      padding: 24px;
      max-width: 820px;
      margin: 0 auto;
      font-size: 12px;
      line-height: 1.4;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #1c1917;
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 800;
      color: #8c1c0b;
      font-family: 'Tiro Devanagari Marathi', serif;
    }
    .company-sub {
      font-size: 11px;
      font-weight: 600;
      color: #44403c;
    }
    .tax-badge {
      background: #8c1c0b;
      color: #ffffff;
      padding: 4px 10px;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 1px;
      border-radius: 4px;
      display: inline-block;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #fbf9f6;
      border: 1px solid #e7e5e4;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    th {
      background: #292524;
      color: #ffffff;
      padding: 8px;
      text-align: left;
      font-size: 11px;
    }
    td {
      padding: 8px;
      border-bottom: 1px solid #e7e5e4;
      font-size: 11px;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .bold { font-weight: 700; }
    .total-row td {
      border-top: 2px solid #1c1917;
      font-size: 13px;
      font-weight: 800;
      color: #8c1c0b;
    }
    .footer {
      border-top: 1px dashed #d6d3d1;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
    }
    @media print {
      body { padding: 0; }
      @page { size: A4 portrait; margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">MS Masale Industries</div>
      <div class="company-sub">MS Masale Foods Pvt. Ltd.</div>
      <div style="font-size: 10px; color: #78716c; margin-top: 4px;">
        MS Masale Complex, Baner-Mahalunge Road, Pune 411045, Maharashtra<br/>
        <strong>GSTIN:</strong> 27AABCU9603R1ZM | <strong>FSSAI Lic:</strong> 11523038000492 | <strong>Helpline:</strong> 8591254237
      </div>
    </div>
    <div style="text-align: right;">
      <div class="tax-badge">TAX INVOICE</div>
      <div style="margin-top: 6px; font-size: 11px; color: #44403c;">
        <div><strong>Invoice No:</strong> ${invoiceNumber}</div>
        <div><strong>Order ID:</strong> #${order.id}</div>
        <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        <div><strong>Place of Supply:</strong> Maharashtra (27)</div>
      </div>
    </div>
  </div>

  <div class="grid-2">
    <div>
      <div style="font-size: 10px; font-weight: bold; color: #a8a29e; text-transform: uppercase; margin-bottom: 4px;">Billed & Shipped To:</div>
      <div class="bold" style="font-size: 13px;">${order.customer.fullName}</div>
      <div>${order.customer.addressLine1}</div>
      ${order.customer.addressLine2 ? `<div>${order.customer.addressLine2}</div>` : ''}
      <div>${order.customer.talukaDistrict}, ${order.customer.state || 'Maharashtra'} - ${order.customer.pincode}</div>
      <div style="color: #78716c; margin-top: 4px;">Phone: ${order.customer.phone} ${order.customer.email ? `| Email: ${order.customer.email}` : ''}</div>
    </div>
    <div>
      <div style="font-size: 10px; font-weight: bold; color: #a8a29e; text-transform: uppercase; margin-bottom: 4px;">Payment & Delivery Details:</div>
      <div><strong>Status:</strong> <span style="color: #15803d; font-weight: bold;">${order.paymentStatus || 'PAID'}</span></div>
      <div><strong>Mode:</strong> ${order.paymentMethod || 'UPI / Online'}</div>
      <div><strong>Hub:</strong> MS Masale Pune Fulfillment Center #01</div>
      <div><strong>Courier:</strong> ${order.assignedDeliveryPerson?.name || 'Assal Express Fleet'}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 30px;">#</th>
        <th>Description / Chutney Jar</th>
        <th>HSN Code</th>
        <th>Size</th>
        <th class="text-center">Qty</th>
        <th class="text-right">Rate</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map((item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <strong>${item.titleMr}</strong> (${item.titleEn})
            ${item.isCustomRecipe ? '<br/><span style="font-size: 9px; color: #8c1c0b;">[Signature Recipe]</span>' : ''}
          </td>
          <td>21039090</td>
          <td>${item.size}</td>
          <td class="text-center bold">${item.quantity}</td>
          <td class="text-right">₹${item.unitPrice}</td>
          <td class="text-right bold">₹${item.totalPrice || item.unitPrice * item.quantity}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
    <div style="background: #fef3c7; border: 1px solid #fde68a; padding: 10px; border-radius: 6px; font-size: 10px; color: #78350f;">
      <strong>FSSAI & Quality Declaration:</strong><br/>
      Crafted with zero chemical preservatives, 100% natural cold-pressed oil, stone-pounded in traditional mortars. This computer-generated invoice is legally valid under GST Act 2017.
    </div>
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Subtotal:</span>
        <span class="bold">₹${subtotal}</span>
      </div>
      ${discount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #15803d;">
          <span>Discount:</span>
          <span class="bold">- ₹${discount}</span>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Shipping / Delivery:</span>
        <span class="bold">${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 10px; color: #78716c; border-top: 1px solid #e7e5e4; padding-top: 4px;">
        <span>Taxable Value:</span>
        <span>₹${taxableAmount}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 10px; color: #78716c;">
        <span>CGST (2.5%):</span>
        <span>₹${cgst}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 10px; color: #78716c;">
        <span>SGST (2.5%):</span>
        <span>₹${sgst}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 800; color: #8c1c0b; border-top: 2px solid #1c1917; padding-top: 6px; margin-top: 6px;">
        <span>Grand Total:</span>
        <span>₹${grandTotal}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div style="font-size: 9px; color: #78716c;">
      Digital Signature Verified • Ref: ${order.id}<br/>
      MS Masale Foods Pvt. Ltd.
    </div>
    <div style="text-align: right;">
      <div style="font-size: 12px; font-weight: bold; color: #8c1c0b; font-style: italic;">MS Masale Foods</div>
      <div style="border-top: 1px solid #78716c; width: 140px; margin-top: 4px; padding-top: 2px; font-size: 9px; color: #44403c;">Authorized Signatory</div>
    </div>
  </div>
</body>
</html>`;
  };

  // 1. Direct Print Handler (Uses Isolated Iframe & Fallback Pop-out)
  const handlePrint = () => {
    setIsPrinting(true);
    try {
      const invoiceHTML = generateInvoiceHTML();

      // Create an invisible iframe in document
      let iframe = document.getElementById('tax-invoice-print-frame') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'tax-invoice-print-frame';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
      }

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(invoiceHTML);
        doc.close();

        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (err) {
            console.warn('Iframe print fallback triggered:', err);
            // Fallback: window.open popup
            const printWin = window.open('', '_blank');
            if (printWin) {
              printWin.document.write(invoiceHTML);
              printWin.document.close();
              printWin.focus();
              printWin.print();
            } else {
              window.print();
            }
          }
          setIsPrinting(false);
        }, 400);
      } else {
        window.print();
        setIsPrinting(false);
      }
    } catch (e) {
      console.error('Print execution error:', e);
      window.print();
      setIsPrinting(false);
    }
  };

  // 2. Direct Download Handler (.html Invoice Document that user can open/print/save as PDF anywhere)
  const handleDownload = () => {
    try {
      const invoiceHTML = generateInvoiceHTML();
      const blob = new Blob([invoiceHTML], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Assal-Gavran-Tax-Invoice-${invoiceNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  // 3. Copy Summary to Clipboard
  const handleCopySummary = () => {
    const textSummary = `📜 अस्सल गावरान चटणी - अधिकृत कर पावती (Tax Invoice)
📄 Invoice No: ${invoiceNumber}
🔢 Order ID: #${order.id}
👤 Customer: ${order.customer.fullName} (${order.customer.phone})
📦 Items:
${order.items.map((it, i) => `  ${i + 1}. ${it.titleMr} (${it.size}) x ${it.quantity} = ₹${it.totalPrice || it.unitPrice * it.quantity}`).join('\n')}
💰 Total Paid: ₹${grandTotal} (${order.paymentMethod || 'Online'})
🏢 GSTIN: 27AABCU9603R1ZM | FSSAI: 11523038000492`;
    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
          {/* Backdrop with subtle fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs print:hidden"
          />

          {/* Modal Container with fluid spring entrance & exit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.8 }}
            className="relative z-10 bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
          >
            {/* Action Bar (Hidden on print) */}
            <div className="bg-[#241C1C] p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#B82A16] flex items-center justify-center text-white shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {isMr ? 'कायदेशीर कर बीजक (Official Tax Invoice)' : 'Official Tax Invoice (GST)'}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {invoiceNumber}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Print Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  id="btn-print-tax-invoice"
                  type="button"
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#B82A16] to-[#8C1C0B] hover:from-[#981E0D] hover:to-[#701407] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isPrinting ? (isMr ? 'प्रिंटिंग...' : 'Printing...') : (isMr ? 'प्रिंट करा (Print)' : 'Print Invoice')}</span>
                </motion.button>

                {/* Download Document Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  id="btn-download-tax-invoice"
                  type="button"
                  onClick={handleDownload}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isMr ? 'डाउनलोड (.html / PDF)' : 'Download'}</span>
                </motion.button>

                {/* Copy Text Summary */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={handleCopySummary}
                  className="px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Copy Summary"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copied ? (isMr ? 'कॉपी झाले!' : 'Copied!') : (isMr ? 'कॉपी' : 'Copy')}</span>
                </motion.button>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div
              ref={printRef}
              id="tax-invoice-printable-container"
              className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-stone-800 bg-[#FFFFFF] font-sans print:overflow-visible print:p-8"
            >
              {/* Invoice Header: Company Info & Branding */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8C1C0B] via-[#520909] to-[#241C1A] flex items-center justify-center text-amber-300 font-serif font-black text-xl shadow-md shrink-0 border border-amber-500/40">
                    MS
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black font-serif text-[#241C1A] tracking-tight">
                      MS Masale Industries
                    </h1>
                    <p className="text-xs font-semibold text-stone-600">
                      MS Masale Foods Pvt. Ltd.
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      MS Masale Complex, Baner-Mahalunge Road, Pune 411045, Maharashtra
                    </p>
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold text-stone-700 mt-1">
                      <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-300">
                        GSTIN: 27AABCU9603R1ZM
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                        FSSAI Lic No: 11523038000492
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right text-left">
                  <span className="inline-block px-3 py-1 bg-[#B82A16] text-white text-xs font-extrabold tracking-wider uppercase rounded-lg">
                    TAX INVOICE
                  </span>
                  <div className="mt-2 text-xs text-stone-600">
                    <div><strong>Invoice No:</strong> {invoiceNumber}</div>
                    <div><strong>Order ID:</strong> #{order.id}</div>
                    <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <div><strong>Place of Supply:</strong> Maharashtra (27)</div>
                  </div>
                </div>
              </div>

              {/* Bill To & Dispatch Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    बिल कोणाचे (Billed & Shipped To):
                  </span>
                  <div className="font-bold text-sm text-stone-900">{order.customer.fullName}</div>
                  <div className="text-stone-700 mt-0.5">{order.customer.addressLine1}</div>
                  {order.customer.addressLine2 && <div className="text-stone-700">{order.customer.addressLine2}</div>}
                  <div className="text-stone-700">
                    {order.customer.talukaDistrict}, {order.customer.state || 'Maharashtra'} - {order.customer.pincode}
                  </div>
                  <div className="text-stone-600 mt-1 font-mono">
                    📞 {order.customer.phone} {order.customer.email ? `• ✉️ ${order.customer.email}` : ''}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    डिलिव्हरी & पेमेंट तपशील (Dispatch & Payment):
                  </span>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Payment Status:</span>
                      <span className="font-bold text-emerald-700 uppercase">{order.paymentStatus || 'PAID'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Payment Mode:</span>
                      <span className="font-bold text-stone-800 uppercase">{order.paymentMethod || 'UPI/Online'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Dispatch Hub:</span>
                      <span className="font-bold text-stone-800">Sahyadri Stone-Crush Center #01</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Courier Partner:</span>
                      <span className="font-bold text-stone-800">{order.assignedDeliveryPerson?.name || 'Assal Express Fleet'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-800 text-white font-bold">
                      <th className="p-2.5 rounded-l-lg">#</th>
                      <th className="p-2.5">वस्तू / चटणीचे नाव (Description)</th>
                      <th className="p-2.5">HSN Code</th>
                      <th className="p-2.5">पॅक आकार</th>
                      <th className="p-2.5 text-center">नग (Qty)</th>
                      <th className="p-2.5 text-right">दर (Rate)</th>
                      <th className="p-2.5 text-right rounded-r-lg">रक्कम (Total)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50">
                        <td className="p-2.5 font-mono text-stone-500">{idx + 1}</td>
                        <td className="p-2.5">
                          <div className="font-bold text-stone-900">{item.titleMr}</div>
                          <div className="text-[10px] text-stone-500">{item.titleEn}</div>
                          {item.isCustomRecipe && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-bold">
                              १००% सानुकूल दगडी खलबत्त्यात कुटलेली
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono text-stone-600">21039090</td>
                        <td className="p-2.5 font-medium">{item.size}</td>
                        <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                        <td className="p-2.5 text-right font-mono">₹{item.unitPrice}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-stone-900">
                          ₹{item.totalPrice || item.unitPrice * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculations & Taxes Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-950 font-medium">
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#B82A16]" />
                      <span>FSSAI & अन्न सुरक्षा हमी:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      हे उत्पादन १००% नैसर्गिक, शून्य केमिकल प्रिझर्व्हेटिव्ह व शून्य पाम ऑइल युक्त आहे.
                      सदर बीजक वस्तू व सेवा कर (GST) कायद्यानुसार अधिकृत आहे.
                    </p>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    <strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal (एकूण किंमत):</span>
                    <span className="font-mono font-bold">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount (सूट):</span>
                      <span className="font-mono font-bold">- ₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping & Delivery (डिलिव्हरी शुल्क):</span>
                    <span className="font-mono font-bold">
                      {shippingFee === 0 ? 'मोफत (FREE)' : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-500 text-[11px] pt-1 border-t border-stone-200">
                    <span>Taxable Amount (करपात्र मूल्य):</span>
                    <span className="font-mono">₹{taxableAmount}</span>
                  </div>
                  <div className="flex justify-between text-stone-500 text-[11px]">
                    <span>CGST (2.5%):</span>
                    <span className="font-mono">₹{cgst}</span>
                  </div>
                  <div className="flex justify-between text-stone-500 text-[11px]">
                    <span>SGST (2.5%):</span>
                    <span className="font-mono">₹{sgst}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-extrabold text-[#241C1A] pt-2 border-t-2 border-stone-800">
                    <span>Grand Total (एकूण देय रक्कम):</span>
                    <span className="font-mono text-base text-[#B82A16]">₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Signature & Seal */}
              <div className="pt-6 border-t border-dashed border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center text-xs font-mono font-bold text-stone-600">
                    QR
                  </div>
                  <div className="text-[10px] text-stone-500">
                    <div>Digital Verification Hash:</div>
                    <div className="font-mono text-stone-700">{order.id.slice(0, 16)}...</div>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-xs font-serif font-black text-[#8C1C0B] italic mb-1">
                    MS Masale Foods Pvt. Ltd.
                  </div>
                  <div className="w-32 h-0.5 bg-stone-300 mx-auto sm:ml-auto" />
                  <div className="text-[10px] font-bold text-stone-600 mt-1 uppercase">
                    Authorized Signatory (अधिकृत स्वाक्षरी)
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
