import type { AuthClient, AuthSession } from "./types";

const ANON_SESSION: AuthSession = {
  user: null,
  isAuthenticated: false,
  isAnonymous: true,
};

/**
 * Cliente stub — usuários são sempre anônimos até integrar Supabase.
 * Trocar esta implementação sem alterar a UI.
 */
export const authClient: AuthClient = {
  async getSession() {
    return ANON_SESSION;
  },
  async signInWithGoogle() {
    console.info("[auth] signInWithGoogle — stub; Supabase ainda não configurado.");
    return ANON_SESSION;
  },
  async signInWithEmail() {
    console.info("[auth] signInWithEmail — stub; Supabase ainda não configurado.");
    return ANON_SESSION;
  },
  async signOut() {
    return;
  },
};
