const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



// middlewere
app.use(cors());
app.use(express.json());




const uri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7argw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
 

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
      );
      
    const gamerCollection = client.db("assignment-10").collection("Reviews");

      const userCollection = client.db("assignment-10").collection("users");
      const personCollection = client.db("assignment-10").collection("person");



      // get data
   app.get("/reviews", async (req, res) => {
     const { sortField, genre } = req.query;

     // Default query object for filtering by genre
     const query = genre ? { genres: genre } : {};

     // Sort criteria object
     const sortCriteria = {};
     if (sortField === "Rating") {
       sortCriteria.rating = -1; // Sort by rating in descending order
     } else if (sortField === "Year") {
       sortCriteria.year = -1; // Sort by year in descending order
     }

     try {
       // Apply filter and sort to the query
       const cursor = gamerCollection.find(query).sort(sortCriteria);
       const result = await cursor.toArray();
       res.send(result);
     } catch (error) {
       console.error("Error fetching reviews:", error);
       res.status(500).send("Error fetching reviews.");
     }
   });
    
    // riview details
     app.get("/reviews/:id", async (req, res) => {
       const id = req.params.id;
       const query = { _id: new ObjectId(id) };
       const result = await gamerCollection.findOne(query);
       res.send(result);
     });

    
    //

    // review post
     app.post("/reviews", async (req, res) => {
       console.log(req.body);
       const newGame = req.body;
       const result = await gamerCollection.insertOne(newGame);
       res.send(result);
     });











    //
    
    
    

       

      app.get('/person', async (req, res) => {
          const curson = personCollection.find();
          const result = await curson.toArray();
          res.send(result);
      })
      
      app.post('/person', async (req, res) => {
          const newPerson = req.body;
          const result = await personCollection.insertOne(newPerson);
          res.send(result);
      })
    
    app.patch('/person', async (req, res) => {
      const email = req.body.email;
      console.log(email);
      const filter = { email };
      const updateDoc = {
        $set: {
          lastLogInTime: req.body.lastLogInTime
        },
      };
      const result = await personCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.delete('/person/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await personCollection.deleteOne(query);
      res.send(result);
    })
      
      
      
      // create data
      // app.post('/users', async (req, res) => {
      //     console.log(req.body);
      //     const newUser = req.body;
      //     const result = await userCollection.insertOne(newUser);
      //     res.send(result);
          
      // })
     


      app.put('/users/:id', async (req, res) => {
          console.log(req.params.id);
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
              $set: req.body,
          }
          const result = await userCollection.updateOne(filter, updateDoc, options);
          res.send(result);
      })

      app.delete('/users/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await userCollection.deleteOne(query);
          res.send(result);
      })



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server Running ');
})

app.listen(port, () => {
    console.log(`Example app Listening on port ${port}`);
})

