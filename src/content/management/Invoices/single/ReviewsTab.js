import {
  Box,
  Typography,
  Divider,
  ListItem,
  List,
  // Button,
  Avatar,
} from '@mui/material';

// import axios from 'axios';


function ReviewsTab({comments}) {

  return (
    <>
      { comments?.length === 0 ?
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
                      Aún no se tienen comentarios para esta contratación publicada. Sé el primero.
          </Typography>
          <Divider />
        </>)
        :
            (<List>
              {
                comments.map( (comment) =>{
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
                       {comment.authUserName}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    {comment.image?
                          <img key={comment.id} src={`data:image/jpeg;base64,${comment.image}`} alt="comentario como imagen"  style={{ maxWidth: '600px', height: 'auto' }} />
                    :
                        (<Typography
                            sx={{
                              mb: 3
                            }}
                          >
                            {comment.text}
                          </Typography>)
                    }
                    <Box
                      sx={{
                        display: { xs: 'block', md: 'flex' }
                      }}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle2" color="text.primary">
                        {comment.date}
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
