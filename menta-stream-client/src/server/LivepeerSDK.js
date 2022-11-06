import axios from 'axios';
const LIVESTREAM_API = process.env.REACT_APP_LIVESTREAM_API;

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Methods": "*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${LIVESTREAM_API}`,
};
export async function RequestUplaodNewStream(nameStream, video) {

    console.log(headers);
   // get upload streamn URL:
   try {
    const response = await fetch(
        "https://livepeer.studio/api/asset/request-upload",
        {
          method: "POST",
          headers:headers,
          body: JSON.stringify({
            name: nameStream,
          }),
        }
      );
      
      const { url } = await response.json();

      const upload = await fetch(url, {
        method: "PUT",
        body: video,
      });

      console.log("upload", upload)
    } catch(error) {
        console.log(error)
    }

}

export async function GetUplaodNewStreamStatus(id) {

    const response = await fetch(`https://livepeer.studio/api/asset/${id}`, {
        method: "GET",
        headers:headers
      });
      
      const { status } = await response.json();
      console.log('status', status)
      return status;
 }