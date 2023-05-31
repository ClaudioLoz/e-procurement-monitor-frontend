import { useState } from 'react';

import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import numeral from 'numeral';

import {
  Rating,
  Box,
  Card,
  Grid,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import Label from 'src/components/Label';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';




const getInvoiceStatusLabel = (invoiceStatus) => {
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

  const { text, color } = map[invoiceStatus];

  return (
    <Label color={color}>
      <b>{text}</b>
    </Label>
  );
};

const applyFilters = (eprocurements, query, filters) => {
  return eprocurements.filter((eprocurement) => {
    let matches = true;

    if (query) {
      const properties = ['contractingEntityName', 'contractorName', 'contractingEntityRuc', 'contractorRuc'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (eprocurement[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && eprocurement.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && eprocurement[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (eprocurements, page, limit) => {
  return eprocurements.slice(page * limit, page * limit + limit);
};

const Results = ({ eprocurements }) => {
  const [selectedItems] = useState([]);
  const location = useLocation();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    status: null
  });


  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };


  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredEProcurements = applyFilters(eprocurements, query, filters);
  const paginatedEProcurements = applyPagination(filteredEProcurements, page, limit);

  return (
    <>
      <Card
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Grid alignItems="center" container spacing={3}>
          <Grid item xs={12} lg={7} md={6}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                )
              }}
              sx={{
                m: 0
              }}
              onChange={handleQueryChange}
              placeholder="Buscar por nombre o RUC de contratante o contratista"
              value={query}
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Card>
      <Card>

        {paginatedEProcurements.length === 0 ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            No se encontraron contrataciones con el criterio de búsqueda elegido
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Entidad contratante</TableCell>
                    <TableCell>Contratista</TableCell>
                    <TableCell >Objeto de contratación</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Departamento</TableCell>
                    <TableCell>Cantidad de observaciones</TableCell>
                    <TableCell>Promedio de valoración</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedEProcurements.map((eprocurement) => {
                    const isInvoiceSelected = selectedItems.includes(
                      eprocurement.id
                    );
                    return (
                      <TableRow
                        hover
                        key={eprocurement.id}
                        selected={isInvoiceSelected}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box pl={1}>
                              <Typography noWrap variant="subtitle2">
                                {eprocurement.contractingEntityName + " - " + eprocurement.contractingEntityRuc}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                              <Typography noWrap variant="subtitle2">
                                {eprocurement.contractorName + " - " + eprocurement.contractorRuc}
                            </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>
                            {getInvoiceStatusLabel(eprocurement.procurementObject)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>
                               S/. {numeral(eprocurement.amount).format('0,0')}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h5">
                              {eprocurement.department}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h5">
                              {eprocurement.totalCommentCount}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h5">
                              {eprocurement.totalRatingAverage.toFixed(2)} 
                              <Rating size="small" readOnly value={1} max={1}/>
                            </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title="Calificar la contratación" arrow>
                              <IconButton
                                component={RouterLink}
                                to={
                                  `/${
                                    location.pathname.split('/')[1]
                                  }/detalle/${eprocurement.id}` 
                                }
                                color="primary"
                              >
                                <AssignmentTurnedInIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Ver el detalle de los indicadores cuantitativos" arrow>
                              <IconButton
                                component={RouterLink}
                                to={
                                  `/${
                                    location.pathname.split('/')[1]
                                  }/indicadores-cuantitativos/${eprocurement.id}/` 
                                }
                                color="primary"
                              >
                                <StackedLineChartIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                labelRowsPerPage={"Filas por página:"}
                count={filteredEProcurements.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          </>
        )}
      </Card>
    </>
  );
};

Results.propTypes = {
  eprocurements: PropTypes.array.isRequired
};

Results.defaultProps = {
  eprocurements: []
};

export default Results;
