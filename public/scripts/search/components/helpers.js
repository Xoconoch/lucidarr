export const createImage = (src, alt) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    return img;
};

export const createParagraph = (text, fontWeight = 'normal') => {
    const p = document.createElement('p');
    p.textContent = text;
    p.style.fontWeight = fontWeight;
    return p;
};
