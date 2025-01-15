import { createImage, createParagraph } from './helpers.js';

export const handleArtists = (item, div) => {
    // Find the largest image in the pictures array based on size (assume URL or metadata contains size info)
    const largestArtistImage = item.pictures && item.pictures.length 
        ? item.pictures.reduce((largest, current) => {
            // Optional: Add logic to handle cases where the image size is part of the URL or other metadata
            // For simplicity, assume larger URLs correspond to larger images if no explicit size info is available
            return current.length > largest.length ? current : largest;
        }) 
        : null;

    if (largestArtistImage) {
        const img = createImage(largestArtistImage, `${item.name} Picture`);
        img.style.width = '128px'; // Set width to 128px
        img.style.height = '128px'; // Set height to 128px
        img.style.objectFit = 'cover'; // Ensure it is cropped correctly
        div.appendChild(img);
    }

    div.appendChild(createParagraph(item.name, 'bold'));
};
