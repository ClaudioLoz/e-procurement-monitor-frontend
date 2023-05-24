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
const CompletedProcurement = Loader(lazy(() => import('src/content/management/CompletedProcurements')));
const AudienceOverview = Loader(lazy(() => import('src/content/dashboards/Analytics/AudienceOverview')));
const SingleInvoice = Loader(
  lazy(() => import('src/content/management/CompletedProcurements/single'))
);



const completedProcurementRoutes = [
  {
    path: '',
    element: <Navigate to="lista" replace />
  },
  {
    path: 'lista',
    element: <CompletedProcurement />
  },
  {
      path: 'detalle',
        children: [
          {
            path: '',
            element: <Navigate to="1" replace />
          },
          {
            path: ':eProcurementId',
            element: <SingleInvoice />,
          }
        ]
  },
  {
      path: 'indicadores-cuantitativos',
      children: [
        {
          path: '',
          element: <Navigate to="1" replace />
        },
        {
          path: ':eProcurementId',
          element: <AudienceOverview />
        }
      ]
  }
  
];

export default completedProcurementRoutes;
