import Authenticated from 'src/components/Authenticated';
// import { Navigate } from 'react-router-dom';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';


import accountRoutes from './account';
import managementRoutes from './management';
import monitoredProcurementRoutes from './monitoredProcurement';




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
        path: 'contrataciones-evaluacion',
        children: managementRoutes
      }
    ]
  }
];

export default router;
