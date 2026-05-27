export type Role = 'Admin' | 'Staff' | 'Doctor' | 'Patient';
export type ClinicalRole = 'physician' | 'nurse' | 'medical_assistant' | 'admin' | 'receptionist';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  clinicalRole?: ClinicalRole | null;
  avatarUrl?: string;
  isFirstLogin: boolean;
  phoneNumber?: string;
}

export interface AuthUserDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  isFirstLogin: boolean;
  phoneNumber?: string | null;
}

export interface AuthSessionDto {
  accessToken: string;
  refreshToken: string;
  expiresAt?: string;
  user: AuthUserDto;
}

export interface RefreshTokenDto {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleAuthRequest {
  provider: 'Google';
  idToken: string;
  accessToken: string | null;
}

export interface FacebookAuthRequest {
  accessToken: string;
  userId: string;
}
