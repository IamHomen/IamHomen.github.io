const anilistApi = 'https://graphql.anilist.co';
const movieQuery = `
 query {
  Page(page: 1, perPage: 20) {
    media(type: ANIME, sort: POPULARITY_DESC, format: MOVIE) {
      id
      seasonYear
      coverImage {
        extraLarge
      }
      title {
        romaji
        english
        userPreferred
      }
    }
  }
}
`;
const upcomingMovieQuery = `
 query {
  Page(page: 1, perPage: 20) {
    media(type: ANIME, sort: POPULARITY_DESC, format: MOVIE, status: NOT_YET_RELEASED) {
      id
      seasonYear
      coverImage {
        extraLarge
      }
      title {
        romaji
        english
        userPreferred
      }
    }
  }
}
`;
document.addEventListener('DOMContentLoaded', function() {
  // Your fetch and data processing code here
fetchMovies(movieQuery);
fetchUpcomingMovies(upcomingMovieQuery);
});
function fetchMovies(movieQuery) {
  fetch(anilistApi, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    query: movieQuery
  })
})
.then(response => response.json())
.then(data => {
  console.log(data);
  const animeList = data.data.Page.media;

animeList.forEach(anime => {
  const { coverImage, title, seasonYear } = anime;
  
 const results = `<div class="items">
      <img class="cover" src="${coverImage.extraLarge}">
      <img class="shadow" src="img/shadow.png">
      <span class="year">${seasonYear}</span>
      <a href="#" class="title" title="${title.userPreferred}">${title.userPreferred}</a>
    </div>`;
  document.querySelector('div.seasonal-wrapper').insertAdjacentHTML('beforeend', results);
  });
})
.catch(error => {
  console.error('Error:', error);
  // Handle errors here
});
}
function fetchUpcomingMovies(upcomingMovieQuery) {
  fetch(anilistApi, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    query: upcomingMovieQuery
  })
})
.then(response => response.json())
.then(data => {
  console.log(data);
  const animeList = data.data.Page.media;

animeList.forEach(anime => {
  const { coverImage, title, seasonYear } = anime;
  
 const results = `<div class="items">
      <img class="cover" src="${coverImage.extraLarge}">
      <img class="shadow" src="img/shadow.png">
      <span class="year">${seasonYear}</span>
      <a href="#" class="title" title="${title.userPreferred}">${title.userPreferred}</a>
    </div>`;
  document.querySelector('div.upcoming-movies-wrapper').insertAdjacentHTML('beforeend', results);
  });
})
.catch(error => {
  console.error('Error:', error);
  // Handle errors here
});
}