export interface Product {
  id: string;
  name: string;
  barcode?: string;
  price: number;
  category: string;
  stock: number;
  gstRate: number;
  hsnCode?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  gstNumber?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: Customer | null;
  items: CartItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  date: string;
  paymentMethod: 'cash' | 'card' | 'upi';
}

export interface GSTBreakdown {
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
}

export interface BusinessProfile {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
  gstNumber: string;
  logo?: string;
}