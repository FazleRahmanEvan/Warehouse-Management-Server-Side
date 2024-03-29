const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqabw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
      try{
          await client.connect();
          const inventoryCollection = client.db('motorBike').collection('inventory');

       app.get('/inventory', async (req,res) => {
        const query ={};
        const cursor = inventoryCollection.find(query);
        const inventorys = await cursor.toArray();
        res.send(inventorys);
       });

       app.get('/inventory/:id', async(req,res) =>{
           const id = req.params.id;
           const query= {_id: ObjectId(id)};
           const inventory = await inventoryCollection.findOne(query);
           res.send(inventory);
       });

       //post

       app.post('/inventory', async(req, res) => {
           const newInventory = req.body;
           const result = await inventoryCollection.insertOne(newInventory);
           res.send(result);
       })

       //delete
       app.delete('/inventory/:id', async(req,res) => {
           const id = req.params.id;
           const query = {_id: ObjectId(id)};
           const result = await inventoryCollection.deleteOne(query);
           res.send(result);
       })

       app.put("/inventory/:id", async (req, res) => {
        const id = req.params.id;
        const updatedStock = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDocument = {
          $set: updatedStock
      };
        const result = await inventoryCollection.updateOne(
          filter,
          updateDocument,
          options
        );
        console.log("updating", id);
        res.send(result);
      });
    
     

      }
      finally{

      }
}

run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Server Running');
});

app.listen(port,() =>{
    console.log('Listening to port', port)
})
