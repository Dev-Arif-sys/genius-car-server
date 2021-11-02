const express=require('express')
const app= express();
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId
const cors=require('cors')
require('dotenv').config()
const port = process.env.PORT|| 5000;

app.use(cors());
app.use(express.json());


// userName: myDbUser1
// pass:EEGJ8dqap5ZlUI59

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ffgwy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

async function run(){
   try{
      await client.connect()
      console.log('connected to the database')
      const database= client.db('geniusMechanic');
      const servicesCollection=database.collection('services');

      app.get('/services',async(req,res)=>{
          const cursor=servicesCollection.find({})
          const services= await cursor.toArray()
          res.send(services)
      })

      app.get('/services/:id',async(req,res)=>{
          const id = req.params.id
          const query={_id:ObjectId(id)}
          const service= await servicesCollection.findOne(query)
          res.send(service)
      })

      app.post('/services',async(req,res)=>{
          const service=req.body
          const result=await servicesCollection.insertOne(service)
         res.json(result)
      })

      app.delete('/services/:id',async(req,res)=>{
          const id=req.params.id;
          const query={_id:ObjectId(id)};
          const result=await servicesCollection.deleteOne(query)
          res.json(result);
      })
   }
    finally{

   }
}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('genius server running')
})
app.listen(port,()=>{
    console.log('server running on',port)
})