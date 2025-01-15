import { createImage, createParagraph } from './helpers.js';

export const handleAlbums = (item, div) => {
    const releaseYear = new Date(item.releaseDate).getFullYear();
    const firstArtist = item.artists && item.artists.length ? item.artists[0].name : 'Unknown Artist';

    // Find the largest coverArtwork based on width
    const largestCoverArt = item.coverArtwork && item.coverArtwork.length 
        ? item.coverArtwork.reduce((largest, current) => {
            return current.width > largest.width ? current : largest;
        }) 
        : null;

    if (largestCoverArt) {
        // Create the image and apply a 128x128 size using CSS
        const img = createImage(largestCoverArt.url, `${item.title} Cover`);
        img.style.width = '128px'; // Set width to 128px
        img.style.height = '128px'; // Set height to 128px
        img.style.objectFit = 'cover'; // Ensure it is cropped correctly
        div.appendChild(img);
    }

    div.appendChild(createParagraph(item.title, 'bold'));
    div.appendChild(createParagraph(`${firstArtist} - ${item.trackCount || 'Unknown'} Tracks - ${releaseYear}`));
};
