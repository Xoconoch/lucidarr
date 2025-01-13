import { downloadTrackByModule } from '../../../dist/downloaders/downloadTrackByModule.js';


let downloadProgress = "";
let downloadStarted = false;

export default function downloadTrackRoute(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    if (!downloadStarted) {
        const moduleId = req.query.moduleId;
        const trackUrl = req.query.trackUrl; // Use trackUrl instead of albumUrl

        if (!moduleId || !trackUrl) {
            res.write(`data: ${JSON.stringify({ error: "moduleId and trackUrl are required as query parameters" })}\n\n`);
            res.end();
            return;
        }

        startDownload(moduleId, trackUrl, res);
    }
}


function startDownload(moduleId, trackUrl, res) { // Use trackUrl here
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


    downloadTrackByModule(moduleId, trackUrl) // Call downloadTrackByModule
        .then(() => {
            console.log = originalConsoleLog;
            res.write(`data: ${JSON.stringify({ message: "Download complete", progress: downloadProgress })}\n\n`);
            res.end();
            downloadStarted = false;
        })
        .catch(err => {
            console.error("Track download failed:", err); // More specific error message
            console.log = originalConsoleLog;
            res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
            res.end();
            downloadStarted = false;
        });
}

