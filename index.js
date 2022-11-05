const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.set("port", 3000);
app.use(express.json())

const browserP = puppeteer.launch({
    slowMo: 100,
    defaultViewport: {width: 1366, height: 768},
    args: ["--no-sandbox", "--disable-setuid-sandbox"],headless: true
  });
  
app.post("/api-prestadora", (req, res) => {
    let page;
    let body_filtros = req.body;
    console.log(body_filtros);
    (async () => {
      page = await (await browserP).newPage({headless: true});
      await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
        await page.goto('https://www.datacels.com/detectar-empresa-telefono');
        await page.waitForSelector("#buscador");  
        await page.waitForTimeout(3000);
        await page.type("#indicativo",body_filtros.indicativo);
        await page.type("#bloque",body_filtros.bloque);
        await page.click("#buscador");
        await page.waitForTimeout(2000);
        let salida = await page.evaluate(() =>{ 
            var container = document.querySelector('#resultado');
            var elemento = container.querySelectorAll('p');
            return {
              linea: elemento[0].innerHTML,
              operador: elemento[1].innerHTML,
              localidad: elemento[2].innerHTML,
              servicios: elemento[3].innerHTML,
            };
         });
        res.send(salida);
      
          })()
          .catch(err => res.sendStatus(500))
          .finally(async () => await page.close())
        ;
});
 
app.post("/rec-imagen", (req, res) => {
  let page;
  let body_filtros = req.body;
  console.log(body_filtros);
  (async () => {
    page = await (await browserP).newPage({headless: true});
    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
      await page.goto('https://carnet.ai/'); 
      await page.waitForSelector("#carUrl"); 
      const inputUploadHandle = await page.$('input[type=file]');
      let fileToUpload = body_filtros.url;
      inputUploadHandle.uploadFile(fileToUpload);
      await page.waitForTimeout(5000);
      //await page.waitForTimeout(2000);
      //await page.type("#carUrl",body_filtros.url);
      //await page.waitForTimeout(2000);
      let salida = await page.evaluate(() =>{ 
          var container = document.querySelector('#carResult');
          var elemento = container.querySelectorAll('p');
          return {
            modelo: elemento[0].innerText,
            año: elemento[1].innerText,
            probabilidad: elemento[2].innerText,
            color: elemento[3].innerText,
            angulo: elemento[4].innerText,
          };
       });
      res.send(salida);
    
        })()
        .catch(err => res.sendStatus(500))
        .finally(async () => await page.close())
      ;
});

app.post("/id-facebook", (req, res) => {
  let page;
  let body_filtros = req.body;
  console.log(body_filtros);
  (async () => {
    page = await (await browserP).newPage({headless: true});
    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
      await page.goto('https://whopostedwhat.com/'); 
      await page.waitForSelector("#username-input"); 
      await page.waitForTimeout(2000);
      await page.type("#username-input",body_filtros.user);
      await page.click("#btn-get-user");
      await page.waitForTimeout(5000);
      let salida = await page.$eval('#uid-show', el => el.value);
      res.send(salida);
    
        })()
        .catch(err => res.sendStatus(500))
        .finally(async () => await page.close())
      ;
});

app.post("/id-twitter", (req, res) => {
  let page;
  let body_filtros = req.body;
  console.log(body_filtros);
  (async () => {
    page = await (await browserP).newPage({headless: true});
    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
      await page.goto('https://tweeterid.com/'); 
      await page.waitForSelector("#twitterButton"); 
      await page.waitForTimeout(2000);
      await page.type("#twitter",body_filtros.user);
      await page.click("#twitterButton");
      await page.waitForTimeout(5000);
      let salida = await page.$eval('#output', el => el.innerText);
      res.send(salida);
    
        })()
        .catch(err => res.sendStatus(500))
        .finally(async () => await page.close())
      ;
});


app.post("/sisa", (req, res) => {
  let page;
  let body_filtros = req.body;
  console.log(body_filtros);
  (async () => {
    page = await (await browserP).newPage({headless: true});
    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
      await page.goto('https://sisa.msal.gov.ar/sisa/'); 
      await page.waitForSelector("#homelogoff_serv_agenda"); 
      await page.waitForTimeout(3000);
      await page.click("#homelogoff_serv_agenda");
      await page.waitForSelector(".util_org_hijo");
      await page.waitForTimeout(3000);
      await page.click(".util_org_padre100alto"); 
      await page.click("#gwt-uid-233"); 
      await page.type(".gwt-TextBox",body_filtros.sisa);
      await page.screenshot({ path: `probando.jpeg` });
      await page.waitForTimeout(5000);
      let salida = await page.$eval('#output', el => el.innerText);
      res.send(salida);
    
        })()
        .catch(err => res.sendStatus(500))
        .finally(async () => await page.close())
      ;
});




app.post("/", (req, res) => {
  res.send("tu documento es : "+req.body.salida);
});
    
app.listen(app.get("port"), () => 
  console.log("La app esta corriendo en el puerto", app.get("port"))
);
