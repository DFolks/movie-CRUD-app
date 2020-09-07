import React, { useState, useEffect } from 'react';
import './App.css';
import MovieList from './Components/movie-list';
import MovieDetails from './Components/movie-details';
import MovieForm from './Components/movie-form';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editedMovie, setEditMovie] = useState(null);
  const [token, removeCookie] = useCookies(['movieapp-token']);

  useEffect(() => {
    console.log(token);
    if (token['movieapp-token'] === undefined || !token['movieapp-token'])
      window.location.href = '/';
  }, [token]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/movies/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token['movieapp-token']}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => setMovies(resp))
      .catch((err) => console.log(err));
  }, []);

  const loadMovie = (movie) => {
    setSelectedMovie(movie);
    setEditMovie(null);
  };

  const editClicked = (movie) => {
    setSelectedMovie(null);
    setEditMovie(movie);
  };

  const removeClicked = (movie) => {
    const newMovies = movies.filter((mov) => mov.id !== movie.id);
    setMovies(newMovies);
  };

  const updatedMovie = (movie) => {
    const newMovies = movies.map((mov) => {
      if (mov.id === movie.id) {
        return movie;
      }
      return mov;
    });
    setMovies(newMovies);
  };

  const newMovie = () => {
    setEditMovie({
      title: '',
      year: '',
      director: '',
      genre: '',
      rated: '',
      plot: '',
      released_on: '',
    });
    setSelectedMovie(null);
  };

  const logoutUser = () => {
    //deleteToken(['movieapp-token']);
    removeCookie(['movieapp-token']);
  };

  const movieCreated = (movie) => {
    const newMovies = [...movies, movie];
    setMovies(newMovies);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <FontAwesomeIcon icon={faFilm} />
          <span>Movie CRUD Application</span>
        </h1>
        <FontAwesomeIcon icon={faSignOutAlt} onClick={logoutUser} />
      </header>
      <div className="layout">
        <div>
          <MovieList
            movies={movies}
            movieClicked={loadMovie}
            editClicked={editClicked}
            removeClicked={removeClicked}
          />
          <button onClick={newMovie}>New Movie</button>
        </div>

        {editedMovie ? (
          <MovieForm
            movie={editedMovie}
            updatedMovie={updatedMovie}
            movieCreated={movieCreated}
          />
        ) : (
          <MovieDetails movie={selectedMovie} updateMovie={loadMovie} />
        )}
      </div>
    </div>
  );
}

export default App;
