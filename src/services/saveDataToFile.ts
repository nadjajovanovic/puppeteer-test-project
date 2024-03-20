import { fs } from "../utils/consts";
import { writeToFile } from "./writeToFile";

export function saveDataToFile(data: string[], fileName: string) {
  const filePath = `../src/data/${fileName}`;
  if (fs.existsSync(filePath)) {
    //if file exists deleted it
    fs.unlinkSync(filePath);
    console.log("File deleted successfully.");
    console.log("Creating new file");
    //when deleted create new one
    writeToFile(fileName, data);
  } else {
    console.log("File does not exist....");
    console.log("Creating the file");
    writeToFile(fileName, data);
  }
}
