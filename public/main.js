    // main.js
    import { createModuleSelect, populateModuleSelect } from './scripts/modules/moduleSelect.js';
    import { createSearchInput, createSearchButton, createSearchResultsSection, handleSearch } from './scripts/search.js';
    import { createModuleConfig } from './scripts/modules/configureModules.js';
    import { fetchModules } from './scripts/modules/fetchModules.js'; // Import the shared function


    const appContainer = document.getElementById('music-search-app');

    // Modules Section
    const moduleSelect = createModuleSelect();
    appContainer.appendChild(moduleSelect);
    populateModuleSelect(moduleSelect);  // Populate the select


    fetchModules().then(modules => {  // Fetch modules for config
        const moduleConfig = createModuleConfig(modules);
        appContainer.appendChild(moduleConfig); // Append the config area
    });



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
