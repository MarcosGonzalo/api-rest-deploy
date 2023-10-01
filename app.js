const express = require("express");
const peliculas = require("./movies.json");
const crypto = require("crypto");
const cors = require("cors");
const { validarPelicula, validarPropiedadPelicula } = require("./validarPelis");

const app = express();


app.use(express.json())

app.use(cors({
    origin: (origin, callback) => {
        if (origin === "http://localhost:8080" || !origin) {
            return callback(null, true)
        }

        return callback(new Error("Not allowd by cors xd"))
    }

}))

app.get("/peliculas", (req, res) => { 

    // res.header("Access-Control-Allow-Origin", "http://localhost:8080")


    const { genero } = req.query;
    console.log(genero, "genero");
    if (genero) {
        const filtro = peliculas.filter(peli => peli.genre.some( g => g.toLowerCase() === genero.toLowerCase()));
        return res.json(filtro)
    }

    res.json(peliculas)
})
/*
app.options("/peliculas/:id", (req, res) => { 
    const origen = req.header("origin");
    console.log(origen)
    console.log(origen === "http://localhost:8080" || !origen )
    if (origen === "http://localhost:8080" || !origen ) {
        res.header("Access-control-Allow-Origin", origen)
        res.header("Access-control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
    }

    res.send(200)
})*/

app.delete("/peliculas/:idPeli", (req, res) => { 
    const { idPeli } = req.params;

    const indicePeli = peliculas.findIndex(peli => peli.id === idPeli);

    if (indicePeli === -1) { 
        return res.status(404).json({ error: "La pelicula no fue eliminada porque no existe" })
    }

    peliculas.splice(indicePeli, 1)

    return res.json({ "message": "Pelicula Eliminada con exito"})
})


app.get("/peliculas/:idPeli", (req, res) => { 
    const { idPeli } = req.params;

    const findPeli = peliculas.find(peli => peli.id === idPeli)
    
    if (!findPeli) return res.status(404).send("Esta pelicula no existe o no esta fuera de servicio")


    res.json(findPeli)


})

app.post("/peliculas", (req, res) => {
    
    const resultado = validarPelicula(req.body)
    console.log(resultado)
    const newPeli = {
        id: crypto.randomUUID(),
        ...resultado.data,
        rate: req.body.rate ? req.body.rate  : 9.3
    }
    console.log(resultado.rate ? resultado.rate : 9.3)
    

    peliculas.push(newPeli)

    res.json(newPeli)

})

app.patch("/peliculas/:idPeli", (req, res) => {
    
    const resultado = validarPropiedadPelicula(req.body)


    if (!resultado.success) {
        return res.status(404).json({"message": JSON.parse(resultado.error.message)})
    }


    const id = req.params.idPeli
    const indicePeli = peliculas.findIndex(peli => peli.id === id)


    const newPeli = {
        ...peliculas[indicePeli],
        ...resultado.data
    }

    console.log(newPeli)
    console.log(resultado.data)

    peliculas[indicePeli] = newPeli

    res.json(newPeli)
        

})

const cb0 = function (req, res, next) {
    console.log('CB0')
    next()
  }
  
  const cb1 = function (req, res, next) {
    console.log('CB1')
    next()
  }
  
  app.get('/example/d', [cb0, cb1], (req, res, next) => {
    console.log('the response will be sent by the next function ...')
    next()
  }, (req, res) => {
    res.send('Hello from D!')
  })




app.listen(process.env.PORT || 3000, () => {
    console.log("El servidor esta corriendo en http://localhost:3000");
})