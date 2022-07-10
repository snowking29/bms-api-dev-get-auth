const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uri = "mongodb+srv://dbDeveloper:MHqaGjazwTDcGbu2@mycluster.4rkjp.mongodb.net/bmsDB?retryWrites=true&w=majority"
let isConnected;

module.exports = connectToDatabase = () => {
    if (isConnected) {
        console.log("=> Using existing database connection");
        return Promise.resolver
    }
    console.log("=> Using new database connection");
    return mongoose.connect(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db => {
        console.log("Conectado a la DB", mongoose.connection.readyState)
        isConnected = db.connections[0].readyState;
    })
    .catch(err => console.log("Error al conectar a la DB:",err));
};
