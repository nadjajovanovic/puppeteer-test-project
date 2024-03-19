import { fs, path } from "../utils/consts";

export function saveAllProductsToFile(data: string[], fileName: string) {
  try {
    fs.writeFile(
      path.join(__dirname, '..', 'data', fileName),
      JSON.stringify(data, null, 2),
      function (err: string) {
        if (err) throw err;
      }
    );
  } catch (error) {
    console.log('You cannot write to file');
  }
}
