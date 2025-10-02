import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Category } from '../types';

interface CategorySelectorProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => Promise<string>;
  required?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  value,
  onChange,
  onAddCategory,
  required = false
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setAdding(true);
    try {
      const id = await onAddCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined
      });
      
      // Select the newly added category
      onChange(newCategoryName.trim());
      
      // Reset form
      setNewCategoryName('');
      setNewCategoryDescription('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleCancel = () => {
    setNewCategoryName('');
    setNewCategoryDescription('');
    setShowAddForm(false);
  };

  const categoryExists = categories.some(cat => cat.name.toLowerCase() === value.toLowerCase());
  const showAddButton = !showAddForm && (!value.trim() || !categoryExists);

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          list="categories"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type or select category"
        />
        
        {showAddButton && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors duration-200"
            title="Add category"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Category</span>
          </button>
        )}
      </div>

      <datalist id="categories">
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.description}
          </option>
        ))}
      </datalist>

      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <form onSubmit={handleAddCategory} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category name"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional description"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={adding || !newCategoryName.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>{adding ? 'Adding...' : 'Add Category'}</span>
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