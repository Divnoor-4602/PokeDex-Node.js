import express, { response } from "express";
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

//todo: make a home page with all the pokemon in the game
//todo: When a pokemon is clicked render a specific page showing all the details of the pokemon

// get the home page
app.get("/", async (req, res) => {
  let pokemonImage = [];
  let pokemonName = [];
  // all pokemon rendering
  let response = await axios.get(API_URL, {
    params: {
      limit: 10,
    },
  });
  let pokemonToDisplay = response.data.results;
  pokemonToDisplay.forEach((element) => {
    pokemonName.push(element["name"]);
  });

  for (let i = 0; i < pokemonToDisplay.length; i++) {
    let imageReqUrl = pokemonToDisplay[0]["url"];
    let imageResponse = await axios.get(imageReqUrl);
    pokemonImage.push(
      imageResponse.data["sprites"]["other"]["dream_world"]["front_default"]
    );
  }
  res.render("index.ejs", { pokemonList: pokemonName, images: pokemonImage });
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
  });
  count = 1;

  // fetching image
  let pokeSprite =
    pokeResponse["sprites"]["other"]["dream_world"]["front_default"];

  console.log(pokeSprite);
});
