import {
  Box,
  Typography,
  Divider,
  ListItem,
  List,
  // Button,
  Avatar,
} from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function ReviewsTab({eProcurementId}) {
  const isMountedRef = useRefMounted();
  const [comments, setComments] = useState([]);
  const getComments = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/comments`,{
        params:{
          eProcurementId
        }
      });
      if (isMountedRef.current) {
        setComments(response.data.map( comment => {
          if(comment.image.length > 0 ) comment.url = URL.createObjectURL(new Blob([comment.image]));
          return comment;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  return (
    <>
      { comments.length === 0 ?
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
                comments.map( comment =>{
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
                    <Avatar src="/static/images/avatars/5.jpg" />
                    <Typography
                      sx={{
                        mt: 1,
                        mb: 2
                      }}
                      variant="h5"
                    >
                      Brook Holding
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    {comment.url?
                          <img key={comment.url} src={comment.url} alt="comentario como imagen" />
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
                        {comment.createdDate}
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
