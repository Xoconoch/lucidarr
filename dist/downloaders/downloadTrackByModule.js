var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from 'fs/promises';
import Default from 'lucida-tagger/build/index.js';
import { loadModules } from '../loaders/modulesLoader.js';
const CONFIG_PATH = './config/modules.json';
export function downloadTrackByModule(moduleId, trackUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
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
            const track = yield lucida.modules[moduleName].getByUrl(trackUrl);
            if (track === null || track === void 0 ? void 0 : track.getStream) {
                const trackStream = yield track.getStream();
                const trackNumber = ((_a = track.metadata.trackNumber) === null || _a === void 0 ? void 0 : _a.toString().padStart(2, '0')) || '00';
                const trackTitle = track.metadata.title || 'Unknown Track';
                const artistName = ((_c = (_b = track.metadata.artists) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown Artist';
                const albumTitle = ((_d = track.metadata.album) === null || _d === void 0 ? void 0 : _d.title) || 'Unknown Album';
                const albumDir = `${artistName}/${albumTitle}`;
                const filePath = `${albumDir}/${trackNumber}. ${trackTitle}.flac`;
                // Crear directorios necesarios
                yield fs.mkdir(albumDir, { recursive: true });
                // Guardar el archivo de audio
                yield fs.writeFile(filePath, trackStream.stream);
                console.log(`Downloaded: ${trackTitle}`);
                // Leer el archivo descargado para etiquetar
                const fileBuffer = yield fs.readFile(filePath);
                // Etiquetar el archivo con metadatos
                const taggedBuffer = yield Default.encodeTags('audio/flac', new Uint8Array(fileBuffer), {
                    title: track.metadata.title,
                    artists: track.metadata.artists,
                    album: {
                        title: (_e = track.metadata.album) === null || _e === void 0 ? void 0 : _e.title,
                        releaseDate: (_f = track.metadata.album) === null || _f === void 0 ? void 0 : _f.releaseDate,
                        coverArtwork: ((_g = track.metadata.album) === null || _g === void 0 ? void 0 : _g.coverArtwork) || undefined,
                    },
                    trackNumber: track.metadata.trackNumber,
                    discNumber: track.metadata.discNumber,
                    genre: track.metadata.genres,
                });
                // Sobrescribir archivo con etiquetas
                yield fs.writeFile(filePath, Buffer.from(taggedBuffer));
                console.log(`Tagged: ${trackTitle}`);
            }
            else {
                console.error(`Track ${track.metadata.title} does not have a getStream method`);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Failed to process track: ${error.message}`);
            }
            else {
                console.error('Failed to process track:', error);
            }
        }
        finally {
            yield lucida.disconnect();
        }
    });
}
