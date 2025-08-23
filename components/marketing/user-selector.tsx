"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, UserCheck } from "lucide-react"
import type { User } from "@/lib/auth"

interface UserSelectorProps {
  users: User[]
  selectedUsers: string[]
  onSelectionChange: (userIds: string[]) => void
}

export function UserSelector({ users, selectedUsers, onSelectionChange }: UserSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleUserToggle = (userId: string) => {
    const newSelection = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId]

    onSelectionChange(newSelection)
  }

  const handleSelectAll = () => {
    const allFilteredIds = filteredUsers.map((user) => user.id)
    onSelectionChange(allFilteredIds)
  }

  const handleSelectNone = () => {
    onSelectionChange([])
  }

  const handleSelectByRole = (role: string) => {
    const roleUserIds = users.filter((user) => user.role === role).map((user) => user.id)
    onSelectionChange(roleUserIds)
  }

  const userCounts = {
    total: users.length,
    students: users.filter((u) => u.role === "student").length,
    faculty: users.filter((u) => u.role === "faculty").length,
    admin: users.filter((u) => u.role === "admin").length,
    active: users.filter((u) => u.status === "approved").length,
    pending: users.filter((u) => u.status === "pending").length,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Select Recipients
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Select</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4">
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex space-x-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admins</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* User List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredUsers.map((user) => (
                <div className="overflow-x-auto">
                  <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleUserToggle(user.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div><br/>
                  
                </div>
                <div className="flex space-x-1 ml-10">
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                    <Badge variant={user.status === "approved" ? "default" : "secondary"} className="text-xs">
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No users found matching your criteria</p>
              </div>
            )}

            {/* Selection Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All ({filteredUsers.length})
              </Button>
              <Button variant="outline" size="sm" onClick={handleSelectNone}>
                Select None
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            {/* Quick Selection Options */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Select by Role</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectByRole("student")}
                    className="justify-between"
                  >
                    All Students
                    <Badge variant="secondary">{userCounts.students}</Badge>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectByRole("faculty")}
                    className="justify-between"
                  >
                    All Faculty
                    <Badge variant="secondary">{userCounts.faculty}</Badge>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectByRole("admin")}
                    className="justify-between"
                  >
                    All Admins
                    <Badge variant="secondary">{userCounts.admin}</Badge>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="justify-between bg-transparent"
                  >
                    Everyone
                    <Badge variant="secondary">{userCounts.total}</Badge>
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Select by Status</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const activeUserIds = users.filter((user) => user.status === "approved").map((user) => user.id)
                      onSelectionChange(activeUserIds)
                    }}
                    className="justify-between"
                  >
                    Active Users
                    <Badge variant="secondary">{userCounts.active}</Badge>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const pendingUserIds = users.filter((user) => user.status === "pending").map((user) => user.id)
                      onSelectionChange(pendingUserIds)
                    }}
                    className="justify-between"
                  >
                    Pending Users
                    <Badge variant="secondary">{userCounts.pending}</Badge>
                  </Button>
                </div>
              </div>
            </div>

            {/* User Statistics */}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-3">User Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Users</p>
                  <p className="font-medium">{userCounts.total}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Active Users</p>
                  <p className="font-medium">{userCounts.active}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Students</p>
                  <p className="font-medium">{userCounts.students}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Faculty</p>
                  <p className="font-medium">{userCounts.faculty}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Selected Users Summary */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSelectNone}>
                Clear
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
