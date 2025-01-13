import express from 'express';
import searchRoute from './routes/searchRoute.js/index.js';
import downloadAlbumRoute from './routes/downloadAlbum.js';

const app = express();
const port = 3000;

const router = express.Router();


router.get('/search', searchRoute);  // Use imported search route
router.get('/download/album', downloadAlbumRoute); // Use imported download album route




app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
