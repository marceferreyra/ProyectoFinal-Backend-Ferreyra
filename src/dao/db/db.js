const mongoose = require('mongoose');
const config = require('../../config/config')

module.exports = {
  connect: () =>{
    return mongoose.connect(config.dbUrl)
    .then (()=>{
      console.log (`Conexión a DB exitosa`)
    }).catch((error)=> {
      console.log(error)
     })
  }
}



