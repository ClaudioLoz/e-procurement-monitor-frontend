import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  Container,
  Rating,
  Button,
  Table,
  Tabs,
  TextField,
  Tab,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  styled,
  useTheme,

} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import SalesByCategory from '../../../dashboards/Commerce/SalesByCategory';
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';
import numeral from 'numeral';
import axios from 'axios';
import useRefMounted from 'src/hooks/useRefMounted';

import ReviewsTab from './ReviewsTab';
import AdditionalInfoTab from './AdditionalInfoTab';
// import BottomBarContent from './BottomBarContent';

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

const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12:true };
const map = {
  WORK: {
    text: 'OBRA',
    color: 'warning'
  },
  GOOD: {
    text: 'BIEN',
    color: 'info'
  },
  SERVICE: {
    text: 'SERVICIO',
    color: 'primary'
  },
  WORK_CONSULTING: {
    text: 'CONSULTORÍA DE OBRA',
    color: 'yellow'
  }
};

const EProcurementBody = ({ eProcurement }) => {
  // const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('rating_justifications');
  const [comments, setComments] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [justifications, setJustifications] = useState([]);
  const [starValue, setStarValue] = useState(2);
  const [justificationValue, setJustificationValue] = useState(null);
  const [suggestionValue, setSuggestionValue] = useState(null);
  const isMountedRef = useRefMounted();
  const theme = useTheme();


  const getComments = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/comments`,{
        params:{
          eProcurementId: eProcurement.eprocurement.id,
        }
      });
      if (isMountedRef.current) {
        setComments(response.data.map( comment => {
          // if(comment.image) comment.url = URL.createObjectURL(new Blob([comment.image]));
          comment.date = new Date(comment.createdDate).toLocaleString( 'es-PE', options);
          return comment;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);



  const getRatingJustifications = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/ratings`,{
        params:{
          eProcurementId: eProcurement.eprocurement.id,
        }
      });
      // console.log(response.data)
      if (isMountedRef.current) {
        setJustifications(response.data.map( justification => {
          // if(comment.image) comment.url = URL.createObjectURL(new Blob([comment.image]));
          justification.date = new Date(justification.createdDate).toLocaleString( 'es-PE', options);
          return justification;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);



  const getSuggestions = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/suggestions`,{
        params:{
          eProcurementId: eProcurement.eprocurement.id,
        }
      });
      if (isMountedRef.current) {
        setSuggestions(response.data.map( suggestion => {
          suggestion.date = new Date(suggestion.createdDate).toLocaleString( 'es-PE', options);
          return suggestion;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);


  useEffect(() => {
    if(currentTab === "reviews") getComments();
    else if(currentTab === "rating_justifications") getRatingJustifications();
    else if(currentTab === "suggestions") getSuggestions();
  }, [getComments, getRatingJustifications, getSuggestions, currentTab]);

  const tabs = [
    { value: 'rating_justifications', label: `Justificaciones (${justifications.length})`},
    { value: 'suggestions', label: `Sugerencias (${suggestions.length})`},
    { value: 'reviews', label: `Observaciones durante su ejecución (${comments.length})` },
    { value: 'additional_info', label: "Información adicional"},
  ];
  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };


  const handleRatingJustificationChange = (event) => {
    setJustificationValue(event.target.value)
  };

  const handleSuggestionChange = (event) => {
    setSuggestionValue(event.target.value)
  };

  const handleStarChange = (event) => {
    setStarValue(event.target.value)
  };

  const handleRatingJustificationSubmit = async() => {
    const newRating = {
      eprocurementId:eProcurement.eprocurement.id,
      stars:starValue,
      justification:justificationValue
    };
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/ratings`, newRating);
    response.data.date = new Date(response.data.createdDate).toLocaleString( 'es-PE', options);
    setJustifications(prev => [...prev, response.data]);
  }

  const handleSuggestionSubmit = async() => {
    const newSuggestion = {
      eprocurementId: eProcurement.eprocurement.id, 
      text:suggestionValue
    };
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/suggestions`, newSuggestion);
    response.data.date = new Date(response.data.createdDate).toLocaleString( 'es-PE', options);
    setSuggestions(prev => [...prev, response.data]);
  }

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
              Objeto de contratación: {map[eProcurement.eprocurement.procurementObject].text}
            </Typography>
            <Typography variant="h4" gutterBottom sx={typographySx}>
              Monto:  S/. {numeral(eProcurement.eprocurement.amount).format('0,0')}
            </Typography>
            <Typography variant="h4" gutterBottom sx={typographySx}>
              Departamento: {eProcurement.eprocurement.department}
            </Typography>
            {eProcurement.eprocurement.province && <Typography variant="h4" gutterBottom sx={typographySx}>
                  Provincia: {eProcurement.eprocurement.province}
                </Typography>}
                {
                  eProcurement.eprocurement.district && 
                  <Typography variant="h4" gutterBottom sx={typographySx}>
                  Distrito: {eProcurement.eprocurement.district}
                </Typography>
                }
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
                        {eProcurement.fileInfoOutDTOList?.map((item, index) => (
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
          {currentTab === 'rating_justifications' && <ReviewsTab data={justifications} type="justifications"/>}
          {currentTab === 'suggestions' && <ReviewsTab data={suggestions} type="suggestions"/>}
          {currentTab === 'reviews' && <ReviewsTab data={comments} type="reviews"/>}
          {currentTab === 'additional_info' && <AdditionalInfoTab description={eProcurement.eprocurement.description}/>}

          <Grid container>
  {/* Left Side Content */}
  <Grid item xs={12} sm={7}>
    <Grid container direction="column">
      <Grid item>
          <Typography variant="h2">
                          Calificación total actual:
                          {` ${eProcurement.totalRatingAverage.toFixed(2)}`} 
                          <Rating size="medium" readOnly value={1} max={1}/>
        </Typography>
      </Grid>
      <br/>
      <Grid item>
      <Typography variant="h3">Califica a la contratación</Typography>
      </Grid>
      <Grid item>
        <Rating size="large" defaultValue={3} precision={1} value={starValue} onChange={handleStarChange}/>
      </Grid>
      <Grid item>
        <Typography variant="body1">Su retroalimentación podría ayudar a mejorar el futuro de las contrataciones públicas.</Typography>
      </Grid>
      <Grid item xs={12} sm={4} md={3} justifyContent="flex-end" textAlign={{ sm: 'left' }}>
        <Box pr={3} sx={{ pt: `${theme.spacing(2)}`, pb: { xs: 1, md: 0 } }} alignSelf="center">
          <b>Justificación:</b>
        </Box>
      </Grid>
      <Grid item xs={12} sm={8} md={9}>
        <TextField
          multiline
          placeholder="Escriba la justificación de su calificación"
          name="rating_justification"
          fullWidth
          minRows={3}
          maxRows={8}
          onChange={handleRatingJustificationChange}
          value={justificationValue}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={handleRatingJustificationSubmit}>
          Enviar calificación
        </Button>
      </Grid>
      <Grid item xs={12} sm={4} md={3} justifyContent="flex-end" textAlign={{ sm: 'left' }}>
        <Box pr={3} sx={{ pt: `${theme.spacing(2)}`, pb: { xs: 1, md: 0 } }} alignSelf="center">
          <b>Sugerencias:</b>
        </Box>
      </Grid>
      <Grid item xs={12} sm={8} md={9}>
        <TextField
          multiline
          placeholder="Escriba sugerencias"
          name="suggestion"
          fullWidth
          minRows={3}
          maxRows={8}
          onChange={handleSuggestionChange}
          value={suggestionValue}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={handleSuggestionSubmit}>
          Enviar sugerencia
        </Button>
      </Grid>
    </Grid>
  </Grid>

      {/* Right Side Content */}
      <Grid item xs={12} sm={5}>
        <SalesByCategory justifications={justifications} eProcurementId={eProcurement.eprocurement.id}/>
      </Grid>
    </Grid>

    </Card>
  </Grid>
</Container>
  );
};

  EProcurementBody.propTypes = {
  eProcurement: PropTypes.object.isRequired
};

export default EProcurementBody;
