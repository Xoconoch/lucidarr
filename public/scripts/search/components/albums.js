import { createImage, createParagraph } from './helpers.js';

export const handleAlbums = (item, div) => {
    const releaseYear = new Date(item.releaseDate).getFullYear();
    const firstArtist = item.artists && item.artists.length ? item.artists[0].name : 'Unknown Artist';

    // Get the first image from the array
    const firstCoverArt = item.coverArtwork && item.coverArtwork.length ? item.coverArtwork[0] : null;

    if (firstCoverArt) {
        // Create the image and apply a 128x128 size using CSS
        const img = createImage(firstCoverArt.url, `${item.title} Cover`);
        img.style.width = '128px'; // Set width to 128px
        img.style.height = '128px'; // Set height to 128px
        img.style.objectFit = 'cover'; // Ensure it is cropped correctly
        div.appendChild(img);
    }

    div.appendChild(createParagraph(item.title, 'bold'));
    div.appendChild(createParagraph(`${firstArtist} - ${item.trackCount} Tracks - ${releaseYear}`));
};
