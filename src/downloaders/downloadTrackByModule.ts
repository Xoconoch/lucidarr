import * as fs from 'fs/promises';
import Default from 'lucida-tagger/build/index.js';
import { TrackGetByUrlResponse } from 'lucida/types';
import { loadModules } from '../loaders/modulesLoader';

const CONFIG_PATH = './config/modules.json';

export async function downloadTrackByModule(moduleId: string, trackUrl: string): Promise<void> {
  let lucida;
  try {
    lucida = await loadModules(CONFIG_PATH);
  } catch (error) {
    console.error('Failed to initialize Lucida:', error);
    return;
  }

  const moduleName = Object.keys(lucida.modules).find((name) => name === moduleId);

  if (!moduleName) {
    console.error(`Module with ID ${moduleId} not found in loaded modules.`);
    await lucida.disconnect();
    return;
  }

  try {
    const track = await lucida.modules[moduleName].getByUrl(trackUrl) as TrackGetByUrlResponse;
    if (track?.getStream) {
      const trackStream = await track.getStream();
      const trackNumber = track.metadata.trackNumber?.toString().padStart(2, '0') || '00';
      const trackTitle = track.metadata.title || 'Unknown Track';
      const artistName = track.metadata.artists?.[0]?.name || 'Unknown Artist';
      const albumTitle = track.metadata.album?.title || 'Unknown Album';
      const albumDir = `${artistName}/${albumTitle}`;
      const filePath = `${albumDir}/${trackNumber}. ${trackTitle}.flac`;

      // Crear directorios necesarios
      await fs.mkdir(albumDir, { recursive: true });

      // Guardar el archivo de audio
      await fs.writeFile(filePath, trackStream.stream);
      console.log(`Downloaded: ${trackTitle}`);

      // Leer el archivo descargado para etiquetar
      const fileBuffer = await fs.readFile(filePath);

      // Etiquetar el archivo con metadatos
      const taggedBuffer = await Default.encodeTags(
        'audio/flac',
        new Uint8Array(fileBuffer),
        {
          title: track.metadata.title,
          artists: track.metadata.artists,
          album: {
            title: track.metadata.album?.title,
            releaseDate: track.metadata.album?.releaseDate,
            coverArtwork: track.metadata.album?.coverArtwork || undefined,
          },
          trackNumber: track.metadata.trackNumber,
          discNumber: track.metadata.discNumber,
          genre: track.metadata.genres,
        }
      );

      // Sobrescribir archivo con etiquetas
      await fs.writeFile(filePath, Buffer.from(taggedBuffer));
      console.log(`Tagged: ${trackTitle}`);
    } else {
      console.error(`Track ${track.metadata.title} does not have a getStream method`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to process track: ${error.message}`);
    } else {
      console.error('Failed to process track:', error);
    }
  } finally {
    await lucida.disconnect();
  }
}
