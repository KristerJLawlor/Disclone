//index.ts

//imports
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';  //mechanism to safely bypass the same-origin policy, that is, it allows a web page to access restricted resources from a server on a domain different than the domain that served the web page
import mongoData from './mongoData';

//app config
const app = express();
const port = 3000;

//middleware
app.use(express.json());  //define what express will parse
app.use(cors());  //cross origin resource sharing. Allows access from other domains (origins)

//db config   pass: KBw3wxv9DMVVKtwH
const mongoURI = 'mongodb+srv://admin:KBw3wxv9DMVVKtwH@cluster0.b17mu.mongodb.net/DiscloneDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI);

app.get("/", (req: Request, res: Response) => {

  res.send("<h1> Hello World </h1>");

});


//api routes
app.post("/api/sendMessage", (req: Request, res: Response) => {

  console.log(req.body);  //JSON data logged

  res.send("<h2> You have triggered post! </h2>");     //echo result back

});

app.post('/new/channel', (req: Request, res: Response) => {

  console.log(req.body);

  const dbData = req.body;  //save data to immutable variable

  //create file from request
  mongoData.create(dbData)
    .then((result) => {res.status(201).send(dbData); }) //respond with success code

    .catch((err) => {res.status(500).send(err)});  //respond with server error code

    
  
});


app.listen(port, () => {

  console.log("Listening to port 3000");

});