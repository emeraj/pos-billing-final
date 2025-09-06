import { Product, Invoice, Customer, BusinessProfile } from '../types';

const PRODUCTS_KEY = 'pos_products';
const INVOICES_KEY = 'pos_invoices';
const CUSTOMERS_KEY = 'pos_customers';
const BUSINESS_PROFILE_KEY = 'pos_business_profile';

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  return stored ? JSON.parse(stored) : getDefaultProducts();
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getInvoices = (): Invoice[] => {
  const stored = localStorage.getItem(INVOICES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveInvoices = (invoices: Invoice[]): void => {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
};

export const getCustomers = (): Customer[] => {
  const stored = localStorage.getItem(CUSTOMERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCustomers = (customers: Customer[]): void => {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
};

export const getBusinessProfile = (): BusinessProfile => {
  const stored = localStorage.getItem(BUSINESS_PROFILE_KEY);
  return stored ? JSON.parse(stored) : getDefaultBusinessProfile();
};

export const saveBusinessProfile = (profile: BusinessProfile): void => {
  localStorage.setItem(BUSINESS_PROFILE_KEY, JSON.stringify(profile));
};

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