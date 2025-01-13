import { loadModules } from '../loaders/modulesLoader';
import { downloadAlbumByModule } from './downloadAlbumByModule';
import { ArtistGetByUrlResponse } from 'lucida/types';

export async function downloadArtistByModule(moduleId: string, url: string): Promise<void> {
  let lucida;

  try {
    lucida = await loadModules('./config/modules.json');
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
    const artist = await lucida.modules[moduleName].getByUrl(url) as ArtistGetByUrlResponse;

    if (artist?.metadata?.albums && Array.isArray(artist.metadata.albums)) {
      for (const album of artist.metadata.albums) {
        try {
          await downloadAlbumByModule(moduleId, album.url);
        } catch (albumError) {
          if (albumError instanceof Error) {
            console.error(`Failed to process album '${album.title}': ${albumError.message}`);
          } else {
            console.error(`Failed to process album '${album.title}': ${albumError}`);
          }
        }
      }
    } else {
      console.error('Artist does not have albums or albums are null.');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`An error occurred while processing the artist: ${error.message}`);
    } else {
      console.error('An unknown error occurred while processing the artist.');
    }
  } finally {
    await lucida.disconnect();
  }
}
