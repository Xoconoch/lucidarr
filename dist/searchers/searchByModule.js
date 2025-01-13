var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadModules } from '../loaders/modulesLoader';
const CONFIG_PATH = './config/modules.json';
export function searchByModule(moduleId, query, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        let lucida;
        try {
            lucida = yield loadModules(CONFIG_PATH);
        }
        catch (error) {
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
            const results = yield lucida.modules[moduleName].search(query, limit);
            console.log(`Search results for '${query}' in module '${moduleName}':`, results);
            return results;
        }
        catch (error) {
            console.error(`Failed to search with module ID ${moduleId}:`, error);
            return null;
        }
        finally {
            yield lucida.disconnect();
        }
    });
}
