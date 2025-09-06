import React, { useState } from 'react';
import { X, Printer as Print, User, Phone, MapPin, FileText } from 'lucide-react';
import { CartItem, Customer, Invoice } from '../types';
import { formatCurrency, calculateGST } from '../utils/gst';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  isInterState: boolean;
  onGenerateInvoice: (customer: Customer | null, paymentMethod: 'cash' | 'card' | 'upi') => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  items,
  isInterState,
  onGenerateInvoice
}) => {
  const [customer, setCustomer] = useState<Customer>({
    id: '',
    name: '',
    phone: '',
    address: '',
    gstNumber: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [useCustomer, setUseCustomer] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const gstBreakdown = calculateGST(items, isInterState);
  const total = subtotal + gstBreakdown.totalGst;

  const handleGenerateInvoice = () => {
    onGenerateInvoice(useCustomer ? customer : null, paymentMethod);
    onClose();
    setCustomer({ id: '', name: '', phone: '', address: '', gstNumber: '' });
    setUseCustomer(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Generate Invoice</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="useCustomer"
              checked={useCustomer}
              onChange={(e) => setUseCustomer(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="useCustomer" className="text-sm font-medium text-gray-700">
              Add customer details
            </label>
          </div>

          {useCustomer && (
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  required={useCustomer}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  required={useCustomer}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address
                </label>
                <textarea
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  value={customer.gstNumber}
                  onChange={(e) => setCustomer({ ...customer, gstNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['cash', 'card', 'upi'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method as 'cash' | 'card' | 'upi')}
                  className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                    paymentMethod === method
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {method.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Bill Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {!isInterState ? (
                <>
                  <div className="flex justify-between text-blue-600">
                    <span>CGST:</span>
                    <span>{formatCurrency(gstBreakdown.cgst)}</span>
                  </div>
                  <div className="flex justify-between text-blue-600">
                    <span>SGST:</span>
                    <span>{formatCurrency(gstBreakdown.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-blue-600">
                  <span>IGST:</span>
                  <span>{formatCurrency(gstBreakdown.igst)}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleGenerateInvoice}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
            >
              <Print className="w-4 h-4" />
              <span>Generate Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};