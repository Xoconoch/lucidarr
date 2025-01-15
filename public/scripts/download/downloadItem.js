const MAX_CONCURRENT_DOWNLOADS = 1; // Adjust as needed
let activeDownloads = 0;
const downloadQueue = [];

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

    const startDownload = (queuedListItem) => {
        activeDownloads++;

        const statusText = queuedListItem.querySelector('.status-text');
        statusText.textContent = 'Downloading...';

        fetch(downloadUrl)
            .then(response => {
                if (!response.body) {
                    throw new Error('No response body received.');
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                const processResult = ({ done, value }) => {
                    if (done) {
                        statusText.textContent = 'Download complete';
                        activeDownloads--;
                        processQueue();
                        return;
                    }

                    const chunk = decoder.decode(value, { stream: true });

                    try {
                        const jsonString = chunk.startsWith('data: ') ? chunk.slice(6) : chunk;
                        const json = JSON.parse(jsonString);
                        if (json.progress) {
                            statusText.textContent = json.progress;
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
                activeDownloads--;
                processQueue();
            });
    };

    const processQueue = () => {
        if (activeDownloads < MAX_CONCURRENT_DOWNLOADS && downloadQueue.length > 0) {
            const { startFn, queuedListItem } = downloadQueue.shift();
            startFn(queuedListItem);
        }
    };

    // Remove the item from the search results list
    const parentList = listItem.parentElement;
    if (parentList) {
        parentList.removeChild(listItem);
    }

    // Visualize the item in the queue immediately
    const queueElement = document.getElementById('download-queue');
    const queuedListItem = listItem.cloneNode(true);
    queuedListItem.querySelector('button').remove(); // Remove the download button
    const statusText = document.createElement('span');
    statusText.classList.add('status-text');
    statusText.textContent = 'Waiting in queue...';
    queuedListItem.appendChild(statusText);
    queueElement.appendChild(queuedListItem);

    // Queue or start the download
    if (activeDownloads < MAX_CONCURRENT_DOWNLOADS) {
        startDownload(queuedListItem);
    } else {
        downloadQueue.push({ startFn: startDownload, queuedListItem });
    }
};
