import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CreditCard as Edit2, Check, X, Tag, Percent, Package } from 'lucide-react';
import { Category, GSTRate, Product } from '../types';

interface SettingsProps {
  userId: string;
  products: Product[];
  onLoadCategories: () => Promise<Category[]>;
  onLoadGSTRates: () => Promise<GSTRate[]>;
  onAddCategory: (category: Omit<Category, 'id'>) => Promise<string>;
  onAddGSTRate: (gstRate: Omit<GSTRate, 'id'>) => Promise<string>;
  onDeleteCategory: (id: string) => Promise<void>;
  onDeleteGSTRate: (id: string) => Promise<void>;
  onUpdateCategory: (id: string, category: Omit<Category, 'id'>) => Promise<void>;
  onUpdateGSTRate: (id: string, gstRate: Omit<GSTRate, 'id'>) => Promise<void>;
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  onUpdateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}

export const Settings: React.FC<SettingsProps> = ({
  userId,
  products,
  onLoadCategories,
  onLoadGSTRates,
  onAddCategory,
  onAddGSTRate,
  onDeleteCategory,
  onDeleteGSTRate,
  onUpdateCategory,
  onUpdateGSTRate,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [gstRates, setGSTRates] = useState<GSTRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'products' | 'categories' | 'gst'>('products');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const [newGSTRate, setNewGSTRate] = useState('');
  const [newGSTDescription, setNewGSTDescription] = useState('');
  const [addingGSTRate, setAddingGSTRate] = useState(false);

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDescription, setEditCategoryDescription] = useState('');

  const [editingGSTRate, setEditingGSTRate] = useState<string | null>(null);
  const [editGSTRateValue, setEditGSTRateValue] = useState('');
  const [editGSTRateDescription, setEditGSTRateDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, rates] = await Promise.all([
        onLoadCategories(),
        onLoadGSTRates(),
      ]);
      setCategories(cats);
      setGSTRates(rates);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setAddingCategory(true);
    try {
      await onAddCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
      await loadData();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleAddGSTRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(newGSTRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      alert('Please enter a valid GST rate between 0 and 100');
      return;
    }

    setAddingGSTRate(true);
    try {
      await onAddGSTRate({
        rate,
        description: newGSTDescription.trim() || `${rate}% GST`,
      });
      setNewGSTRate('');
      setNewGSTDescription('');
      await loadData();
    } catch (error) {
      console.error('Error adding GST rate:', error);
      alert('Failed to add GST rate');
    } finally {
      setAddingGSTRate(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await onDeleteCategory(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleDeleteGSTRate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this GST rate?')) return;

    try {
      await onDeleteGSTRate(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting GST rate:', error);
      alert('Failed to delete GST rate');
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
    setEditCategoryDescription(category.description || '');
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setEditCategoryName('');
    setEditCategoryDescription('');
  };

  const saveEditCategory = async (id: string) => {
    if (!editCategoryName.trim()) return;

    try {
      await onUpdateCategory(id, {
        name: editCategoryName.trim(),
        description: editCategoryDescription.trim() || undefined,
      });
      setEditingCategory(null);
      await loadData();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };

  const startEditGSTRate = (gstRate: GSTRate) => {
    setEditingGSTRate(gstRate.id);
    setEditGSTRateValue(gstRate.rate.toString());
    setEditGSTRateDescription(gstRate.description);
  };

  const cancelEditGSTRate = () => {
    setEditingGSTRate(null);
    setEditGSTRateValue('');
    setEditGSTRateDescription('');
  };

  const saveEditGSTRate = async (id: string) => {
    const rate = parseFloat(editGSTRateValue);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      alert('Please enter a valid GST rate between 0 and 100');
      return;
    }

    try {
      await onUpdateGSTRate(id, {
        rate,
        description: editGSTRateDescription.trim() || `${rate}% GST`,
      });
      setEditingGSTRate(null);
      await loadData();
    } catch (error) {
      console.error('Error updating GST rate:', error);
      alert('Failed to update GST rate');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Tag className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        </div>

        <form onSubmit={handleAddCategory} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={addingCategory || !newCategoryName.trim()}
            className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>{addingCategory ? 'Adding...' : 'Add Category'}</span>
          </button>
        </form>

        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No categories yet. Add your first category above.</p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {editingCategory === category.id ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Category name"
                    />
                    <input
                      type="text"
                      value={editCategoryDescription}
                      onChange={(e) => setEditCategoryDescription(e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Description"
                    />
                    <button
                      onClick={() => saveEditCategory(category.id)}
                      className="text-green-600 hover:text-green-700 p-1"
                      title="Save"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEditCategory}
                      className="text-gray-600 hover:text-gray-700 p-1"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-500">{category.description}</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditCategory(category)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Percent className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">GST Rates</h2>
        </div>

        <form onSubmit={handleAddGSTRate} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New GST Rate</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={newGSTRate}
                onChange={(e) => setNewGSTRate(e.target.value)}
                placeholder="GST rate (%)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={newGSTDescription}
                onChange={(e) => setNewGSTDescription(e.target.value)}
                placeholder="Description"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={addingGSTRate || !newGSTRate.trim() || !newGSTDescription.trim()}
            className="mt-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>{addingGSTRate ? 'Adding...' : 'Add GST Rate'}</span>
          </button>
        </form>

        <div className="space-y-2">
          {gstRates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No GST rates yet. Add your first GST rate above.</p>
          ) : (
            gstRates.map((gstRate) => (
              <div
                key={gstRate.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {editingGSTRate === gstRate.id ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={editGSTRateValue}
                      onChange={(e) => setEditGSTRateValue(e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Rate (%)"
                    />
                    <input
                      type="text"
                      value={editGSTRateDescription}
                      onChange={(e) => setEditGSTRateDescription(e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Description"
                    />
                    <button
                      onClick={() => saveEditGSTRate(gstRate.id)}
                      className="text-green-600 hover:text-green-700 p-1"
                      title="Save"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEditGSTRate}
                      className="text-gray-600 hover:text-gray-700 p-1"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{gstRate.rate}%</div>
                      <div className="text-sm text-gray-500">{gstRate.description}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditGSTRate(gstRate)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGSTRate(gstRate.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
