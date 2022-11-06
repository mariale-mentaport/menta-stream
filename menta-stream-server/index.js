

import express from 'express';
import cors from 'cors';

import { NFTStorage, File } from 'nft.storage'
import config from 'config';


const endpoint = 'https://api.nft.storage' // the default
const token = config.get('NFT_STORAGE');

const description="MentaStream Video NFTs to leave a memory or find a moment in location.";
const video_url_tst = "https://livepeercdn.com/recordings/2cd0f2bd-ae66-4ce1-8f46-df36fc4ac7dd/index.m3u8";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
        origin: '*',
        methods: '*',
}));

// Function to hash location of where the user minted nft
async function hash(loc) {
    const { createHmac } = await import('node:crypto');
    const secret = config.get('STREAM_SECRET');
    const hash = createHmac('sha256', secret)
                   .update(loc)
                   .digest('hex');
    console.log(hash)
    return hash;
}

// NFT.Storage :ipfs
async function UploadNewNFT(name, video_id, latlong ) {
    const location = await hash(latlong);
    const storage = new NFTStorage({ endpoint, token })
    const metadata = {
        name: name,
        description:description,
        image: "ipfs://bafkreicrkymtfor6pfegqv4moysjekbi536nr4uswh5lfsz77ryutfgmca",
        properties: {
        video:video_id,
        location: locations
        },
    };

    const readmeFile = new File(JSON.stringify(metadata), '3', { type: 'text/json' });
   
    const cid = await storage.storeDirectory([readmeFile])
    console.log({ cid })
    const status = await storage.status(cid)
    console.log(status)

    return true;
}

// NFT.Storage :ipfs
async function UploadManyNewNFT(directory) {
    const storage = new NFTStorage({ endpoint, token })
    
    let files = [];
    var index = 1;
    directory.forEach(async (obj) => {
        const metadata = {
            name: obj.name,
            description:description,
            image: "ipfs://bafkreicrkymtfor6pfegqv4moysjekbi536nr4uswh5lfsz77ryutfgmca",
            properties: {
            video:obj.video,
            location: obj.locations
            },
        };

        const readmeFile = new File(JSON.stringify(metadata), `${index}.json`, { type: 'text/json' });
        index++;
        files.push(readmeFile);
     });
  
   console.log(files)
    const cid = await storage.storeDirectory(files)
    console.log({ cid })
    const status = await storage.status(cid)
    console.log(status)
    return true;
}

// server to add new minted metadata to ipfs
const uploadNewNFTAPI = async (req, res) => {
    const {name, video_id, latlong} = req.body

    try {
        const result = await UploadNewNFT(name, video_id, latlong)
        if(result) {
            return res.status(200).send({
                status: 'Success',
                message: 'Added NFT metadata in bulk to NFT.Storage in IPFS',
            })
        }
        return res.status(400).send({
            status: 'Failed',
            message: 'Failed to add NFT metadata ...',
        })
    } catch (error) {
        return res.status(500).send({
			status: 'Error',
			message: error.message,
		});
    }
}

// server function to add many at once to ipfs
const uploadManyNewNFTAPI = async (req, res) => {
    const {directory} = req.body

    try {
        const result = await UploadManyNewNFT(directory)
        if(result) {
            return res.status(200).send({
                status: 'Success',
                message: 'Added NFT metadata in bulk to NFT.Storage in IPFS',
            })
        }
        return res.status(400).send({
            status: 'Failed',
            message: 'Failed to add NFT metadata ...',
        })
    } catch (error) {
        return res.status(500).send({
			status: 'Error',
			message: error.message,
		});
    }
}


app.post('/upload/nft', uploadNewNFTAPI)
app.post('/upload/multiple/nft', uploadManyNewNFTAPI)


exports.app = functions.https.onRequest(app)
