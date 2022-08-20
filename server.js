const express = require("express");
const app = express();
const validator = require("validator");
const rateLimit = require("express-rate-limit");
const sendmail = require("sendmail")();
var md = require("markdown-it")();
const fs = require("fs");
var minify = require("html-minifier").minify;
const xss = require("xss")

app.set("trust proxy", 1);

const apiLimiter = rateLimit({
  windowMs: 60000,
  max: 3
});
app.use("/submit/", apiLimiter);

app.use(express.static("views"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/", (req, res) => {
  console.log("Запуск!")
  // Имя
  var name = req.query.name;
  // Кол-во товаров
  var sum = req.query.sum;
  // Почта
  var email = req.query.email;
  // Номер телефона
  var number = req.query.number;
  
  console.log(sum, name, email, number);
  var err;
  if (typeof err == "string") {
    res.send(err).status(400);
  } else {
    res.send(`
<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="refresh" content="5; URL=/" />
      <link rel="icon" href="https://cdn.worldplay.tk/cdn/general/favicon.ico" />
      <link rel="stylesheet" href="https://cdn.worldplay.tk/style.css" />
      <title>Отправлено!</title>
    </head>
    <body>
      <h1>The message has been sent. In a few seconds you will be taken to the main page</h1>
    </body>
  <html>`)
    
    var res = `
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          ${fs.readFileSync("./style.css", "utf8")}
        </style>
      </head>
      <body>
        <article>
          <p>
            Имя: ${md.render(name)}
            Кол-во товаров: ${md.render(sum)}
            Почта: ${md.render(email)}
            Номер телефона: ${md.render(number)}
          </p>
        </article>
      </body>
    </html>`;
    sendmail(
      {
        from: "feedback@worldplay.tk",
        to: "aleksejseryj659@yandex.ru",
        subject: "Заказ с сайта projector.ml",
        html: minify(res, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true
        })
      },
      function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
      }
    );
  }
});
const listener = app.listen(process.env.PORT, () => {
  console.log(`Порт приложения ${listener.address().port}`);
});
