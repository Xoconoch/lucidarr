    // main.js
    import { createModuleSelect, populateModuleSelect } from './modules/moduleSelect.js';
    import { createSearchInput, createSearchButton, createSearchResultsSection, handleSearch } from './search/search.js';

    const appContainer = document.getElementById('music-search-app');

    // Modules Section
    const moduleSelect = createModuleSelect();
    appContainer.appendChild(moduleSelect);
    populateModuleSelect(moduleSelect);  // Populate the select


    // Search Section (unchanged)
    const searchInput = createSearchInput();
    const searchButton = createSearchButton();

    const searchResultsSection = createSearchResultsSection();
    const searchResultsContainer = document.createElement('div'); 
    searchResultsContainer.id = 'searchResultsContainer'; 

    searchResultsContainer.appendChild(searchResultsSection.albumResults);
    searchResultsContainer.appendChild(searchResultsSection.artistResults);
    searchResultsContainer.appendChild(searchResultsSection.trackResults);

    appContainer.appendChild(searchInput); 
    appContainer.appendChild(searchButton); 
    appContainer.appendChild(searchResultsContainer);  

    searchButton.addEventListener('click', () => {
        handleSearch(moduleSelect, searchInput, searchResultsSection);
    });
