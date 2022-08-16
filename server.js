const express = require("express");
const app = express()
const cors  = require("cors");
const {Client} = require("pg");
const dotenv = require('dotenv');
const PORT  =  process.env.PORT || 5000;
dotenv.config()
app.use(express.json())
app.use(cors());    
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

 client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('heroku db connected')
    }
});

app.get("/",(req,res)=>{
    res.send("You found the backends");
})

app.get("/products", async(req,res)=>{
    try {
        const herbalTeas = await client.query("SELECT * FROM products WHERE flavor_type = $1",['Herbal Tea']);
        const dairyKefir = await client.query("SELECT * FROM products WHERE flavor_type = $1",['Dairy Kefir']);
        const nonDairyKefir = await client.query("SELECT * FROM products WHERE flavor_type = $1",['Non Dairy Kefir']);
        const fruitInfused = await client.query("SELECT * FROM products WHERE flavor_type = $1",['Fruit Infused']);
        res.send(herbalTeas.rows);
    } catch (error) {
        console.log(error.message);
    }
})

app.get("/blogs",async(req,res)=>{
    try {
        const blogs = await client.query("SELECT * FROM blogs");
        res.send(blogs.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.listen(PORT,console.log(`server started at port: ${PORT}`))