const Koa = require("koa");
const Router = require("koa-router");
const logger = require('koa-logger');
const BodyParser = require("koa-bodyparser");
const ObjectID = require("mongodb").ObjectID;
const jwt = require("./jwt");

const app = new Koa();
const router = new Router();
const securedRouter = new Router();

app.use(logger());
app.use(BodyParser());

// app.use(jwt.errorHandler()).use(jwt.jwt());
app.use(router.routes()).use(router.allowedMethods());
app.use(securedRouter.routes()).use(securedRouter.allowedMethods());
securedRouter.use(jwt.errorHandler()).use(jwt.jwt());
require("./mongo")(app);

router.get("/", async function (ctx) {
    ctx.body = { message: "Hello World!!" }
});

router.post("/auth", async (ctx) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

    if (username === "user" && password === "pwd") {
        ctx.body = {
            token: jwt.issue({
                user: "user",
                role: "admin"
            })
        }
    } else {
        ctx.status = 401;
        ctx.body = { error: "Invalid login" }
    }
});

// List all people
securedRouter.get("/people", async (ctx) => {
    ctx.body = await ctx.app.people.find().toArray();
});

// Create new person
securedRouter.post("/people", async (ctx) => {
    ctx.body = await ctx.app.people.insertOne(ctx.request.body);
});

// Get one
securedRouter.get("/people/:id", async (ctx) => {
    ctx.body = await ctx.app.people.findOne({ "_id": ObjectID(ctx.params.id) });
});

// Update one
securedRouter.put("/people/:id", async (ctx) => {
    let documentQuery = { "_id": ObjectID(ctx.params.id) }; // Used to find the document
    let valuesToUpdate = ctx.request.body;
    ctx.body = await ctx.app.people.updateOne(documentQuery, {$set: valuesToUpdate});
});

// Delete one
securedRouter.delete("/people/:id", async (ctx) => {
    let documentQuery = { "_id": ObjectID(ctx.params.id) }; // Used to find the document
    ctx.body = await ctx.app.people.deleteOne(documentQuery);
});

app.listen(3000);
