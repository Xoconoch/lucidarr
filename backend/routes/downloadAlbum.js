import { downloadAlbumByModule } from '../../dist/downloaders/downloadAlbumByModule.js';


let downloadProgress = "";
let downloadStarted = false;

export default  function downloadAlbumRoute(req, res) {

     res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    if (!downloadStarted) {
        const moduleId = req.query.moduleId;
        const albumUrl = req.query.albumUrl;

        if (!moduleId || !albumUrl) {
            res.write(`data: ${JSON.stringify({ error: "moduleId and albumUrl are required as query parameters" })}\n\n`);
            res.end();
            return;
        }

        startDownload(moduleId, albumUrl, res); 
    }

}


function startDownload(moduleId, albumUrl, res) {
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

    downloadAlbumByModule(moduleId, albumUrl)
        .then(() => {
            console.log = originalConsoleLog;
            res.write(`data: ${JSON.stringify({ message: "Download complete", progress: downloadProgress })}\n\n`);
            res.end();
            downloadStarted = false;
        })
        .catch(err => {
            console.error("Download failed:", err);
            console.log = originalConsoleLog; 
            res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`); 
            res.end();
            downloadStarted = false;
        });
}