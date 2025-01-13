import express from 'express';
import checkModules from './routes/modules/checkModules.js';
import addModule from './routes/modules/addModule.js';
import removeModuleRoute from './routes/modules/removeModule.js';
import searchRoute from './routes/search/searchRoute.js';
import downloadArtistRoute from './routes/download/downloadArtist.js'; 
import downloadAlbumRoute from './routes/download/downloadAlbum.js';
import downloadTrackRoute from './routes/download/downloadTrack.js';

const app = express();
const port = 3000;

const router = express.Router();

router.get('/modules/check', checkModules);
router.post('/modules/add', addModule);
router.delete('/modules/remove', removeModuleRoute);
router.get('/search', searchRoute);
router.get('/download/artist', downloadArtistRoute);  
router.get('/download/album', downloadAlbumRoute);
router.get('/download/track', downloadTrackRoute);

app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
