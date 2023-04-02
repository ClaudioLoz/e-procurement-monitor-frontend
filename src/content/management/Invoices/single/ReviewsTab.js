import {
  Box,
  // Grid,
  Typography,
  // LinearProgress,
  Divider,
  ListItem,
  List,
  // Rating,
  // Tooltip,
  // Button,
  // useTheme,
  // IconButton,
  Avatar,
  // lighten,
  // styled
} from '@mui/material';

function ReviewsTab() {

  return (
    <>
      <List>
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
            <Typography
              sx={{
                mb: 3
              }}
            >
              Quis autem vel eum iure reprehenderit qui in ea voluptate velit
              esse quam nihil molestiae consequatur, vel illum qui dolorem eum
              fugiat quo voluptas nulla pariatur?
            </Typography>
            <Box
              sx={{
                display: { xs: 'block', md: 'flex' }
              }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle2" color="text.primary">
                  21 July 2021
                </Typography>
              </Box>
            </Box>
          </Box>
        </ListItem>
        <Divider />
      </List>
    </>
  );
}

export default ReviewsTab;
