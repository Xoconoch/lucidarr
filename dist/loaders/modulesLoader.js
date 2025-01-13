var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Lucida from 'lucida';
import * as fs from 'fs/promises';
export function loadModules(configPath) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let config;
        try {
            const configFile = yield fs.readFile(configPath, 'utf8');
            config = JSON.parse(configFile);
        }
        catch (error) {
            console.error(`Failed to read or parse the configuration file at ${configPath}:`, error);
            throw error;
        }
        const modules = {};
        const logins = {};
        const moduleTypes = {
            deezer: import('lucida/streamers/deezer/main.js'),
            spotify: import('lucida/streamers/spotify'),
            tidal: import('lucida/streamers/tidal/main.js'),
            qobuz: import('lucida/streamers/qobuz/main.js'),
            soundcloud: import('lucida/streamers/soundcloud/main.js'),
        };
        for (const [id, moduleConfig] of Object.entries(config.modules)) {
            const { type, name, logins: moduleLogins, options } = moduleConfig;
            if (!type || !name || !(moduleLogins === null || moduleLogins === void 0 ? void 0 : moduleLogins.username) || !(moduleLogins === null || moduleLogins === void 0 ? void 0 : moduleLogins.password)) {
                console.error(`Module with ID ${id} has incomplete configuration.`);
                continue;
            }
            const ModuleClass = (_a = (yield moduleTypes[type.toLowerCase()])) === null || _a === void 0 ? void 0 : _a.default;
            if (!ModuleClass) {
                console.error(`Unsupported module type '${type}' for module ID ${id}.`);
                continue;
            }
            modules[id] = new ModuleClass(options || {});
            logins[id] = moduleLogins;
        }
        const lucida = new Lucida({ modules, logins });
        try {
            yield lucida.login();
        }
        catch (error) {
            console.error('Error logging into modules:', error);
            throw error;
        }
        return lucida;
    });
}
