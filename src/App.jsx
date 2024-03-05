import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import { Home, PokemonList, PokemonEvolutionChains } from "./components/pages";

const App = () => {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const getPokemon = async () => {
      try {
        const data = await fetch(
          "https://pokeapi.co/api/v2/pokemon/?limit=1025&offset=0"
        );
        if (!data.ok) {
          throw new Error("Failed to fetch pokemon");
        }
        const response = await data.json();
        setPokemons(response.results);
      } catch (error) {
        console.error(error);
      }
    };
    getPokemon();
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/pokemon_list"
          element={<PokemonList pokemons={pokemons} />}
        />
        <Route
          path="/pokemon_evolution_chains"
          element={<PokemonEvolutionChains pokemons={pokemons} />}
        />
      </Routes>
    </div>
  );
};

export default App;
