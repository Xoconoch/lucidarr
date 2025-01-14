import { createImage, createParagraph } from './helpers.js';

export const handleArtists = (item, div) => {
    const artistImage = item.pictures?.find(pic => {
        const dimensions = pic.split('/').pop().split('-')[0]; // Extract dimensions (e.g., 256x256)
        return dimensions === '256x256';
    });

    if (artistImage) {
        const img = createImage(artistImage, `${item.name} Picture`);
        div.appendChild(img);
    }

    div.appendChild(createParagraph(item.name, 'bold'));
};
