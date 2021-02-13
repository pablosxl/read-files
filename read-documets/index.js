// readdir.js 
const OcrGateway = require('./src/gateway/OcrGateway');
var FormData = require('form-data');
const fs = require('fs');
var domain = require('domain').create();
require('dotenv').config();

const gateway = new OcrGateway();
const formData = new FormData();

fs.readdir('./files/', function (error, files) {

   files.forEach(async (item, index) => {
      console.log('Documento ' + (index + 1));
      try {
         //createJob
         const createJobResponse = await gateway.postCreateJob();
         console.log(createJobResponse.data);

         //uploadDocument
         formData.append('File', fs.createReadStream(`./files/${item}`));
         const uploadDocumentResponse = await gateway.putUploadDocuments(createJobResponse.data.idJob, formData);
         console.log(uploadDocumentResponse.data);

         //startProcess
         const startProcessResponse = await gateway.putStartProcess(createJobResponse.data.idJob);
         if (startProcessResponse.status === 204)
            console.log(`${startProcessResponse.status} :: processo iniciado`);
      } catch (error) {
         console.log(error);
      }


      //console.log(item.valueOf())
   });
});

domain.on("error", function (erros) {
   console.log(erros);
});
