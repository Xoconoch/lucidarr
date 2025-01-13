var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadModules } from '../loaders/modulesLoader.js';
import { downloadTrackByModule } from './downloadTrackByModule.js';
const CONFIG_PATH = './config/modules.json';
export function downloadAlbumByModule(moduleId, albumUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let lucida;
        try {
            lucida = yield loadModules(CONFIG_PATH);
        }
        catch (error) {
            console.error('Failed to initialize Lucida:', error);
            return;
        }
        const moduleName = Object.keys(lucida.modules).find((name) => name === moduleId);
        if (!moduleName) {
            console.error(`Module with ID ${moduleId} not found in loaded modules.`);
            yield lucida.disconnect();
            return;
        }
        try {
            const album = yield lucida.modules[moduleName].getByUrl(albumUrl);
            if ((album === null || album === void 0 ? void 0 : album.tracks) && Array.isArray(album.tracks)) {
                console.log(`Found ${album.tracks.length} tracks for album: ${album.metadata.title}`);
                for (const track of album.tracks) {
                    yield downloadTrackByModule(moduleId, track.url);
                }
            }
            else {
                console.error('Album does not have tracks or is null');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`An error occurred while processing the album: ${error.message}`);
            }
            else {
                console.error('An unknown error occurred while processing the album.');
            }
        }
        finally {
            yield lucida.disconnect();
        }
    });
}
