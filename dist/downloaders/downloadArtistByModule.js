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
import { downloadAlbumByModule } from './downloadAlbumByModule.js';
export function downloadArtistByModule(moduleId, url) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let lucida;
        try {
            lucida = yield loadModules('./config/modules.json');
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
            const artist = yield lucida.modules[moduleName].getByUrl(url);
            if (((_a = artist === null || artist === void 0 ? void 0 : artist.metadata) === null || _a === void 0 ? void 0 : _a.albums) && Array.isArray(artist.metadata.albums)) {
                for (const album of artist.metadata.albums) {
                    try {
                        yield downloadAlbumByModule(moduleId, album.url);
                    }
                    catch (albumError) {
                        if (albumError instanceof Error) {
                            console.error(`Failed to process album '${album.title}': ${albumError.message}`);
                        }
                        else {
                            console.error(`Failed to process album '${album.title}': ${albumError}`);
                        }
                    }
                }
            }
            else {
                console.error('Artist does not have albums or albums are null.');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`An error occurred while processing the artist: ${error.message}`);
            }
            else {
                console.error('An unknown error occurred while processing the artist.');
            }
        }
        finally {
            yield lucida.disconnect();
        }
    });
}
