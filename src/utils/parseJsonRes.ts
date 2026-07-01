export const parseJsonRes = (res) => {
    return new Promise( async (resolve, reject) => {
        const text = await res.text(); 
        if (res.ok) {
            try {
                resolve(JSON.parse(text))
            } catch(e) {
                resolve(`${text}`)
            }
        } else {
            try {
                reject(JSON.parse(text))
            } catch(e) {
                reject(`${res.status}: ${text}`)
            }
        }
    })
        
      
}