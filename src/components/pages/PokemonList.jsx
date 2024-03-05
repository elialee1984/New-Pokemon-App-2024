// PokemonList.jsx
import { useState, useEffect } from "react";
import Pokemon from "./Pokemon";
import "../../App.css";

const PokemonList = ({ pokemons }) => {
  const [pokemonStatuses, setPokemonStatuses] = useState({});

  /********************************************************/
  /********* P * A * G * I * N * A * T * I * O * N ********/
  /********************************************************/
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [pokemonPerPage, setPokemonPerPage] = useState(156);
  const [sortOption, setSortOption] = useState("pokemonIdAsc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateTotalPages = (totalPokemon) => {
    setTotalPages(Math.ceil(totalPokemon / pokemonPerPage));
  };

  const handlePokemonPerPageChange = (event) => {
    setPokemonPerPage(parseInt(event.target.value, 10));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleManualPageChange = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setPageInput("");
    }
  };
  const renderPokemonForCurrentPage = () => {
    const startIndex = (currentPage - 1) * pokemonPerPage;
    const endIndex = startIndex + pokemonPerPage;
    return pokemons.slice(startIndex, endIndex);
  };

  useEffect(() => {
    calculateTotalPages(pokemons.length);
  }, [pokemons, pokemonPerPage]);
  /*********************************************************/
  /*********************************************************/
  /*********************************************************/
  /*********************************************************/
  /*********************************************************/
  /******* P * A * G * I * N * A * T * I * O * N END *******/
  /*********************************************************/
  /*********************************************************/
  /*********************************************************/
  /*********************************************************/
  /*********************************************************/

  /**************************************************************/
  /************ F * I * L * T * E * R * I * N * G ***************/
  /**************************************************************/

  const [filterOptions, setFilterOptions] = useState({
    "Gen 1": false,
    "Gen 2": false,
    "Gen 3": false,
    "Gen 4": false,
    "Gen 5": false,
    "Gen 6": false,
    "Gen 7": false,
    "Gen 8": false,
    "Gen 9": false,
    Baby: false,
    Legendary: false,
    Mythical: false,
  });

  const generations = [
    { id: "Gen 1", name: "Kanto" },
    { id: "Gen 2", name: "Johto" },
    { id: "Gen 3", name: "Hoenn" },
    { id: "Gen 4", name: "Sinnoh" },
    { id: "Gen 5", name: "Unova" },
    { id: "Gen 6", name: "Kalos" },
    { id: "Gen 7", name: "Alola" },
    { id: "Gen 8", name: "Galar" },
    { id: "Gen 9", name: "Paldea" },
  ];

  const genRanges = {
    "Gen 1": [1, 151],
    "Gen 2": [152, 251],
    "Gen 3": [252, 386],
    "Gen 4": [387, 493],
    "Gen 5": [494, 649],
    "Gen 6": [650, 721],
    "Gen 7": [722, 809],
    "Gen 8": [810, 905],
    "Gen 9": [906, 1025],
  };

  const handleFilterChange = (event) => {
    setFilterOptions({
      ...filterOptions,
      [event.target.value]: event.target.checked,
    });
  };

  /********** F * I * L * T * E * R * I * N * G END *************/

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

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

        let filteredPokemon = response.results.filter((pokemon) => {
          const pokemonId = parseInt(
            pokemon.url.split("/")[pokemon.url.split("/").length - 2]
          );
          const isAnyFilterApplied = Object.values(filterOptions).some(
            (isChecked) => isChecked
          );
          if (!isAnyFilterApplied) {
            return true;
          }
          return Object.entries(filterOptions).some(([filter, isChecked]) => {
            if (isChecked) {
              if (filter === "Baby") {
                return pokemonStatuses[pokemonId] === "BABY";
              }
              if (filter === "Legendary") {
                return pokemonStatuses[pokemonId] === "LEGENDARY";
              }
              if (filter === "Mythical") {
                return pokemonStatuses[pokemonId] === "MYTHICAL";
              } else {
                const [start, end] = genRanges[filter];
                return pokemonId >= start && pokemonId <= end;
              }
            }
            return false;
          });
        });

        let sortedPokemon;
        switch (sortOption) {
          case "pokemonIdAsc":
            sortedPokemon = filteredPokemon.sort((a, b) => {
              const aId = parseInt(
                a.url.split("/")[a.url.split("/").length - 2]
              );
              const bId = parseInt(
                b.url.split("/")[b.url.split("/").length - 2]
              );
              return aId - bId;
            });
            break;
          case "pokemonIdDesc":
            sortedPokemon = filteredPokemon.sort((a, b) => {
              const aId = parseInt(
                a.url.split("/")[a.url.split("/").length - 2]
              );
              const bId = parseInt(
                b.url.split("/")[b.url.split("/").length - 2]
              );
              return bId - aId;
            });
            break;
          case "alphabeticalAsc":
            sortedPokemon = filteredPokemon.sort((a, b) =>
              a.name > b.name ? 1 : -1
            );
            break;
          case "alphabeticalDesc":
            sortedPokemon = filteredPokemon.sort((a, b) =>
              a.name < b.name ? 1 : -1
            );
            break;
          default:
            sortedPokemon = filteredPokemon;
            break;
        }

        calculateTotalPages(sortedPokemon.length);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    getPokemon();
  }, [sortOption, filterOptions]);

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

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div className="filter">
        <div>
          <label>Filter by generations: </label>

          <div className="regionFilter">
            {generations.map((gen) => (
              <div key={gen.id}>
                <label
                  htmlFor={gen.id}
                  style={{
                    cursor: "pointer",
                    backgroundColor: filterOptions[gen.id]
                      ? "brown"
                      : "transparent",
                    borderRadius: "10px",
                    padding: "5px",
                  }}
                >
                  <input
                    type="checkbox"
                    id={gen.id}
                    name="filter"
                    value={gen.id}
                    checked={filterOptions[gen.id]}
                    onChange={handleFilterChange}
                    style={{ display: "none" }}
                  />
                  <span style={{}}>{`${gen.id} - ${gen.name}`}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label>Special groups:</label>
        <div className="groupFilter">
          <label
            htmlFor="Baby"
            style={{
              cursor: "pointer",
              borderRadius: "10px",
              padding: "5px",
            }}
          >
            <input
              type="checkbox"
              id="Baby"
              name="filter"
              value="Baby"
              checked={filterOptions["Baby"]}
              onChange={handleFilterChange}
              style={{ display: "none" }}
            />
            Baby Pokemon
          </label>
        </div>
        <div className="groupFilter">
          <label
            htmlFor="Legendary"
            style={{
              cursor: "pointer",
              borderRadius: "10px",
              padding: "5px",
            }}
          >
            <input
              type="checkbox"
              id="Legendary"
              name="filter"
              value="Legendary"
              checked={filterOptions["Legendary"]}
              onChange={handleFilterChange}
              style={{ display: "none" }}
            />
            Legendary Pokemon
          </label>
        </div>
        <div className="groupFilter">
          <label
            htmlFor="Mythical"
            style={{
              cursor: "pointer",
              borderRadius: "10px",
              padding: "5px",
            }}
          >
            <input
              type="checkbox"
              id="Mythical"
              name="filter"
              value="Mythical"
              checked={filterOptions["Mythical"]}
              onChange={handleFilterChange}
              style={{ display: "none" }}
            />
            Mythical Pokemon
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="pokemonIdAsc">ID Ascending</option>
          <option value="pokemonIdDesc">ID Descending</option>
          <option value="alphabeticalAsc">Alphabetical Ascending</option>
        </select>
      </div>
      <div>
        <label htmlFor="pokemonPerPage">Pokemon per page: </label>
        <select
          id="pokemonPerPage"
          value={pokemonPerPage}
          onChange={handlePokemonPerPageChange}
        >
          <option value="" disabled>
            -- Chose number or Pkmn displayed --
          </option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="156">156</option>
        </select>
      </div>
      <ol className="pokemonGrid">
        {renderPokemonForCurrentPage().map((pokemon) => {
          const pokemonId =
            pokemon.url.split("/")[pokemon.url.split("/").length - 2];
          return (
            <Pokemon
              key={pokemon.name}
              pokemonId={pokemonId}
              status={pokemonStatuses[pokemonId]}
            />
          );
        })}
      </ol>
    </div>
  );
};

export { PokemonList };
