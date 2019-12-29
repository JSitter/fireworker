// Front end library with access to fetch
let fetchData = function(url, payload, method){
  return new Promise((resolve, reject)=>{
    let reqParams;

    if(method != "POST"){

      reqParams = {
        method : "GET",
        mode : "cors",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      }

    }else{

      reqParams = {
        method : "POST",
        mode : "cors",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
  }

    fetch(url, reqParams).then((response)=>{
      if(response.status != 200){
        console.log("error text: ", response.text)
        reject(response.text);
      }

    response.json().then((data)=>{
      resolve(data);
    });


    }).catch((err)=>{
      console.log("Error Fetching Resource: ", err)
      reject(String(err));
    });
  });
};

export function userLogin(userData){
  return new Promise((resolve, reject) => {
    fetchData('/login/', userData, 'POST').then((response)=>{
      resolve(response);
    }).catch((err)=> {
      reject(err)});
  });
}

export function registerNewUser(userData){
  return new Promise((resolve, reject) => {
    fetchData('/register/', userData, 'POST').then((response) => {
      resolve(response);
    }).catch((err)=>reject(err));
  });
}

export function checkUserAvailability(username){
  return new Promise((resolve, reject)=>{
    fetchData('/find/'+username, {}, 'GET').then((response)=>{
      resolve(response);
    })
  }).catch((err) => reject(err));
}

export function getCookie(){
  return new Promise((resolve, reject) => {
    fetchData('/login/', {}, 'GET').then((response) => {
      resolve(response);
    }).catch(err => reject(err));
  });
}
