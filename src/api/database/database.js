const mongoose = require('mongoose');

const uri = "mongodb+srv://dbDeveloper:MHqaGjazwTDcGbu2@mycluster.4rkjp.mongodb.net/bmsDB?retryWrites=true&w=majority"

mongoose.connect(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(db => console.log("Conectado a la DB", mongoose.connection.readyState))
.catch(err => console.log("Error al conectar a la DB:",err));