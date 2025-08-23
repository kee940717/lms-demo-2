import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export interface User {
  id: string
  email: string
  name: string
  role: "student" | "faculty" | "admin"
  status: "pending" | "approved" | "suspended"
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  specialty?: string
  institution?: string
  yearsOfExperience?: number
  bio?: string
  avatar?: string
  phone?: string
  country?: string
  createdAt: Date
  updatedAt: Date
}

// Mock user database - replace with real database
const users: User[] = [
  {
    id: "1",
    email: "admin@radiologylms.com",
    name: "System Admin",
    role: "admin",
    status: "approved",
  },
  {
    id: "2",
    email: "faculty@radiologylms.com",
    name: "Dr. Sarah Chen",
    role: "faculty",
    status: "approved",
  },
  {
    id: "3",
    email: "student@radiologylms.com",
    name: "Dr. John Smith",
    role: "student",
    status: "approved",
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Mock authentication - replace with real authentication
        const user = users.find((u) => u.email === credentials.email)

        if (user && user.status === "approved") {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.sub
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  session: {
    strategy: "jwt",
  },
}

// User management functions
export async function createUser(userData: {
  email: string
  name: string
  password: string
  role: "student" | "faculty"
}) {
  // Mock user creation - replace with real database operations
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    role: userData.role,
    status: userData.role === "faculty" ? "pending" : "approved",
  }

  users.push(newUser)
  return newUser
}

export async function getUserById(id: string) {
  return users.find((u) => u.id === id)
}

export async function updateUserStatus(id: string, status: "pending" | "approved" | "suspended") {
  const user = users.find((u) => u.id === id)
  if (user) {
    user.status = status
  }
  return user
}

export async function getAllUsers() {
  return users
}

export async function getPendingUsers() {
  return users.filter((u) => u.status === "pending")
}
