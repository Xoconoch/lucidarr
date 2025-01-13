import { loadModules } from '../loaders/modulesLoader';
import { downloadTrackByModule } from './downloadTrackByModule';
import { AlbumGetByUrlResponse } from 'lucida/types';

const CONFIG_PATH = './config/modules.json';

export async function downloadAlbumByModule(moduleId: string, albumUrl: string): Promise<void> {
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
    const album = await lucida.modules[moduleName].getByUrl(albumUrl) as AlbumGetByUrlResponse;

    if (album?.tracks && Array.isArray(album.tracks)) {
      console.log(`Found ${album.tracks.length} tracks for album: ${album.metadata.title}`);

      for (const track of album.tracks) {
        await downloadTrackByModule(moduleId, track.url);
      }
    } else {
      console.error('Album does not have tracks or is null');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`An error occurred while processing the album: ${error.message}`);
    } else {
      console.error('An unknown error occurred while processing the album.');
    }
  } finally {
    await lucida.disconnect();
  }
}
