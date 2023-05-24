import {
  Box,
  Grid,
  Typography,
  Tooltip,
  // Button,
  Container,
  IconButton
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
// import StarIcon from '@mui/icons-material/Star';
// import PropTypes from 'prop-types';

const PageHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    return navigate(`/${location.pathname.split('/')[1]}/lista`);
  };
  // const handleFollow = () => {
  // };
  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Tooltip arrow placement="top" title="Regresar">
              <IconButton
                onClick={handleBack}
                color="primary"
                sx={{
                  p: 2,
                  mr: 2
                }}
              >
                <ArrowBackTwoToneIcon />
              </IconButton>
            </Tooltip>
            <Box>
              <Typography variant="h3" component="h3" gutterBottom>
                Detalle de la contratación finalizada
              </Typography>
            </Box>
          </Box>
        </Grid>
        {/* <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleFollow}
            variant="contained"
            startIcon={<StarIcon fontSize="small" />}
          >
            Favoritos
          </Button>
        </Grid> */}
      </Grid>
    </Container>
  );
};

// PageHeader.propTypes = {
//   eProcurement: PropTypes.object.isRequired
// };

export default PageHeader;
