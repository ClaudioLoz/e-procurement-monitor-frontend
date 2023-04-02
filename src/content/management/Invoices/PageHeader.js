import { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import wait from 'src/utils/wait';

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
// const IconButtonError = styled(IconButton)(
//   ({ theme }) => `
//      background: ${theme.colors.error.lighter};
//      color: ${theme.colors.error.main};
//      padding: ${theme.spacing(0.5)};

//      &:hover {
//       background: ${lighten(theme.colors.error.lighter, 0.4)};
//      }
// `
// );

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

function PageHeader() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  
  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg']
    }
  });

  const files = acceptedFiles.map((file, index) => (
    <ListItem disableGutters component="div" key={index}>
      <ListItemText primary={file.name} />
      <b>{file.size} bytes</b>
      <Divider />
    </ListItem>
  ));

  const contractObjects = [
    { title: 'BIEN' },
    { title: 'OBRA' },
    { title: 'SERVICIO' }
  ];
  // const itemsList = [
  //   {
  //     id: 1,
  //     name: 'Design services for March',
  //     quantity: 1,
  //     price: 8945,
  //     currency: '$'
  //   },
  //   {
  //     id: 2,
  //     name: 'Website migration services',
  //     quantity: 3,
  //     price: 2367,
  //     currency: '$'
  //   }
  // ];

  //   {
  //     avatar: '/static/images/avatars/1.jpg',
  //     name: 'Maren Lipshutz'
  //   },
  //   {
  //     avatar: '/static/images/avatars/2.jpg',
  //     name: 'Zain Vetrovs'
  //   },
  //   {
  //     avatar: '/static/images/avatars/3.jpg',
  //     name: 'Hanna Siphron'
  //   },
  //   {
  //     avatar: '/static/images/avatars/4.jpg',
  //     name: 'Cristofer Aminoff'
  //   },
  //   {
  //     avatar: '/static/images/avatars/5.jpg',
  //     name: 'Maria Calzoni'
  //   }
  // ];

  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);

  // const [items] = useState(itemsList);

  const handleCreateInvoiceOpen = () => {
    setOpen(true);
  };

  const handleCreateInvoiceClose = () => {
    setOpen(false);
  };

  const handleCreateInvoiceSuccess = () => {
    enqueueSnackbar(t('A new invoice has been created successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpen(false);
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
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateInvoiceOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
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
            contracteeName: '',
            contractorName: '',
            contractAmount: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            contracteeName: Yup.string()
              .max(255)
              .required("El nombre del contratante es requerido")
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              await wait(1000);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              handleCreateInvoiceSuccess();
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
                    <TextField
                      error={Boolean(touched.contracteeName && errors.contracteeName)}
                      helperText={touched.contracteeName && errors.contracteeName}
                      name="contracteeName"
                      placeholder="Escriba nombre del contratante"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contracteeName}
                      variant="outlined"
                    />

                    <TextField
                      error={Boolean(touched.contracteeRUC && errors.contracteeRUC)}   
                      helperText={touched.contracteeRUC && errors.contracteeRUC}
                      name="contracteeRUC"
                      placeholder="Escriba RUC del contratante"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contracteeRUC}
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
                    <TextField
                      error={Boolean(touched.contractorName && errors.contractorName)}
                      helperText={touched.contractorName && errors.contractorName}
                      name="contractorName"
                      placeholder="Escriba nombre del contratista"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contractorName}
                      variant="outlined"
                    />
                    <TextField
                      error={Boolean(touched.contractorRUC && errors.contractorRUC)}
                      helperText={touched.contractorRUC && errors.contractorRUC}
                      name="contractorRUC"
                      placeholder="Escriba RUC del contratista"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contractorRUC}
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
                        getOptionLabel={(option) => option.title}
                        options={contractObjects}
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
                        getOptionLabel={(option) => option.title}
                        options={contractObjects}
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
                        getOptionLabel={(option) => option.title}
                        options={contractObjects}
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
                        <b>Fecha de inicio del contrato:</b>
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
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          placeholder="Seleccione una fecha"
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
                        <b>Fecha fin del contrato:</b>
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
                      value={value1}
                      onChange={(newValue1) => {
                        setValue1(newValue1);
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          placeholder="Seleccione una fecha"
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
                      <b>Documentos:</b>
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
                              {t('Drop the files to start uploading')}
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
                            Has subido <b>{files.length}</b>{' '}
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
