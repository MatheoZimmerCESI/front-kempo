// src/types/auth.ts

export interface AuthResponse {
  token: string
}

export interface MessageResponseAuth {
  message: string
}

export interface JwtPayload {
  userId: number
  roles:   string[]
}
