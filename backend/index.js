import express from 'express';
import modulesRoute from './routes/search/searchModules.js';
import searchRoute from './routes/search/searchRoute.js';
import downloadAlbumRoute from './routes/download/downloadAlbum.js';
import downloadTrackRoute from './routes/download/downloadTrack.js';
import downloadArtistRoute from './routes/download/downloadArtist.js'; 

const app = express();
const port = 3000;

const router = express.Router();

router.get('/modules', modulesRoute);
router.get('/search', searchRoute);
router.get('/download/album', downloadAlbumRoute);
router.get('/download/track', downloadTrackRoute);
router.get('/download/artist', downloadArtistRoute);  


app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
