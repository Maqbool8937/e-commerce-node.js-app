import express from "express";
import morgan from "morgan";

// rest object 
const app = express();

// middlewares
app.use(morgan('dev'));

// route
app.get('/', (req, res) => {

    return res.status(200).send(
        "<h1>E-comm App</h1>"
    )
});
// port 
const PORT = 3000;
// listen
app.listen(PORT, () => {
    console.log("Server is running on port ")
})

