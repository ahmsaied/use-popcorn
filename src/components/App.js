import { useState } from "react";

import { useMoviesFetch } from "../Hooks/useMoviesFetch";
import { useLocalStorageState } from "../Hooks/useLocalStorageState";

import NumResult from "./NumResult";
import NavBar from "./NavBar";
import Box from "./Box";
import ErrorMessage from "./ErrorMessage";
import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails";
import Loader from "./Loader";
import WatchedMoviesList from "./WatchedMoviesList";
import Search from "./Search";
import WatchedSummary from "./WatchedSummary";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMoviesFetch(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectedMovie(id) {
    setSelectedId((selected) => (id === selected ? null : id));
  }

  function handelCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <main className="main">
        <Box>
          {error && <ErrorMessage message={error} />}
          {isLoading && !error && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedId={handleSelectedMovie} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handelCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </main>
    </>
  );
}
