import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  Container,
  // Tooltip,
  Button,
  Table,
  Tabs,
  Tab,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  styled
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';
import numeral from 'numeral';
// import axios from 'axios';

import ReviewsTab from './ReviewsTab';
import AdditionalInfoTab from './AdditionalInfoTab';
import BottomBarContent from './BottomBarContent';

const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
      padding: ${theme.spacing(2)};
  `
);



const TableWrapper = styled(Box)(
  ({ theme }) => `
  border: 1px solid ${theme.colors.alpha.black[10]};
  border-bottom: 0;
  margin: ${theme.spacing(4)} 0;
`
);

const typographySx = {
  whiteSpace: 'nowrap',
  mb: 2
};


const EProcurementBody = ({ eProcurement }) => {
  // const { user } = useAuth();

  const [currentTab, setCurrentTab] = useState('reviews');

  const tabs = [
    { value: 'reviews', label: "Comentarios" },
    { value: 'additional_info', label: "Información adicional"}
  ];
  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <Container maxWidth="lg">
      <Card
        sx={{
          p: 3,
          mb: 3
        }}
      >
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box >
            <Typography variant="h4" gutterBottom sx={typographySx}>
              Entidad contratante: {`${eProcurement.eprocurement.contractingEntityName} - ${eProcurement.eprocurement.contractingEntityRuc}`}
            </Typography>
            <Typography variant="h4" gutterBottom sx={typographySx}>
              Contratista: {`${eProcurement.eprocurement.contractorName} - ${eProcurement.eprocurement.contractorRuc}`}
            </Typography>
            <Typography variant="h4" gutterBottom sx={typographySx}>
              Objeto de contratación: {eProcurement.eprocurement.procurementObject}
            </Typography>
            <Typography variant="h4" gutterBottom sx={typographySx}>
              Monto:  S/. {numeral(eProcurement.eprocurement.amount).format('0,0')}
            </Typography>
            <Typography variant="h4" gutterBottom sx={typographySx}>
              Departamento: {eProcurement.eprocurement.department}
            </Typography>
            <Typography variant="h4" gutterBottom sx={typographySx}>
              Provincia: {eProcurement.eprocurement.province}
            </Typography>
            <Typography variant="h4" gutterBottom sx={typographySx}>
              Distrito: {eProcurement.eprocurement.district}
            </Typography>
            <Typography variant="h4" gutterBottom sx={typographySx}>
              Fecha de inicio del contrato: {eProcurement.eprocurement.contractStartDate[2]}/
              {eProcurement.eprocurement.contractStartDate[1]}/{eProcurement.eprocurement.contractStartDate[0]}
            </Typography>
            <Typography variant="h4" gutterBottom sx={typographySx}>
              Fecha fin del contrato:  {eProcurement.eprocurement.contractEndDate[2]}/
              {eProcurement.eprocurement.contractEndDate[1]}/{eProcurement.eprocurement.contractEndDate[0]}
            </Typography>
          </Box>
     
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}/>
          <Grid item xs={12} sm={6}>
            <Grid
              container
              spacing={4}
              justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
            >
              <Grid item>
                <Typography variant="h5">
                  Documentos adjuntos        
                </Typography>
                <TableWrapper>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre del documento</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {eProcurement.fileInfoOutDTOList.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography noWrap>{item.name}</Typography>
                            </TableCell>
                            <TableCell>
                                  <Typography noWrap>
                                          <Button
                                            
                                            variant="contained"
                                            sx={{
                                              mx: 3
                                            }}
                                            onClick={async() =>  window.open(item.url, "_blank")}
                                            startIcon={<DownloadTwoToneIcon />}
                                          />
                                </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TableWrapper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        </Box>
      </Card>

      <Grid item xs={12}>
        <Card>
          <TabsContainerWrapper>
            <Tabs
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
          </TabsContainerWrapper>
          <Divider />
          {currentTab === 'reviews' && <ReviewsTab eProcurementId={eProcurement.eprocurement.id}/>}
          {currentTab === 'additional_info' && <AdditionalInfoTab description={eProcurement.eprocurement.description}/>}
          <BottomBarContent eProcurementId={eProcurement.eprocurement.id}/>
        </Card>
      </Grid>
    </Container>
  );
};

EProcurementBody.propTypes = {
  eProcurement: PropTypes.object.isRequired
};

export default EProcurementBody;
