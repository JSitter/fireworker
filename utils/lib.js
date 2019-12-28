// Front end library with access to fetch
let fetchData = function(url, payload, method){
  console.log("Setting Params");
  return new Promise((resolve, reject)=>{
    console.log("Promising feedback", url);
    let reqParams;

    if(method != "POST"){

      reqParams = {
        method : "GET",
        mode : "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }

    }else{

      reqParams = {
        method : "POST",
        mode : "cors",
        credentials: "include",
        headers: {
          "Content-Type":"application/x-www-form-urlencoded",
        },
        body: JSON.stringify(payload)
      }
  }
    console.log("Url: ", url);
    console.log("Params: ", reqParams)
    console.log("Fetch: ", fetch)
    fetch(url, reqParams).then((response)=>{
      console.log("Attempting to fetch");
      if(response.status != 200){
        console.log("ERror: ", response)
        throw new Error(response.text);
      }
      console.log('Response from Server: ', response.status);
      response.json().then((data)=>{
        console.log("Received data: ", data)
        return data;
      });
    })
    .catch((err)=>{
      console.log("Error recieved: ", err);
      new Error(String(err));
    });

  });
  
};

export function userLogin(userName, password1){
  console.log("logging in");
  return {_uid: "myuseride"}
}

export function userRegister(userData){
  return {_uid: "testuserid"}
}

export function checkUserAvailability(username){
  console.log("Calling fetching function");
  fetchData('/find/'+username, {}, 'GET').then((response)=>{
    console.log("Returned ", response)
  })
}
