import React, { useState } from 'react';
import { User, Mail, Building2, Phone, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import Input from '../components/Input';
import StatusBadge from '../components/StatusBadge';

export default function Profile() {
  const { currentUser, updateProfile, role } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    company: currentUser?.company || '',
    phone: currentUser?.phone || '+1 (555) 019-2834'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      toast.success('Profile details updated successfully.');
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Participant Profile & Security</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your registered organization credentials and network access parameters.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        {/* User Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-medblue-600 to-teal-500 text-white font-bold flex items-center justify-center text-xl shadow-md shadow-medblue-500/20">
            {formData.name ? formData.name.slice(0, 2).toUpperCase() : 'PC'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900">{formData.name}</h3>
              <StatusBadge status="Active" size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{role} • {formData.company}</p>
            <span className="inline-block mt-1 font-mono text-[11px] text-medblue-700 bg-medblue-50 px-2 py-0.5 rounded-md border border-medblue-200/60">
              Identity: {currentUser?.id || 'USR-001'}
            </span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Representative Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              icon={User}
              required
            />

            <Input
              label="Authorized Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              icon={Mail}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Organization / Company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              icon={Building2}
              required
            />

            <Input
              label="Contact Telephone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              icon={Phone}
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Current Access Level: {role}</span>
            <p className="text-[11px]">
              Access permissions and cryptographic signing privileges are managed by the PharmaChain Regulatory Administrator.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSaving}
              icon={Save}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
