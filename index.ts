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
 */
import express, {Request, response, Response} from "express";


const app = express();
const port = 3000;
app.use(express.json());

type Contact = {
    id: number,
    nombre: string,
    telefono: number,
    correo: string
}

const contacts: Contact[] = [{
    id: 1,
    nombre: "Juan Pérez",
    telefono: 123456789,
    correo: "juan.perez@example.com"
  },
  {
    id: 2,
    nombre: "María García",
    telefono: 987654321,
    correo: "maria.garcia@example.com"
  },
  {
    id: 3,
    nombre: "Luis Rodríguez",
    telefono: 456789123,
    correo: "luis.rodriguez@example.com"
  }]


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

app.listen(port, () => console.log(`This server is running at port ${port}`))       
