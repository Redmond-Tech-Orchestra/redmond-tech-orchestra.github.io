import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const concertsPath = path.join(rootDir, "src/content/concerts.json");
const concerts = JSON.parse(readFileSync(concertsPath, "utf8"));

const missingProgramUrls = concerts
  .filter((concert) => concert.programUrl?.startsWith("/"))
  .filter((concert) => !existsSync(path.join(rootDir, "public", concert.programUrl)))
  .map((concert) => `${concert.title}: ${concert.programUrl}`);

if (missingProgramUrls.length > 0) {
  console.error("Missing public files for concert programUrl entries:");
  for (const missingProgramUrl of missingProgramUrls) {
    console.error(`- ${missingProgramUrl}`);
  }
  process.exit(1);
}
