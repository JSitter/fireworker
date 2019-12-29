// Front end library with access to fetch
let fetchData = function(url, payload, method){
  console.log("Fetching")
  return new Promise((resolve, reject)=>{
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
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
  }
    console.log(reqParams)
    fetch(url, reqParams).then((response)=>{

      if(response.status != 200){
        console.log("Error fetching: ", response)
        reject(response.text);
      }

      response.json().then((data)=>{
        resolve(data);
      });

    }).catch((err)=>{
      console.log("Error recieved: ", err);
      reject(String(err));
    });
  });
};

export function userLogin(userName, password1){
  console.log("logging in");
  return {_uid: "myuseride"}
}

export function registerNewUser(userData){
  console.log("Library function: Registering User")
  return new Promise((resolve, reject) => {
    fetchData('/register/', userData, 'POST').then((response) => {
      resolve(response);
    }).catch((err)=>reject(err));
  });
}

export function checkUserAvailability(username){
  return new Promise((resolve, reject)=>{
    fetchData('/find/'+username, {}, 'GET').then((response)=>{
      resolve(response)
    })
  }).catch((err) => reject(err));
}
