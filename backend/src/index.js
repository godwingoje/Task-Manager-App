import express from "express"

const app = express()

// app.post();
app.get('/', (req, res)=>{
    res.send("Todo App!")
});
// app.put();
// app.patch();
// app.delete();


app.listen(8000, ()=>{
    console.log("server don start to dey listen on 8000")
})
