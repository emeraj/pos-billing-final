import React from 'react';
import { Printer as Print, X } from 'lucide-react';
import { Invoice as InvoiceType } from '../types';
import { formatCurrency } from '../utils/gst';
import { getBusinessProfile } from '../services/firebaseService';

interface InvoiceProps {
  invoice: InvoiceType;
  onClose: () => void;
}

export const Invoice: React.FC<InvoiceProps> = ({ invoice, onClose }) => {
  const [businessProfile, setBusinessProfile] = React.useState(null);

  React.useEffect(() => {
    const loadBusinessProfile = async () => {
      try {
        const profile = await getBusinessProfile();
        setBusinessProfile(profile);
      } catch (error) {
        console.error('Error loading business profile:', error);
        // Fallback to default profile
        setBusinessProfile({
          name: 'Your Business Name',
          address: 'Shop Address Line 1',
          city: 'City Name',
          state: 'State Name',
          pincode: '123456',
          phone: '+91 98765 43210',
          email: 'business@example.com',
          gstNumber: '22AAAAA0000A1Z5'
        });
      }
    };

    loadBusinessProfile();
  }, []);

  if (!businessProfile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${invoice.invoiceNumber}</title>
          <style>
            @media print {
              @page {
                size: 80mm auto;
                margin: 2mm;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                line-height: 1.3;
                width: 76mm;
                color: #000;
              }
              .no-print { display: none !important; }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 11px;
              line-height: 1.3;
              width: 76mm;
              margin: 0;
              padding: 4mm;
              background: white;
              color: #000;
            }
            .center { text-align: center; }
            .left { text-align: left; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .large { font-size: 13px; }
            .small { font-size: 9px; }
            .line { 
              border-top: 1px dashed #000; 
              margin: 3px 0; 
              width: 100%;
            }
            .double-line { 
              border-top: 2px solid #000; 
              margin: 3px 0; 
              width: 100%;
            }
            .item-row { 
              margin: 1px 0; 
              display: flex;
              justify-content: space-between;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              margin-bottom: 2px;
            }
            .total-row { 
              margin: 1px 0;
              display: flex;
              justify-content: space-between;
            }
            .no-break { page-break-inside: avoid; }
            .flex-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .item-name {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 35mm;
            }
            .item-details {
              text-align: right;
              white-space: nowrap;
            }
            .gst-info {
              font-size: 8px;
              color: #666;
              margin-top: 1px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Invoice Generated</h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Print className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div id="receipt-content" className="font-mono text-sm">
            {/* Receipt Header */}
            <div className="center bold large">
              <div>{businessProfile.name.toUpperCase()}</div>
            </div>
            <div className="center">
              <div>{businessProfile.address}</div>
              <div>{businessProfile.city}, {businessProfile.state} - {businessProfile.pincode}</div>
              <div>Phone: {businessProfile.phone}</div>
              {businessProfile.email && <div>Email: {businessProfile.email}</div>}
              <div>GSTIN: {businessProfile.gstNumber}</div>
            </div>
            
            <div className="double-line"></div>
            
            <div className="center bold">
              <div>TAX INVOICE</div>
            </div>
            
            <div className="line"></div>
            
            <div className="flex-row">
              <span>Bill No:</span>
              <span className="bold">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex-row">
              <span>Date:</span>
              <span>{new Date(invoice.date).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex-row">
              <span>Time:</span>
              <span>{new Date(invoice.date).toLocaleTimeString('en-IN', { hour12: true })}</span>
            </div>

            {invoice.customer && (
              <>
                <div className="line"></div>
                <div className="bold">CUSTOMER DETAILS:</div>
                <div>{invoice.customer.name}</div>
                <div>Phone: {invoice.customer.phone}</div>
                {invoice.customer.address && <div>{invoice.customer.address}</div>}
                {invoice.customer.gstNumber && <div>GSTIN: {invoice.customer.gstNumber}</div>}
              </>
            )}

            <div className="double-line"></div>

            {/* Items Header */}
            <div className="item-header small">
              <span style={{ width: '35mm' }}>ITEM</span>
              <span style={{ width: '8mm' }}>QTY</span>
              <span style={{ width: '12mm' }}>MRP</span>
              <span style={{ width: '12mm' }}>RATE</span>
              <span style={{ width: '15mm' }}>AMOUNT</span>
            </div>
            <div className="line"></div>

            {/* Items */}
            {invoice.items.map((item, index) => {
              const itemTotal = item.product.price * item.quantity;
              const itemName = item.product.name.length > 18 
                ? item.product.name.substring(0, 15) + '...' 
                : item.product.name;
              
              return (
                <div key={index} className="no-break" style={{ marginBottom: '3px' }}>
                  <div className="item-row">
                    <span className="item-name">{itemName}</span>
                    <span style={{ width: '8mm', textAlign: 'center' }}>{item.quantity}</span>
                    <span style={{ width: '12mm', textAlign: 'right' }}>{item.product.price.toFixed(2)}</span>
                    <span style={{ width: '12mm', textAlign: 'right' }}>{item.product.price.toFixed(2)}</span>
                    <span style={{ width: '15mm', textAlign: 'right' }}>{itemTotal.toFixed(2)}</span>
                  </div>
                  <div className="gst-info">
                    GST {item.product.gstRate}% | HSN: {item.product.hsnCode || 'N/A'}
                  </div>
                </div>
              );
            })}

            <div className="line"></div>

            {/* Totals */}
            <div className="total-row">
              <span>Items:</span>
              <span className="bold">{invoice.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            
            <div className="line"></div>
            
            <div className="total-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal).replace('₹', '').trim()}</span>
            </div>
            
            {invoice.igst === 0 ? (
              <>
                <div className="total-row">
                  <span>CGST:</span>
                  <span>{formatCurrency(invoice.cgst).replace('₹', '').trim()}</span>
                </div>
                <div className="total-row">
                  <span>SGST:</span>
                  <span>{formatCurrency(invoice.sgst).replace('₹', '').trim()}</span>
                </div>
              </>
            ) : (
              <div className="total-row">
                <span>IGST:</span>
                <span>{formatCurrency(invoice.igst).replace('₹', '').trim()}</span>
              </div>
            )}
            
            <div className="double-line"></div>
            <div className="total-row bold large">
              <span>TOTAL:</span>
              <span>₹{invoice.total.toFixed(2)}</span>
            </div>
            <div className="double-line"></div>

            <div className="center">
              <div className="bold">Payment Method: {invoice.paymentMethod.toUpperCase()}</div>
            </div>

            <div className="line"></div>

            <div className="center">
              <div className="bold">THANK YOU FOR SHOPPING!</div>
              <div>Please visit again</div>
            </div>

            <div className="line"></div>
            
            <div className="center small">
              <div>This is a computer generated receipt</div>
              <div>For any queries, contact: {businessProfile.phone}</div>
            </div>
          </div>

          {/* Preview for screen */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Receipt Preview</h3>
            <p className="text-sm text-gray-600 mb-3">
              This receipt is optimized for 3-inch (80mm) thermal printers with improved formatting and layout.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>✓ Professional header with business details</p>
              <p>✓ Clear item listing with QTY, MRP, RATE, AMOUNT columns</p>
              <p>✓ Proper GST breakdown and totals</p>
              <p>✓ Customer details when provided</p>
              <p>✓ Payment method and thank you message</p>
              <p>✓ Thermal printer compatible 80mm width</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};