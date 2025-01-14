import { createImage, createParagraph } from './helpers.js';

export const handleArtists = (item, div) => {
    const artistImage = item.pictures?.find(pic => {
        const dimensions = pic.split('/').pop().split('-')[0]; // Extract dimensions (e.g., 256x256)
        return dimensions === '256x256';
    });

    if (artistImage) {
        const img = createImage(artistImage, `${item.name} Picture`);
        img.style.width = '128px'; // Set width to 128px
        img.style.height = '128px'; // Set height to 128px
        img.style.objectFit = 'cover'; // Ensure it is cropped correctly
        div.appendChild(img);
    }

    div.appendChild(createParagraph(item.name, 'bold'));
};
