const HttpClientBuilder = require("../lib/HttpClientBuilder")

class OcrGateway {
    constructor() {
        this.ocrApi = {
            baseUrl: process.env.API_OCR_URL,
            timeout: 60000
        }
        this.client = new HttpClientBuilder().buildClient(this.ocrApi);
    }

    get createJob() {
        return this.getPath(process.env.CREATE_JOB);
    }

    get uploadDocuments() {
        return this.getPath(`${process.env.UPLOAD_JOB}/:jobId`);
    }

    get startProcess() {
        return this.getPath(`${process.env.START_JOB}/:jobId`);
    }

    getPath(endPoint) {
        return `${this.ocrApi.baseUrl}${endPoint}`
    }

    async postCreateJob(body) {
        let result = undefined;
        try {
            const response = await this.client.post(this.createJob, body);

            if(response.status === 201) {
                result = response;
            } else {
                console.log(response.data.detail);
            }
                
        } catch (error) {
            console.log(error);
        }
        return result;
    }

    async putUploadDocuments(jobId, formData) {
        let result = undefined;
        try {
            const response = await this.client.put(this.uploadDocuments.replace(':jobId', jobId), formData, {
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                },
                params: {
                    docType: 'wimo'
                }});
            result = response;
        } catch(error) {
            console.log(error);
        }
        return result;
    }

    async putStartProcess(jobId) {
        let result = undefined;
        try {
            const response = await this.client.put(this.startProcess.replace(':jobId', jobId));
            result = response;
        } catch(error) {
            console.log(error);
        }
        return result;
    }
}

module.exports = OcrGateway;