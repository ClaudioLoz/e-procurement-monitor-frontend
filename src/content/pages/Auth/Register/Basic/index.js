import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Link,
  // Tooltip,
    Typography,
  Container,
  // Alert,
  styled
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import useAuth from 'src/hooks/useAuth';
import JWTRegister from '../RegisterJWT';
// import Logo from 'src/components/LogoSign';



const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  () => `
  display: flex;
  width: 100%;
  flex: 1;
  padding: 20px;
`
);

function RegisterBasic() {
  const { method } = useAuth();

  return (
    <>
      <Helmet>
        <title>Registro usuario</title>
      </Helmet>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
              {/* <Logo /> */}
            <Card
              sx={{
                mt: 3,
                px: 4,
                pt: 5,
                pb: 3
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                 Creación de usuario
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  Complete los campos con la información necesaria para crear su usuario
                </Typography>
              </Box>
              {method === 'JWT' && <JWTRegister />}
              <Box mt={4}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  ¿Ya estás registrado?
                </Typography>{' '}
                <Link component={RouterLink} to="/cuenta/login">
                  <b>Inicia sesión aquí</b>
                </Link>
              </Box>
            </Card>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default RegisterBasic;
