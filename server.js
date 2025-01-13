import express from 'express';
import { searchByModule } from './dist/searchers/searchByModule.js';
import { downloadAlbumByModule } from './dist/downloaders/downloadAlbumByModule.js';

const app = express();
const port = 3000;

let downloadProgress = "";
let downloadStarted = false;

function startDownload(moduleId, albumUrl, res) {
    downloadStarted = true;
    downloadProgress = ""; // Initialize or reset downloadProgress

    const originalConsoleLog = console.log;
    console.log = (...args) => {
        const newLine = args.join(' ') + '';
        downloadProgress += newLine;  // Accumulate progress (if needed elsewhere)

        if (newLine.startsWith("Failed to")) {
            res.write(`data: ${JSON.stringify({ error: newLine })}\n\n`);
        } else {
            res.write(`data: ${JSON.stringify({ progress: newLine })}\n\n`);
        }

        originalConsoleLog(...args); // Call the original console.log
    };

    downloadAlbumByModule(moduleId, albumUrl)
        .then(() => {
            console.log = originalConsoleLog; // Restore original console.log
            res.write(`data: ${JSON.stringify({ message: "Download complete", progress: downloadProgress })}\n\n`);
            res.end();
            downloadStarted = false;
        })
        .catch(err => {
            console.error("Download failed:", err);
            console.log = originalConsoleLog; // Restore original console.log
            res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`); // Send final error
            res.end();
            downloadStarted = false;
        });
}

const router = express.Router();

router.get('/search', async (req, res) => {
    try {
        const moduleId = req.query.moduleId;
        const query = req.query.query;
        const limit = req.query.limit;

        const results = await searchByModule(moduleId, query, limit);

        if (results) {
            res.json(results);
        } else {
            res.status(500).json({ error: "Error searching" }); 
        }
    } catch (error) {
        console.error("Error in /search route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Download album route
router.get('/download/album', (req, res) => {

    // Set response headers for SSE
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


});




app.use(express.json()); // This is still needed for other routes (like /search if it uses req.body)
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});