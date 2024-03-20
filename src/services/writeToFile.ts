import { fs, path } from "../utils/consts";

export function writeToFile(fileName: string, data: string[]) {
  fs.writeFile(
    path.join(__dirname, "..", "data", fileName),
    JSON.stringify(data, null, 2),
    function () {
      /* if (err) throw err;
        console.log("An error occured. You cannot write to file."); */
      console.log("Writing to file finished");
    }
  );
}
