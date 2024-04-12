const anilistApi = 'https://graphql.anilist.co';
const queryPTS = `
  query {
    Page(page: 1, perPage: 20) {
      media(type: ANIME, sort: POPULARITY_DESC, seasonYear: 2024, season: WINTER) {
        id
        seasonYear
        episodes
        format
        startDate {
          year
          month
          day
        }
        status
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
const queryPopularity = `
  query {
    Page(page: 1, perPage: 20) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        id
        seasonYear
        format
        status
        status
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
const upcomingEpisodeQuery =`{
  Page(page: 1, perPage: 20) {
    airingSchedules(notYetAired: true, sort: TIME) {
      airingAt
      episode
      timeUntilAiring
      media {
        id
        title {
          romaji
          english
          userPreferred
          native
        }
        coverImage {
          extraLarge
        }
        seasonYear
      }
    }
  }
}
`;
document.addEventListener('DOMContentLoaded', function() {
  // Your fetch and data processing code here
fetchPopularThisSeason(queryPTS);
fetchPopularity(queryPopularity);
fetchUpcomingEpisode(upcomingEpisodeQuery);
});

function fetchPopularity(queryPopularity) {
  fetch(anilistApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      query: queryPopularity
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data); 
    const animelist = data.data.Page.media;
    
    animelist.forEach(anime => {
  const { coverImage, title, seasonYear, format } = anime;
  
  const results = `<li>
          <img class="pCover" src="${coverImage.extraLarge}">
          <img class="sCover" src="img/shadow.png">
          <i class="bx bx-play-circle"></i>
          <a href="#" class="title" title="${title.userPreferred}">${title.userPreferred}</a>
          <span class="type">${format}</span>
          <span class="year">${seasonYear}</span>
        </li>`;
  
  document.querySelector('ul.popular-list').insertAdjacentHTML('beforeend', results);
  });
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle errors here
  });
}

function fetchPopularThisSeason(queryPTS) {
  fetch(anilistApi, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    query: queryPTS
  })
})
.then(response => response.json())
.then(data => {
  console.log(data);
  const animeList = data.data.Page.media;

animeList.forEach(anime => {
  const { coverImage, title, format, status } = anime;
  
 const results = `<div class="items">
      <img class="cover" src="${coverImage.extraLarge}">
      <img class="shadow" src="img/shadow.png">
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
function fetchUpcomingEpisode(upcomingEpisodeQuery) {
  fetch(anilistApi, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    query: upcomingEpisodeQuery
  })
})
.then(response => response.json())
.then(data => {
  console.log(data);
  const animeList = data.data.Page.airingSchedules;
  
  let results = '';
  
animeList.forEach(anime => {
// Convert the adjusted timestamp to a human-readable date and time
      let dateObj = new Date(anime.airingAt * 1000);
      let month = dateObj.getMonth() + 1;
      let year = dateObj.getFullYear();
      let date = dateObj.getDate();
      let hour = dateObj.getHours() % 12 || 12;
      let minute = dateObj.getMinutes();
      let am_pm = hour >= 12 ? 'AM' : 'PM'
      // Convert the hour to a 2-digit string with a leading zero if necessary
     if (hour < 10) {
      hour = '0' + hour;
   }
   if (minute < 10) {
    minute = '0' + minute;
 }

      
let air = `${month}/${date}/${year} ${hour}:${minute} ${am_pm}`;
 results = `<div class="items">
      <img class="cover" src="${anime.media.coverImage.extraLarge}">
      <img class="shadow" src="img/shadow.png">
      <span class="episode-num">EP ${anime.episode}</span>
      <span class="time">${air} Japan Time</span>
      <a href="#" class="title" title="${anime.media.title.userPreferred}">${anime.media.title.userPreferred}</a>
    </div>`;
  document.querySelector('div.upcoming-episode-wrapper').insertAdjacentHTML('beforeend', results);
  });
})
.catch(error => {
  console.error('Error:', error);
  // Handle errors here
});
}