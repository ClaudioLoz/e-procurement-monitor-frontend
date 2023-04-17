import { Typography, Card } from '@mui/material';

function AdditionalInfoTab({description}) {

  return (
    <Card
      sx={{
        p: 4
      }}
    >
      <Typography variant="h4" gutterBottom>
        Descripción
      </Typography>
      <p>
        {description?.length > 0 ? description :"No se ha completado su descripción."}
      </p>
    </Card>
  );
}

export default AdditionalInfoTab;
