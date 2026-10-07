import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ROUTE_PATHS } from './routes/paths';
import { NotFoundPage } from './routes/NotFoundPage';
import { Login } from './features/login/Login';
import { HomePage } from './features/home/HomePage';
import { DealerDetailsPage } from './features/dealerDetails/DealerDetailsPage';
import { AdvancedSearch } from './features/advancedSearch/AdvancedSearch';

/**
 * Central route registry (Constitution §13). All application routes are
 * declared here; feature components MUST NOT define their own routing logic.
 */
export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path={ROUTE_PATHS.login} element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path={ROUTE_PATHS.home} element={<HomePage />} />
                <Route path={ROUTE_PATHS.dealerDetails} element={<DealerDetailsPage />} />
                <Route path={ROUTE_PATHS.advancedSearch} element={<AdvancedSearch />} />
              </Route>

              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
