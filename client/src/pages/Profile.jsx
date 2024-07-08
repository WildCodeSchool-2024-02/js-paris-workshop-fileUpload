import { useOutletContext } from "react-router-dom";
import { useRef, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";

const theme = createTheme({
  palette: {
    wild: {
      main: "#ff1493ad",
      light: "#ff1493ad",
      dark: "#ff1493ad",
      contrastText: "white",
    },
  },
});


function Profile() {
  const avatar = useRef();
  const [edit, setEdit] = useState(false);
  const {auth} = useOutletContext();

  const handleSubmit = async () => {
    console.info(avatar.current.files[0]);
  }

  return (
    <ThemeProvider theme={theme}>
      <section className="profile">
        <h2>Mes informations</h2>
        <figcaption
          role="presentation"
          onClick={() => {
            setEdit(true);
            avatar.current.click();
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src={auth?.user?.avatar ? auth?.user?.avatar : null}
          />
          <input type="file" hidden ref={avatar} />
        </figcaption>
        {edit && (
          <Button
            type="button"
            onClick={handleSubmit}
            component="label"
            role="button"
            variant="contained"
            color="wild"
            tabIndex={-1}
          >
            update avatar
          </Button>
        )}
        <h4 style={{textAlign: "center"}}>
          {auth?.user?.email} <br/> {auth?.user?.firstname} <br/> {auth?.user?.lastname}
        </h4>
      </section>
    </ThemeProvider>
  );
}

export default Profile;
