/* Crear un API utilizando NodeJs con la que pueda manejar una agenda telefonica, se debera crear lo siguientes endpoint:

 /api/contacts

agregar los siguientes methods
obtener todos los contactos - get
obtener un contacto en especifico - get (hint: necesitas un params :id)
si el param id llega undefined responder con un 404 Not Found
si el param id no es un number devover un 400 bad request
nota: para este ejercicios se utilizara un array para almacenar los contactos

datos del contacto:
nombre completo
telefono
correo

Continuar el proyecto de la agenda telefonica y agregar los metodos para agregar, actualizar, filtrar y eliminar
Validar los campos que no llegen undefined, retornar un 400 bad request
validar el correo que sea unico (que no se repita por contacto), retornar un bad request 400 

*/
import express, {Request, response, Response} from "express";
import { request } from "http";


const app = express();
const port = 3000;
app.use(express.json());
let sequence = 0;

type Contact = {
    id: number,
    nombre: string,
    telefono: number,
    correo: string
}

const contacts: Contact[] = []


app.get('/api/contacts/:id', (request: Request, response: Response) => {
    const id = Number.parseInt(request.params.id);

    if(Number.isNaN(id)) {
        return response.status(400).json({
            msg: "id debe ser un numero",
            parameter: 'id',
            value: id
        });
    }

    const result = contacts.find(
        (item) => item.id === id);
    
    if(!contacts){
        return response.status(404).json({
            msg: "Not found"
        })
    }
    
    response.json({
        data:result
    });

})

app.get('/api/contacts', (request: Request, response: Response) => {
    response.json(contacts)

})
//filtra por nombre de contacto
app.get('/api/contacts/filter/:nombre', (request: Request, response: Response) => {
    const nombre = request.params.nombre;

    const result = contacts.filter((contacto) => contacto.nombre.toLocaleLowerCase().includes(nombre.toLocaleLowerCase()));
    response.json(result)

})

app.post('/api/contacts', (request: Request, response: Response) =>{
    const {nombre, correo, telefono} = request.body;

    if (!nombre || !correo || !telefono) {
        return response.status(400).json({
            msg: "Todos los campos son requeridos",
        });
    }

    if (typeof telefono !== "number") {
        return response.status(400).json({
            msg: "El campo 'telefono' debe ser un número",
            parameter: "telefono",
            value: telefono,
        });
    }

    if (contacts.some((contact) => contact.correo === correo)) {
        return response.status(400).json({
            msg: "El correo ya existe",
            parameter: "correo",
            value: correo,
        });
    }

    sequence +=1;
    const contact: Contact = {
        id: sequence,
        nombre,
        correo,
        telefono
    }

    contacts.push(contact)
    response.status(201).json(contact)
})
//Actualiza
app.put('/api/contacts/:id', (request: Request, response: Response) => {
    const { id } = request.params;
    const { nombre, telefono, correo} =request.body;

    if(Number.isNaN(id)) {
        return response.status(400).json({
            msg: "id debe ser un numero",
            parameter: 'id',
            value: id
        });
    }

    const result = contacts.find(
        (item) => item.id === Number.parseInt(id));
    
    if(!result){
        return response.status(404).json({
            msg: `No se encuentra un producto con el id: ${id}`
        })
    }
    result.nombre = nombre ?? result.nombre;
    result.telefono = telefono ?? result.telefono;
    result.correo = correo ?? result.correo;


    
    response.status(200).json({
        data:result
    });

})

app.delete('/api/contacts/:id', (request: Request, response: Response) =>{
    const { id } = request.params;

    const contact = contacts.find((item)=> item.id === Number.parseInt(id));

    if(!contact) {
        return response.status(404).json({
            msg: `No se enceuntra un producto con el id: ${id}`
        });
    }

    const contactIndex = contacts.findIndex((item) => item.id === Number.parseInt(id));
    contacts.splice(contactIndex, 1);

    response.json({
        msg: `Contacto: ${contact.nombre} borrado`
    })
})

app.listen(port, () => console.log(`This server is running at port ${port}`))       
