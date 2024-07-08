import { useOutletContext } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Avatar } from "@mui/material";
import { toast } from "react-toastify";
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
  const { auth, setAuth } = useOutletContext();

  const handleSubmit = async () => {
    console.info(avatar.current.files[0]);

    const form = new FormData();
    form.append("avatar", avatar.current.files[0]);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "PUT",
        body: form,
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.ok) {
        const user = await response.json();
        setAuth((prevState) => ({ ...prevState, user }));
        toast.success("Vos modifications ont bien été prise en compte.");
      } else toast.warn("Veuillez verifier le format de votre image.");
    } catch (error) {
      toast.error("Une erreur est survenue..");
    }
  };

  useEffect(() => {
    avatar.current?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const fileTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

      if (fileTypes.includes(file.type))
         (document.querySelector(".profile .MuiAvatar-img").src =
          URL.createObjectURL(file));
      else toast.warn("Veuillez verifier le format de votre image.");
    });
  }, []);

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
        <h4 style={{ textAlign: "center" }}>
          {auth?.user?.email} <br /> {auth?.user?.firstname} <br />{" "}
          {auth?.user?.lastname}
        </h4>
      </section>
    </ThemeProvider>
  );
}

export default Profile;
