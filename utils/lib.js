// Front end library with access to fetch
let fetchData = function(url, payload, method){
  let headers;

  if(method != "POST"){
    method = "GET"
    headers = 'application/json';

  }else{
    headers = 'application/x-www-form-urlencoded';
  }

  let reqParams = {
    method : method,
    mode : "cors",
    credentials: "include",
    headers: {
      'Content-Type': headers,
    },
    body: JSON.stringify(payload)
  }

  fetch(url, reqParams).then((response)=>{
    if(response.status != 200){
      throw new Error(response.text);
    }
    response.json().then((data)=>{
      return data;
    });
  })
  .catch((err)=>new Error(String(err)));
};

export function userLogin(userName, password1){
  console.log("logging in");
  return {_uid: "myuseride"}
}

export function userRegister(userData){
  return {_uid: "testuserid"}
}
