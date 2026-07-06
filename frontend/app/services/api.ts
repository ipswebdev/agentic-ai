const expressURL = 'http://localhost:3001'
const fastApiUrl = 'http://127.0.0.1:8000'

export const  fetchUserDocuments = async () => {
    const results = await fetch(`${expressURL}/documents`,);
    return results.json();
}

export const  askQuestion = async (question,docId) => {
    const payload = {
        message:question,
        documentId:docId
    }
    const results = await fetch(`${expressURL}/chat`,{
        headers: {
            "Content-Type": "application/json"
        },
        method:'POST',
        body:JSON.stringify(payload),
    })
    return results.json();
}

export const  processDocument = async (docId:string) => {
    const results = await fetch(`${expressURL}/documents/${docId}/process-document`,{
        headers: {
            "Content-Type": "application/json"
        },
        method:'POST',
        // body:JSON.stringify(payload),
    })
    return results.json();
}

export const  uploadDocument = async (file:File) => {
    const formData = new FormData();

    formData.append("file", file);
    const results = await fetch(`${expressURL}/documents/upload`,{
        method:'POST',
        body:formData,
    })
    return results.json();
}