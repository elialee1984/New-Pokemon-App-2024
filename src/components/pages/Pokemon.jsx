import React, { useState, useEffect } from "react";
import "../../App.css";

const Pokemon = ({ pokemonId, status }) => {
  const [pokemonName, setPokemonName] = useState(null);
  const [names, setNames] = useState([]);

  // get the sprites, types as well as status (legendary, mythical)
  const [pkmnSpr, setPkmnSpr] = useState(null);
  const [pkmnTyp1, setPkmnTyp1] = useState(null);
  const [pkmnTyp2, setPkmnTyp2] = useState(null);
  const [pkmnStatus, setPkmnStatus] = useState(null);
  const [pkmnVariety, setPkmnVariety] = useState(Array(10).fill(null));

  useEffect(() => {
    const getSinglePokemon = async () => {
      const data = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      const response = await data.json();

      setPkmnSpr(response.sprites.other["official-artwork"].front_default);
      setPkmnTyp1(
        response.types[0].type.name
          .split("")
          .map((char, index) => (index === 0 ? char.toUpperCase() : char))
          .join("")
      );
      setPkmnTyp2(null);
      if (response.types[1]) {
        setPkmnTyp2(
          response.types[1].type.name
            .split("")
            .map((char, index) => (index === 0 ? char.toUpperCase() : char))
            .join("")
        );
      }

      const dataSpecies = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
      );
      const responseSpecies = await dataSpecies.json();

      setNames(responseSpecies.names);
    };

    getSinglePokemon();
    setPkmnStatus(status);
  }, [pokemonId]);

  useEffect(() => {
    const fetchEnglishName = async () => {
      const pkmnEnglishName = names.find(
        (nameObject) => nameObject.language.name === "en"
      );

      if (pkmnEnglishName) {
        setPokemonName(pkmnEnglishName.name);
      }
    };

    fetchEnglishName();
  }, [names]);

  const statusColors = {
    BABY: "pink",
    LEGENDARY: "orange",
    MYTHICAL: "turquoise",
  };

  const typeResult = () => {
    if (!pkmnTyp2) {
      return `${pkmnTyp1}`;
    } else {
      return `${pkmnTyp1} / ${pkmnTyp2}`;
    }
  };

  if (!pkmnSpr) {
    return (
      <div className="pokemonCard">
        <p style={{ fontWeight: "bold" }}>
          {pokemonId}. {pokemonName}
        </p>
        <img
          style={{ backgroundColor: "transparent", border: "1px solid grey" }}
          src="https://via.placeholder.com/150/000000?text=?"
          alt="Placeholder"
          className="sprite"
        />
        <p className="type">{typeResult()}</p>
        <p
          className="status"
          style={{
            color: statusColors[pkmnStatus] || "white",
          }}
        >
          {pkmnStatus}
        </p>
      </div>
    );
  }

  return (
    <div className="pokemonCard">
      <p style={{ fontWeight: "bold" }}>
        {pokemonId}. {pokemonName}
      </p>
      <img src={pkmnSpr} alt={`${pokemonName}`} className="sprite" />
      <p className="type">{typeResult()}</p>
      <p
        className="status"
        style={{
          color: statusColors[pkmnStatus] || "white",
        }}
      >
        {pkmnStatus}
      </p>
    </div>
  );
};

export default Pokemon;
