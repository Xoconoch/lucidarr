import { downloadArtistByModule } from '../../../dist/downloaders/downloadArtistByModule.js';

let downloadProgress = "";
let downloadStarted = false;

export default function downloadArtistRoute(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    if (!downloadStarted) {
        const moduleId = req.query.moduleId;
        const artistUrl = req.query.artistUrl;

        if (!moduleId || !artistUrl) {
            res.write(`data: ${JSON.stringify({ error: "moduleId and artistUrl are required as query parameters" })}\n\n`);
            res.end();
            return;
        }

        startDownload(moduleId, artistUrl, res);
    }
}


function startDownload(moduleId, artistUrl, res) {
    downloadStarted = true;
    downloadProgress = "";

    const originalConsoleLog = console.log;
    console.log = (...args) => {
        const newLine = args.join(' ') + '';
        downloadProgress += newLine;

        if (newLine.startsWith("Failed to")) {
            res.write(`data: ${JSON.stringify({ error: newLine })}\n\n`);
        } else {
            res.write(`data: ${JSON.stringify({ progress: newLine })}\n\n`);
        }

        originalConsoleLog(...args);
    };

    downloadArtistByModule(moduleId, artistUrl)
        .then(() => {
            console.log = originalConsoleLog;
            res.write(`data: ${JSON.stringify({ message: "Download complete", progress: downloadProgress })}\n\n`);
            res.end();
            downloadStarted = false;
        })
        .catch(err => {
            console.error("Artist download failed:", err);
            console.log = originalConsoleLog;
            res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
            res.end();
            downloadStarted = false;
        });
}
