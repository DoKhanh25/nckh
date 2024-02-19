// config for gateway 
const fs = require('fs/promises');
const path = require('path')



function envOrDefault(key, defaultValue) {
    return process.env[key] || defaultValue;
}

const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto materials.
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, 'organizations', 'peerOrganizations', 'org1.example.com'));

// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));

// Path to user certificate.
const certPath = envOrDefault('CERT_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts', 'cert.pem'));

// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', '103.166.184.81:7051');

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');


const utf8Decoder = new TextDecoder();
const assetId = `asset${Date.now()}`;

const hyperledgerGateway = {
    createAsset: async (obj) => {
        const {connect, signers} = await import ('@hyperledger/fabric-gateway');
        const crypto = await import('crypto');
        const grpc = await import('@grpc/grpc-js');


        await displayInputParameters();


        async function newGrpcConnection() {
            const tlsRootCert = await fs.readFile(tlsCertPath);
            const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
            return new grpc.Client(peerEndpoint, tlsCredentials, {
                'grpc.ssl_target_name_override': peerHostAlias,
            });
        }

        async function newIdentity() {
            const credentials = await fs.readFile(certPath);
            return { mspId, credentials };
        }
        
        async function newSigner() {
            const files = await fs.readdir(keyDirectoryPath);
            const keyPath = path.resolve(keyDirectoryPath, files[0]);
            const privateKeyPem = await fs.readFile(keyPath);
            const privateKey = crypto.createPrivateKey(privateKeyPem);
            return signers.newPrivateKeySigner(privateKey);
        }

        const client = await newGrpcConnection();

        const gateway = connect({
            client,
            identity: await newIdentity(),
            signer: await newSigner(),
            // Default timeouts for different gRPC calls
            evaluateOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            endorseOptions: () => {
                return { deadline: Date.now() + 15000 }; // 15 seconds
            },
            submitOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            commitStatusOptions: () => {
                return { deadline: Date.now() + 60000 }; // 1 minute
            },
        });
        const network = gateway.getNetwork(channelName);

        const contract = network.getContract(chaincodeName);

        await createAsset(contract, obj).then(
            (result) => {
                return result;
            })
            .catch((err) => {
                console.log(err);
                return false;
            })
            .finally(() => {
                gateway.close();
                client.close();
            })      
       
    },
    getAllAssets: async () => {
        const {connect, signers} = await import ('@hyperledger/fabric-gateway');
        const crypto = await import('crypto');
        const grpc = await import('@grpc/grpc-js');


        await displayInputParameters();


        async function newGrpcConnection() {
            const tlsRootCert = await fs.readFile(tlsCertPath);
            const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
            return new grpc.Client(peerEndpoint, tlsCredentials, {
                'grpc.ssl_target_name_override': peerHostAlias,
            });
        }

        async function newIdentity() {
            const credentials = await fs.readFile(certPath);
            return { mspId, credentials };
        }
        
        async function newSigner() {
            const files = await fs.readdir(keyDirectoryPath);
            const keyPath = path.resolve(keyDirectoryPath, files[0]);
            const privateKeyPem = await fs.readFile(keyPath);
            const privateKey = crypto.createPrivateKey(privateKeyPem);
            return signers.newPrivateKeySigner(privateKey);
        }

        const client = await newGrpcConnection();

        const gateway = connect({
            client,
            identity: await newIdentity(),
            signer: await newSigner(),
            // Default timeouts for different gRPC calls
            evaluateOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            endorseOptions: () => {
                return { deadline: Date.now() + 15000 }; // 15 seconds
            },
            submitOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            commitStatusOptions: () => {
                return { deadline: Date.now() + 60000 }; // 1 minute
            },
        });
        const network = gateway.getNetwork(channelName);

        const contract = network.getContract(chaincodeName);
        await getAllAssets(contract).then(result => {
            console.log(result)
        })
        let result = await getAllAssets(contract);
    
        return result;
    },
    readAssetByID: async (id) => {
        const {connect, signers} = await import ('@hyperledger/fabric-gateway');
        const crypto = await import('crypto');
        const grpc = await import('@grpc/grpc-js');


        await displayInputParameters();


        async function newGrpcConnection() {
            const tlsRootCert = await fs.readFile(tlsCertPath);
            const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
            return new grpc.Client(peerEndpoint, tlsCredentials, {
                'grpc.ssl_target_name_override': peerHostAlias,
            });
        }

        async function newIdentity() {
            const credentials = await fs.readFile(certPath);
            return { mspId, credentials };
        }
        
        async function newSigner() {
            const files = await fs.readdir(keyDirectoryPath);
            const keyPath = path.resolve(keyDirectoryPath, files[0]);
            const privateKeyPem = await fs.readFile(keyPath);
            const privateKey = crypto.createPrivateKey(privateKeyPem);
            return signers.newPrivateKeySigner(privateKey);
        }

        const client = await newGrpcConnection();

        const gateway = connect({
            client,
            identity: await newIdentity(),
            signer: await newSigner(),
            // Default timeouts for different gRPC calls
            evaluateOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            endorseOptions: () => {
                return { deadline: Date.now() + 15000 }; // 15 seconds
            },
            submitOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            commitStatusOptions: () => {
                return { deadline: Date.now() + 60000 }; // 1 minute
            },
        });
        const network = gateway.getNetwork(channelName);

        const contract = network.getContract(chaincodeName);
        await getAllAssets(contract).then(result => {
            console.log(result)
        })
        let result = await readAssetByID(contract, id);
    
        return result;
    }



}

hyperledgerGateway.readAssetByID('asset2').catch(err => {
    console.log(err)
});

async function displayInputParameters() {
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`cryptoPath:        ${cryptoPath}`);
    console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
    console.log(`certPath:          ${certPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
    console.log(`peerHostAlias:     ${peerHostAlias}`);
}



async function createAsset(contract, obj){
    console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments');

    await contract.submitTransaction(
        'CreateAsset',
        assetId,
        obj.title,
        obj.hashValue,
        obj.DOI,
        obj.authorName,
        obj.identity,
        obj.acceptBy,
        obj.updateTime,
        obj.updateBy
    );

    console.log('*** Transaction committed successfully');
}
async function getAllAssets(contract) {
    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAllAssets');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return result;
}
async function readAssetByID(contract, id) {
    console.log('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');

    const resultBytes = await contract.evaluateTransaction('ReadAsset', id);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return result;
}

module.exports = hyperledgerGateway;