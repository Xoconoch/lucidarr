import { loadModules } from '../loaders/modulesLoader';
import { SearchResults } from 'lucida/types';

const CONFIG_PATH = './config/modules.json';

export async function searchByModule(
  moduleId: string,
  query: string,
  limit: number
): Promise<SearchResults | null> {
  let lucida;
  try {
    lucida = await loadModules(CONFIG_PATH);
  } catch (error) {
    console.error('Failed to initialize Lucida:', error);
    return null;
  }

  // Verificar si el módulo con el ID existe
  const moduleName = Object.keys(lucida.modules).find((name) => name === moduleId);

  if (!moduleName) {
    console.error(`Module with ID ${moduleId} not found in loaded modules.`);
    return null;
  }

  try {
    // Realizar la búsqueda con el módulo correspondiente
    const results = await lucida.modules[moduleName].search(query, limit);
    console.log(`Search results for '${query}' in module '${moduleName}':`, results);
    return results;
  } catch (error) {
    console.error(`Failed to search with module ID ${moduleId}:`, error);
    return null;
  } finally {
    await lucida.disconnect();
  }
}
