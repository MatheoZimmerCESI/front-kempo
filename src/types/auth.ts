// src/types/auth.ts
export interface AuthResponse {
    token: string
  }
  

// src/types/auth.ts
export interface JwtPayload {
    userId: number
    roles: string[]
  }
  