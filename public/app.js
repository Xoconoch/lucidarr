const moduleSelect = document.createElement('select');
moduleSelect.id = 'moduleSelect';

const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.id = 'searchInput';
searchInput.placeholder = 'Search...';

const searchButton = document.createElement('button');
searchButton.id = 'searchButton';
searchButton.textContent = 'Search';

const createDetailsList = (summaryText, id) => {
    const details = document.createElement('details');
    details.open = true;

    const summary = document.createElement('summary');
    summary.textContent = summaryText;

    const ul = document.createElement('ul');
    ul.id = id;

    details.appendChild(summary);
    details.appendChild(ul);
    return details;
};


const albumResults = createDetailsList('Albums', 'albumResults');
const artistResults = createDetailsList('Artists', 'artistResults');
const trackResults = createDetailsList('Tracks', 'trackResults');



const appContainer = document.getElementById('music-search-app');
appContainer.appendChild(moduleSelect);
appContainer.appendChild(searchInput);
appContainer.appendChild(searchButton);
appContainer.appendChild(albumResults);
appContainer.appendChild(artistResults);
appContainer.appendChild(trackResults);



// Fetch modules
fetch('/api/modules/check')
.then(response => response.json())
.then(modules => {
    for (const moduleId in modules.modules) {
        const module = modules.modules[moduleId];
        const option = document.createElement('option');
        option.value = moduleId;
        option.text = module.name;
        moduleSelect.appendChild(option);
    }
})
.catch(error => console.error('Error fetching modules:', error));

searchButton.addEventListener('click', () => {
    const moduleId = moduleSelect.value;
    const query = searchInput.value;
    const limit = 10;

    const searchUrl = `/api/search?moduleId=${moduleId}&query=${query}&limit=${limit}`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            // Clear previous results
            albumResults.querySelector('ul').innerHTML = '';
            artistResults.querySelector('ul').innerHTML = '';
            trackResults.querySelector('ul').innerHTML = '';

            const populateList = (category, container) => {
                data[category].forEach(item => {
                    const li = document.createElement('li');
                    const div = document.createElement('div'); // Container for item info

                    if (category === 'albums') {
                        const releaseYear = new Date(item.releaseDate).getFullYear();
                        const firstArtist = item.artists && item.artists.length ? item.artists[0].name : 'Unknown Artist';
                        const coverArt = item.coverArtwork.find(art => art.height === 256 && art.width === 256);
                        
                        const img = document.createElement('img');
                        img.src = coverArt ? coverArt.url : '';
                        img.alt = item.title + " Cover";
                        div.appendChild(img);

                        const title = document.createElement('p');
                        title.textContent = item.title;
                        title.style.fontWeight = "bold";
                        div.appendChild(title);

                        const details = document.createElement('p');
                        details.textContent = `${firstArtist} - ${item.trackCount} Tracks - ${releaseYear}`;
                        div.appendChild(details);


                    } else if (category === 'tracks') {
                        const trackArtist = item.artists && item.artists.length ? item.artists[0].name : 'Unknown Artist';
        
                        const coverArt = item.album && item.album.coverArtwork && item.album.coverArtwork.find(art => art.height === 256 && art.width === 256); // Find cover art in track's album object if available
                        if(coverArt){
                            const img = document.createElement('img');
                            img.src = coverArt.url;
                            img.alt = item.title + " Cover";
                            div.appendChild(img);
                        }
        
        
                        const title = document.createElement('p');
                        title.textContent = item.title;
                        title.style.fontWeight = "bold";
                        div.appendChild(title);
        
                        const artist = document.createElement('p');
                        artist.textContent = trackArtist;
                        div.appendChild(artist);


                    } else if (category === 'artists') {
                        const artistImage = item.pictures && item.pictures.find(pic => {
                            const dimensions = pic.split('/').pop().split('-')[0]; // Extract dimensions (e.g., 256x256)
                            return dimensions === '256x256'; // Find if there is any 256 x 256 image present for the current artist.
                        });
        
        
        
                       if (artistImage) {
                            const img = document.createElement('img');
                            img.src = artistImage;
                            img.alt = item.name + " Picture";
                            div.appendChild(img);
                        }
        
                        const name = document.createElement('p'); // Create a <p> for the artist's name
                        name.textContent = item.name;
                        name.style.fontWeight = "bold";
                        div.appendChild(name);
        
        
                    }
        

                    li.appendChild(div); // Append the div to the li
                    container.appendChild(li);
                });
            };

            populateList('albums', albumResults.querySelector('ul'));
            populateList('artists', artistResults.querySelector('ul'));
            populateList('tracks', trackResults.querySelector('ul'));

        })
        .catch(error => console.error('Error fetching search results:', error));
});

