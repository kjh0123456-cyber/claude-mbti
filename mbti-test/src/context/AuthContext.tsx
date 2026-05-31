import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, type User, type AuthError } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { getStats, clearStats } from '../utils/statsStorage';
import { migrateLocalToCloud } from '../utils/cloudStatsStorage';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// 인증 상태(user, loading)와 signIn/signOut 함수를 하위 컴포넌트에 제공하는 Context Provider다
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // Google 팝업으로 로그인하고, localStorage에 기존 통계가 있으면 Firestore로 마이그레이션한다
  async function signIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const localStats = getStats();
      const hasLocalData = Object.values(localStats).some(v => v > 0);
      if (hasLocalData) {
        await migrateLocalToCloud(result.user.uid, localStats);
        clearStats();
      }
    } catch (error) {
      const code = (error as AuthError).code;
      // 사용자가 팝업을 닫거나 중복 요청한 경우 — 정상적인 취소이므로 무시한다
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
      throw error;
    }
  }

  // Firebase에서 현재 사용자를 로그아웃시킨다
  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// AuthContext에서 인증 상태와 로그인/로그아웃 함수를 꺼내 반환하는 훅이다
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
