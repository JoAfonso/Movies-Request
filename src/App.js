import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from './components/AddMovie'
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchMoviesHandler = useCallback(() => {
    setIsLoading(true);
    setError(null);
    fetch("https://http-request-star-wars-default-rtdb.firebaseio.com/movies.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        return response.json();
      })
      .then(data => {
        const loadedMovies = [];
        for (const key in data) {
          loadedMovies.push({
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate
          })
        }
        setMovies(loadedMovies);
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [])
  
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);
  
  function addMovieHandler(movie) {
    fetch("https://http-request-star-wars-default-rtdb.firebaseio.com/movies.json", {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  }
  let content = <p>Found no Movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <>
    <section>
      <AddMovie onAddMovie={addMovieHandler}/>
    </section>
      <section>
        <button onClick={fetchMoviesHandler}>Update List</button>
      </section>
      <section>{content}</section>
    </>
  );
}

export default App;
