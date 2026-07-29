/**
 * Camada de autenticação desacoplada.
 * Preparação para Supabase Auth — sem implementação real nesta versão.
 */

export type AuthProvider = "google" | "email" | "anonymous";

export type AuthUser = {
  id: string;
  email?: string;
  displayName?: string;
  provider: AuthProvider;
  createdAt: string;
};

export type AuthSession = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;
};

/** Contrato futuro — implementações concretas virão com Supabase. */
export type AuthClient = {
  getSession(): Promise<AuthSession>;
  signInWithGoogle(): Promise<AuthSession>;
  signInWithEmail(email: string, password: string): Promise<AuthSession>;
  signOut(): Promise<void>;
};
