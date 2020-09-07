import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useCookies } from 'react-cookie';

function MovieDetails(props) {
  const mov = props.movie;

  const [highlighted, setHighlighted] = useState(-1);
  const [token] = useCookies(['movieapp-token']);

  const highlightRate = (highlight) => (event) => {
    setHighlighted(highlight);
  };

  const rateClicked = (rate) => (event) => {
    fetch(`http://127.0.0.1:8000/api/movies/${mov.id}/rate_movie/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token['movieapp-token']}`,
      },
      body: JSON.stringify({ stars: rate + 1 }),
    })
      .then((resp) => resp.json())
      .then((resp) => getDetails())
      .catch((err) => console.log(err));
  };

  const getDetails = () => {
    fetch(`http://127.0.0.1:8000/api/movies/${mov.id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token['movieapp-token']}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => props.updateMovie(resp))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {mov ? (
        <div>
          <h1>{mov.title}</h1>
          <p>{mov.year}</p>
          <p>{mov.rated}</p>
          <p>{mov.director}</p>
          <p>{mov.genre}</p>
          <p>{mov.plot}</p>
          <p>{mov.released_on}</p>
          <FontAwesomeIcon
            icon={faStar}
            className={mov.avg_rating > 0 ? 'orange' : ''}
          />
          <FontAwesomeIcon
            icon={faStar}
            className={mov.avg_rating > 1 ? 'orange' : ''}
          />
          <FontAwesomeIcon
            icon={faStar}
            className={mov.avg_rating > 2 ? 'orange' : ''}
          />
          <FontAwesomeIcon
            icon={faStar}
            className={mov.avg_rating > 3 ? 'orange' : ''}
          />
          <FontAwesomeIcon
            icon={faStar}
            className={mov.avg_rating > 4 ? 'orange' : ''}
          />
          ({mov.no_of_ratings})
          <div className="rate-container">
            <h2>Rate It</h2>
            {[...Array(5)].map((ele, index) => {
              return (
                <FontAwesomeIcon
                  key={index}
                  icon={faStar}
                  className={highlighted > index - 1 ? 'purple' : ''}
                  onMouseEnter={highlightRate(index)}
                  onMouseLeave={highlightRate(-1)}
                  onClick={rateClicked(index)}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MovieDetails;
