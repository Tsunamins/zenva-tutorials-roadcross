const baseURL = "http://localhost:3000";

const adapter = {

  getStats: () => {
    return fetch(`${baseURL}/stats`)
    .then(res=>res.json())
  },

  createStat: (score, hit) => {
    return fetch(`${baseURL}/stats`, {
      method: 'POST',
      headers: { 
        "Accept": "application/json", 
        "Content-Type": "application/json"
     },
      body: JSON.stringify({'score': score, 'hit': hit})
      
   
})
.then(res => res.json())
},

}

