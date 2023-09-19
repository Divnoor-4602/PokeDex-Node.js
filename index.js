import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { name } from "ejs";

// creating an express app
const app = express();
const port = 3000;
const API_URL = "https://pokeapi.co/api/v2/pokemon/";

let count = 1;

app.set("view engine", "ejs");
// serving static files in ejs through the public folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, (req, res) => {
  console.log(`Listening at ${port}`);
});

// get the home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// fetching pokemon details from the api according to the search of the user
app.post("/pokemon", async (req, res) => {
  let movelist = [];
  let abilityList = [];
  let typeList = [];
  let stats = {};
  let sprites = {};
  // making a request with the pokemon name to the api
  let response = await axios.get(API_URL + `${req.body["pokemon-name"]}`);
  let pokeResponse = response.data;
  // extracting all information and putting it as an object
  pokeResponse["abilities"].forEach((ability) => {
    abilityList.push(ability["ability"]["name"]);
  });

  pokeResponse["moves"].forEach((move) => {
    movelist.push(move["move"]["name"]);
  });

  pokeResponse["types"].forEach((type) => {
    typeList.push(type["type"]["name"]);
  });

  pokeResponse["stats"].forEach((individualStat) => {
    stats[count] = {
      [individualStat["stat"]["name"]]: individualStat["base_stat"],
    };
    count += 1;
    console.log(count);
  });
});

// todo: the server sends back the information and communicates with the api
