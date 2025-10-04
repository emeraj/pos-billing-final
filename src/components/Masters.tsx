import React, { useState } from 'react';
import { Package, Tag, Percent } from 'lucide-react';
import { Category, GSTRate, Product } from '../types';
import { ProductManagement } from './ProductManagement';

interface MastersProps {
  userId: string;
  products: Product[];
  categories: Category[];
  gstRates: GSTRate[];
  onLoadCategories: () => Promise<Category[]>;
  onLoadGSTRates: () => Promise<GSTRate[]>;
  onAddCategory: (category: Omit<Category, 'id'>) => Promise<string>;
  onAddGSTRate: (gstRate: Omit<GSTRate, 'id'>) => Promise<string>;
  onDeleteCategory: (id: string) => Promise<void>;
  onDeleteGSTRate: (id: string) => Promise<void>;
  onUpdateCategory: (id: string, category: Omit<Category, 'id'>) => Promise<void>;
  onUpdateGSTRate: (id: string, gstRate: Omit<GSTRate, 'id'>) => Promise<void>;
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  onUpdateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}

export const Masters: React.FC<MastersProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'gst'>('products');

  const tabs = [
    { id: 'products' as const, name: 'Products', icon: Package },
    { id: 'categories' as const, name: 'Categories', icon: Tag },
    { id: 'gst' as const, name: 'GST Rates', icon: Percent },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'products' && (
          <ProductManagement
            products={products}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-500 text-center py-8">Categories management coming soon...</p>
          </div>
        )}

        {activeTab === 'gst' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-500 text-center py-8">GST Rates management coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};
