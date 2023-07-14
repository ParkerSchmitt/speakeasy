/* eslint-disable */ 
const { parse } = require('csv-parse');
const path = require('path')
const fs = require('fs');
const { Readable } = require('stream');
const https = require('https');
import { Database } from 'sqlite3'; /*eslint: ignore */


import Fs from 'fs'  
import Https from 'https'



const topicName: string = "spanish"
const filePath: string = process.argv[1]

const db = new Database("../src/storage.db")

db.run("DELETE FROM cards", {}, (err) => {
  if (err) {
      throw err
  }
  })


fs.createReadStream("import.csv")
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", async function (row: string[]) {
      console.log(row)
    // 0: preview, 1: reveal,2: imageUrl,3: audioUrl,4: helpText
    let preview = row[0]
    let reveal = row[1]
    let imageUrl = row[2]
    let audioUrl = row[3]
    let helpText = row[4]

    let newImageUrl = `${topicName}/${preview}`
    let newAudioUrl = `${topicName}/${preview}${path.extname(audioUrl)}`


    try {
    //Lets download the image, compress it, and store it on our server.
    //await downloadFile(imageUrl, `../public/resources/images/${newImageUrl}.png`)
    //await downloadFile(audioUrl, `../public/resources/audio/${preview}${path.extname(audioUrl)}`)

    db.run("INSERT INTO cards(topicId, name, previewText, revealText, imageUrl, audioUrl, pronunciation) VALUES ($topicId, $name, $target, $native, $image, $audio, $pronunciation)", {
        $topicId: 1,
        $name: "Introductory",
        $target: preview,
        $native: reveal,
        $image: `${newImageUrl}.png`,
        $audio: newAudioUrl,
        $pronunciation: helpText
    }, (err) => {
        if (err) {
            throw err
        }
        })


    } catch (error: any) {
        console.log(row + error);
    }

    
    



    }).on("end", function () {
    console.log("finished");
    }).on("error", function (error: Error) {
    console.log(error.message);
    });

  




/**
 * Download a file from the given `url` into the `targetFile`.
 *
 * @param {String} url
 * @param {String} targetFile
 *
 * @returns {Promise<void>}
 */
async function downloadFile (url:string, targetFile :string) {  
  return await new Promise((resolve, reject) => {
    Https.get(url, {
        rejectUnauthorized: false,
        headers:  {
            'User-Agent': 'Chrome/8.30.0',
        }
        
    }, response => {
      const code = response.statusCode ?? 0

      if (code >= 400) {
        return reject(new Error('code: ' + code + ' status message: ' + response.statusMessage))
      }

      // handle redirects
      if (code > 300 && code < 400 && !!response.headers.location) {
        return resolve(
          downloadFile(response.headers.location, targetFile)
        )
      }

      // save the file to disk
      const fileWriter = Fs
        .createWriteStream(targetFile)
        .on('finish', () => {
          resolve({})
        })

      response.pipe(fileWriter)
    }).on('error', error => {
      reject(error)
    })
  })
}