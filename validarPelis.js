const z = require("zod")

const prototipoPeli = z.object(
    {
        title: z.string({
            invalid_type_error: "Movie title must be a string",
            required_error: "Movie title is required"
        }),
        year: z.number().int().min(1900).max(2023),
        director: z.string(),
        duration: z.number().int().positive(),
        poster: z.string().url({
            "message": "The Poster must be a valid URL"
        }),
        genre: z.array(
            z.enum(["Action", "Drama", "Crime"]),
            {
                invalid_type_error: "The Genre must be an array of enum genre",
                required_error: "The Genre is required"
            }
        ),
        rate: z.number().min(0).max(10).optional()
    }
)

function validarPelicula(input) {
    return prototipoPeli.safeParse(input)
}

function validarPropiedadPelicula(input) { 
    return prototipoPeli.partial().safeParse(input)

}

module.exports = {
    validarPelicula,
    validarPropiedadPelicula
}