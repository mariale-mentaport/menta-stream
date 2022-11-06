import {MentaportSDK, MentaportTypes, MentaGeoLocation} from "@mentaport/sdk-web";
const geofire = require('geofire-common');

const MENTAPORT_API = process.env.REACT_APP_MENTAPORT_API_KEY;
const MENTAPORT_BASE_URL = process.env.REACT_APP_BASE_URL;
const keyId = process.env.REACT_APP_KEY_ID_CONTRACT;

console.log(MENTAPORT_API)
console.log(MENTAPORT_BASE_URL)

const sdkClient = new MentaportSDK({
    baseUrl: MENTAPORT_BASE_URL,
    apiKey: MENTAPORT_API
});


export function DistanceBtwePopints(lat,lng,lat1,lng1, distance) {
    
    const distanceInKm = geofire.distanceBetween([Number(lat), Number(lng)], [Number(lat1), Number(lng1)]);
    const distanceInM = distanceInKm * 1000;
    // too close
    if (distanceInM <= distance ) {
       return false;
    }
    return true;
}

export async function AddNFTbyLocation(tokenId, wallet, radius, name) {
   try {
        const result = await sdkClient.addNFTbyLocation(keyId,tokenId,wallet, radius, name);
        console.log(result);
        return true;
    } catch(err) {
        console.log(err);
        return false;
   }
}

export async function GetNFTWithinRegion(radius, handleAdd) {
    console.log("GetNFTWithinRegion: ",radius);
    try {
        const result = await sdkClient.getNFTbyLocation(keyId, radius);
        console.log(result);
        if(result.status == "Success") {
            for(var i=0;i<result.data.length;i++) {
                const location = [result.data[i].latitude,result.data[i].longitude];
                handleAdd(result.data[i].tokenId, result.data[i].walletAddress,location, result.data[i].name,result.data[i].info);
            }
            return true;
        }
      
      
        return false;
    } catch(err) {
        console.log(err);
        return false;
    }
   
    // var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location) {
    //    // console.log(key + " entered the query. Hi " + key + "!");
    //     //console.log(location);
    //     handleAdd(key, location);
    // });
 }

 export async function GetNFT(key) {
    // const ref = app.database().ref('NFTCards').child(key);
    // const nft = await ref.once('value');
    // return JSON.parse(nft.val());
    return null;
 }