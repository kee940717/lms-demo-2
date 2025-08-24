"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Users,
  RefreshCw,
  Download,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Settings,
  Eye,
  RotateCcw,
} from "lucide-react"
import { getAllUsers, type User } from "@/lib/auth"
import { ShowToast } from "@/components/loading_notification/ShowToast"
import { LoadingSkeleton } from "@/components/loading_notification/loading-skeleton"

interface Payment {
  id: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  currency: string
  method: "credit_card" | "paypal" | "bank_transfer"
  status: "completed" | "pending" | "failed" | "refunded"
  description: string
  transactionId: string
  createdAt: Date
  completedAt?: Date
  refundedAt?: Date
}

interface UserPermissions {
  userId: string
  courseAccess: boolean
  downloadAccess: boolean
  liveClassAccess: boolean
  communityAccess: boolean
  certificateAccess: boolean
  subscriptionStatus: "active" | "expired" | "cancelled"
  subscriptionEnd?: Date
}

export default function PaymentsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [permissions, setPermissions] = useState<UserPermissions[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Mock payments data
  const mockPayments: Payment[] = [
    {
      id: "pay_1",
      userId: "2",
      userName: "Dr. Michael Chen",
      userEmail: "michael.chen@clinic.com",
      amount: 299.99,
      currency: "SGD",
      method: "credit_card",
      status: "completed",
      description: "Annual Subscription - RadiologyLMS Pro",
      transactionId: "txn_abc123",
      createdAt: new Date("2024-01-15"),
      completedAt: new Date("2024-01-15"),
    },
    {
      id: "pay_2",
      userId: "3",
      userName: "Dr. Emily Rodriguez",
      userEmail: "emily.rodriguez@medical.com",
      amount: 49.99,
      currency: "SGD",
      method: "paypal",
      status: "completed",
      description: "Advanced MRI Course",
      transactionId: "txn_def456",
      createdAt: new Date("2024-01-14"),
      completedAt: new Date("2024-01-14"),
    },
    {
      id: "pay_3",
      userId: "5",
      userName: "Dr. Lisa Thompson",
      userEmail: "lisa.thompson@clinic.com",
      amount: 199.99,
      currency: "SGD",
      method: "bank_transfer",
      status: "pending",
      description: "6-Month Subscription",
      transactionId: "txn_ghi789",
      createdAt: new Date("2024-01-16"),
    },
    {
      id: "pay_4",
      userId: "2",
      userName: "Dr. Michael Chen",
      userEmail: "michael.chen@clinic.com",
      amount: 29.99,
      currency: "SGD",
      method: "credit_card",
      status: "refunded",
      description: "CT Imaging Fundamentals",
      transactionId: "txn_jkl012",
      createdAt: new Date("2024-01-10"),
      completedAt: new Date("2024-01-10"),
      refundedAt: new Date("2024-01-12"),
    },
  ]

  // Mock permissions data
  const mockPermissions: UserPermissions[] = [
    {
      userId: "2",
      courseAccess: true,
      downloadAccess: true,
      liveClassAccess: true,
      communityAccess: true,
      certificateAccess: true,
      subscriptionStatus: "active",
      subscriptionEnd: new Date("2025-01-15"),
    },
    {
      userId: "3",
      courseAccess: true,
      downloadAccess: false,
      liveClassAccess: false,
      communityAccess: true,
      certificateAccess: false,
      subscriptionStatus: "active",
      subscriptionEnd: new Date("2024-07-14"),
    },
    {
      userId: "5",
      courseAccess: false,
      downloadAccess: false,
      liveClassAccess: false,
      communityAccess: false,
      certificateAccess: false,
      subscriptionStatus: "expired",
      subscriptionEnd: new Date("2023-12-01"),
    },
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const allUsers = await getAllUsers()
      setUsers(allUsers)
      setPayments(mockPayments)
      setPermissions(mockPermissions)
    } catch (error) {
      setAlert({ type: "error", message: "Failed to load data" })
    } finally {
      const timer = setTimeout(()=>{
        setIsLoading(false)
      }, 500)
      return (()=> clearTimeout(timer))
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleRefund = async (paymentId: string) => {
    try {
      const updatedPayments = payments.map((payment) =>
        payment.id === paymentId ? { ...payment, status: "refunded" as const, refundedAt: new Date() } : payment,
      )
      setPayments(updatedPayments)
      setAlert({ type: "success", message: "Refund processed successfully" })
    } catch (error) {
      setAlert({ type: "error", message: "Failed to process refund" })
    }
  }

  const handlePermissionChange = (userId: string, permission: keyof UserPermissions, value: boolean | string) => {
    const updatedPermissions = permissions.map((perm) =>
      perm.userId === userId ? { ...perm, [permission]: value } : perm,
    )
    setPermissions(updatedPermissions)
    setAlert({ type: "success", message: "Permission updated successfully" })
  }

  const getStatusBadge = (status: Payment["status"]) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      refunded: "outline",
    } as const

    const icons = {
      completed: CheckCircle,
      pending: Clock,
      failed: XCircle,
      refunded: RotateCcw,
    }

    const Icon = icons[status]

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getMethodBadge = (method: Payment["method"]) => {
    const labels = {
      credit_card: "Credit Card",
      paypal: "PayPal",
      bank_transfer: "Bank Transfer",
    }

    return <Badge variant="outline">{labels[method]}</Badge>
  }

  const getSubscriptionBadge = (status: UserPermissions["subscriptionStatus"]) => {
    const variants = {
      active: "default",
      expired: "destructive",
      cancelled: "secondary",
    } as const

    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(9)}</Badge>
  }

  // Calculate stats
  const stats = {
    totalRevenue: payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
    totalTransactions: payments.length,
    successRate: (payments.filter((p) => p.status === "completed").length / payments.length) * 100,
    pendingAmount: payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-[75vw]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payment Management</h1>
            <p className="text-muted-foreground">Track payments and manage user permissions</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <Alert variant={alert.type === "error" ? "destructive" : "default"}>
            {alert.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        {isLoading ? <LoadingSkeleton/> : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">${stats.pendingAmount.toFixed(2)} pending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                  <p className="text-xs text-muted-foreground">
                    {payments.filter((p) => p.status === "completed").length} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Payment success rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {permissions.filter((p) => p.subscriptionStatus === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground">With active subscriptions</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="payments" className="space-y-6">
              <TabsList>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="permissions">User Permissions</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="payments" className="space-y-6">
                {/* Search and Filters */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search payments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {/* Payments Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>All payment transactions and their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{payment.userName}</p>
                                  <p className="text-sm text-muted-foreground">{payment.userEmail}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  ${payment.amount.toFixed(2)} {payment.currency}
                                </div>
                              </TableCell>
                              <TableCell>{getMethodBadge(payment.method)}</TableCell>
                              <TableCell>{getStatusBadge(payment.status)}</TableCell>
                              <TableCell>
                                <div className="max-w-[200px] truncate" title={payment.description}>
                                  {payment.description}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {payment.completedAt?.toLocaleDateString() || payment.createdAt.toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {payment.status === "completed" && (
                                    <Button variant="outline" size="sm" onClick={() => handleRefund(payment.id)}>
                                      <RotateCcw className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      User Permissions & Access Control
                    </CardTitle>
                    <CardDescription>Manage user access to platform features and content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {users.map((user) => {
                        const userPermissions = permissions.find((p) => p.userId === user.id)
                        if (!userPermissions) return null

                        return (
                          <div key={user.id} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{user.name}</h4>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">{user.role}</Badge>
                                {getSubscriptionBadge(userPermissions.subscriptionStatus)}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`course-${user.id}`} className="text-sm">
                                  Course Access
                                </Label>
                                <Switch
                                  id={`course-${user.id}`}
                                  checked={userPermissions.courseAccess}
                                  onCheckedChange={(checked) => handlePermissionChange(user.id, "courseAccess", checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <Label htmlFor={`download-${user.id}`} className="text-sm">
                                  Downloads
                                </Label>
                                <Switch
                                  id={`download-${user.id}`}
                                  checked={userPermissions.downloadAccess}
                                  onCheckedChange={(checked) => handlePermissionChange(user.id, "downloadAccess", checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <Label htmlFor={`live-${user.id}`} className="text-sm">
                                  Live Classes
                                </Label>
                                <Switch
                                  id={`live-${user.id}`}
                                  checked={userPermissions.liveClassAccess}
                                  onCheckedChange={(checked) => handlePermissionChange(user.id, "liveClassAccess", checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <Label htmlFor={`community-${user.id}`} className="text-sm">
                                  Community
                                </Label>
                                <Switch
                                  id={`community-${user.id}`}
                                  checked={userPermissions.communityAccess}
                                  onCheckedChange={(checked) => handlePermissionChange(user.id, "communityAccess", checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <Label htmlFor={`certificate-${user.id}`} className="text-sm">
                                  Certificates
                                </Label>
                                <Switch
                                  id={`certificate-${user.id}`}
                                  checked={userPermissions.certificateAccess}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(user.id, "certificateAccess", checked)
                                  }
                                />
                              </div>
                            </div>

                            {userPermissions.subscriptionEnd && (
                              <div className="text-sm text-muted-foreground">
                                Subscription ends: {userPermissions.subscriptionEnd.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Analytics</CardTitle>
                    <CardDescription>Detailed analytics and insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                      <p className="text-muted-foreground">
                        Detailed payment analytics and revenue insights will be available here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
