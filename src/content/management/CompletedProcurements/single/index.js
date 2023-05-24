import { useState, useCallback, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import useRefMounted from 'src/hooks/useRefMounted';
import axios from 'axios';

import EProcurementBody from './EProcurementBody';
import PageHeader from './PageHeader';

function ManagementInvoicesView() {
  const isMountedRef = useRefMounted();
  const [eProcurement, setEProcurement] = useState(null);

  const { eProcurementId } = useParams();

  const getEProcurement = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/eprocurements/${eProcurementId}`);
      if (isMountedRef.current) {
        setEProcurement(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [eProcurementId, isMountedRef]);

  useEffect(() => {
    getEProcurement();
  }, [getEProcurement]);
  
  if (!eProcurement) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Detalle de la contratación finalizada</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader/>
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
          <EProcurementBody eProcurement={eProcurement} />
        </Grid>
      </Grid>
    </>
  );
}

export default ManagementInvoicesView;
