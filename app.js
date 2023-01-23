const express = require('express');
const app = express();
const port = 3000;

//requires the local file of our created module
const date = require(__dirname + '/date.js');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//array of items to the list of to do list 
const items = [];
const workItems = [];


//renders the list as the root file 
app.get('/', (req, res) => {
    //renders the ejs file
    res.render('list', { listTitle: date.getDate(), newListItems: items });
})

//renders a new list as the work list
app.get('/work', (req, res) => {
    res.render('list', { listTitle: "Work List", newListItems: workItems })
})

//shows about page
app.get('/about', (req, res) => {
    res.render('about')
})

app.post('/', (req, res) => {
    // adds the item to the items array to display
    let item = req.body.newItem;

    //checkes the list and display the right list
    if (req.body.list === "work") {
        workItems.push(item)
        //posts the item to the page
        res.redirect('/work')
    } else {
        items.push(item);
        //posts the item to the page
        res.redirect('/')
    }
})





app.listen(port, () => {
    console.log('Listening on port ' + port);
});