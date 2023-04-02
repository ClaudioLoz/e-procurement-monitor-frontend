import { Suspense, lazy } from 'react';
import { Navigate} from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Management
const MonitoredProcurement = Loader(lazy(() => import('src/content/management/Invoices')));
const SingleInvoice = Loader(
  lazy(() => import('src/content/management/Invoices/single'))
);



const monitoredProcurementRoutes = [
  {
    path: '',
    element: <Navigate to="lista" replace />
  },
  {
    path: 'lista',
    element: <MonitoredProcurement />
  },
  {
      path: 'detalle',
        children: [
          {
            path: '',
            element: <Navigate to="1" replace />
          },
          {
            path: ':invoiceId',
            element: <SingleInvoice />
          }
        ]
  }
  ];

export default monitoredProcurementRoutes;
