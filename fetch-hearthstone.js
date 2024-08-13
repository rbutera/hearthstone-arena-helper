const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const API_URL = 'https://hearthcard.io/api/search.php?&classn=N/A&format=Standard&limit=10&sort=mana-name';
const OUTPUT_DIR = '/tmp';
const FINAL_OUTPUT = 'hearthstone-cards.json';

async function fetchPage(offset) {
  const url = `${API_URL}&offset=${offset}`;
  const response = await axios.get(url);
  return response.data;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  let offset = 0;
  let pageNum = 1;
  let allCards = [];

  while (true) {
    console.log(`Fetching page ${pageNum}...`);
    const data = await fetchPage(offset);

    if (data.data.length === 0) break;

    const filename = path.join(OUTPUT_DIR, `hearthstone-${pageNum.toString().padStart(3, '0')}.json`);
    await fs.writeFile(filename, JSON.stringify(data.data, null, 2));

    allCards = allCards.concat(data.data);

    offset += 10;
    pageNum++;

    const delay = Math.floor(Math.random() * (3000 - 1000 + 1) + 1000);
    console.log(`Waiting ${delay / 1000} seconds before next request...`);
    await sleep(delay);
  }

  console.log('Combining all files...');
  await fs.writeFile(FINAL_OUTPUT, JSON.stringify(allCards, null, 2));
  console.log(`All done! Final output written to ${FINAL_OUTPUT}`);
}

main().catch(console.error);
