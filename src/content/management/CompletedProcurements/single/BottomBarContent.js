/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/label-has-for */
import {
  // Avatar,
  Tooltip,
  IconButton,
  Box,
  Button,
  styled,
  InputBase,
  useTheme
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { useState } from 'react';

import axios from 'axios';

const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12:true };

const MessageInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(18)};
    padding: ${theme.spacing(1)};
    width: 100%;
`
);

const Input = styled('input')({
  display: 'none'
});

function BottomBarContent({eProcurementId, setComments}) {
  const auth = useAuth();
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(null);
  const [imageBytes, setImageBytes] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClear = () => {
    setInputDisabled(false);
    setImageBytes(null);
    setInputValue('');
    setSelectedFileName('');
  };


  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setInputValue('');
      setSelectedFileName(file.name);
      setInputDisabled(true);
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        const bytes = new Uint8Array(reader.result);
        setImageBytes(bytes);
      };
    }
  };

  const handleSubmit = async() => {

    const formData = new FormData();
    formData.append('image', new Blob([imageBytes]));
    const newComment = {
      eprocurementId: eProcurementId,
      text: inputValue
    };

    const json = JSON.stringify(newComment);
    const blob = new Blob([json], {
      type: 'application/json'
    });
    formData.append("json", blob);
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/comments`, formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response)
    response.data.date = new Date(response.data.createdDate).toLocaleString( 'es-PE', options);
    setComments(prev => [...prev, response.data, ]);
    handleClear();
  };

  return (
    <Box
      sx={{
        background: theme.colors.alpha.white[50],
        display: 'flex',
        alignItems: 'center',
        p: 2
      }}
    >
      <Box flexGrow={1} display="flex" alignItems="center">
      <Tooltip arrow placement="top" title={!auth.isAuthenticated? "Regístrese en el sistema y empiece a contribuir al seguimiento" : ""}>
        <MessageInputWrapper
          autoFocus
          placeholder= "Escriba su comentario aquí o adjunte una imagen de lo que sucede"
          fullWidth
          value={inputValue}
          onChange={handleInputChange}
          disabled={inputDisabled || !auth.isAuthenticated}
          onKeyPress={(event) => {
            console.log(event)
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </Tooltip>
      </Box>
      <Box>
        <Input disabled={!auth.isAuthenticated} accept="image/*" id="messenger-upload-file" type="file" onChange={handleFileUpload} />
        <Tooltip arrow placement="top" title="Adjunte imagen">
          <label htmlFor="messenger-upload-file">
            <IconButton sx={{ mx: 1 }}  disabled={!auth.isAuthenticated}  color="primary" component="span">
              <AttachFileTwoToneIcon fontSize="small" />
            </IconButton>
          </label>
        </Tooltip>
        <Button startIcon={<SendTwoToneIcon />} variant="contained" onClick={handleSubmit}  disabled={!auth.isAuthenticated} >
          Enviar
        </Button>
        {selectedFileName && <p>Imagen a adjuntar: {selectedFileName}</p>}
      </Box>
    </Box>
  );
}

export default BottomBarContent;
