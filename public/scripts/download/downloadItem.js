export const downloadItem = (moduleId, itemUrl, itemType, listItem) => {
    const endpointMap = {
        album: '/api/download/album',
        track: '/api/download/track',
        artist: '/api/download/artist',
    };

    const paramMap = {
        album: 'albumUrl',
        track: 'trackUrl',
        artist: 'artistUrl',
    };

    const endpoint = endpointMap[itemType];
    const paramName = paramMap[itemType];

    if (!endpoint || !paramName) {
        console.error(`Invalid item type: ${itemType}`);
        return;
    }

    const downloadUrl = `${endpoint}?moduleId=${moduleId}&${paramName}=${encodeURIComponent(itemUrl)}`;

    // Mueve el elemento a la barra lateral "download queue"
    const downloadQueue = document.getElementById('download-queue');
    const statusText = document.createElement('span');
    statusText.textContent = 'Downloading...';
    listItem.querySelector('button').remove(); // Eliminar el botón de descarga
    listItem.appendChild(statusText);
    downloadQueue.appendChild(listItem);

    fetch(downloadUrl)
        .then(response => {
            if (!response.body) {
                throw new Error('No response body received.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Función recursiva para leer el stream y actualizar el texto de estado
            const processResult = ({ done, value }) => {
                if (done) {
                    statusText.textContent = 'Download complete';
                    return;
                }

                const chunk = decoder.decode(value, { stream: true });

                try {
                    // Limpiar el prefijo "data: " si existe
                    const jsonString = chunk.startsWith('data: ') ? chunk.slice(6) : chunk;

                    // Parsear el JSON
                    const json = JSON.parse(jsonString);
                    if (json.progress) {
                        statusText.textContent = json.progress; // Mostrar solo el campo "progress"
                    } else {
                        console.warn('Progress field missing in stream data:', jsonString);
                    }
                } catch (error) {
                    console.error('Failed to parse JSON from stream:', error, chunk);
                }

                return reader.read().then(processResult);
            };

            return reader.read().then(processResult);
        })
        .catch(error => {
            console.error('Download failed:', error);
            statusText.textContent = 'Download failed';
        });
};
