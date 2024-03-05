import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

const Root = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  // Add state to track the scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  // Update the scroll position on scroll events
  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  // Attach and remove scroll event listeners on mount/unmount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Toolbar>
        <IconButton
          size="large"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{
            position: "fixed",
            top: `${Math.min(Math.max(scrollPosition, 0), 60)}px`, // Dynamic top value
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/home");
            }}
          >
            Cart
          </MenuItem>
        </Menu>
      </Toolbar>
    </div>
  );
};

export default Root;
