import {
  Box,
  Typography,
  Divider,
  ListItem,
  List,
  // Button,
  Rating,
  Avatar,
} from '@mui/material';


function ReviewsTab({data, type,stringg}) {

    if (type === 'comments') {
      stringg = 'comentarios';
    } else if (type === "justifiactions") {
      stringg="justificaciones de las calificaciones recibidas"
    } else if (type === "suggestions") {
      stringg="sugerencias"
    }

  return (
    <>
      { data?.length === 0?
        ( 
        <>
          <Typography
              sx={{
                py: 10
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
                  Aún no se tienen {stringg} para esta contratación publicada. Sé el primero.
          </Typography>
          <Divider />
        </>)
        :
            (<List>
              {
                data.map( (d) =>{
                  return (<>
                    <ListItem
                      sx={{
                        display: { xs: 'block', sm: 'flex' },
                        p: 3
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: 210,
                          pb: { xs: 2, sm: 0 },
                          svg: {
                            width: 38
                          }
                        }}
                      >
                        <Avatar src="/static/images/avatars/0.jpg" />
                        <Typography
                          sx={{
                            mt: 1,
                            mb: 2
                          }}
                          variant="h5"
                        >
                            {d.authUserName}
                        </Typography>
                      </Box>
                      <Box flex={1}>
                      {d.image ? (
                                <img
                                  key={d.id}
                                  src={`data:image/jpeg;base64, ${d.image}`}
                                  alt="comentario como imagen"
                                  style={{ maxWidth: '600px', height: 'auto' }}
                                />
                              ) : (
                                  (() => {
                                    let returnn;
                                    if (type === "comments" || type === "suggestions") {
                                      returnn = 
                                        <Typography sx={{ mb: 3 }}>
                                          {d.text}
                                        </Typography>
                                    } else if (type === "justifications") {
                                      returnn = (<>
                                       <Rating size="medium" defaultValue={d.stars} precision={1} value={d.stars} disabled/>
                                        <Typography sx={{ mb: 3 }}>
                                          {d.justification}
                                      </Typography>
                                      </>)
                                    } 
                                    // else if (type === "suggestions") {
                                    //   returnn = <Typography sx={{ mb: 3 }}>
                                    //   {d.text}
                                    //   </Typography>;
                                    // }
                                    return returnn;
                                  })()
                          )}
                        <Box
                          sx={{
                            display: { xs: 'block', md: 'flex' }
                          }}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Box display="flex" alignItems="center">
                            <Typography variant="subtitle2" color="text.primary">
                            {d.date}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>
                    <Divider />     
                        </> )             
              })
              }
            </List>)
      }
  </>)
}

export default ReviewsTab;
