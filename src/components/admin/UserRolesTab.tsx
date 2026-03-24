import React from 'react';
import { Search, Edit2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { User } from '../../types';

interface UserRolesTabProps {
  users: User[];
  filteredUsers: User[];
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  userRoleFilter: 'all' | 'user' | 'business' | 'admin';
  setUserRoleFilter: (role: 'all' | 'user' | 'business' | 'admin') => void;
  userStatusFilter: 'all' | 'active' | 'suspended';
  setUserStatusFilter: (status: 'all' | 'active' | 'suspended') => void;
  userSortBy: 'name' | 'email' | 'role' | 'status' | 'lastLogin';
  setUserSortBy: (sortBy: 'name' | 'email' | 'role' | 'status' | 'lastLogin') => void;
  userSortOrder: 'asc' | 'desc';
  setUserSortOrder: (order: 'asc' | 'desc') => void;
  selectedUsers: string[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  handleBulkRoleUpdate: (role: 'user' | 'business' | 'admin') => void;
  handleBulkStatusUpdate: (status: 'active' | 'suspended') => void;
  handleUpdateUserRole: (id: string, name: string, role: 'admin' | 'business' | 'user') => void;
  handleUpdateUserStatus: (id: string, name: string, status: 'active' | 'suspended') => void;
  setEditingUser: (user: User | null) => void;
}

export const UserRolesTab: React.FC<UserRolesTabProps> = ({
  users,
  filteredUsers,
  userSearchQuery,
  setUserSearchQuery,
  userRoleFilter,
  setUserRoleFilter,
  userStatusFilter,
  setUserStatusFilter,
  userSortBy,
  setUserSortBy,
  userSortOrder,
  setUserSortOrder,
  selectedUsers,
  setSelectedUsers,
  handleBulkRoleUpdate,
  handleBulkStatusUpdate,
  handleUpdateUserRole,
  handleUpdateUserStatus,
  setEditingUser,
}) => {
  const toggleSort = (column: 'name' | 'email' | 'role' | 'status' | 'lastLogin') => {
    if (userSortBy === column) {
      setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortBy(column);
      setUserSortOrder('asc');
    }
  };

  const renderSortIcon = (column: 'name' | 'email' | 'role' | 'status' | 'lastLogin') => {
    if (userSortBy !== column) return <ArrowUpDown size={14} className="text-gray-400" />;
    return userSortOrder === 'asc' ? <ArrowUp size={14} className="text-blue-600" /> : <ArrowDown size={14} className="text-blue-600" />;
  };

  return (
    <>
      <div className="flex flex-col gap-3 px-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">User Roles</h2>
          <span className="text-xs text-gray-500">{users.length} Total</span>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={userRoleFilter}
            onChange={(e) => setUserRoleFilter(e.target.value as any)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="business">Business</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={userStatusFilter}
            onChange={(e) => setUserStatusFilter(e.target.value as any)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between px-2 mb-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedUsers(filteredUsers.map(u => u.id));
                } else {
                  setSelectedUsers([]);
                }
              }}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-xs">Select All</span>
          </label>
          
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in duration-200">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkRoleUpdate(e.target.value as any);
                    e.target.value = '';
                  }
                }}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none focus:border-blue-500"
              >
                <option value="">Change Role...</option>
                <option value="user">Set as User</option>
                <option value="business">Set as Business</option>
                <option value="admin">Set as Admin</option>
              </select>
              
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusUpdate(e.target.value as any);
                    e.target.value = '';
                  }
                }}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none focus:border-blue-500"
              >
                <option value="">Change Status...</option>
                <option value="active">Set as Active</option>
                <option value="suspended">Set as Suspended</option>
              </select>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-500">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                <th 
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-1">Name {renderSortIcon('name')}</div>
                </th>
                <th 
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSort('email')}
                >
                  <div className="flex items-center gap-1">Email {renderSortIcon('email')}</div>
                </th>
                <th 
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSort('role')}
                >
                  <div className="flex items-center gap-1">Role {renderSortIcon('role')}</div>
                </th>
                <th 
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSort('status')}
                >
                  <div className="flex items-center gap-1">Status {renderSortIcon('status')}</div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(prev => [...prev, user.id]);
                          } else {
                            setSelectedUsers(prev => prev.filter(id => id !== user.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-900 truncate max-w-[100px]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 truncate max-w-[120px]" title={user.email}>
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUserRole(user.id, user.name, e.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border outline-none ${
                          user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          user.role === 'business' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="business">Business</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.status}
                        onChange={(e) => handleUpdateUserStatus(user.id, user.name, e.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border outline-none ${
                          user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                      >
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
