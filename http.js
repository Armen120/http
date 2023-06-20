
import {createServer} from 'http'
import { csvToJson } from './func.js'
import fs from 'fs';

const httpServer = () =>{
    return (
        createServer((req, res) => {
            console.log(req.method, req.url);
        
            if (req.method === 'POST' && req.url === '/csvs') {
              const arrInput = req.url.split('/');
              const input = arrInput[arrInput.length - 1]
              const arr = process.env.env.split(',');
              csvToJson(input, arr);
              res.writeHead(200, { 'content-Type': 'text/plain' });
              res.end('converted');
        
            } else if (req.method === 'GET' && req.url === '/converted') {
              const filesArr = new Promise((res, rej) => {
                fs.readdir('./converted', { recursive: true }, (err, files) => {
                  if (err) {
                    rej(err.message);
                  }
                  res(files);
        
                })
              })
              filesArr
                .then((data) => {
                  res.writeHead(200, { 'Content-Type': 'text/plain' });
                  let newData = '';
                  data.forEach(element => {
                    newData += `${element}\n`;
                  })
                  console.log(newData);
                  res.end(newData);
                })
        
            } else if (req.url.includes('converted/') && req.method === 'GET') {
              const arr = req.url.split('/');
        
              fs.readFile(`converted/${arr[2]}`, (err, data) => {
                if (err) {
                  res.end('file is not find');
                } else {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(data);
                }
              })
        
        
            } else if (req.url.includes('converted/') && req.method === 'DELETE') {
              const arr = req.url.split('/');
              fs.unlink(`converted/${arr[2]}`, (err) => {
                if (err) {
        
                  res.end(`file isn't find`);
                } else {
                  res.end('file deleted');
                }
              })

            }
          })


    )
} 
export default httpServer;