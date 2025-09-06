import { CartItem, GSTBreakdown } from '../types';

export const calculateGST = (items: CartItem[], isInterState = false): GSTBreakdown => {
  let totalGst = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  items.forEach(item => {
    const itemTotal = item.product.price * item.quantity;
    const gstAmount = (itemTotal * item.product.gstRate) / 100;
    
    totalGst += gstAmount;
    
    if (isInterState) {
      igst += gstAmount;
    } else {
      cgst += gstAmount / 2;
      sgst += gstAmount / 2;
    }
  });

  return {
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    totalGst: Math.round(totalGst * 100) / 100
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};