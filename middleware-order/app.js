const Koa = require('koa');
const app = new Koa();

// x-response-time "middleware"
app.use(async (ctx, next) => {
    console.log('1) x-response-time middleware')
    const start = Date.now();

    // when this hits next, it needs to complete the next middleware before continuing on with remaining x-response-time middleware
    await next();//-> go to next middleware right now and pause here

    console.log('5) this is last');
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);

    //finally all done?
    //TODO, where are errors and where do they go?
});


// logger "middleware"
app.use(async (ctx, next) => {
    console.log('2) logger middleware')
    const start = Date.now();

    // when this hits next, it needs to complete the next middleware before continuing on with the remaining logger middleware
    await next()//-> go to next middleware right now and pause here

    // this part executes AFTER the entire response middleware completed
    const ms = Date.now() - start;
    console.log(`4) ${ctx.method} ${ctx.url} - ${ms}`);

    //there is no next here, so this logger middleware is complete, the step that comes after this resumes in the x-response-time middleware
});


// response "middleware"
app.use(async ctx => {
    console.log('3) response middleware')
    ctx.body = 'Hello World';

    // there is no next here, so this response middleware is complete, the step that comes after this resumes in the logger middleware
});

app.listen(3000);
