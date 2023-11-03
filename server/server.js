const express = require('express');
const cors = require('cors')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());


const readUsers = () => {
    const userData = fs.readFileSync('./users.json');
    const parsedData = JSON.parse(userData);
    return parsedData;
}

app.get('/', (_request, response) => {
    const users = readUsers();
    response.status(200).json(users);
})

app.get('/users', (_request, response) => {
    const users = readUsers();
    response.status(200).json(users);
});

app.get('/users/:id', (request, response) => {
    const { id } = request.params;

    const userData = fs.readFileSync('./users.json');
    let parsedData = JSON.parse(userData);

    let currentUser = parsedData.filter((user) => user.id === id);
    //console.log(currentUser.name);

    response.send(currentUser);
})

app.post('/', (request, response) => {

    const { name, zip } = request.body;
    console.log(name, zip)

    const newUser = {
        id: uuidv4(),
        name: name,
        zip: zip
    }

    const users = readUsers();
    response.status(200).json(users);

    const userData = fs.readFileSync('./users.json');
    const parsedData = JSON.parse(userData);
    parsedData.push(newUser);
    fs.writeFileSync('./users.json', JSON.stringify(parsedData));
    response.status(201).json(newUser);
});

app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;

    const userData = fs.readFileSync('./users.json');
    let parsedData = JSON.parse(userData);

    let newData = parsedData.filter((user) => user.id !== id);

    fs.writeFileSync('./users.json', JSON.stringify(newData));

    response.send(`Deleting student with id: ${id}`);
});
app.put('/update-user/:id', (request, response) => {
    const { id } = request.params;
    const { name, zip } = request.body;

    console.log(id, name, zip);

    const userData = fs.readFileSync('./users.json');
    let parsedData = JSON.parse(userData);

    parsedData = parsedData.map((user) => {
        if (user.id === id) {
            user.name = name;
            user.zip = zip;
        }
        return user;
    });

    fs.writeFileSync('./users.json', JSON.stringify(parsedData));

    response.send(`Updating student with id: ${id}`);
});

app.listen(8080, '0.0.0.0', (request, response) => {
    console.log('Listening on 8080');
})