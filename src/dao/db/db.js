const mongoose = require('mongoose');

module.exports = {
  connect: () =>{
    return mongoose.connect("mongodb+srv://marceeferreyra:Marce507@coder-backend.osbdrri.mongodb.net/ecommerce")
    .then (()=>{
      console.log (`Conexión a DB exitosa`)
    }).catch((error)=> {
      console.log(error)
     })
  }
}



