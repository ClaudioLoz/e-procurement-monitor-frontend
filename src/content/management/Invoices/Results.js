import { useState, forwardRef } from 'react';

import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import numeral from 'numeral';

import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Grid,
  Slide,
  Divider,
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
  Button,
  Typography,
  Dialog,
  Zoom,
  InputAdornment,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import Label from 'src/components/Label';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSnackbar } from 'notistack';
// import { format } from 'date-fns';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

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
      const properties = ['clientName'];
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
  const [selectedItems, setSelectedInvoices] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
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

  const handleSelectAllInvoices = (event) => {
    setSelectedInvoices(
      event.target.checked ? eprocurements.map((eprocurement) => eprocurement.id) : []
    );
  };

  const handleSelectOneInvoice = (event, invoiceId) => {
    if (!selectedItems.includes(invoiceId)) {
      setSelectedInvoices((prevSelected) => [...prevSelected, invoiceId]);
    } else {
      setSelectedInvoices((prevSelected) =>
        prevSelected.filter((id) => id !== invoiceId)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredEProcurements = applyFilters(eprocurements, query, filters);
  const paginatedEProcurements = applyPagination(filteredEProcurements, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeInvoices =
    selectedItems.length > 0 && selectedItems.length < eprocurements.length;
  const selectedAllInvoices = selectedItems.length === eprocurements.length;

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);

    enqueueSnackbar("La contratación se ha eliminado exitosamente", {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

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
              placeholder="Buscar contratación pública por nombre de entidad contratante o contratista"
              value={query}
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Card>
      <Card>
        <Box pl={2} display="flex" alignItems="center">
          <Checkbox
            checked={selectedAllInvoices}
            indeterminate={selectedSomeInvoices}
            onChange={handleSelectAllInvoices}
          />
          {selectedBulkActions && (
            <Box flex={1} p={2}>
              <BulkActions />
            </Box>
          )}
          {/* {!selectedBulkActions && (
            <Box
              flex={1}
              p={2}
              display={{ xs: 'block', sm: 'flex' }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box/>
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
          )} */}
        </Box>
        <Divider />

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
                    <TableCell>Fecha de inicio</TableCell>
                    <TableCell>Fecha de fin</TableCell>
                    <TableCell>Departamento</TableCell>
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
                            <Checkbox
                              checked={isInvoiceSelected}
                              onChange={(event) =>
                                handleSelectOneInvoice(event, eprocurement.id)
                              }
                              value={isInvoiceSelected}
                            />
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
                          <Typography noWrap>
                            {/* {format(eprocurement.issuedDate, 'MMMM dd yyyy')} */}
                            {eprocurement.contractStartDate[2]}/{eprocurement.contractStartDate[1]}/{eprocurement.contractStartDate[0]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap>
                            {/* {format(eprocurement.issuedDate, 'MMMM dd yyyy')} */}
                            {eprocurement.contractEndDate[2]}/{eprocurement.contractEndDate[1]}/{eprocurement.contractEndDate[0]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h5">
                              {eprocurement.department}
                            </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title="Mirar el detalle de la contratación" arrow>
                              <IconButton
                                component={RouterLink}
                                to={
                                  `/${
                                    location.pathname.split('/')[1]
                                  }/detalle/${eprocurement.id}` 
                                }
                                color="primary"
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar" arrow>
                              <IconButton
                                onClick={handleConfirmDelete}
                                color="primary"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
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

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            ¿Realmente quieres eliminar esta contratación?
          </Typography>
          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              Cancelar
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              Eliminar
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
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
