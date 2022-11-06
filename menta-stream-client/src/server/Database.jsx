

export async function GetNFTWithinRegion (handleAdd, center, radius) {
    console.log("GetNFTWithinRegion: ");
    // if (typeof(center.latitude) == "undefined") {
    //     return;
    // }

    // const center_query = [center.latitude, center.longitude];
    // console.log(center_query);
    // const ref = app.database().ref('GeoList');
    // var geoFireInstance = new geofire1.GeoFire(ref);
    
    // var geoQuery = geoFireInstance.query({
    //     center: center_query,
    //     radius: radius
    // });

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