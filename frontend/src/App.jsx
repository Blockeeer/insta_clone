import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import PageTransition from './components/layout/PageTransition'
import Dashboard from './pages/Dashboard'
import Messages from './pages/Messages'
import Chat from './pages/Chat'
import ManageAccounts from './pages/ManageAccounts'

function App() {
  const location = useLocation()

  return (
    <PageTransition>
      <Routes location={location}>
        {/* Main Routes - No Auth Required */}
        <Route path="/" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/messages" element={
          <Layout hideHeader hideNav>
            <Messages />
          </Layout>
        } />
        <Route path="/chat/:conversationId" element={
          <Layout hideHeader hideNav>
            <Chat />
          </Layout>
        } />
        <Route path="/manage-accounts" element={
          <Layout hideHeader hideNav>
            <ManageAccounts />
          </Layout>
        } />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PageTransition>
  )
}

export default App
