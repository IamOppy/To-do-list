const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const app = express();

//const date = require(__dirname + "/modules/date.js")

//Database Creation
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",
  {useNewUrlParser: true})
}

const itemsSchema = new mongoose.Schema({
  name:String
})

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item ({
  name: "Gym"
})
const item2 = new Item ({
  name: "read"
})
const item3 = new Item ({
  name: "study"
})
// item1.save()
// item2.save()
// item3.save()

const defaultItems = [item1, item2, item3];

const listSchema = {
  name:String,
  items:[itemsSchema]
}

const List = mongoose.model("List", listSchema);

// var items = []
// var workItems = []
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

 app.get("/", function(req, res) {

   Item.find({}, function(err, foundItems){
     if (foundItems === 0){
       Item.InsertMany(defaultItems, function(err){
         if (err){
           console.log("Data insert unsuccesful.")
           console.log(err)
         }else {
           console.log("Data successfully saved to database.")
         }
       });
       res.redirect("/")

     } else {
       res.render("list", {
         listTitle: "Today",
         newListItems:foundItems
       });
     }

   })
   //let day = date();



 });
app.get("/:customListName", function(req, res){
  const customListName = req.params.customListName;
  List.findOne({name:customListName}, function(err, results){
    if (!err){
      if(!results){
        const list = new List ({
          name: customListName,
          items: defaultItems
        });
        list.save()
        console.log("New list created.")
        res.redirect("/" + customListName)
      } else {
        res.render("list", {
          listTitle: customListName,
          newListItems: results.items
        });
      }
    }
  })


});


 app.post("/", function(req, res){

   const itemName = req.body.newItem ;
   const item = new Item ({
     name: itemName
   })
   item.save()
   res.redirect("/")

 //   if (req.body.list.newItem === "Work"){
 //     workItems.push(item);
 //     res.redirect("/work")
 //   } else{
 //     items.push(item);
 //     res.redirect("/")
 //   }
 //
})

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove({_id:checkedItemId}, function(err){
    if (err){
      console.log(err)
    } else {
      console.log("Successfully deleted task.")
    }
    res.redirect("/")
  })
})

 app.get("/work", function(req, res){
   res.render("list", {listTitle: "Work List", newListItems: workItems});
 })
 app.post("/work", function(req, res) {
   let item = req.body.newItem;
   workItems.push(item);
   res.redirect("/work")
 })

 app.listen(3000, function(){
   console.log("Server started on port 3000");
 })
