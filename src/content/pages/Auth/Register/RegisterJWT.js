import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Button,
  // Checkbox,
  FormHelperText,
  TextField,
  // Typography,
  // FormControlLabel,
  // Link,
  Zoom,
  CircularProgress
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

function RegisterJWT() {
  const { register } = useAuth();
  const isMountedRef = useRefMounted();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();


  return (
    <Formik
      initialValues={{
        email: '',
        name: '',
        nin: '',
        password: '',
        terms: false,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email(t('The email provided should be a valid email address'))
          .max(255)
          .required("El correo es requerido"),
        name: Yup.string().max(255).required("El nombre es requerido"),
        nin: Yup.string()
          .min(8, "El DNI es de 8 dígitos")
          .max(8, "El DNI es de 8 dígitos")
          .required("El DNI es requerido"),
        password: Yup.string()
          .max(255)
          .required("La contraseña es requerida"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await register(values.email, values.name, values.nin, values.password);

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }

          enqueueSnackbar('Se ha creado su usuario en el sistema exitosamente', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
            TransitionComponent: Zoom
          });
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
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            error={Boolean(touched.name && errors.name)}
            fullWidth
            margin="normal"
            helperText={touched.name && errors.name}
            label="Nombre"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.nin && errors.nin)}
            fullWidth
            margin="normal"
            helperText={touched.nin && errors.nin}
            label="DNI"
            name="nin"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.nin}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            margin="normal"
            helperText={touched.email && errors.email}
            label="Correo electrónico"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
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
            {/* <FormControlLabel
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
            /> */}
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
            Crear usuario
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default RegisterJWT;
