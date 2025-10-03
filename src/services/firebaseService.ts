import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, Invoice, Customer, BusinessProfile, Category, GSTRate } from '../types';
import { auth } from '../config/firebase';

// Helper function to get current user's UID
const getCurrentUserUID = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.uid;
};

// Helper function to get user-specific collection path
const getUserCollection = (collectionName: string) => {
  const uid = getCurrentUserUID();
  return `users/${uid}/${collectionName}`;
};

// Products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, getUserCollection('products')));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching products:', error);
    return getDefaultProducts();
  }
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, getUserCollection('products')), product);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Omit<Product, 'id'>): Promise<void> => {
  try {
    await updateDoc(doc(db, getUserCollection('products'), id), product);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, getUserCollection('products'), id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const q = query(collection(db, getUserCollection('invoices')), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate().toISOString() : data.date
      } as Invoice;
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};

export const addInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<string> => {
  try {
    const invoiceData = {
      ...invoice,
      date: Timestamp.fromDate(new Date(invoice.date))
    };
    const docRef = await addDoc(collection(db, getUserCollection('invoices')), invoiceData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding invoice:', error);
    throw error;
  }
};

// Customers
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, getUserCollection('customers')));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Customer));
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const addCustomer = async (customer: Omit<Customer, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, getUserCollection('customers')), customer);
    return docRef.id;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

// Business Profile
export const getBusinessProfile = async (): Promise<BusinessProfile> => {
  try {
    const docRef = doc(db, getUserCollection('settings'), 'businessProfile');
    const docSnap = await getDocs(collection(db, getUserCollection('settings')));
    const profileDoc = docSnap.docs.find(d => d.id === 'businessProfile');
    
    if (profileDoc && profileDoc.exists()) {
      return profileDoc.data() as BusinessProfile;
    } else {
      return getDefaultBusinessProfile();
    }
  } catch (error) {
    console.error('Error fetching business profile:', error);
    return getDefaultBusinessProfile();
  }
};

export const saveBusinessProfile = async (profile: BusinessProfile): Promise<void> => {
  try {
    await setDoc(doc(db, getUserCollection('settings'), 'businessProfile'), profile);
  } catch (error) {
    console.error('Error saving business profile:', error);
    throw error;
  }
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, getUserCollection('categories')));
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Category));
    
    // Return default categories if none exist
    if (categories.length === 0) {
      return getDefaultCategories();
    }
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return getDefaultCategories();
  }
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, getUserCollection('categories')), category);
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, category: Omit<Category, 'id'>): Promise<void> => {
  try {
    await updateDoc(doc(db, getUserCollection('categories'), id), category);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, getUserCollection('categories'), id));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// GST Rates
export const getGSTRates = async (): Promise<GSTRate[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, getUserCollection('gstRates')));
    const gstRates = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GSTRate));
    
    // Return default GST rates if none exist
    if (gstRates.length === 0) {
      return getDefaultGSTRates();
    }
    return gstRates;
  } catch (error) {
    console.error('Error fetching GST rates:', error);
    return getDefaultGSTRates();
  }
};

export const addGSTRate = async (gstRate: Omit<GSTRate, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, getUserCollection('gstRates')), gstRate);
    return docRef.id;
  } catch (error) {
    console.error('Error adding GST rate:', error);
    throw error;
  }
};

export const updateGSTRate = async (id: string, gstRate: Omit<GSTRate, 'id'>): Promise<void> => {
  try {
    await updateDoc(doc(db, getUserCollection('gstRates'), id), gstRate);
  } catch (error) {
    console.error('Error updating GST rate:', error);
    throw error;
  }
};

export const deleteGSTRate = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, getUserCollection('gstRates'), id));
  } catch (error) {
    console.error('Error deleting GST rate:', error);
    throw error;
  }
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

// Real-time listeners
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }
  
  return onSnapshot(collection(db, getUserCollection('products')), (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
    callback(products);
  });
};

export const subscribeToInvoices = (callback: (invoices: Invoice[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }
  
  const q = query(collection(db, getUserCollection('invoices')), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const invoices = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate().toISOString() : data.date
      } as Invoice;
    });
    callback(invoices);
  });
};