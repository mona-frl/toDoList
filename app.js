const express = require('express');
const app = express();

//lodash
const _ = require('lodash');

//dotenv
require("dotenv").config()
const login = process.env.LOGIN;
const password = process.env.PASSWORD;
//db 
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


//requires the local file of our created module
const date = require(__dirname + '/date.js');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//array of items to the list of to do list 
mongoose.connect(`mongodb+srv://${login}:${password}@cluster0.vicar3r.mongodb.net/toDoListDB`);

const itemSchema = {
    name: String
};


const listSchema = {
    name: String,
    items: [itemSchema]
}

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);


const defaultItem1 = new Item({ name: "Be happy 😊" });
const defaultItem2 = new Item({ name: "Drink water 💧" });
const defaultItem3 = new Item({ name: "Sleep 8h 💤" });

const defaultItems = [defaultItem1, defaultItem2, defaultItem3]

const day = date.getDate();

//renders the list as the root file 
app.get('/', (req, res) => {

    Item.find({}, (err, foundItems) => {
        if (err) {
            console.error(err);
        } else {
            //looks for the foundItems lenght and adds the 3 default Items
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, (err) => {
                    if (err) {
                        console.log(err.message);
                    } else {
                        console.log("Items have been added to the DB.")
                    }
                });
                res.redirect("/");
            }
            res.render('list', {
                listTitle: day,
                newListItems: foundItems
            });
        }
    })
})

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, {}, (err, foundList) => {
        if (!err) {
            if (customListName === "About") {
                res.render("about");
                //checks if the foundlist exists & length is 0
            } else if (!foundList || !foundList.length === 0) {
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save(() =>
                    res.redirect("/" + customListName));
            } else {
                //Show an existing list
                res.render("list", {
                    listTitle: foundList.name,
                    newListItems: foundList.items
                });
            }
        }
    });
});

app.post('/', (req, res) => {
    // adds the item to the items array to display
    const itemName = req.body.newItem;
    const listName = req.body.list;

    //creates the item with the input
    const item = new Item({
        name: itemName
    })

    //saves the item to the right DB. the day one is the root one
    if (listName === day) {
        item.save();
        res.redirect('/')
    }
    else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        })
    }
})

app.post('/delete', (req, res) => {
    //creates the item to delete, by looking through the submite button using the value of the name "delete" that is the item's DB ID
    const itemDelete = req.body.delete;
    const listTitle = req.body.listTitle;


    //checks if the list is the root list 
    if (listTitle === day) {
        Item.findByIdAndRemove(itemDelete, err => {
            if (!err) {
                console.log("Item has been successfully deleted.")
                res.redirect("/");
            }
        })
    } else {
        List.findOneAndUpdate(
            { name: listTitle }, { $pull: { items: { _id: itemDelete } } }, (err, foundList) => {
                if (!err) {
                    res.redirect('/' + listTitle)
                }
            })
    }
});





app.listen(process.env.PORT || port, () => {
    console.log(`Listening to the port ${port}`);
})
