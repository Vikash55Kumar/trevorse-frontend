import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/AuthLayout'
import PhoneCard from './app/authform/phone'
import Verify from './app/authform/verify'
import SetPin from './app/authform/setpin'
// import LoginPage from './app/authform/login'
import { PanVerify } from './app/authform/PAN'
import { BankDetail } from './app/authform/bankdetail'
import MaritalStatus from './app/authform/MaritalStatus'
import AnualIncome from './app/authform/anualincome'
import Occupations from './app/authform/occupation'
import ExperienceForm from './app/authform/experience'
import ConfirmPin from './app/authform/confirm'
import Dashboard from './pages/Dashboard'
import MainLayout from './components/layout/Mainlayout'
import Trade from './pages/Trade'
import Profile from './pages/Profile'
import Learn from './pages/Learn'
import Analytics from './pages/Analytics'
import Mentorship from './pages/Mentorship'
import Positions from './pages/Position'
import LoginPage from './app/login/login'
import Admin from './pages/Admin'
import { authClient } from './lib/auth-client'
import type { UserWithRole } from './types/auth'
import AcceptInvitation from './pages/AcceptInvitation'

function RequireAuth({ children }: { children: ReactNode }) {
  const { data, isPending } = authClient.useSession()
  console.log("data", data);
  
  if (isPending) {
    return <div className="p-6 text-sm text-slate-600">Loading...</div>
  }

  if (!data?.user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { data, isPending } = authClient.useSession()
  const role = (data?.user as UserWithRole | undefined)?.role

  if (isPending) {
    return <div className="p-6 text-sm text-slate-600">Loading...</div>
  }

  if (!data?.user || role !== 'ADMIN') {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/accept-invitation" element={<AcceptInvitation />} />
        
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          {/* <Route path="login" element={<LoginPage />} /> */}
          <Route path="phone" element={<PhoneCard />} />
          <Route path="verify" element={<Verify />} />
          <Route path="setpin" element={<SetPin />} />
          <Route path="confirm" element={<ConfirmPin />} />
          <Route path="pan" element={<PanVerify />} />
          <Route path="bankdetail" element={<BankDetail />} />
          <Route path="marital" element={<MaritalStatus />} />
          <Route path="anualincome" element={<AnualIncome />} />
          <Route path="occupations" element={<Occupations />} />
          <Route path="experience" element={<ExperienceForm />} />
        </Route>

        <Route
          path="/home"
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="trade" element={<Trade />} />
          <Route path="profile" element={<Profile />} />
          <Route path="learn" element={<Learn />} />
          <Route path="mentorship" element={<Mentorship />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="positions" element={<Positions />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  )
}

export default App
