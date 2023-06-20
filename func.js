import fs from 'fs';
import process from 'process';
import csvParser from 'csv-parser';
import path from 'path';


async function csvToJson(input, arr) {
  console.time('a')
  for (let i = 0; i < arr.length; i++) {
    const currentDir = process.cwd();

    const outputPath = path.join(currentDir, 'converted', `${arr[i]}.json`);

    const readableStream = fs.createReadStream(path.join(currentDir, input, arr[i]));
    const writableStream = fs.createWriteStream(outputPath);

    readableStream.on('error', (err) => {
      console.log('some issue with the readable stream:', err);
      process.exit(1);
    });

    writableStream.on('error', (err) => {
      console.log('some issue with the writable stream:', err);
      process.exit(1);
    });
    readableStream.pipe(csvParser())
      .on('data', (data) => {
        data = JSON.stringify(data);
        writableStream.write(`${data}\n`);
      })
      .on('end', () => {
        console.log('end');
        writableStream.end();
      });

    writableStream.on('close', () => {
      console.timeEnd('a')    
      console.log('conversion close');
      console.timeEnd('a')
      process.exit(0);
      

    });
  }
  
}


function splintPathArr(pathArr, cpuLength) {
  const arrLength = pathArr.length;
  let count = Math.round(arrLength / cpuLength)
  const splintArr = [];
  let k = 0;
  for (let i = 0; i < count; i++) {
    if (pathArr.length >= count) {
      if (pathArr.slice(k, pathArr.length).length - count < count) {
        splintArr.push(pathArr.slice(k, pathArr.length));
        break;
      }
      splintArr.push(pathArr.slice(k, k + count));
    }
    k += count;
  }
  return splintArr;
}

export { splintPathArr, csvToJson };
