## Installation

- Git clone this [project](https://github.com/WildCodeSchool-2024-02/js-paris-workshop-fileUpload)
- Run `npm install`
- Setup your .env file in both `server` and `client` folder
- Run `npm run db:migrate`
- Run `npm run dev:server`

## Your mission

The objective of this workshop is to set up file upload within an application developed with Harmonia (express, react) using the multer library

## Server configuration

### Install multer dependency

Run the following command to install the multer library into the `server` folder :

```bash
npm install multer
```

### public folder setup

In your `config.js` file uncomment the following lines :

- path require

```js
const path = require("path");
```

- public folder path

```js
const publicFolderPath = path.join(__dirname, "/../public");

app.get("*.*", express.static(publicFolderPath, { maxAge: "1y" }));
```

This configuration allows us to give public access to the file specified in the public folder
{:.alert-info}

## Server implementation

### fileUpload middleware service

- In your `app/service` folder declare a new file named `fileUpload.js`
- Import multer :
```js
const multer = require('multer');
```
- Define storage setup : 
```js
const storage = multer.diskStorage({
  destination: "define where the files will be stored",
  filename: "define how the file will be named",
});
```
- Setup file destination :
```js
const storage = multer.diskStorage({
  destination: path.join(__dirname, "/../../public/upload/"),
  filename: "define how the file will be named",
});
```

Here we use the `path.join` method to define the path to the upload folder via the `__dirname` variable to generate a relative path, this allows us to ensure that the path is valid regardless of the operating system
{:.alert-info}

- Setup filename generation : 
```js
const storage = multer.diskStorage({
  destination: path.join(__dirname, "/../../public/upload/"),
  filename: (_, file, cb) => {
    const fileTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (fileTypes.includes(file.mimetype))
      cb(null, `${Date.now()}-${file.originalname}`);
    else cb(new Error("Invalid file type."));
  },
});
```

Here we first validate the type of file sent to us to only accept images, then if the file type matches we generate a random file name to avoid duplicates
{:.alert-info}

- Export multer middleware using the storage defined before : 
```js
module.exports = multer({ storage });
```

### Update user routes

Now we gonna implement a put route on the user module to allow us to update the user avatar or other informations

- Add a update method into your `AbstractRepository` : 
```js
update(body, id) {
  return this.database.query(`UPDATE ${this.table} SET ? WHERE id = ?`, 
  [ body, id ]);
}
```
- Add a edit method into your `userActions` :
```js
const edit = async (req, res, next) => {
  try {
    // we gonna handle the file uploaded by our fileUpload middleware here
    const [result] = await tables.user.update(req.body, req.auth.id);
    if (result.affectedRows > 0) {
      const [[user]] = await tables.user.read(req.auth.id);
      res.status(200).json(user);
    }
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
}
```
- Update your edit method to manage the downloaded file :
```js
const uploadDest = `${process.env.APP_HOST}/upload/`;
if (req.file) req.body.avatar = uploadDest + req.file.filename;
```
- Add a `put` route on `users/router.js` :
```js
router.put("/", edit);
```
- Implement isAuth & fileUpload middlewares on your route :
```js
router.put("/", isAuth, fileUpload.single("avatar"), edit);
```

It is important to call our authentication middleware beforehand because it allows us to identify the user making the request and retrieve their ID via the token to use it in our SQL query
{:.alert-info}

Our fileUpload middleware provides us with several methods, the `single` method used here allows us to set up the upload of a single file by specifying as a parameter of our method the identifier under which we will send the file in the body of the request
{:.alert-info}

## Client implementation

### Sending file to your api

For this step part of the code has already been put in place in the `Profile.jsx` page component, it allows us to set up the selection of the file by the user and to store it in a variable

- In the `handleSubmit` method generate a new formData :
```js
const form = new FormData();
```
- Append the selected file on your formData :
```js
form.append("avatar", avatar.current.files[0]);
```
- Fetch the user `put` route defined before :
```js
try {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
    method: "PUT",
    body: form,
    headers: { Authorization: `Bearer ${auth.token}` },
  });
 } catch (error) {
   toast.error("Une erreur est survenue..");
}
```
- If the response is ok update the auth context with the updated user informations and send a success message : 
```js
if (response.ok) {
  const user = await response.json();
  setAuth((prevState) => ({ ...prevState, user }));
  toast.success("Vos modifications ont bien été prise en compte.");
}
```
- Otherwise, send a warning message : 
```js
else toast.warn("Veuillez verifier le format de votre image.");
```

## Final words

We have just set up the file upload within our Harmonia application, in the example used here we manage the upload of a file when updating a user's information but we can just as easily handle this when creating a new user or any other entity.
