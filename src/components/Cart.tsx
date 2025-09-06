import React from 'react';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';
import { formatCurrency, calculateGST } from '../utils/gst';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  isInterState: boolean;
  onToggleInterState: (isInterState: boolean) => void;
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  isInterState,
  onToggleInterState
}) => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const gstBreakdown = calculateGST(items, isInterState);
  const total = subtotal + gstBreakdown.totalGst;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Cart ({items.length})</span>
          </h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Inter-state:</span>
            <button
              onClick={() => onToggleInterState(!isInterState)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isInterState ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isInterState ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product.id} className="p-4 border-b border-gray-100 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-800 text-sm">{item.product.name}</h3>
              <button
                onClick={() => onRemoveItem(item.product.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {formatCurrency(item.product.price)} × {item.quantity}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="text-right mt-1">
              <span className="font-semibold text-green-600">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-b-lg">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
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
          
          <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-green-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};