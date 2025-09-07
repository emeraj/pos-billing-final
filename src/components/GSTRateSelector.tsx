import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { GSTRate } from '../types';

interface GSTRateSelectorProps {
  gstRates: GSTRate[];
  value: string;
  onChange: (value: string) => void;
  onAddGSTRate: (gstRate: Omit<GSTRate, 'id'>) => Promise<string>;
  required?: boolean;
}

export const GSTRateSelector: React.FC<GSTRateSelectorProps> = ({
  gstRates,
  value,
  onChange,
  onAddGSTRate,
  required = false
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRate, setNewRate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddGSTRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      alert('Please enter a valid GST rate between 0 and 100');
      return;
    }

    setAdding(true);
    try {
      await onAddGSTRate({
        rate,
        description: newDescription.trim() || `${rate}% GST`
      });
      
      // Select the newly added rate
      onChange(newRate);
      
      // Reset form
      setNewRate('');
      setNewDescription('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding GST rate:', error);
      alert('Failed to add GST rate. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleCancel = () => {
    setNewRate('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const rateExists = gstRates.some(rate => rate.rate.toString() === value);
  const showAddButton = value.trim() && !rateExists && !showAddForm && !isNaN(parseFloat(value));

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select GST Rate</option>
          {gstRates.map((rate) => (
            <option key={rate.id} value={rate.rate.toString()}>
              {rate.rate}% - {rate.description}
            </option>
          ))}
        </select>
        
        {showAddButton && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors duration-200"
            title="Add new GST rate"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <form onSubmit={handleAddGSTRate} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Rate (%) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter GST rate (e.g., 18)"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Standard Rate - Most goods"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={adding || !newRate.trim() || !newDescription.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>{adding ? 'Adding...' : 'Add Rate'}</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={adding}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};