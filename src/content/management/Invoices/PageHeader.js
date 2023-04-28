import { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';

import {
  styled,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Box,
  Zoom,
  Typography,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
  Button,
  Avatar,
  Alert,
  // IconButton,
  // lighten,
  useTheme,
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import departmentList from '../../../mocks/departments';
import provincesJSON from '../../../mocks/provinces';
import districtsJSON from '../../../mocks/districts';
import useAuth from 'src/hooks/useAuth';


const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(3)};
    background: ${theme.colors.alpha.black[5]};
    border: 1px dashed ${theme.colors.alpha.black[30]};
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(['border', 'background'])};

    &:hover {
      background: ${theme.colors.alpha.white[100]};
      border-color: ${theme.colors.primary.main};
    }
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.primary.lighter};
    color: ${theme.colors.primary.main};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);



function PageHeader({handleAddEProcurement}) {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedProcurementObject, setSelectedProcurementObject] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const onDrop = (acceptedFiles) => {
    const auxFormData = new FormData();
    acceptedFiles.forEach((file) => {
      auxFormData.append("files", file);
    });
    setFormData(auxFormData);
  }

  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop
  });

  const files = acceptedFiles.map((file, index) => (
    <ListItem disableGutters component="div" key={index}>
      <ListItemText primary={file.name} />
      <b>{file.size} bytes</b>
      <Divider />
    </ListItem>
  ));

  const contractObjects = [
    { title: 'BIEN', translation:'GOOD' },
    { title: 'OBRA', translation:'WORK' },
    { title: 'SERVICIO', translation:'SERVICE' },
    { title: 'CONSULTORÍA DE OBRA', translation:'WORK_CONSULTING' }
  ];
  
  const [contractStartDate, setContractStartDate] = useState(null);
  const [contractEndDate, setContractEndDate] = useState(null);


  const handleCreateInvoiceOpen = () => {
    setOpen(true);
  };

  const handleCreateInvoiceClose = () => {
    setOpen(false);
  };

  const handleCreateInvoiceSuccess = (newEProcurement) => {
    enqueueSnackbar('La contratación ha sido publicada en el sistema exitosamente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpen(false);
    handleAddEProcurement(prev =>[...prev,newEProcurement])

  };


  const handleDepartmentChange = (event, value) =>{
    if (value) {
        setSelectedDepartment(value.nombre_ubigeo);
        setProvinces(provincesJSON[value.id_ubigeo]);
    } else {
      setProvinces([]);
      setDistricts([]);
    }
  };  
  const handleProvinceChange = (event, value) =>{
    if (value) {
        setSelectedProvince(value.nombre_ubigeo);
        setDistricts(districtsJSON[value.id_ubigeo]);
    } else {
      setDistricts([]);
    }
  };  
  const handleDistrictChange = (event, value) =>{
    if (value) {
      setSelectedDistrict(value.nombre_ubigeo);
    } 
  };  
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Contrataciones públicas a dar seguimiento
          </Typography>
        </Grid>
        <Grid item>
              <a href="http://contratos.seace.gob.pe/busqueda/#/buscar  " target="_blank" rel="noreferrer" > ¿No sabes de dónde sacar la información necesaria? Ingresa al portal del estado </a>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateInvoiceOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            disabled={auth.isVisitor}
          >
            Subir una contratación
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateInvoiceClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            Nueva contratación a subir al sistema
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            contractingName: '',
            contractingEntityRuc: '',
            contractorName: '',
            contractorRuc: '',
            contractAmount: 0,
            description: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            contractingName: Yup.string()
              .max(255)
              .required("El nombre del contratante es requerido")
            , contractingEntityRuc: Yup.string()
              .max(255)
              .required("El RUC del contratante es requerido")
            , contractorName: Yup.string()
              .max(255)
              .required("El nombre del contratista es requerido")
            , contractorRuc: Yup.string()
              .max(255)
              .required("El RUC del contratista es requerido")
            , contractAmount: Yup.number()
              .min(1,"El monto del contrato es requerido")
              .required("El monto del contrato es requerido")
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const newEProcurement = {
                contractingEntityName: _values.contractingName,
                contractingEntityRuc: _values.contractingEntityRuc,
                contractorName: _values.contractorName,
                contractorRuc: _values.contractorRuc,
                procurementObject: selectedProcurementObject.translation,
                amount: parseInt(_values.contractAmount),
                department: selectedDepartment,
                province: selectedProvince,
                district: selectedDistrict,
                contractStartDate,
                contractEndDate,
                description: _values.description,
              };

              const json = JSON.stringify(newEProcurement);
              const blob = new Blob([json], {
                type: 'application/json'
              });
              formData.append("json", blob);
              const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/eprocurements`, formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
              );
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              handleCreateInvoiceSuccess(response.data);
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={0}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                       <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>Entidad contratante: </b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                  <Box sx={{ display: "flex" }}>

                    <TextField
                      error={Boolean(touched.contractingName && errors.contractingName)}
                      helperText={touched.contractingName && errors.contractingName}
                      name="contractingName"
                      placeholder="Escriba nombre del contratante"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contractingName}
                      variant="outlined"
                      sx={{ width: '70%', mr: `1.5rem` }}
                    />

                    <TextField
                      error={Boolean(touched.contractingEntityRuc && errors.contractingEntityRuc)}   
                      helperText={touched.contractingEntityRuc && errors.contractingEntityRuc}
                      name="contractingEntityRuc"
                      placeholder="Escriba RUC del contratante"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contractingEntityRuc}
                      variant="outlined"
                      sx={{ width: '30%' }}
                    />
                  </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                     <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>Contratista: </b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                  <Box sx={{ display: "flex" }}>

                    <TextField
                      error={Boolean(touched.contractorName && errors.contractorName)}
                      helperText={touched.contractorName && errors.contractorName}
                      name="contractorName"
                      placeholder="Escriba nombre del contratista"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contractorName}
                      variant="outlined"
                      sx={{ width: '70%', mr: `1.5rem` }}
                    />
                    <TextField
                      error={Boolean(touched.contractorRuc && errors.contractorRuc)}
                      helperText={touched.contractorRuc && errors.contractorRuc}
                      name="contractorRuc"
                      placeholder="Escriba RUC del contratista"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contractorRuc}
                      variant="outlined"
                      sx={{ width: '30%' }}

                    />
                   </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                     <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                        <b>Objeto de contratación: </b>
                      </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <Autocomplete
                        sx={{
                          m: 0
                        }}
                        limitTags={2}
                        getOptionLabel={(option) => option.title}
                        options={contractObjects}
                        onChange={(event,newValue)=> setSelectedProcurementObject(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant="outlined"
                            placeholder="Seleccione un objeto de contratación"
                          />
                        )}
                      />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                     <Box
                        pr={3}
                        sx={{
                          pt: `${theme.spacing(2)}`,
                          pb: { xs: 1, md: 0 }
                        }}
                        alignSelf="center"
                      >
                        <b>Monto(soles): </b>
                      </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      error={Boolean(touched.contractAmount && errors.contractAmount)}
                      fullWidth
                      helperText={touched.contractAmount && errors.contractAmount}
                      name="contractAmount"
                      placeholder="Escriba el monto"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contractAmount}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                     <Box
                        pr={3}
                        sx={{
                          pt: `${theme.spacing(2)}`,
                          pb: { xs: 1, md: 0 }
                        }}
                        alignSelf="center"
                      >
                        <b>Departamento: </b>
                      </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <Autocomplete
                        sx={{
                          m: 0
                        }}
                        limitTags={2}
                        onChange={handleDepartmentChange}
                        getOptionLabel={(option) => option.nombre_ubigeo}
                        options={departmentList}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant="outlined"
                            placeholder="Seleccione un departamento"
                          />
                        )}
                      />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                     <Box
                        pr={3}
                        sx={{
                          pt: `${theme.spacing(2)}`,
                          pb: { xs: 1, md: 0 }
                        }}
                        alignSelf="center"
                      >
                        <b>Provincia: </b>
                      </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <Autocomplete
                        sx={{
                          m: 0
                        }}
                        limitTags={2}
                        onChange={handleProvinceChange}
                        getOptionLabel={(option) => option.nombre_ubigeo}
                        options={provinces}
                        disabled={provinces.length === 0}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant="outlined"
                            placeholder="Seleccione una provincia"
                          />
                        )}
                      />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                     <Box
                        pr={3}
                        sx={{
                          pt: `${theme.spacing(2)}`,
                          pb: { xs: 1, md: 0 }
                        }}
                        alignSelf="center"
                      >
                        <b>Distrito: </b>
                      </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <Autocomplete
                        sx={{
                          m: 0
                        }}
                        limitTags={2}
                        onChange={handleDistrictChange}
                        getOptionLabel={(option) => option.nombre_ubigeo}
                        options={districts}
                        disabled={districts.length === 0}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant="outlined"
                            placeholder="Seleccione un distrito"
                          />
                        )}
                      />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                      <Box
                          pr={3}
                          sx={{
                            pt: `${theme.spacing(2)}`,
                            pb: { xs: 1, md: 0 }
                          }}
                          alignSelf="center"
                        >
                        <b>Fecha de inicio del contrato:*</b>
                      </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <DatePicker
                      value={contractStartDate}
                      onChange={(newValue) => {
                        setContractStartDate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          placeholder="Seleccione la fecha inicio del contrato"
                          {...params}
                          // TODO: latin date format
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                      <Box
                          pr={3}
                          sx={{
                            pt: `${theme.spacing(2)}`,
                            pb: { xs: 1, md: 0 }
                          }}
                          alignSelf="center"
                        >
                        <b>Fecha fin del contrato: *</b>
                      </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <DatePicker
                      value={contractEndDate}
                      onChange={(newValue1) => {
                        setContractEndDate(newValue1);
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          placeholder="Seleccione la fecha del fin de contrato"
                          {...params}
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                     <Box
                        pr={3}
                        sx={{
                          pt: `${theme.spacing(2)}`,
                          pb: { xs: 1, md: 0 }
                        }}
                        alignSelf="center"
                      >
                      <b>Documentos: *</b>
                      </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <BoxUploadWrapper {...getRootProps()}>
                        <input {...getInputProps()} />
                        {isDragAccept && (
                          <>
                            <AvatarSuccess variant="rounded">
                              <CheckTwoToneIcon />
                            </AvatarSuccess>
                            <Typography
                              sx={{
                                mt: 2
                              }}
                            >
                              Coloca aquí los documentos a subir
                            </Typography>
                          </>
                        )}
                        {isDragReject && (
                          <>
                            <AvatarDanger variant="rounded">
                              <CloseTwoToneIcon />
                            </AvatarDanger>
                            <Typography
                              sx={{
                                mt: 2
                              }}
                            >
                              No se aceptan este tipo de archivos
                            </Typography>
                          </>
                        )}
                        {!isDragActive && (
                          <>
                            <AvatarWrapper variant="rounded">
                              <CloudUploadTwoToneIcon />
                            </AvatarWrapper>
                            <Typography
                              sx={{
                                mt: 2
                              }}
                            >
                              Arrastra y deja los documentos aquí
                            </Typography>
                          </>
                        )}
                      </BoxUploadWrapper>
                      {files.length > 0 && (
                        <>
                          <Alert
                            sx={{
                              py: 0,
                              mt: 2
                            }}
                            severity="success"
                          >
                            Se van a subir <b>{files.length}</b>{' '}
                            archivo(s)!
                          </Alert>
                          <Divider
                            sx={{
                              mt: 2
                            }}
                          />
                          <List disablePadding component="div">
                            {files}
                          </List>
                        </>
                      )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                     <Box
                        pr={3}
                        sx={{
                          pt: `${theme.spacing(2)}`,
                          pb: { xs: 1, md: 0 }
                        }}
                        alignSelf="center"
                      >
                      <b>Descripción:</b>
                      </Box>
                  </Grid>
                   <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                      <TextField
                        multiline
                        placeholder="Escriba algún resumen de la contratación"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="description"
                        value={values.description}
                        fullWidth
                        minRows={3}
                        maxRows={8}
                      />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    textAlign={{ sm: 'right' }}
                  />
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <Button
                      sx={{
                        mr: 2
                      }}
                      type="submit"
                      startIcon={
                        isSubmitting ? <CircularProgress size="1rem" /> : null
                      }
                      disabled={Boolean(errors.submit) || isSubmitting}
                      variant="contained"
                      size="large"
                    >
                      Subir
                    </Button>
                    <Button
                      color="secondary"
                      size="large"
                      variant="outlined"
                      onClick={handleCreateInvoiceClose}
                    >
                      Cancelar
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
