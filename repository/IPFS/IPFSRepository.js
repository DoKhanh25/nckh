require('dotenv').config();

const IPFS = {
    saveSearchQuery: async function(searchObject){
        const { FsBlockstore } = await import('blockstore-fs')
        const { createHelia } = await import('helia')
        const { unixfs } = await import('@helia/unixfs')


        const blockstore = new FsBlockstore(process.env.IPFS_DIRECTORY)
        const helia = await createHelia({blockstore})
        const fs = unixfs(helia)
        const encoder = new TextEncoder()

        try {
            const jsonString = JSON.stringify(searchObject);
            const bytes = encoder.encode(jsonString); // ma hoa query string
            const cid = await fs.addBytes(bytes);

            // luu tru cid vao trong hyperledger fabric
            console.log(cid)

            return cid;
        } catch (error) {
            console.log(error)
            return null;
        }
      
    },
    retriveDataFromIPFS: async function(type, cid) {
        const { FsBlockstore } = await import('blockstore-fs')
        const { createHelia } = await import('helia')
        const { unixfs } = await import('@helia/unixfs')


        const blockstore = new FsBlockstore(process.env.IPFS_DIRECTORY)
        const helia = await createHelia({blockstore})
        const fs = unixfs(helia)
        const decoder = new TextDecoder()

        if(type == "searchQuery"){
            let text = "";
            for await (const chunk of fs.cat(cid)) {
                text += decoder.decode(chunk, {
                  stream: true
                })
              };
              console.log(text)
            return text;
        }
        if(type == "document"){
            const file = fs.cat(cid);
            return file;
        }
        
    },
    saveFile: async function(file){
        const { FsBlockstore } = await import('blockstore-fs')
        const { createHelia } = await import('helia')
        const { unixfs } = await import('@helia/unixfs')


        const blockstore = new FsBlockstore(process.env.IPFS_DIRECTORY)
        const helia = await createHelia({blockstore})
        const fs = unixfs(helia)
        const encoder = new TextEncoder()

        try {
  
            const cid = await fs.addFile(file);

            // luu tru cid vao trong hyperledger fabric
            console.log(cid)

            return cid;
        } catch (error) {
            console.log(error)
            return null;
        }
      
    }

      
    
}

module.exports = IPFS;