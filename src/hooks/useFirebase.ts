import { useState, useEffect } from 'react';
import { Product, Invoice, Customer, BusinessProfile, Category, GSTRate } from '../types';
import * as supabaseService from '../services/supabaseService';
import { User } from '@supabase/supabase-js';

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
        const data = await supabaseService.getProducts();
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
    const unsubscribe = supabaseService.subscribeToProducts(setProducts);
    return () => unsubscribe();
  }, [user]);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      await supabaseService.addProduct(productData);
    } catch (err) {
      setError('Failed to add product');
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Omit<Product, 'id'>) => {
    try {
      await supabaseService.updateProduct(id, productData);
    } catch (err) {
      setError('Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await supabaseService.deleteProduct(id);
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
        const data = await supabaseService.getInvoices();
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
    const unsubscribe = supabaseService.subscribeToInvoices(setInvoices);
    return () => unsubscribe();
  }, [user]);

  const addInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
    try {
      return await supabaseService.addInvoice(invoiceData);
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
        const data = await supabaseService.getBusinessProfile();
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
      await supabaseService.saveBusinessProfile(profileData);
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

export const useFirebaseCategories = (user: User | null) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await supabaseService.getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [user]);

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const id = await supabaseService.addCategory(categoryData);
      setCategories(prev => [...prev, { ...categoryData, id }]);
      return id;
    } catch (err) {
      setError('Failed to add category');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await supabaseService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      setError('Failed to delete category');
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    deleteCategory
  };
};

export const useFirebaseGSTRates = (user: User | null) => {
  const [gstRates, setGSTRates] = useState<GSTRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setGSTRates([]);
      setLoading(false);
      return;
    }

    const loadGSTRates = async () => {
      try {
        setLoading(true);
        const data = await supabaseService.getGSTRates();
        setGSTRates(data);
      } catch (err) {
        setError('Failed to load GST rates');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGSTRates();
  }, [user]);

  const addGSTRate = async (gstRateData: Omit<GSTRate, 'id'>) => {
    try {
      const id = await supabaseService.addGSTRate(gstRateData);
      setGSTRates(prev => [...prev, { ...gstRateData, id }]);
      return id;
    } catch (err) {
      setError('Failed to add GST rate');
      throw err;
    }
  };

  const deleteGSTRate = async (id: string) => {
    try {
      await supabaseService.deleteGSTRate(id);
      setGSTRates(prev => prev.filter(rate => rate.id !== id));
    } catch (err) {
      setError('Failed to delete GST rate');
      throw err;
    }
  };

  return {
    gstRates,
    loading,
    error,
    addGSTRate,
    deleteGSTRate
  };
};