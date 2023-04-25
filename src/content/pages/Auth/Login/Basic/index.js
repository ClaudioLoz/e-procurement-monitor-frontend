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
import JWTLogin from '../LoginJWT';
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

function LoginBasic() {
  const { method } = useAuth();

  return (
    <>
      <Helmet>
        <title>Inicio de sesión</title>
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
                  Inicio de sesión
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  Complete los campos con la información necesaria para iniciar sesión
                </Typography>
              </Box>
              {method === 'JWT' && <JWTLogin />}
              <Box my={4}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  ¿Quieres dejar de ser visitante?
                </Typography>{' '}
                <Link component={RouterLink} to="/cuenta/creacion">
                  <b>Regístrate aquí</b>
                </Link>
              </Box>
            </Card>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default LoginBasic;
