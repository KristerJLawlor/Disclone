//index.ts

//imports
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';  //mechanism to safely bypass the same-origin policy, that is, it allows a web page to access restricted resources from a server on a domain different than the domain that served the web page
import mongoData from './mongoData';
import { error } from 'console';

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

//test
app.post("/test/message", (req: Request, res: Response) => {

  console.log(req.body);  //JSON data logged

  res.send("<h2> You have triggered post! </h2>");     //echo result back

});


//create new channel
app.post('/new/channel', (req: Request, res: Response) => {

  console.log(req.body);

  const dbData = req.body;  //save data to immutable variable

  if(mongoData.find({channel: dbData.channel})) //check for duplicate names and prevent adding if found
    {
      res.status(304).send();
      console.log("Not added due to duplication");
      return;
    }

  //create file from request
  mongoData.create(dbData)
    .then((result) => {res.status(201).send(dbData); }) //respond with success code

    .catch((err) => {res.status(500).send(err)});  //respond with server error code

});


//retrieve a channel list
app.get('/get/channelList', (req: Request, res: Response) => {

  mongoData.find({})
    .then((documents) => {
      console.log("inside get channel list");
      let channels = [];  //create new array for channels

      documents.map((channelData) => { //map through document and retrieve id + name and save to channelInfo
        const channelInfo = {
          id: channelData._id,
          name: channelData.channel
        }
        channels.push(channelInfo)  //add channelInfo to list of channels
      })

      res.status(200).send(channels);}) //success

    .catch((err) => {res.status(500).send(err)}); //error

});


//send a new message and push the message to the db
app.post('/new/message', (req: Request, res: Response) => {

  const id = req.query.id;  //need the unique ID to update the channel
  const newMessage = req.body;

  mongoData.updateOne(
    {_id: req.query.id},
    {$push: { conversation: req.body }}, //define which conversation to inject new message in to and send it
  )
  .then((data) => {

    console.log(req.body);

    res.status(201).send(data); 

  }) 
  .catch((err) => {

    console.log('Error saving message...');

    console.log(err); 
  })
})


//retrieve data generic
app.get('/get/data', (req: Request, res: Response) => {
  mongoData.find({}).then((data) => {
    
    res.status(200).send(data);

  }).catch((err) => {
    
    res.status(500).send(err);

  });

})


//retrieve messages in specific conversation
app.get('/get/conversation', (req: Request, res: Response) => {
  const id = req.query.id;
  
  mongoData.findById({_id: id}).then((data) => {
    
    res.status(200).send(data);

  }).catch((err) => {
    
    res.status(500).send(err);

  });
})


//listen
app.listen(port, () => {

  console.log("Listening to port 3000");

});