import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/tables/DataTable';
import { ClubForm } from '../../components/forms/ClubForm';
import { clubService } from '../../services/clubService';
import { useToast } from '../../context/ToastContext';
import { CLUB_CATEGORIES } from '../../constants/categories';
import { getStatusBadgeVariant } from '../../utils/formatters';
import { Building, Plus, Search, Edit2, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';

export default function SystemAdminClubsPage() {
  const { showToast } = useToast();
  const [clubs, setClubs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 15,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;

      const data = await clubService.getAll(params);
      setClubs(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast('Failed to load university clubs directory', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, categoryFilter, statusFilter, showToast]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const handleCreateClub = async (data) => {
    try {
      setSubmitting(true);
      await clubService.create(data);
      showToast(`Club "${data.name}" chartered successfully`, 'success');
      setCreateModalOpen(false);
      fetchClubs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create club', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateClub = async (data) => {
    if (!selectedClub) return;
    try {
      setSubmitting(true);
      await clubService.update(selectedClub.id, data);
      showToast(`Club "${data.name}" updated successfully`, 'success');
      setEditModalOpen(false);
      fetchClubs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update club', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (club, newStatus) => {
    try {
      await clubService.update(club.id, { status: newStatus });
      showToast(`Club "${club.name}" status changed to ${newStatus}`, 'success');
      fetchClubs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change club status', 'error');
    }
  };

  const columns = [
    {
      header: 'Club Name & Profile',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.logoUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80'}
            alt={row.name}
            className="w-9 h-9 rounded-md object-cover border border-border shrink-0"
          />
          <div>
            <Link
              to={`/clubs/${row.slug}`}
              className="font-bold text-navy-900 hover:text-gold block transition-colors"
            >
              {row.name}
            </Link>
            <span className="text-[11px] text-ink-secondary">{row.contactEmail || 'No contact email'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (row) => <Badge variant="neutral">{row.category}</Badge>,
    },
    {
      header: 'Roster / Events',
      key: 'metrics',
      render: (row) => (
        <span className="text-xs text-ink-primary font-medium">
          {row.memberCount || 0} members • {row.eventCount || 0} events
        </span>
      ),
    },
    {
      header: 'Governance Status',
      key: 'status',
      render: (row) => <Badge variant={getStatusBadgeVariant(row.status)}>{row.status}</Badge>,
    },
    {
      header: 'Meeting Location',
      key: 'location',
      render: (row) => <span className="text-xs text-ink-secondary">{row.location || '—'}</span>,
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedClub(row);
              setEditModalOpen(true);
            }}
            title="Edit Club Details"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>

          {row.status === 'ACTIVE' ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleToggleStatus(row, 'SUSPENDED')}
              title="Suspend Club Operations"
            >
              <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Suspend
            </Button>
          ) : (
            <Button
              variant="forest"
              size="sm"
              onClick={() => handleToggleStatus(row, 'ACTIVE')}
              title="Approve / Activate Club"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Activate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-900">University Clubs Directory</h1>
          <p className="text-sm text-ink-secondary mt-1">
            Charter new student organizations, review compliance statuses, and manage university club records.
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Charter New Club
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1">
              Search Clubs
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
              <input
                type="text"
                placeholder="Club name or charter keyword..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-md focus:outline-none focus:border-navy-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1">
              Filter by Category
            </label>
            <Select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Categories</option>
              {CLUB_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1">
              Filter by Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Governance Statuses</option>
              <option value="ACTIVE">Active & Approved</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Clubs Table */}
      <Card className="overflow-hidden">
        <DataTable
          columns={columns}
          data={clubs}
          loading={loading}
          emptyMessage="No clubs found matching current criteria."
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Charter New Student Organization"
      >
        <ClubForm
          onSubmit={handleCreateClub}
          isLoading={submitting}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit ${selectedClub?.name || 'Club'}`}
      >
        {selectedClub && (
          <ClubForm
            defaultValues={selectedClub}
            onSubmit={handleUpdateClub}
            isLoading={submitting}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
