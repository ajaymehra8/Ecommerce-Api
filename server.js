const dotenv=require("dotenv");
const express= require('express');
const colors= require("colors");
const cors=require("cors");
const morgan= require("morgan");
const db=require('./config/db');
const authRoutes=require("./routes/auth")
const categoryRoutes=require("./routes/categoryRoutes");
const productRoutes=require("./routes/productRoutes");

//configure dotenv
dotenv.config();

//connect with database
db();

//rest objects
const app=express();

const PORT=process.env.PORT;

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//cors policy
// middleware
app.use(cors({
    origin: 'https://ecommerce-app-absr.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));


//routes

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/products",productRoutes);


//rest apis
 
app.get('/',(req,res)=>{
    res.send("hellow");

});

app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`.bgCyan.white);
})
