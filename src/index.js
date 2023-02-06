require('dotenv').config();
const db_client = require("./db_client");
const queries = require("./queries")
const express = require('express');
const app = express();


const PORT = 8080;

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/ingredients', async(req, res) => {

    response_body = [];
    try {
        query_response = await db_client.query(queries.getIngredients());
        query_response.rows.map(x => response_body.push(x))
    } catch (e) { console.log(e) };


    res.status(200).send({
        response_body
    })

})



app.get('/finishing', async(req, res) => {

    response_body = [];
    try {
        query_response = await db_client.query(queries.getFinishing());
        query_response.rows.map(x => response_body.push(x))
    } catch (e) { console.log(e) };


    res.status(200).send({
        response_body
    })

})

app.get('/category', async(req, res) => {
    response_body = [];

    try {
        query_response = await db_client.query(queries.getIngredientFoodType(req.query));
        query_response.rows.map(x => response_body.push(x))
    } catch (e) { console.log(e) };
    res.status(200).send({ response_body })
})

app.get('/id', async(req, res) => {
    response_body = [];

    try {
        query_response = await db_client.query(queries.getIngredientsById(req.query));
        query_response.rows.map(x => response_body.push(x));
    } catch (e) { console.log(e) };
    res.status(200).send({ response_body })
})

app.get('/confection', async(req, res) => {
    response_body = [];

    try {
        query_response = await db_client.query(queries.getIngredientConfectionType(req.query));
        query_response.rows.map(x => response_body.push(x))
    } catch (e) { console.log(e) };
    res.status(200).send({ response_body })
})

app.get('/location', async(req, res) => {
    response_body = [];

    try {
        query_response = await db_client.query(queries.getIngredientLocation(req.query));
        query_response.rows.map(x => response_body.push(x))
    } catch (e) { console.log(e) };
    res.status(200).send({ response_body })
})

app.get('/incomplete', async(req, res) => {
    response_body = [];

    try {
        query_response = await db_client.query(queries.getIncompleteIngredients());
        query_response.rows.map(x => response_body.push(x))
    } catch (e) { console.log(e) };
    res.status(200).send({ response_body })
})

app.get('/previouslystored', async(req, res) => {
    response_body = [];

    try {
        query_response = await db_client.query(queries.getPreviouslyStoredIngredients(req.query));
        query_response.rows.map(x => response_body.push(x))
    } catch (e) { console.log(e) };
    res.status(200).send({ response_body })
})


app.post('/delete', async(req, res) => {
    let data = req.body;

    let query_response = ""
    try {
        query_response = await db_client.query(queries.deleteIngredients(data))
    } catch (e) { console.log(e) };
    res.status(200).send({
        "message": "Ingredient deleted"
    })



})

app.post('/deletegrocery', async(req, res) => {
    let data = req.body;

    let query_response = "";
    try {
        query_response = await db_client.query(queries.deleteGroceryItem(data))
    } catch (e) { console.log(e) };
    res.status(200).send({
        "message": "grocery item deleted"
    })



})


app.get('/expiring', async(req, res) => {
    response_body = [];

    try {
        query_response = await db_client.query(queries.getIngredients());
        query_response.rows.map(x => {


            let expiration_date = new Date(x.expiration);
            let today_date = new Date();

            const utc1 = Date.UTC(today_date.getFullYear(), today_date.getMonth(), today_date.getDate());
            const utc2 = Date.UTC(expiration_date.getFullYear(), expiration_date.getMonth(), expiration_date.getDate());

            let difference = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));

            if (difference < 3) {
                if (difference < 0) {
                    response_body.push({ "brand": x.brand, "name": x.name, "expiration": "Item Expired", "id": x.id });
                } else {
                    response_body.push({ "brand": x.brand, "name": x.name, "expiration": 'Expiring in ' + difference + ' day(s)', "id": x.id });
                }
            }

        })
    } catch (e) { console.log(e) };
    res.status(200).send({ response_body })
})

app.get('/ripness', async(req, res) => {
    response_body = [];

    try {
        query_response = await db_client.query(queries.getIngredients());
        query_response.rows.map(x => {

            if (x.category == 'Vegatables' || x.category == 'Fruits') {
                let expiration_date = new Date(x.created_at);
                let today_date = new Date();

                const utc1 = Date.UTC(today_date.getFullYear(), today_date.getMonth(), today_date.getDate());
                const utc2 = Date.UTC(expiration_date.getFullYear(), expiration_date.getMonth(), expiration_date.getDate());

                let difference = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));

                if (difference > 2) {
                    if (difference > 10) {
                        response_body.push({ "brand": x.brand, "name": x.name, "expiration": "Throw away", "id": x.id });
                    } else {
                        response_body.push({ "brand": x.brand, "name": x.name, "expiration": 'check ripness', "id": x.id });
                    }
                }

            }
        })
    } catch (e) { console.log(e) };
    res.status(200).send({ response_body })
})




app.post('/new', async(req, res) => {
    let data = req.body;
    let date = new Date()

    if (data.expiration.toLowerCase().includes('day')) {
        date.setDate(date.getDate() + parseInt(data.expiration.toLowerCase().match(/[0-9]/g)))
        data.expiration = date.toISOString().substring(0, 10);
    }
    if (data.expiration.toLowerCase().includes('week')) {
        date.setDate(date.getDate() + (parseInt(data.expiration.toLowerCase().match(/[0-9]/g)) * 7))
        data.expiration = date.toISOString().substring(0, 10);
    }

    let query_response = ""
    try {
        query_response = await db_client.query(queries.insertIngredient(data))
    } catch (e) { console.log(e) };
    res.status(200).send({
        "message": "Ingredient inserted!"
    })
})

app.post('/insertgrocery', async(req, res) => {
    let data = req.body;

    let query_response = ""
    try {
        query_response = await db_client.query(queries.insertGrocery(data))
    } catch (e) { console.log(e) };
    res.status(200).send({
        "message": "Ingredient inserted in grocery!"
    })
})

app.get('/grocery', async(req, res) => {
    response_body = [];

    try {
        query_response = await db_client.query(queries.getGrocery(req.query));
        query_response.rows.map(x => response_body.push(x))
    } catch (e) { console.log(e) };
    res.status(200).send({ response_body })
})


app.get('/search', async(req, res) => {
    response_body = [];

    try {
        query_response = await db_client.query(queries.searchIngredient(req.query));
        query_response.rows.map(x => response_body.push(x))
    } catch (e) { console.log(e) };
    res.status(200).send({ response_body })
})







app.listen(PORT, () => console.log('Started server on localhost: ' + PORT))