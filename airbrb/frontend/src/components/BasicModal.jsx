import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
// start from the code: https://mui.com/material-ui/react-modal/#transitions
const BasicModal = (props) => {
  return (
    <div>
      <Modal
        name="basicModal"
        open={props.errorOpen}
        onClose={() => { props.setOpen(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableBackdropClick // Add this to prevent closing when clicking outside
      >
        <Box sx={style}>
          <IconButton
            name="modalClose"
            aria-label="close"
            onClick={() => { props.setOpen(false) }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="error-modal-modal-title" variant="h6" component="h2">
            {props.modalTitle}
          </Typography>
          <Typography id="error-modal-modal-description" sx={{ mt: 2 }}>
            {props.modalContent}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default BasicModal;
