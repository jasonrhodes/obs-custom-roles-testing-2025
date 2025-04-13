import { ingestDocuments } from "../lib/ingest_docs";

async function main() {
  const result = await ingestDocuments();

  console.log('finished');
  console.log(JSON.stringify(result));
}

main();