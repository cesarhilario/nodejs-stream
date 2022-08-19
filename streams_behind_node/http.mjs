import http from "http";
import { readFileSync, createReadStream } from "fs";

// ** To generate a big file
// node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file

http
  .createServer((req, res) => {
    const file = readFileSync("big.file"); //.toString()
    res.write(file);
    res.end();

    createReadStream("big.file").pipe(res);
  })
  .listen(3000, () => console.log("running at 3000"));

// ** Run this command
// curl localhost:3000 ---output output.txt
