import * as Yup from 'yup';

import { Formik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';

import {
  // Box,
  Zoom,
  Button,
  FormHelperText,
  TextField,
  // Checkbox,
  // Typography,
  Link,
  // FormControlLabel,
  CircularProgress
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import { useSnackbar } from 'notistack';
import useRefMounted from 'src/hooks/useRefMounted';
import {useNavigate} from 'react-router-dom';

const LoginJWT = () => {
  const { login, visitorLogin} = useAuth();
  const isMountedRef = useRefMounted();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();



  return (
    <> <Formik
      initialValues={{
        nin: '',
        password: '',
        terms: true,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        nin: Yup.string()
          .min(8, "El DNI es de 8 dígitos")
          .max(8, "El DNI es de 8 dígitos")
          .required("El DNI es requerido"),
        password: Yup.string()
          .max(255)
          .required("La contraseña es requerida"),
        // terms: Yup.boolean().oneOf(
        //   [true],
        //   "Tiene que leer y aceptar los términos y condiciones"
        // )
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await login(values.nin, values.password);

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
          console.log("hello?");
          navigate(`/contrataciones-seguimiento`);
        } catch (err) {
          console.error(err);
          enqueueSnackbar('Credenciales incorrectas', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
            TransitionComponent: Zoom
          });
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
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
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            error={Boolean(touched.nin && errors.nin)}
            fullWidth
            margin="normal"
            autoFocus
            helperText={touched.nin && errors.nin}
            label="Número de DNI"
            name="nin"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.nin}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            margin="normal"
            helperText={touched.password && errors.password}
            label="Contraseña"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          {/* <Box
            alignItems="center"
            display={{ xs: 'block', md: 'flex' }}
            justifyContent="space-between"
          >
            <Box display={{ xs: 'block', md: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.terms}
                    name="terms"
                    color="primary"
                    onChange={handleChange}
                  />
                }
                label={
                  <>
                    <Typography variant="body2">
                      Acepto los {' '}
                      <Link component="a" href="#">
                        términos y condiciones
                      </Link>
                      .
                    </Typography>
                  </>
                }
              />
            </Box>
            <Link component={RouterLink} to="/account/recover-password">
              <b>{t('Lost password?')}</b>
            </Link>
        </Box> */}

          {Boolean(touched.terms && errors.terms) && (
            <FormHelperText error>{errors.terms}</FormHelperText>
          )}

          <Button
            sx={{
              mt: 3
            }}
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
            disabled={isSubmitting}
            type="submit"
            fullWidth
            size="large"
            variant="contained"
          >
            Iniciar Sesión
          </Button>
        </form>
      )}
    </Formik>
    <Link component={RouterLink} to="/contrataciones-seguimiento">
            <Button
            sx={{
              mt: 3
            }}
            color="primary"
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            onClick={async() => visitorLogin()}
          >
            Ingresar como visitante
          </Button>
    </Link>
   
   </>
  );
};

export default LoginJWT;
