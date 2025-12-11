import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import multer from 'multer';
import methodOverride from 'method-override';
import { v4 as uuidv4 } from 'uuid';

const upload = multer({ dest: 'public/images' })
const app = express();
const port = 3000;
const tabPub = [];





const defaultAuteur = "Anonyme"
// const tabPub = [{title: "", auteur: "", contenu: ""}];

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

app.get("/", (req, res) => {
  res.render("index.ejs", {tab: tabPub});
});

app.get("/post/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/post/new", upload.single('formFile'), (req, res) => {
  const defaultImage = "defaultImagePortaitPost.png";
  const newId = uuidv4();
  let newName = defaultImage;
  if (!req.file) {
    newName = defaultImage;  
  } else {
    const oldPath = req.file.path;     // chemin actuel (ex: public/images/xxxxx.jpg)
    newName = 'new_image_' + newId + '.png'; // ton nouveau nom
    const newPath = 'public/images/' + newName;

    fs.rename(oldPath, newPath, (err) => {
      if (err) throw err;
    });
  }

  const titre = req.body["titrePub"];
  let auteur = req.body["auteurPub"];
  const imgFile = newName;
  const contenu = req.body["contenuPub"];
  const date = new Date().toLocaleString();

  if (auteur === "") {
    tabPub.push({id: newId, title: titre, auteur: defaultAuteur, dateCreation: date, image: imgFile, contenu: contenu});
  } else {
    tabPub.push({id: newId, title: titre, auteur: auteur, dateCreation: date, image: imgFile, contenu: contenu});
  }

  res.redirect("/post/new");
});

app.get("/post/id", (req, res) => {
  const id = req.query.id;
  tabPub.forEach((item, i) => {
    if (item.id === id) {
      res.render("show.ejs", {
        id: item.id,
        title: item.title,
        auteur: item.auteur,
        dateCreation: item.dateCreation,
        dateModif: item.dateUpdate,
        contenu: item.contenu,
        image: item.image,
      });
    };
  });
});

app.get("/post/id/edit", (req, res) => {
  const id = req.query.id;
  tabPub.forEach((item, i) => {
    if (item.id === id) {
      res.render("edit.ejs", {
        id: item.id,
        title: item.title,
        auteur: item.auteur,
        contenu: item.contenu,
      });
    };
  });
});

app.put("/post/id/edit", upload.single('formFile'), (req, res) => {
  const id = req.query.id;
  let defaultImage = "";
  let num;
  tabPub.forEach((item, i) => {
    if (item.id === id) {
      num = i;
      defaultImage = item.image;
    };
  });
  let newName = defaultImage;
  if (!req.file) {
    newName = defaultImage;  
  } else {
    const oldPath = req.file.path;     // chemin actuel (ex: public/images/xxxxx.jpg)
    newName = 'new_image_' + id + '.png'; // ton nouveau nom
    const newPath = 'public/images/' + newName;

    fs.rename(oldPath, newPath, (err) => {
      if (err) throw err;
    });
  }

  tabPub[num].title = req.body["titrePub"];
  tabPub[num].auteur = req.body["auteurPub"];
  tabPub[num].image = newName;
  tabPub[num].contenu = req.body["contenuPub"];
  tabPub[num].dateUpdate = new Date().toLocaleString();

  res.render("edit.ejs", {
    id: id,
    title: tabPub[num].title,
    auteur: tabPub[num].auteur,
    contenu: tabPub[num].contenu,
  });
});

app.delete("/post/id/delete", (req, res) => {
  const id = req.query.id;
  const index = tabPub.findIndex(item => item.id === id);
  tabPub.splice(index, 1);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Le serveur est ouvert sous le port ${port}`);
});