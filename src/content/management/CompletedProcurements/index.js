import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';
import Results from './Results';

function ManagementCompletedProcurement() {
  const isMountedRef = useRefMounted();
  const [eprocurements, setEProcurements] = useState([]);

  const getEprocurements = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/eprocurements?procurementStatus=COMPLETED`);
      if (isMountedRef.current) {
        setEProcurements(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getEprocurements();
  }, [getEprocurements]);

  return (
    <>
      <Helmet>
        <title>Contrataciones finalizadas</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader handleAddEProcurement={setEProcurements}/>
      </PageTitleWrapper>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <Results eprocurements={eprocurements} />
        </Grid>
      </Grid>
    </>
  );
}

export default ManagementCompletedProcurement;
