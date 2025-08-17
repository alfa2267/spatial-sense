import { lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage/DashboardPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage/ClientsPage'));
const DevicesPage = lazy(() => import('./pages/DevicesPage/DevicesPage'));
const StrategiesPage = lazy(() => import('./pages/StrategiesPage/StrategiesPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage/TimelinePage'));
const FloorPlanPage = lazy(() => import('./pages/FloorPlanPage/FloorPlanPage'));
const InvoicesPage = lazy(() => import('./pages/InvoicesPage/InvoicesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'));

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="strategies" element={<StrategiesPage />} />
        <Route path="strategy" element={<StrategiesPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="floorplan" element={<FloorPlanPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
