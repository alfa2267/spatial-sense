import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'clients',
        element: <ClientsPage />,
      },
      {
        path: 'devices',
        element: <DevicesPage />,
      },
      {
        path: 'strategies',
        element: <StrategiesPage />,
      },
      {
        path: 'timeline',
        element: <TimelinePage />,
      },
      {
        path: 'floorplan',
        element: <FloorPlanPage />,
      },
      {
        path: 'invoices',
        element: <InvoicesPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
