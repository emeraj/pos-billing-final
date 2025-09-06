import { useState, useEffect } from 'react';
import { Product, Invoice, Customer, BusinessProfile } from '../types';
import * as firebaseService from '../services/firebaseService';
import { User } from 'firebase/auth';

export const useFirebaseProducts = (user: User | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await firebaseService.getProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    // Set up real-time listener
    const unsubscribe = firebaseService.subscribeToProducts(setProducts);
    return () => unsubscribe();
  }, [user]);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      await firebaseService.addProduct(productData);
    } catch (err) {
      setError('Failed to add product');
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Omit<Product, 'id'>) => {
    try {
      await firebaseService.updateProduct(id, productData);
    } catch (err) {
      setError('Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await firebaseService.deleteProduct(id);
    } catch (err) {
      setError('Failed to delete product');
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

export const useFirebaseInvoices = (user: User | null) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    const loadInvoices = async () => {
      try {
        setLoading(true);
        const data = await firebaseService.getInvoices();
        setInvoices(data);
      } catch (err) {
        setError('Failed to load invoices');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();

    // Set up real-time listener
    const unsubscribe = firebaseService.subscribeToInvoices(setInvoices);
    return () => unsubscribe();
  }, [user]);

  const addInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
    try {
      return await firebaseService.addInvoice(invoiceData);
    } catch (err) {
      setError('Failed to save invoice');
      throw err;
    }
  };

  return {
    invoices,
    loading,
    error,
    addInvoice
  };
};

export const useFirebaseBusinessProfile = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await firebaseService.getBusinessProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to load business profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateProfile = async (profileData: BusinessProfile) => {
    try {
      await firebaseService.saveBusinessProfile(profileData);
      setProfile(profileData);
    } catch (err) {
      setError('Failed to save business profile');
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile
  };
};