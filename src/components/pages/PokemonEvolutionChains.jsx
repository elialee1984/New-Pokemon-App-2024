import React, { useState, useEffect } from "react";

import "../../App.css";

import Pokemon from "./Pokemon";

const PokemonEvolutionChains = ({ pokemons }) => {
  const [stageOne, setStageOne] = useState(null);
  const [stageOneId, setStageOneId] = useState(null);
  const [stageTwo, setStageTwo] = useState(Array(10).fill(null));
  const [stageTwoId, setStageTwoId] = useState(Array(10).fill(null));
  const [stageThree, setStageThree] = useState(Array(10).fill(null));
  const [stageThreeId, setStageThreeId] = useState(Array(10).fill(null));
  const [stageMega, setStageMega] = useState(null);
  const [stageFusion, setStageFusion] = useState(null);

  const [pokemonStatuses, setPokemonStatuses] = useState({});

  const [chainId, setChainId] = useState(1);
  // const [pokemonId, setPokemonId] = useState(null);
  const [error, setError] = useState(null);

  // const pokemonId = pokemons.map((pokemon) => {
  //   pokemon.url.split("/")[pokemons.url.split("/").length - 2];
  // });

  useEffect(() => {
    const fetchPokemonStatuses = async () => {
      const statuses = {};
      for (const pokemon of pokemons) {
        const pokemonId =
          pokemon.url.split("/")[pokemon.url.split("/").length - 2];
        const data = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
        );
        const response = await data.json();
        if (response.is_legendary) {
          statuses[pokemonId] = "LEGENDARY";
        } else if (response.is_mythical) {
          statuses[pokemonId] = "MYTHICAL";
        } else if (response.is_baby) {
          statuses[pokemonId] = "BABY";
        }
      }
      setPokemonStatuses(statuses);
    };

    fetchPokemonStatuses();
  }, [pokemons]);

  useEffect(() => {
    const getPokemonEvolutionChain = async () => {
      try {
        const data = await fetch(
          `https://pokeapi.co/api/v2/evolution-chain/${chainId}/`
        );
        if (!data.ok) {
          throw new Error(`HTTP error! status: ${data.status}`);
        }
        const response = await data.json();
        // if (!response.chain.species.name) {
        //   throw new Error("No stage one evolution found");
        // }

        setStageOne(response.chain.species.name);
        setStageOneId(
          response.chain.species.url.split("/")[
            response.chain.species.url.split("/").length - 2
          ]
        );
        let newStageTwo = [];
        let newStageTwoId = [];
        let newStageThree = [];
        let newStageThreeId = [];
        for (let i = 0; i < response.chain.evolves_to.length; i++) {
          newStageTwo[i] = response.chain.evolves_to[i]?.species.name || [];
          newStageTwoId[i] =
            response.chain.evolves_to[i]?.species.url.split("/")[
              response.chain.evolves_to[i]?.species.url.split("/").length - 2
            ] || [];
          if (response.chain.evolves_to[i]?.evolves_to) {
            for (
              let j = 0;
              j < response.chain.evolves_to[i].evolves_to.length;
              j++
            ) {
              newStageThree.push(
                response.chain.evolves_to[i].evolves_to[j]?.species.name || []
              );
              newStageThreeId.push(
                response.chain.evolves_to[i].evolves_to[j]?.species.url.split(
                  "/"
                )[
                  response.chain.evolves_to[i].evolves_to[j]?.species.url.split(
                    "/"
                  ).length - 2
                ] || []
              );
            }
          }
        }
        setStageTwo(newStageTwo);
        setStageTwoId(newStageTwoId);
        setStageThree(newStageThree);
        setStageThreeId(newStageThreeId);
      } catch (error) {
        window.alert(`No evolution family with this ID (${chainId}).`);
        console.error(error);
      }
    };

    getPokemonEvolutionChain();
  }, [chainId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      className="pokemonGrid"
    >
      <h1>PokemonEvolutionChains</h1>
      <div
        style={{
          display: "flex",
          marginBottom: "20px",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <button
          onClick={() => setChainId(chainId > 100 ? chainId - 100 : 1)}
          style={{ fontSize: "50px" }}
        >
          ---
        </button>
        <button
          onClick={() => setChainId(chainId > 10 ? chainId - 10 : 1)}
          style={{ fontSize: "50px" }}
        >
          --
        </button>
        <button
          onClick={() => setChainId(chainId > 1 ? chainId - 1 : 1)}
          style={{ fontSize: "50px" }}
        >
          -
        </button>
        <p style={{ fontSize: "25px" }}>
          Evolution Family {chainId}:<br />
          {stageOne && stageOne.charAt(0).toUpperCase() + stageOne.slice(1)}
        </p>
        <button
          onClick={() => setChainId(chainId < 549 ? chainId + 1 : 549)}
          style={{ fontSize: "50px" }}
        >
          +
        </button>
        <button
          onClick={() => setChainId(chainId < 540 ? chainId + 10 : 549)}
          style={{ fontSize: "50px" }}
        >
          ++
        </button>
        <button
          onClick={() => setChainId(chainId < 450 ? chainId + 100 : 549)}
          style={{ fontSize: "50px" }}
        >
          +++
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          Stage 1:<span>&nbsp;</span>
          {stageOne && (
            <Pokemon
              pokemonId={stageOneId}
              status={pokemonStatuses[stageOneId]}
            />
          )}
        </div>

        {stageTwo[0] && (
          <div>
            {stageTwo.map((stageTwoMon, index) => {
              return (
                <div key={index}>
                  Stage 2:<span>&nbsp;</span>
                  <Pokemon
                    pokemonId={stageTwoId[index]}
                    status={pokemonStatuses[stageTwoId[index]]}
                  />
                </div>
              );
            })}
          </div>
        )}
        {stageThree[0] && (
          <div>
            {stageThree.map((stageThreeMon, index) => {
              return (
                <div key={index}>
                  Stage 3:<span>&nbsp;</span>
                  <Pokemon
                    pokemonId={stageThreeId[index]}
                    status={pokemonStatuses[stageThreeId[index]]}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export { PokemonEvolutionChains };
