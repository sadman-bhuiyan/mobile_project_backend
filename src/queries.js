const uuid4 = require('uuid4')

function insertIngredient(message) {
    let complete = "YES"

    if ((message.name === "") || (message.brand === "") || (message.location === "") || (message.confection === "") || (message.expiration === "") || (message.category === "")) {
        if (message.state === "") {
            complete = "NO";
        }
        complete = "NO";
    }


    const command = {
        name: "insert ingredient",
        text: "INSERT INTO ingredients (name, brand, category, state, location, confection,expiration, id, complete) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);",
        values: [
            message.name,
            message.brand,
            message.category,
            message.state,
            message.location,
            message.confection,
            message.expiration,
            uuid4(),
            complete,
        ],
    };


    return command;
}

function insertGrocery(message) {

    let shop = 'Supermarket'
    if (message.category == 'Meat') {
        shop = 'Butcher'
    }
    if (message.category == 'Fish') {
        shop = 'Fishmonger'
    }
    if (message.category == 'Bread') {
        shop = 'Bakery'
    }

    const command = {
        name: "insert grocery",
        //text: "INSERT INTO grocery (name, brand, category, id, shop) VALUES ($1, $2, $3, $4, $5);",
        text: "INSERT INTO grocery (name, brand, category, id, shop) SELECT CAST($1 AS VARCHAR), CAST($2 AS VARCHAR), CAST($3 AS VARCHAR), CAST($4 AS UUID), CAST($5 AS VARCHAR) WHERE NOT EXISTS ( SELECT * FROM grocery WHERE name=$1 and brand=$2);",
        values: [
            message.name,
            message.brand,
            message.category,
            uuid4(),
            shop,
        ],
    };


    return command;
}



function editIngredient(message) {
    let complete = "YES"

    if ((message.name === "") || (message.brand === "") || (message.location === "") || (message.confection === "") || (message.expiration === "") || (message.category === "")) {
        if (message.state === "") {
            complete = "NO";
        }
        complete = "NO";
    }
    const command = {
        name: "edit ingredients",
        text: "UPDATE ingredients SET name = $1, brand=$2, category=$3, state=$4, location=$5, confection=$6, expiration=$7, complete=$8 WHERE id = $9",
        values: [
            message.name,
            message.brand,
            message.category,
            message.state,
            message.location,
            message.confection,
            message.expiration,
            complete,
            message.id,

        ]
    };
    return command;

}

function deleteIngredients(message) {
    const command = {
        name: "delete ingredient",
        text: "DELETE FROM ingredients WHERE id = $1",
        values: [
            message.id
        ]
    };
    return command;


}

function deleteGroceryItem(message) {
    const command = {
        name: "delete grocery item",
        text: "DELETE FROM grocery WHERE id = $1",
        values: [
            message.id
        ]
    };
    return command;

}

function searchIngredient(message) {

    const command = {
        name: "search ingredient",
        text: "SELECT * FROM ingredients WHERE $1",
        values: [
            message.query
        ]
    };
    return command;

}

function getIngredients() {
    const command = {
        name: "get ingredients",
        text: "SELECT * FROM ingredients",
    };
    return command;
}

function getIngredientsById(message) {
    const command = {
        name: "get ingredients by id",
        text: "SELECT * FROM ingredients WHERE id = $1",
        values: [
            message.id
        ]
    };
    return command;
}

function getIngredientFoodType(message) {
    const command = {
        name: "get ingredients category",
        text: "SELECT * FROM ingredients WHERE category = $1 AND category != ''",
        values: [
            message.category
        ]
    };

    return command;

}

function getFinishing(message) {
    const command = {
        name: "get ingredients finishing",
        text: "SELECT name,brand,category,count(*) as count FROM ingredients GROUP BY name,brand,category HAVING count(*) < 2",
        values: []
    };

    return command;

}

function getIngredientLocation(message) {
    const command = {
        name: "get ingredients location",
        text: "SELECT * FROM ingredients WHERE location = $1  AND location != ''",
        values: [
            message.location
        ]
    };

    return command;

}

function getIngredientConfectionType(message) {
    const command = {
        name: "get ingredients confection",
        text: "SELECT * FROM ingredients WHERE confection = $1 AND confection != ''",
        values: [
            message.confection
        ]
    };
    return command;

}

function getIncompleteIngredients(message) {
    const command = {
        name: "get incomplete ingredients",
        text: "SELECT * FROM ingredients WHERE complete = $1",
        values: [
            "NO"
        ]
    };
    return command;

}

function getPreviouslyStoredIngredients(message) {
    const command = {
        name: "get previously stored ingredients",
        text: "SELECT * FROM ingredients WHERE name= $1 and expiration != '' order by created_at desc limit 1",
        values: [
            message.name
        ]

    };

    return command;
}

function getGrocery(message) {
    const command = {
        name: "get grocery",
        text: "SELECT * FROM grocery WHERE shop = $1 AND shop != ''",
        values: [
            message.shop
        ]
    };
    return command;
}




module.exports = {
    insertIngredient: insertIngredient,
    getIngredients: getIngredients,
    getIngredientConfectionType: getIngredientConfectionType,
    getIngredientFoodType: getIngredientFoodType,
    getIngredientLocation: getIngredientLocation,
    getIncompleteIngredients: getIncompleteIngredients,
    getFinishing: getFinishing,
    getPreviouslyStoredIngredients: getPreviouslyStoredIngredients,
    getIngredientsById: getIngredientsById,
    editIngredient: editIngredient,
    deleteIngredients: deleteIngredients,
    insertGrocery: insertGrocery,
    getGrocery: getGrocery,
    deleteGroceryItem: deleteGroceryItem,
    searchIngredient: searchIngredient,

};