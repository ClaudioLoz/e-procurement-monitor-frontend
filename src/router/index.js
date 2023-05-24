import Authenticated from 'src/components/Authenticated';
// import { Navigate } from 'react-router-dom';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';


import accountRoutes from './account';
import monitoredProcurementRoutes from './monitoredProcurement';
import completedProcurementRoutes from './completedProcurement';




const router = [
  {
    path: 'cuenta',
    children: accountRoutes
  },


  // Extended Sidebar Layout

  {
    path: '',
    element: (
      <Authenticated>
        <ExtendedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: 'contrataciones-seguimiento',
        children: monitoredProcurementRoutes
      },
      {
        path: 'contrataciones-finalizadas',
        children: completedProcurementRoutes
      }
    ]
  }
];

export default router;
