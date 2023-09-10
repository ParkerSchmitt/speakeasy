export interface AccountType {
  id: number
  email: string
  firstName: string
  lastName: string
  passwordHash: string
  passwordSalt: string
  emailVerificationToken: string
  isEmailAuthenticated: boolean
}
