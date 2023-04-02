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


const InvoiceBody = ({ invoice }) => {
  console.log(invoice);
  // const { user } = useAuth();

  const itemsList = [
    {
      id: 1,
      name: 'Design services for March',
      quantity: 1,
      price: 8945,
      currency: '$'
    },
    {
      id: 2,
      name: 'Website migration services',
      quantity: 3,
      price: 2367,
      currency: '$'
    }
  ];

  const [items] = useState(itemsList);

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
          <Box>
            <Typography variant="h4" gutterBottom>
              Entidad contratante:
            </Typography>
            <Typography variant="h4" gutterBottom>
              Contratista:
            </Typography>
            <Typography variant="h4" gutterBottom>
              Objeto de contratación:
            </Typography>
            <Typography variant="h4" gutterBottom>
              Monto:
            </Typography>
            <Typography variant="h4" gutterBottom>
              Departamento:
            </Typography>
            <Typography variant="h4" gutterBottom>
              Provincia:
            </Typography>
            <Typography variant="h4" gutterBottom>
              Distrito:
            </Typography>
            <Typography variant="h4" gutterBottom>
              Fecha de inicio del contrato:
            </Typography>
            <Typography variant="h4" gutterBottom>
              Fecha fin del contrato:  
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
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Typography noWrap>{item.name}</Typography>
                            </TableCell>
                            <TableCell>
                                  <Typography noWrap>
                                          <Button
                                            disabled
                                            variant="contained"
                                            sx={{
                                              mx: 3
                                            }}
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
          {currentTab === 'reviews' && <ReviewsTab />}
          {currentTab === 'additional_info' && <AdditionalInfoTab />}
          <BottomBarContent/>
        </Card>
      </Grid>
    </Container>
  );
};

InvoiceBody.propTypes = {
  invoice: PropTypes.object.isRequired
};

export default InvoiceBody;
