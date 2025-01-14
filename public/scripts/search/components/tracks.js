import { createImage, createParagraph } from './helpers.js';

export const handleTracks = (item, div) => {
    const trackArtist = item.artists && item.artists.length ? item.artists[0].name : 'Unknown Artist';
    const coverArt = item.album?.coverArtwork?.find(art => art.height === 256 && art.width === 256);

    if (coverArt) {
        const img = createImage(coverArt.url, `${item.title} Cover`);
        img.style.width = '128px'; // Set width to 128px
        img.style.height = '128px'; // Set height to 128px
        img.style.objectFit = 'cover'; // Ensure it is cropped correctly
        div.appendChild(img);
    }

    div.appendChild(createParagraph(item.title, 'bold'));
    div.appendChild(createParagraph(trackArtist));
};
