const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

const MongoConnection = 'mongodb+srv://NyxCaelum:TNsne0xWihFwdgow@react-jwt.b2x3jy3.mongodb.net/System-app';
// const MongoConnection = 'mongodb://127.0.0.1/JWT-Roles';
db.mongoose.connect(`${MongoConnection}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


app.get('/', (req, res) => {
    res.send("server works");
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

const PORT = process.env.PORT || 8080;

app.listen( PORT, () => {
    console.log( `Server runing on port ${PORT}, http://localhost:${PORT}` )
})

//Funcion para añadir roles a la coleccion si no existe
async function initial() {

    const count = await Role.countDocuments();

    if(count === 0){
        const newRoleU = new Role({
            name: "user"
          });
          
          newRoleU.save().then(() => {
                  console.log("added 'user' to roles collection");
          }).catch((err) => {
              console.log(err)
          })
    
          const newRoleM = new Role({
              name: "moderator"
          });
    
          newRoleM.save().then(() => {
                  console.log("added 'moderator' to roles collection");
          }).catch((err) => {
              console.log(err)
          })
    
          const newRoleA = new Role({
              name: "admin"
          });
    
          newRoleA.save().then(() => {
                  console.log("added 'admin' to roles collection");
          }).catch((err) => {
              console.log(err)
          })
    }
  }
