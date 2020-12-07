require('dotenv').config();
const express = require('express')
const db =require('./db');
const morgan = require('morgan')
const app = express()

//app.use(morgan("dev")); --> middleware
app.use(express.json());
// Get method to get all restaurants 
app.get('/api/v1/restaurants', async(req,res) =>{
    try{
        const results = await db.query("select * from restaurants")
        console.log(results)
        res.status(200).json({
            status :"success",
            results:results.rows.length,
            data : {
                restaurants : results.rows
            },
        });
    }catch(err){
        console.log(err)
    }
});
app.get('/api/v1/restaurants/:id', async(req,res)=>{
    console.log(req.params.id);
    try{
        const results = await db.query(` select * from restaurants where id = ${req.params.id}`);
        res.status(200).json({
            status:"success",
            data :{
                restaurant : results.rows[0],
            }
        });
        
    }catch(err){
        console.log(err)
    }
});
// create a restaurants
app.post('/api/v1/restaurants', async(req,res)=>{
    console.log(req.body);
    try {
        const results = await db.query(" INSERT INTO restaurants (name, location, price_range) values($1, $2, $3) returning *",[req.body.name,
             req.body.location, req.body.price_range] )
        console.log(results.rows);
          res.status(201).json({
            status: "success",
            data :{
                restaurant : results.rows[0]
            }
         });
    }catch(err){
        console.log(err)
    }
});
// Update restaurants
app.put("/api/v1/restaurants/:id", async(req,res)=>{
    try{
        const results = await db.query(
            "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
            [req.body.name, req.body.location, req.body.price_range, req.params.id]
        );
        console.log(results);
        res.status(200).json({
            status : "success",
            data :{
                restaurant : results.rows[0]
            },
        });
    }catch(err){
        console.log(err);
    }
})
//Delete restaurant 
app.delete('/api/v1/restaurants/:id', async(req,res)=>{
    try{
        const results = await db.query("DELETE FROM restaurants where id = $1",[req.params.id])
        console.log(req.params.id)
        res.status(200).json({
            status:"success"
        });
    }catch (err){
        console.log(err)
    }
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`app is running on port ${port}`);
});
