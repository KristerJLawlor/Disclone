// index.ts

// Import express library
import express, { Request, Response } from 'express';

// Creates an express object
const app = express();

app.use(express.json());

// It listens to HTTP get request. 
// Here it listens to the root i.e '/'
app.get("/", (req: Request, res: Response) => {

  // Using send function we send
  // response to the client
  // Here we are sending html
  res.send("<h1> Hello World </h1>");
});

app.post("/api/sendMessage", (req: Request, res: Response) => {

  console.log(req.body);//req.body.user + " has logged in to " + req.body.channel + " channel.");  //JSON data logged

  res.send("<h2> You have triggered post! </h2>");     //echo result back
});

// It configures the system to listen
// to port 3000. Any number can be 
// given instead of 3000, the only
// condition is that no other server
// should be running at that port
app.listen(3000, () => {

  // Print in the console when the
  // servers starts to listen on 3000
  console.log("Listening to port 3000");
});