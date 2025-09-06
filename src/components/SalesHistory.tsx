import React, { useState, useMemo } from 'react';
import { Clock, Eye, FileText, User, Phone, Calendar, Filter, FileSpreadsheet } from 'lucide-react';
import { Invoice } from '../types';
import { formatCurrency } from '../utils/gst';
import * as XLSX from 'xlsx';

interface SalesHistoryProps {
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
}

export const SalesHistory: React.FC<SalesHistoryProps> = ({ invoices, onViewInvoice }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredInvoices = useMemo(() => {
    if (!startDate && !endDate) return invoices;

    return invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate + 'T23:59:59') : null;

      if (start && invoiceDate < start) return false;
      if (end && invoiceDate > end) return false;
      return true;
    });
  }, [invoices, startDate, endDate]);

  const totalSales = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalItems = filteredInvoices.reduce((sum, inv) => sum + inv.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  const todaysTotal = invoices
    .filter(inv => new Date(inv.date).toDateString() === new Date().toDateString())
    .reduce((sum, inv) => sum + inv.total, 0);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const exportToCSV = () => {
    const headers = ['Invoice Number', 'Date', 'Customer Name', 'Customer Phone', 'Items', 'Subtotal', 'GST', 'Total', 'Payment Method'];
    const csvData = filteredInvoices.map(invoice => [
      invoice.invoiceNumber,
      new Date(invoice.date).toLocaleDateString('en-IN'),
      invoice.customer?.name || 'Walk-in Customer',
      invoice.customer?.phone || '',
      invoice.items.length,
      invoice.subtotal,
      (invoice.cgst + invoice.sgst + invoice.igst),
      invoice.total,
      invoice.paymentMethod.toUpperCase()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Sales data
    const salesData = filteredInvoices.map(invoice => ({
      'Invoice Number': invoice.invoiceNumber,
      'Date': new Date(invoice.date).toLocaleDateString('en-IN'),
      'Time': new Date(invoice.date).toLocaleTimeString('en-IN'),
      'Customer Name': invoice.customer?.name || 'Walk-in Customer',
      'Customer Phone': invoice.customer?.phone || '',
      'Items Count': invoice.items.length,
      'Subtotal': invoice.subtotal,
      'CGST': invoice.cgst,
      'SGST': invoice.sgst,
      'IGST': invoice.igst,
      'Total GST': invoice.cgst + invoice.sgst + invoice.igst,
      'Total Amount': invoice.total,
      'Payment Method': invoice.paymentMethod.toUpperCase()
    }));
    
    // Create sales worksheet
    const salesWs = XLSX.utils.json_to_sheet(salesData);
    
    // Set column widths
    salesWs['!cols'] = [
      { wch: 15 }, // Invoice Number
      { wch: 12 }, // Date
      { wch: 10 }, // Time
      { wch: 20 }, // Customer Name
      { wch: 15 }, // Customer Phone
      { wch: 10 }, // Items Count
      { wch: 12 }, // Subtotal
      { wch: 10 }, // CGST
      { wch: 10 }, // SGST
      { wch: 10 }, // IGST
      { wch: 12 }, // Total GST
      { wch: 15 }, // Total Amount
      { wch: 15 }  // Payment Method
    ];
    
    XLSX.utils.book_append_sheet(wb, salesWs, 'Sales Report');
    
    // Payment method summary
    const paymentSummary = {
      'UPI': { count: 0, amount: 0 },
      'CASH': { count: 0, amount: 0 },
      'CARD': { count: 0, amount: 0 }
    };
    
    filteredInvoices.forEach(invoice => {
      const method = invoice.paymentMethod.toUpperCase();
      if (paymentSummary[method as keyof typeof paymentSummary]) {
        paymentSummary[method as keyof typeof paymentSummary].count++;
        paymentSummary[method as keyof typeof paymentSummary].amount += invoice.total;
      }
    });
    
    // Create summary data
    const summaryData = [
      { 'Payment Method': 'UPI', 'Transaction Count': paymentSummary.UPI.count, 'Total Amount': paymentSummary.UPI.amount },
      { 'Payment Method': 'CASH', 'Transaction Count': paymentSummary.CASH.count, 'Total Amount': paymentSummary.CASH.amount },
      { 'Payment Method': 'CARD', 'Transaction Count': paymentSummary.CARD.count, 'Total Amount': paymentSummary.CARD.amount },
      { 'Payment Method': '', 'Transaction Count': '', 'Total Amount': '' },
      { 'Payment Method': 'TOTAL', 'Transaction Count': filteredInvoices.length, 'Total Amount': totalSales }
    ];
    
    // Create summary worksheet
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    
    // Set column widths for summary
    summaryWs['!cols'] = [
      { wch: 20 }, // Payment Method
      { wch: 18 }, // Transaction Count
      { wch: 18 }  // Total Amount
    ];
    
    // Style the total row
    const totalRowIndex = summaryData.length;
    const totalCellA = XLSX.utils.encode_cell({ r: totalRowIndex - 1, c: 0 });
    const totalCellB = XLSX.utils.encode_cell({ r: totalRowIndex - 1, c: 1 });
    const totalCellC = XLSX.utils.encode_cell({ r: totalRowIndex - 1, c: 2 });
    
    if (!summaryWs['!rows']) summaryWs['!rows'] = [];
    summaryWs['!rows'][totalRowIndex - 1] = { hpx: 20 };
    
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Payment Summary');
    
    // Generate filename with date range
    let filename = 'sales-report';
    if (startDate && endDate) {
      filename += `-${startDate}-to-${endDate}`;
    } else if (startDate) {
      filename += `-from-${startDate}`;
    } else if (endDate) {
      filename += `-until-${endDate}`;
    } else {
      filename += `-${new Date().toISOString().split('T')[0]}`;
    }
    filename += '.xlsx';
    
    // Save file
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <Clock className="w-6 h-6" />
          <span>Sales History</span>
        </h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filter by Date</span>
          </button>
          
          {filteredInvoices.length > 0 && (
            <button
              onClick={exportToExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={clearFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">Today's Sales</p>
          <p className="text-2xl font-bold text-green-800">{formatCurrency(todaysTotal)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">Filtered Sales</p>
          <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalSales)}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700">Items Sold</p>
          <p className="text-2xl font-bold text-purple-800">{totalItems}</p>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            {startDate || endDate ? 'No sales found for the selected date range' : 'No sales recorded yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice #</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Payment</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {invoice.customer ? (
                        <div>
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">{invoice.customer.name}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{invoice.customer.phone}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Walk-in Customer</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>{new Date(invoice.date).toLocaleDateString('en-IN')}</div>
                      <div className="text-xs text-gray-500">{new Date(invoice.date).toLocaleTimeString('en-IN')}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {invoice.items.length} item{invoice.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                      {formatCurrency(invoice.total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full uppercase">
                        {invoice.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onViewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};