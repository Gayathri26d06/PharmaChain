import React, { useState } from 'react';
import { Layers, Plus, Calendar, DollarSign, Boxes, ArrowRight, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { useNavigate } from 'react-router-dom';

export default function Batches() {
  const { batches, products, addBatch, generatePackagesForBatch } = useData();
  const toast = useToast();
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [selectedBatchForGen, setSelectedBatchForGen] = useState(null);
  const [genCount, setGenCount] = useState(10);

  // Form State
  const [formData, setFormData] = useState({
    productId: products[0]?.id || '',
    batchNumber: '',
    manufacturingDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 years default
    mrp: '45.00',
    quantity: '500',
    manufacturer: 'ABC Pharma Ltd.'
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
    if (!formData.productId) errors.productId = 'Product selection is required';
    if (!formData.batchNumber.trim()) errors.batchNumber = 'Batch number is required';
    if (!formData.manufacturingDate) errors.manufacturingDate = 'Manufacturing date is required';
    if (!formData.expiryDate) errors.expiryDate = 'Expiry date is required';

    if (formData.manufacturingDate && formData.expiryDate) {
      const mfg = new Date(formData.manufacturingDate);
      const exp = new Date(formData.expiryDate);
      if (exp <= mfg) {
        errors.expiryDate = 'Expiry date must be after manufacturing date';
      }
    }

    if (Number(formData.mrp) <= 0 || isNaN(Number(formData.mrp))) {
      errors.mrp = 'MRP must be a positive number';
    }

    if (Number(formData.quantity) <= 0 || isNaN(Number(formData.quantity))) {
      errors.quantity = 'Quantity must be a positive integer';
    }

    return errors;
  };

  const handleCreateBatch = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const matchedProduct = products.find(p => p.id === formData.productId) || products[0];

    const newBatch = addBatch({
      productId: formData.productId,
      productName: matchedProduct?.name || 'Medicine Formulation',
      batchNumber: formData.batchNumber.trim().toUpperCase(),
      manufacturingDate: formData.manufacturingDate,
      expiryDate: formData.expiryDate,
      mrp: parseFloat(formData.mrp),
      quantity: parseInt(formData.quantity, 10),
      manufacturer: formData.manufacturer
    });

    toast.success(`Batch ${newBatch.batchNumber} created successfully.`);
    setIsAddModalOpen(false);
  };

  const handleOpenGenerate = (batch) => {
    setSelectedBatchForGen(batch);
    setGenCount(10);
    setIsGenModalOpen(true);
  };

  const handleGeneratePackages = (e) => {
    e.preventDefault();
    if (!selectedBatchForGen) return;

    try {
      const created = generatePackagesForBatch(selectedBatchForGen.batchNumber, Number(genCount) || 10);
      toast.success(`Generated ${created.length} serialized packages for batch ${selectedBatchForGen.batchNumber}.`);
      setIsGenModalOpen(false);
      navigate('/packages');
    } catch (err) {
      toast.error(err.message || 'Failed to generate packages');
    }
  };

  const productOptions = products.map(p => ({
    value: p.id,
    label: `${p.name} (${p.genericName})`
  }));

  const columns = [
    {
      header: 'Batch Number',
      key: 'batchNumber',
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-medblue-700 bg-medblue-50 px-2.5 py-1 rounded-lg border border-medblue-100">
          {row.batchNumber}
        </span>
      )
    },
    {
      header: 'Product',
      key: 'productName',
      sortable: true,
      render: (row) => <span className="font-semibold text-slate-800">{row.productName}</span>
    },
    {
      header: 'Mfg Date',
      key: 'manufacturingDate',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {row.manufacturingDate}
        </span>
      )
    },
    {
      header: 'Expiry Date',
      key: 'expiryDate',
      sortable: true,
      render: (row) => {
        const isExp = new Date(row.expiryDate) < new Date() || row.status === 'EXPIRED';
        return (
          <span className={`text-xs font-medium flex items-center gap-1 ${isExp ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {row.expiryDate}
          </span>
        );
      }
    },
    {
      header: 'MRP',
      key: 'mrp',
      sortable: true,
      render: (row) => <span className="font-mono text-xs font-semibold text-slate-800">${Number(row.mrp).toFixed(2)}</span>
    },
    {
      header: 'Batch Qty',
      key: 'quantity',
      sortable: true,
      render: (row) => <span className="text-xs text-slate-600">{row.quantity.toLocaleString()} units</span>
    },
    {
      header: 'Serialized QRs',
      key: 'packageCount',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-bold text-medblue-700 bg-slate-100 px-2 py-0.5 rounded-md">
          {row.packageCount || 0} PKGs
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Boxes}
          onClick={() => handleOpenGenerate(row)}
          className="text-xs"
        >
          Generate QRs
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Production Batches</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage pharmaceutical manufacturing lots and assign batch life cycle dates.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          + Create Batch
        </Button>
      </div>

      {/* Batch Table */}
      <DataTable
        columns={columns}
        data={batches}
        searchPlaceholder="Search by batch number or product name..."
        searchKeys={['batchNumber', 'productName', 'manufacturer', 'status']}
      />

      {/* Create Batch Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Manufacturing Batch"
        subtitle="Registers lot numbers and validates expiration thresholds"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateBatch} className="space-y-4">
          <Select
            label="Select Medicine Product"
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            options={productOptions}
            error={formErrors.productId}
            required
          />

          <Input
            label="Batch Identifier Code"
            name="batchNumber"
            placeholder="e.g. PCM004 or AMX002"
            value={formData.batchNumber}
            onChange={handleInputChange}
            error={formErrors.batchNumber}
            required
            helperText="Alphanumeric identifier assigned by the manufacturing plant"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Manufacturing Date"
              name="manufacturingDate"
              type="date"
              value={formData.manufacturingDate}
              onChange={handleInputChange}
              error={formErrors.manufacturingDate}
              required
            />

            <Input
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleInputChange}
              error={formErrors.expiryDate}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Maximum Retail Price (MRP)"
              name="mrp"
              type="number"
              step="0.01"
              placeholder="45.00"
              value={formData.mrp}
              onChange={handleInputChange}
              error={formErrors.mrp}
              required
            />

            <Input
              label="Total Lot Quantity (Units)"
              name="quantity"
              type="number"
              placeholder="500"
              value={formData.quantity}
              onChange={handleInputChange}
              error={formErrors.quantity}
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Create Batch
            </Button>
          </div>
        </form>
      </Modal>

      {/* Generate Packages from Batch Modal */}
      {selectedBatchForGen && (
        <Modal
          isOpen={isGenModalOpen}
          onClose={() => setIsGenModalOpen(false)}
          title={`Generate Serialized Packages: ${selectedBatchForGen.batchNumber}`}
          subtitle={`Product: ${selectedBatchForGen.productName}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleGeneratePackages} className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Batch Number:</span>
                <span className="font-mono font-bold text-medblue-700">{selectedBatchForGen.batchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Already Serialized:</span>
                <span className="font-bold text-slate-800">{selectedBatchForGen.packageCount || 0} packages</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <StatusBadge status={selectedBatchForGen.status} size="sm" />
              </div>
            </div>

            <Input
              label="Number of Unique Packages to Generate"
              type="number"
              min="1"
              max="100"
              value={genCount}
              onChange={(e) => setGenCount(e.target.value)}
              helperText="Generates unique format: PKG-BATCH-00001 with high-density QR"
              required
            />

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setIsGenModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" icon={Boxes}>
                Generate {genCount} Packages
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
