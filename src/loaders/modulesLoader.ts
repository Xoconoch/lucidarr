import Lucida from 'lucida';
import * as fs from 'fs/promises';

interface ModuleConfig {
  type: string;
  name: string;
  logins: { username: string; password: string };
  options?: { [key: string]: any };
}

export async function loadModules(configPath: string): Promise<Lucida> {
  let config;
  try {
    const configFile = await fs.readFile(configPath, 'utf8');
    config = JSON.parse(configFile);
  } catch (error) {
    console.error(`Failed to read or parse the configuration file at ${configPath}:`, error);
    throw error;
  }

  const modules: { [key: string]: any } = {};
  const logins: { [key: string]: { username: string; password: string } } = {};

  const moduleTypes: { [key: string]: Promise<any> } = {
    deezer: import('lucida/streamers/deezer/main.js'),
    spotify: import('lucida/streamers/spotify'),
    tidal: import('lucida/streamers/tidal/main.js'),
    qobuz: import('lucida/streamers/qobuz/main.js'),
    soundcloud: import('lucida/streamers/soundcloud/main.js'),
  };

  for (const [id, moduleConfig] of Object.entries<ModuleConfig>(config.modules)) {
    const { type, name, logins: moduleLogins, options } = moduleConfig;

    if (!type || !name || !moduleLogins?.username || !moduleLogins?.password) {
      console.error(`Module with ID ${id} has incomplete configuration.`);
      continue;
    }

    const ModuleClass = (await moduleTypes[type.toLowerCase()])?.default;
    if (!ModuleClass) {
      console.error(`Unsupported module type '${type}' for module ID ${id}.`);
      continue;
    }

    modules[id] = new ModuleClass(options || {});
    logins[id] = moduleLogins;
  }

  const lucida = new Lucida({ modules, logins });

  try {
    await lucida.login();
  } catch (error) {
    console.error('Error logging into modules:', error);
    throw error;
  }

  return lucida;
}
