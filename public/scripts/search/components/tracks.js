import { createImage, createParagraph } from './helpers.js';

export const handleTracks = (item, div) => {
    const trackArtist = item.artists && item.artists.length ? item.artists[0].name : 'Unknown Artist';

    // Find the largest coverArtwork based on width from the album's coverArtwork array
    const largestCoverArt = item.album?.coverArtwork && item.album.coverArtwork.length
        ? item.album.coverArtwork.reduce((largest, current) => {
            return current.width > largest.width ? current : largest;
        })
        : null;

    if (largestCoverArt) {
        const img = createImage(largestCoverArt.url, `${item.title} Cover`);
        img.style.width = '128px'; // Set width to 128px
        img.style.height = '128px'; // Set height to 128px
        img.style.objectFit = 'cover'; // Ensure it is cropped correctly
        div.appendChild(img);
    }

    div.appendChild(createParagraph(item.title, 'bold'));
    div.appendChild(createParagraph(trackArtist));
};
