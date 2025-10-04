import React, { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { Navigation } from './components/Navigation';
import { POSInterface } from './components/POSInterface';
import { Masters } from './components/Masters';
import { SalesHistory } from './components/SalesHistory';
import { BusinessProfile } from './components/BusinessProfile';
import { Invoice } from './components/Invoice';
import { Product, CartItem, Invoice as InvoiceType, Customer } from './types';
import { useFirebaseProducts, useFirebaseInvoices } from './hooks/useFirebase';
import { calculateGST } from './utils/gst';
import * as firebaseService from './services/firebaseService';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, userProfile, loading: authLoading, authLoading: authActionLoading, error: authError, signUp, signIn, signOut, clearError } = useAuth();
  const [activeTab, setActiveTab] = useState('pos');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInterState, setIsInterState] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  // Use Firebase hooks
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useFirebaseProducts(user);
  const { invoices, loading: invoicesLoading, addInvoice } = useFirebaseInvoices(user);

  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      alert('Product is out of stock!');
      return;
    }

    const existingItem = cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('Cannot add more items. Insufficient stock!');
        return;
      }
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      alert('Cannot add more items. Insufficient stock!');
      return;
    }

    setCartItems(cartItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const generateInvoice = async (customer: Customer | null, paymentMethod: 'cash' | 'card' | 'upi') => {
    try {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const gstBreakdown = calculateGST(cartItems, isInterState);
      
      const invoice: Omit<InvoiceType, 'id'> = {
        invoiceNumber: `INV-${Date.now()}`,
        customer,
        items: cartItems,
        subtotal,
        cgst: gstBreakdown.cgst,
        sgst: gstBreakdown.sgst,
        igst: gstBreakdown.igst,
        total: subtotal + gstBreakdown.totalGst,
        date: new Date().toISOString(),
        paymentMethod
      };

      // Save invoice to Firebase
      const invoiceId = await addInvoice(invoice);

      // Update product stock in Firebase
      for (const item of cartItems) {
        const newStock = item.product.stock - item.quantity;
        await updateProduct(item.product.id, {
          ...item.product,
          stock: newStock
        });
      }

      // Clear cart and show invoice
      setCartItems([]);
      setSelectedInvoice({ ...invoice, id: invoiceId });
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAuth = async (email: string, password: string, displayName?: string) => {
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName!);
      }
    } catch (error) {
      // Error is handled by useAuth hook
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setCartItems([]);
    setSelectedInvoice(null);
    setActiveTab('pos');
  };

  // Show loading screen while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if user is not logged in
  if (!user) {
    return (
      <AuthForm
        isLogin={isLogin}
        onSubmit={handleAuth}
        onToggleMode={() => {
          setIsLogin(!isLogin);
          clearError();
        }}
        loading={authActionLoading}
        error={authError}
      />
    );
  }

  if (productsLoading || invoicesLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading POS System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartItemCount={cartItemCount}
        user={user}
        onSignOut={handleSignOut}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'pos' && (
          <POSInterface
            products={products}
            cartItems={cartItems}
            onAddToCart={addToCart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onGenerateInvoice={generateInvoice}
            isInterState={isInterState}
            onToggleInterState={setIsInterState}
          />
        )}
        
        {activeTab === 'masters' && user && (
          <Masters
            userId={user.uid}
            products={products}
            categories={[]}
            gstRates={[]}
            onLoadCategories={firebaseService.getCategories}
            onLoadGSTRates={firebaseService.getGSTRates}
            onAddCategory={firebaseService.addCategory}
            onAddGSTRate={firebaseService.addGSTRate}
            onDeleteCategory={firebaseService.deleteCategory}
            onDeleteGSTRate={firebaseService.deleteGSTRate}
            onUpdateCategory={firebaseService.updateCategory}
            onUpdateGSTRate={firebaseService.updateGSTRate}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
        )}

        {activeTab === 'history' && (
          <SalesHistory
            invoices={invoices}
            onViewInvoice={setSelectedInvoice}
          />
        )}

        {activeTab === 'profile' && (
          <BusinessProfile />
        )}
      </main>

      {selectedInvoice && (
        <Invoice
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}

export default App;