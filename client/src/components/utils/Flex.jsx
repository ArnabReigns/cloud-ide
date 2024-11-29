import { Box } from "@mui/material";
import React from "react";

const Flex = ({ children, ...props }) => {
  return (
    <Box
      display={"flex"}
      gap={1}
      alignItems={"center"} // Ensures child items can stretch to fill available space
      {...props}
    >
      {children}
    </Box>
  );
};

export default Flex;
