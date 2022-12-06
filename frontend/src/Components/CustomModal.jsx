import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CloseIcon from '@mui/icons-material/Close';

const CustomModal = ({ openModal, title, setOpenModal, children, height, width }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={() => setOpenModal(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        <Box sx={style}>
          <div className={`project-page w-screen ${width} ${height} rounded p-4 bg-secondary`}>
            <div className="h-full w-full flex flex-col justify-between">
              <div className="flex justify-between py-1">
                <p className="font-bold text-3xl text-gray-200 mb-2">{title}</p>
                <div
                  onClick={() => setOpenModal(false)}
                  className="text-primary cursor-pointer"
                >
                  <CloseIcon />
                </div>
              </div>
              <div className="h-[90%]">{children}</div>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CustomModal;
