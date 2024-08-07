import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-toastify";
import { Avatar } from "@mui/material";


function Navbar({ auth, setAuth }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {credentials: "include"});
      setAuth({ isLogged: false, user: null, token: null });
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  }

  return (
    <AppBar position="static" sx={{ background: "#ff1493ad" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
            onClick={() => navigate("/")}
          >
            Harmonia
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Remy Sharp"
                  src={auth?.user?.avatar ? auth?.user?.avatar : null}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "40px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {!auth.isLogged ? (
                <div>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => navigate("/login")}
                    >
                      Connexion
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => navigate("/register")}
                    >
                      Inscription
                    </Typography>
                  </MenuItem>
                </div>
              ) : (
                <div>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => navigate("/")}
                    >
                      Dashboard
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" onClick={logout}>
                      Logout
                    </Typography>
                  </MenuItem>
                </div>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}



Navbar.propTypes = {
  auth: PropTypes.shape({
    isLogged: PropTypes.bool,
    user: PropTypes.shape({
      id: PropTypes.number,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
      cv: PropTypes.string,
      address: PropTypes.string,
      avatar: PropTypes.string,
    }),
    token: PropTypes.string,
  }),
  setAuth: PropTypes.func,
};

export default Navbar;
