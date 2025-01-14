import { populateList } from './search/populateList.js';

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

export const createSearchInput = () => {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchInput';
    searchInput.placeholder = 'Search...';
    return searchInput;
};

export const createSearchButton = () => {
    const searchButton = document.createElement('button');
    searchButton.id = 'searchButton';
    searchButton.textContent = 'Search';
    return searchButton;
};

export const createSearchResultsSection = () => {
    return {
        albumResults: createDetailsList('Albums', 'albumResults'),
        artistResults: createDetailsList('Artists', 'artistResults'),
        trackResults: createDetailsList('Tracks', 'trackResults')
    };
};

export const handleSearch = (moduleSelect, searchInput, searchResultsSection) => {
    const moduleId = moduleSelect.value;
    const query = searchInput.value;
    const limit = 10;
    const searchUrl = `/api/search?moduleId=${moduleId}&query=${query}&limit=${limit}`;

    fetch(searchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Limpia las listas actuales antes de renderizar nuevos resultados
            searchResultsSection.albumResults.querySelector('ul').innerHTML = '';
            searchResultsSection.artistResults.querySelector('ul').innerHTML = '';
            searchResultsSection.trackResults.querySelector('ul').innerHTML = '';

            // Poblar las listas con los nuevos datos
            populateList('albums', searchResultsSection.albumResults.querySelector('ul'), moduleId, data);
            populateList('artists', searchResultsSection.artistResults.querySelector('ul'), moduleId, data);
            populateList('tracks', searchResultsSection.trackResults.querySelector('ul'), moduleId, data);
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
};
