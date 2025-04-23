import fs from "fs";
import path from "path";

export function saveEnvVariable(key: string, value: string) {
  const envFilePath = path.resolve(process.cwd(), ".env");
  const envVariable = `${key}=${value}\n`;

  if (fs.existsSync(envFilePath)) {
    let envFileContent = fs.readFileSync(envFilePath, "utf8");
    const regex = new RegExp(`^${key}=.*`, "m");

    if (regex.test(envFileContent)) {
      envFileContent = envFileContent.replace(regex, envVariable.trim());
    } else {
      envFileContent += `\n${envVariable}`;
    }

    fs.writeFileSync(envFilePath, envFileContent);
  } else {
    fs.writeFileSync(envFilePath, envVariable);
  }
}
