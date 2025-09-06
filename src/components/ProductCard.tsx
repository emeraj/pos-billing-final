import React from 'react';
import { Package, Plus, Barcode } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/gst';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {product.category}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="font-semibold text-green-600">{formatCurrency(product.price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Stock:</span>
          <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-800'}`}>
            {product.stock} units
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">GST:</span>
          <span className="text-gray-800">{product.gstRate}%</span>
        </div>
        {product.barcode && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <Barcode className="w-3 h-3 mr-1" />
              Barcode:
            </span>
            <span className="text-gray-800 font-mono text-xs">{product.barcode}</span>
          </div>
        )}
      </div>
      
      <button
        onClick={() => onAddToCart(product)}
        disabled={product.stock === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
      </button>
    </div>
  );
};