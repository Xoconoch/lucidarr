import { downloadTrackByModule } from './src/downloaders/downloadTrackByModule';

async function main() {
  const moduleId = '4566345';
  const artistUrl = 'https://deezer.page.link/ABFjZAdznM39WPdXA';

  try {
    await downloadTrackByModule(moduleId, artistUrl);
    console.log('Processing completed successfully.');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
