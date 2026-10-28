import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/tables/DataTable';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../constants/roles';
import { formatDateTime } from '../../utils/formatters';
import { Search, UserCheck, UserX, Shield, Edit2, Filter } from 'lucide-react';

export default function SystemAdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Role change modal state
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [updatingRole, setUpdatingRole] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 15,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (roleFilter) params.role = roleFilter;
      if (statusFilter !== '') params.active = statusFilter === 'true';

      const data = await userService.searchUsers(params);
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast('Failed to load user directory', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, roleFilter, statusFilter, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (user) => {
    const actionLabel = user.active ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${actionLabel} account for ${user.fullName}?`)) return;

    try {
      await userService.toggleActive(user.id, !user.active);
      showToast(`User account ${user.fullName} is now ${!user.active ? 'active' : 'deactivated'}`, 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user account status', 'error');
    }
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setTargetRole(user.role);
    setRoleModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser || !targetRole) return;
    try {
      setUpdatingRole(true);
      await userService.changeRole(selectedUser.id, targetRole);
      showToast(`Role for ${selectedUser.fullName} updated to ${targetRole}`, 'success');
      setRoleModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user role', 'error');
    } finally {
      setUpdatingRole(false);
    }
  };

  const columns = [
    {
      header: 'User Identity',
      key: 'fullName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-navy-900/10 text-navy-900 font-bold flex items-center justify-center shrink-0">
            {row.fullName?.[0] || 'U'}
          </div>
          <div>
            <span className="font-semibold text-navy-900 block">{row.fullName}</span>
            <span className="text-[11px] text-ink-secondary">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Student / Staff ID',
      key: 'studentId',
      render: (row) => row.studentId || '—',
    },
    {
      header: 'Academic Department',
      key: 'department',
      render: (row) => row.department || 'General',
    },
    {
      header: 'Assigned Role',
      key: 'role',
      render: (row) => {
        let variant = 'neutral';
        if (row.role === ROLES.SYSTEM_ADMIN) variant = 'gold';
        else if (row.role === ROLES.CLUB_ADMIN) variant = 'primary';
        else if (row.role === ROLES.STUDENT) variant = 'forest';
        return <Badge variant={variant}>{row.role.replace('_', ' ')}</Badge>;
      },
    },
    {
      header: 'Account Status',
      key: 'active',
      render: (row) => (
        <Badge variant={row.active ? 'success' : 'danger'}>
          {row.active ? 'Active' : 'Suspended'}
        </Badge>
      ),
    },
    {
      header: 'Enrolled On',
      key: 'createdAt',
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      header: 'Administrative Actions',
      key: 'actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenRoleModal(row)}
            title="Modify System Role"
          >
            <Shield className="w-3.5 h-3.5 mr-1 text-gold" />
            Role
          </Button>
          <Button
            variant={row.active ? 'danger' : 'forest'}
            size="sm"
            onClick={() => handleToggleStatus(row)}
            title={row.active ? 'Suspend Account' : 'Reactivate Account'}
          >
            {row.active ? (
              <>
                <UserX className="w-3.5 h-3.5 mr-1" /> Deactivate
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 mr-1" /> Activate
              </>
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-900">User Management Directory</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Inspect student, club officer, and administrative credentials, control platform access, and manage security authorizations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1">
              Search Users
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
              <input
                type="text"
                placeholder="Name or university email..."
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
              Filter by Role
            </label>
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All University Roles</option>
              <option value={ROLES.STUDENT}>Students</option>
              <option value={ROLES.CLUB_ADMIN}>Club Administrators</option>
              <option value={ROLES.SYSTEM_ADMIN}>System Administrators</option>
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
              <option value="">All Account Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Suspended / Inactive</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Users Data Table */}
      <Card className="overflow-hidden">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="No users found matching current criteria."
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Card>

      {/* Change Role Modal */}
      <Modal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title="Adjust Institutional Role"
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-sm text-ink-primary">
              Change permissions and dashboard privileges for{' '}
              <strong className="text-navy-900">{selectedUser.fullName}</strong> ({selectedUser.email}):
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1">
                Select Platform Role
              </label>
              <Select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              >
                <option value={ROLES.STUDENT}>STUDENT (Club membership, RSVP, feedback)</option>
                <option value={ROLES.CLUB_ADMIN}>CLUB_ADMIN (Club events, rosters, attendance)</option>
                <option value={ROLES.SYSTEM_ADMIN}>SYSTEM_ADMIN (Full system governance)</option>
              </Select>
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setRoleModalOpen(false)}
                disabled={updatingRole}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSaveRole}
                isLoading={updatingRole}
              >
                Save Role Assignment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
