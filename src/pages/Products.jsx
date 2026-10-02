import React, { useState } from 'react';
import { Pill, Plus, Eye, Edit3, Trash2, CheckCircle2, Building2, Layers } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';

export default function Products() {
  const { products, addProduct } = useData();
  const toast = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    dosage: '',
    category: 'Analgesics',
    manufacturer: 'ABC Pharma Ltd.',
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.genericName.trim()) errors.genericName = 'Generic composition is required';
    if (!formData.dosage.trim()) errors.dosage = 'Dosage (e.g. 500 mg) is required';
    return errors;
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    addProduct({
      name: formData.name,
      genericName: formData.genericName,
      dosage: formData.dosage,
      category: formData.category,
      manufacturer: formData.manufacturer,
      description: formData.description
    });

    toast.success('Product created successfully.');
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      genericName: '',
      dosage: '',
      category: 'Analgesics',
      manufacturer: 'ABC Pharma Ltd.',
      description: ''
    });
  };

  const columns = [
    {
      header: 'Product ID',
      key: 'id',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-medblue-700">{row.id}</span>
    },
    {
      header: 'Product Name',
      key: 'name',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.name}</span>
          <span className="text-xs text-slate-500">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Generic Name',
      key: 'genericName',
      sortable: true,
      render: (row) => <span className="text-slate-700">{row.genericName}</span>
    },
    {
      header: 'Dosage',
      key: 'dosage',
      render: (row) => (
        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-xs font-semibold text-slate-700">
          {row.dosage}
        </span>
      )
    },
    {
      header: 'Manufacturer',
      key: 'manufacturer',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <Building2 className="h-3.5 w-3.5 text-slate-400" />
          <span>{row.manufacturer}</span>
        </div>
      )
    },
    {
      header: 'Batches',
      key: 'batchCount',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <span>{row.batchCount || 0} batches</span>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status || 'Active'} size="sm" />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedProduct(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-medblue-600 hover:bg-slate-100 transition-colors"
            title="View Product Details"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medicine Products Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered master pharmaceutical formulations in the PharmaChain network.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Product
        </Button>
      </div>

      {/* Product Table */}
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search by product name, ID, or generic composition..."
        searchKeys={['name', 'genericName', 'id', 'category', 'manufacturer']}
      />

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Medicine Product"
        subtitle="Add master pharmaceutical formulation to the registry"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <Input
            label="Product Name"
            name="name"
            placeholder="e.g. Paracetamol 500 mg"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Generic Active Ingredient"
              name="genericName"
              placeholder="e.g. Paracetamol"
              value={formData.genericName}
              onChange={handleInputChange}
              error={formErrors.genericName}
              required
            />

            <Input
              label="Dosage Strength"
              name="dosage"
              placeholder="e.g. 500 mg or 250 mg/5ml"
              value={formData.dosage}
              onChange={handleInputChange}
              error={formErrors.dosage}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Therapeutic Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={[
                { value: 'Analgesics', label: 'Analgesics & Antipyretics' },
                { value: 'Antibiotics', label: 'Antibiotics' },
                { value: 'Antihistamines', label: 'Antihistamines' },
                { value: 'NSAIDs', label: 'NSAIDs' },
                { value: 'Supplements', label: 'Vitamins & Supplements' },
                { value: 'Cardiovascular', label: 'Cardiovascular' }
              ]}
            />

            <Input
              label="Manufacturer Name"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              placeholder="e.g. ABC Pharma Ltd."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Description / Indications
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description of therapeutic application..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medblue-500 focus:border-medblue-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Create Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Product Details Modal */}
      {selectedProduct && (
        <Modal
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.name}
          subtitle={`Master Product ID: ${selectedProduct.id}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Generic Ingredient:</span>
                <span className="font-semibold text-slate-800">{selectedProduct.genericName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dosage Strength:</span>
                <span className="font-mono font-bold text-medblue-700">{selectedProduct.dosage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="text-slate-800">{selectedProduct.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Manufacturer:</span>
                <span className="text-slate-800">{selectedProduct.manufacturer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Batches Serialized:</span>
                <span className="font-bold text-slate-900">{selectedProduct.batchCount || 0} batches</span>
              </div>
            </div>

            {selectedProduct.description && (
              <div>
                <span className="font-semibold text-slate-700 block mb-1">Clinical Description:</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
