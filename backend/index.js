import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import checkModules from './routes/modules/checkModules.js';
import addModule from './routes/modules/addModule.js';
import removeModule from './routes/modules/removeModule.js';
import search from './routes/search/search.js';
import downloadArtist from './routes/download/downloadArtist.js'; 
import downloadAlbum from './routes/download/downloadAlbum.js';
import downloadTrack from './routes/download/downloadTrack.js';

const app = express();
const port = 3030;

const router = express.Router();

router.get('/modules/check', checkModules);
router.post('/modules/add', addModule);
router.delete('/modules/remove', removeModule);
router.get('/search', search);
router.get('/download/artist', downloadArtist);  
router.get('/download/album', downloadAlbum);
router.get('/download/track', downloadTrack);

app.use(express.json());
app.use('/api', router);

const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);        

const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
