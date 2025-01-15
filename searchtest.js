import { searchByModule } from './dist/searchers/searchByModule.js';

(async function testSearch() {
    const moduleId = "4566345"; // ID del módulo
    const query = "testing";   // Consulta de búsqueda
    const limit = 10;          // Límite de resultados

    try {
        console.log(`Testing searchByModule with moduleId: ${moduleId}, query: "${query}", limit: ${limit}`);
        const results = await searchByModule(moduleId, query, limit);
        
        if (results) {
            console.log("Search results:", results);
        } else {
            console.log("No results or error occurred.");
        }
    } catch (error) {
        console.error("Error during test execution:", error);
    }
})();
