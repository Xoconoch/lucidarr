import { createImage, createParagraph } from './helpers.js';

export const handleArtists = (item, div) => {
    const artistImage = item.pictures?.[0]; // Take the first image in the array

    if (artistImage) {
        const img = createImage(artistImage, `${item.name} Picture`);
        img.style.width = '128px'; // Set width to 128px
        img.style.height = '128px'; // Set height to 128px
        img.style.objectFit = 'cover'; // Ensure it is cropped correctly
        div.appendChild(img);
    }

    div.appendChild(createParagraph(item.name, 'bold'));
};
