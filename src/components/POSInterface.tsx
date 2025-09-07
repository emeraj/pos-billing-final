import React, { useState } from 'react';
import { Search, Receipt, Barcode, Package } from 'lucide-react';
import { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';
import { Cart } from './Cart';
import { InvoiceModal } from './InvoiceModal';

interface POSInterfaceProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onGenerateInvoice: (customer: any, paymentMethod: any) => void;
  isInterState: boolean;
  onToggleInterState: (isInterState: boolean) => void;
}

export const POSInterface: React.FC<POSInterfaceProps> = ({
  products,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onGenerateInvoice,
  isInterState,
  onToggleInterState
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.barcode && product.barcode.includes(searchTerm));
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBarcodeSearch = (value: string) => {
    setSearchTerm(value);
    
    // Auto-add product if exact barcode match is found
    const exactMatch = products.find(product => 
      product.barcode && product.barcode === value && product.stock > 0
    );
    
    if (exactMatch) {
      onAddToCart(exactMatch);
      setSearchTerm(''); // Clear search after adding
    }
  };
  const handleGenerateInvoice = (customer: any, paymentMethod: any) => {
    onGenerateInvoice(customer, paymentMethod);
    setShowInvoiceModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Search className="text-gray-400 w-4 h-4" />
                <Barcode className="text-gray-400 w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search by name or scan barcode..."
                value={searchTerm}
                onChange={(e) => handleBarcodeSearch(e.target.value)}
                className="w-full pl-16 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {searchTerm.trim() === '' ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Start typing to search products by name or scan barcode</p>
            <p className="text-sm text-gray-400 mt-2">Products will appear here as you type</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">No products found matching "{searchTerm}"</p>
                <p className="text-sm text-gray-400 mt-2">Try a different search term or check the spelling</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cart Section */}
      <div className="space-y-4">
        <Cart
          items={cartItems}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveFromCart}
          isInterState={isInterState}
          onToggleInterState={onToggleInterState}
        />
        
        {cartItems.length > 0 && (
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-semibold transition-colors duration-200"
          >
            <Receipt className="w-5 h-5" />
            <span>Generate Bill</span>
          </button>
        )}
      </div>

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        items={cartItems}
        isInterState={isInterState}
        onGenerateInvoice={handleGenerateInvoice}
      />
    </div>
  );
};
          </div>
        )}
      </div>

      {/* Cart Section */}
      <div className="space-y-4">
        <Cart
          items={cartItems}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveFromCart}
          isInterState={isInterState}
          onToggleInterState={onToggleInterState}
        />
        
        {cartItems.length > 0 && (
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-semibold transition-colors duration-200"
          >
            <Receipt className="w-5 h-5" />
            <span>Generate Bill</span>
          </button>
        )}
      </div>

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        items={cartItems}
        isInterState={isInterState}
        onGenerateInvoice={handleGenerateInvoice}
      />
    </div>
  );
};