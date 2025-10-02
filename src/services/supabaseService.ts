import { supabase } from '../config/supabase';
import { Product, Invoice, BusinessProfile, Category, GSTRate } from '../types';

// Helper function to get current user's ID
const getCurrentUserId = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('User not authenticated');
  }
  return user.id;
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;

    // Return default categories if none exist
    if (!data || data.length === 0) {
      return getDefaultCategories();
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return getDefaultCategories();
  }
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name: category.name,
        description: category.description
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// GST Rates
export const getGSTRates = async (): Promise<GSTRate[]> => {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('gst_rates')
      .select('*')
      .eq('user_id', userId)
      .order('rate');

    if (error) throw error;

    // Return default GST rates if none exist
    if (!data || data.length === 0) {
      return getDefaultGSTRates();
    }

    return data.map(item => ({
      id: item.id,
      rate: parseFloat(item.rate),
      description: item.description
    }));
  } catch (error) {
    console.error('Error fetching GST rates:', error);
    return getDefaultGSTRates();
  }
};

export const addGSTRate = async (gstRate: Omit<GSTRate, 'id'>): Promise<string> => {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('gst_rates')
      .insert({
        user_id: userId,
        rate: gstRate.rate,
        description: gstRate.description
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding GST rate:', error);
    throw error;
  }
};

export const deleteGSTRate = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('gst_rates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting GST rate:', error);
    throw error;
  }
};

// Products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;

    if (!data || data.length === 0) {
      return getDefaultProducts();
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      barcode: item.barcode,
      price: parseFloat(item.price),
      category: item.category,
      stock: item.stock,
      gstRate: parseFloat(item.gst_rate),
      hsnCode: item.hsn_code
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return getDefaultProducts();
  }
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('products')
      .insert({
        user_id: userId,
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        category: product.category,
        stock: product.stock,
        gst_rate: product.gstRate,
        hsn_code: product.hsnCode
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Omit<Product, 'id'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        category: product.category,
        stock: product.stock,
        gst_rate: product.gstRate,
        hsn_code: product.hsnCode,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      invoiceNumber: item.invoice_number,
      customer: item.customer,
      items: item.items,
      subtotal: parseFloat(item.subtotal),
      cgst: parseFloat(item.cgst),
      sgst: parseFloat(item.sgst),
      igst: parseFloat(item.igst),
      total: parseFloat(item.total),
      date: item.date,
      paymentMethod: item.payment_method
    }));
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};

export const addInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<string> => {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        invoice_number: invoice.invoiceNumber,
        customer: invoice.customer,
        items: invoice.items,
        subtotal: invoice.subtotal,
        cgst: invoice.cgst,
        sgst: invoice.sgst,
        igst: invoice.igst,
        total: invoice.total,
        payment_method: invoice.paymentMethod,
        date: invoice.date
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding invoice:', error);
    throw error;
  }
};

// Business Profile
export const getBusinessProfile = async (): Promise<BusinessProfile> => {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return getDefaultBusinessProfile();
    }

    return {
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      phone: data.phone,
      email: data.email,
      gstNumber: data.gst_number,
      logo: data.logo
    };
  } catch (error) {
    console.error('Error fetching business profile:', error);
    return getDefaultBusinessProfile();
  }
};

export const saveBusinessProfile = async (profile: BusinessProfile): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    const { error } = await supabase
      .from('business_profiles')
      .upsert({
        user_id: userId,
        name: profile.name,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        phone: profile.phone,
        email: profile.email,
        gst_number: profile.gstNumber,
        logo: profile.logo,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving business profile:', error);
    throw error;
  }
};

// Real-time subscriptions
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const channel = supabase
    .channel('products_changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      async () => {
        const products = await getProducts();
        callback(products);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToInvoices = (callback: (invoices: Invoice[]) => void) => {
  const channel = supabase
    .channel('invoices_changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'invoices' },
      async () => {
        const invoices = await getInvoices();
        callback(invoices);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Default data functions
const getDefaultBusinessProfile = (): BusinessProfile => ({
  name: 'Your Business Name',
  address: 'Shop Address Line 1',
  city: 'City Name',
  state: 'State Name',
  pincode: '123456',
  phone: '+91 98765 43210',
  email: 'business@example.com',
  gstNumber: '22AAAAA0000A1Z5'
});

const getDefaultProducts = (): Product[] => [
  {
    id: '1',
    name: 'Rice (1kg)',
    barcode: '8901030875021',
    price: 80,
    category: 'Grocery',
    stock: 50,
    gstRate: 5,
    hsnCode: '1006'
  },
  {
    id: '2',
    name: 'Dal Tadka (1kg)',
    barcode: '8901030875038',
    price: 120,
    category: 'Grocery',
    stock: 30,
    gstRate: 5,
    hsnCode: '0713'
  },
  {
    id: '3',
    name: 'Cooking Oil (1L)',
    barcode: '8901030875045',
    price: 200,
    category: 'Grocery',
    stock: 25,
    gstRate: 5,
    hsnCode: '1507'
  },
  {
    id: '4',
    name: 'Smartphone',
    barcode: '8901030875052',
    price: 15000,
    category: 'Electronics',
    stock: 10,
    gstRate: 18,
    hsnCode: '8517'
  },
  {
    id: '5',
    name: 'T-Shirt',
    barcode: '8901030875069',
    price: 500,
    category: 'Clothing',
    stock: 20,
    gstRate: 12,
    hsnCode: '6109'
  }
];

const getDefaultCategories = (): Category[] => [
  { id: '1', name: 'Grocery', description: 'Food and daily essentials' },
  { id: '2', name: 'Electronics', description: 'Electronic items and gadgets' },
  { id: '3', name: 'Clothing', description: 'Apparel and accessories' },
  { id: '4', name: 'Home & Garden', description: 'Home improvement and garden items' },
  { id: '5', name: 'Health & Beauty', description: 'Personal care and health products' }
];

const getDefaultGSTRates = (): GSTRate[] => [
  { id: '1', rate: 0, description: 'Exempt - Essential items' },
  { id: '2', rate: 5, description: 'Low Rate - Basic necessities' },
  { id: '3', rate: 12, description: 'Standard Rate - Processed foods' },
  { id: '4', rate: 18, description: 'Standard Rate - Most goods' },
  { id: '5', rate: 28, description: 'High Rate - Luxury items' }
];
