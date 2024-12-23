const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const ExpressError = require("./ExpressError");
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

main().then(() => { console.log("connection successfull"); })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

// let chat1=new Chat({
//     from:"Priya",
//     to:"Neha",
//     msg:"Send me ur exam sheets",
//     created_at:new Date(),
// })
// chat1.save().then(res=>console.log(res)).catch(err=>console.log(err));
app.get("/", (req, res) => {
    res.send("Root working");
})

app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    //console.log(chats);
    res.render("index.ejs", { chats });
});

//new route - non asynchronys
app.get("/chats/new", (req, res) => {
    //throw new ExpressError(404, "Page not found");
    res.render("new.ejs");
});

app.post("/chats", asyncWrap(async (req, res) => {
    let { from, to, msg } = req.body;
    //console.log(from, to, msg);
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date(),
    });
    await newChat.save();
    res.redirect("/chats");


}));

function asyncWrap(fn) {  //instead of using try and catch we can use this
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    }
}
//new - show route for practice just
app.get("/chats/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
        next(new ExpressError(404, "Chat not found")); //since async errors dont directly call next so write this
    }
    res.render("edit.ejs", { chat });
})
);
app.get("/chats/:id/edit", async (req, res) => {

    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
});

app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true }, { new: true });
    res.redirect("/chats");
});

app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let del_chat = await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
});

//mongoose error handling middleware
app.use((err, req, res, next) => {
    console.log(err.name);
    if (err.name == "ValidationError") {
        console.log("This was a validation error, please fill the required fields"
        );
    }
    //we can also create a seperate function for this purpose
    next(err);
})

//error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Some error" } = err;
    res.status(status).send(message);
});

app.listen("8060", () => { console.log("Server is listening on port 8060.."); });