import React, { useState } from 'react';
import { Users as UsersIcon, Shield, Check, Ban, Eye, Building2, Mail, Phone, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/Toast';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

export default function Users() {
  const { users, updateUserStatus } = useData();
  const toast = useToast();

  const [selectedUser, setSelectedUser] = useState(null);

  const handleApprove = (user) => {
    updateUserStatus(user.id, 'Active');
    toast.success(`User ${user.name} approved and activated.`);
    if (selectedUser?.id === user.id) setSelectedUser(null);
  };

  const handleSuspend = (user) => {
    updateUserStatus(user.id, 'Suspended');
    toast.error(`User ${user.name} suspended.`);
    if (selectedUser?.id === user.id) setSelectedUser(null);
  };

  const columns = [
    {
      header: 'Participant Name',
      key: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-medblue-100 text-medblue-700 font-bold flex items-center justify-center text-xs">
            {row.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-slate-800 text-xs block">{row.name}</span>
            <span className="text-[11px] text-slate-500 font-mono">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      key: 'role',
      sortable: true,
      render: (row) => (
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
          {row.role}
        </span>
      )
    },
    {
      header: 'Organization / Company',
      key: 'company',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <Building2 className="h-3.5 w-3.5 text-slate-400" />
          <span>{row.company}</span>
        </div>
      )
    },
    {
      header: 'Account Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />
    },
    {
      header: 'Joined Date',
      key: 'joinedDate',
      sortable: true,
      render: (row) => <span className="text-xs text-slate-500">{row.joinedDate || '2026-01-01'}</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedUser(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-medblue-600 hover:bg-slate-100 transition-colors"
            title="View User Dossier"
          >
            <Eye className="h-4 w-4" />
          </button>

          {row.status !== 'Active' && (
            <button
              onClick={() => handleApprove(row)}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Approve & Activate"
            >
              <Check className="h-4 w-4" />
            </button>
          )}

          {row.status === 'Active' && row.role !== 'Admin' && (
            <button
              onClick={() => handleSuspend(row)}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
              title="Suspend Access"
            >
              <Ban className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Network Stakeholder Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage authenticated manufacturers, distributors, pharmacies, and regulatory inspectors.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search participants by name, email, company, or role..."
        searchKeys={['name', 'email', 'company', 'role', 'status']}
      />

      {/* View User Modal */}
      {selectedUser && (
        <Modal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          title="Participant Identity Dossier"
          subtitle={`PharmaChain User ID: ${selectedUser.id}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="h-12 w-12 rounded-2xl bg-medblue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                {selectedUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedUser.name}</h4>
                <p className="text-xs text-slate-500">{selectedUser.role} • {selectedUser.company}</p>
                <div className="mt-1">
                  <StatusBadge status={selectedUser.status} size="sm" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-mono">{selectedUser.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{selectedUser.phone || '+1 (555) 010-0000'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Registered: {selectedUser.joinedDate || '2026-01-01'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
              {selectedUser.status !== 'Active' ? (
                <Button variant="secondary" size="sm" onClick={() => handleApprove(selectedUser)}>
                  Approve Access
                </Button>
              ) : selectedUser.role !== 'Admin' ? (
                <Button variant="danger" size="sm" onClick={() => handleSuspend(selectedUser)}>
                  Suspend User
                </Button>
              ) : null}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
