import { handleAlbums } from './albums.js';
import { handleTracks } from './tracks.js';
import { handleArtists } from './artists.js';
import { downloadItem } from '../../download/downloadItem.js';

export const populateList = (category, container, moduleId, data) => {
    data[category].forEach(item => {
        const li = document.createElement('li');
        const div = document.createElement('div');
        const itemUrl = item.url; 
        const itemType = category.slice(0, -1); // Remove trailing "s" from category for item type

        // Call appropriate handler based on category
        if (category === 'albums') {
            handleAlbums(item, div);
        } else if (category === 'tracks') {
            handleTracks(item, div);
        } else if (category === 'artists') {
            handleArtists(item, div);
        }

        // Create download button
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.style.display = 'inline-block'; // Ensure button is visible

        // Attach click event for downloading
        downloadButton.addEventListener('click', () => {
            downloadItem(moduleId, itemUrl, itemType, li);
        });

        // Append the button to the item's container
        div.appendChild(downloadButton);
        li.appendChild(div);
        container.appendChild(li);
    });
};
