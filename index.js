import fs from 'fs';
import process from 'process';
import cluster from 'cluster';
import os from 'os';
import { splintPathArr } from './func.js'
import httpServer from './http.js';

if (cluster.isPrimary) {
  let count = os.cpus().length;
  const filesArr = new Promise((res, rej) => {
    fs.readdir('./csvs', { recursive: true }, (err, files) => {
      if (err) {
        rej(err.message);
      }
      res(files);
    })
  })

  filesArr
    .then(data => {
      const pathArr = splintPathArr(data, count);
      for (let i = 0; i < pathArr.length; i++) {
        const worker = cluster.fork({ env: pathArr[i] });
        console.log('worker:', worker.id);
      }
    })
    .catch(er => console.log(er));


} else {

   httpServer()
  .listen(4000, 'localhost', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('listening port:4000');
    }
  })
 .on('error', (err) => console.log(err.message));

}













