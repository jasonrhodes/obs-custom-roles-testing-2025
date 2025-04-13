import { createRules } from "../lib/create_rules";

async function main() {
  const { errors, results } = await createRules();

  console.log('finished');

  if (errors.length > 0) {
    console.log(`There were errors while creating ${errors.length} of the rules`);
    console.log(JSON.stringify(errors));
  }

  if (results.length > 0) {
    console.log(`Successfully created ${results.length} rules`);
    console.log(JSON.stringify(results));
  }
}

main();