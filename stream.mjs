import { pipeline, Readable, Writable, Transform } from "stream";
import { promisify } from "util";
import { createWriteStream } from "fs";

const pipelineAsync = promisify(pipeline);

{
  const readableStream = Readable({
    read: function () {
      this.push("Hello Dude!!0");
      this.push("Hello Dude!!1");
      this.push("Hello Dude!!2");
      this.push(null);
    },
  });

  const writableStream = Writable({
    write(chunk, enconding, callback) {
      console.log("msg", chunk.toString());
      callback();
    },
  });

  await pipelineAsync(
    readableStream,
    // process.stdout,
    writableStream
  );

  console.log("process end. 🏁");
}
{
  const readableStream = Readable({
    read() {
      for (let index = 0; index < 1e5; index++) {
        const person = { id: Date.now() + index, name: `Cesar-${index}` };
        const data = JSON.stringify(person);
        this.push(data); // send to {2}
      }
      // notify data ends
      this.push(null);
    },
  });

  const writableMapToCSV = Transform({
    transform(chunk, enconding, callback) {
      const data = JSON.parse(chunk);
      const result = `${data.id},${data.name.toUpperCase()}\n`;

      callback(null, result);
    },
  });

  const setHeader = Transform({
    transform(chunk, enconding, callback) {
      this.counter = this.counter ?? 0;
      if (this.counter) {
        return callback(null, chunk);
      }

      this.counter += 1;

      callback(null, "id,name\n".concat(chunk));
    },
  });
  await pipelineAsync(
    readableStream,
    // process.stdout,  {2}
    writableMapToCSV, // {2}
    setHeader,
    // process.stdout
    createWriteStream("my.csv")
  );
}
