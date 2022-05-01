const express = require("express")
const app = express()
const mysql = require("mysql")
require("dotenv").config()

const db = mysql.createPool({
   connectionLimit: 100,
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE,
   port: process.env.DB_PORT
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.getConnection( (err, connection)=> {
   if (err) throw (err)
   console.log ("DB connected successful: " + connection.threadId)
})

app.get("/",(req,res) => {
   res.json({message:"ok"})
});

app.get("/transacao",async(req,res,err)=>{
   const sql = "SELECT * FROM local"
   db.query(sql,function(err,data,fields){
      res.status(200).json({
         status: "sucess",
         length: data?.length,
         data: data,
      })
   })
})

app.post("/transacao_entrada",async(req,res) => {

   const data = req.body     

   const sql = `INSERT INTO local (local, tipo, tarefa, um, qtde, codigo, transacao) VALUES ('${data.local}','${data.tipo}',${data.tarefa},'${data.um}',${data.qtde},'${data.codigo}','${data.transacao}')`        

   db.query(sql,function(err,data,fields){
      
      if(err){
         return res.status(500).json({
            status: "error",
            message: err.message,
            data: [req.body],
            query: sql,
            
         })
      }

      res.status(201).json({
         status: "success",         
      })
   })   
});


app.post("/transacao_saida",async(req,res) => {

   const data = req.body     

   const sql = `INSERT INTO local (local, tipo, tarefa, um, qtde, codigo, transacao) VALUES ('${data.local}','${data.tipo}',${data.tarefa},'${data.um}',${data.qtde},'${data.codigo}','${data.transacao}')`        

   if(data.qtde >= 0 ){
      return res.status(500).json({
         status: "error",
         message: "A quantidade deve ser negativa",
         data: [req.body],
         query: sql,
         
      })   
   }   

   db.query(sql,function(err,data,fields){
      
      if(err){
         return res.status(500).json({
            status: "error",
            message: err.message,
            data: [req.body],
            query: sql,
            
         })
      }

      res.status(201).json({
         status: "success",         
      })
   })   
});

const port2 = 3000

app.listen(port2, 
()=> console.log(`Server Started on port ${port2}...`))