const express = require("express");
//const bodyParser = require('body-parser');
//const parser = require('xml2json-light');
const parser = require('fast-xml-parser');

const app = express();

const soapRequest = require('easy-soap-request');
const fs = require('fs');

const url = 'http://rubenromero-001-site1.itempurl.com/WCFReservaVehiculos.svc/basic';
const headers = {

"Content-Type": "text/xml;charset=UTF-8",
"SOAPAction": "http://tempuri.org/IWCFReservaVehiculos/ConsultarPaises",
"Host": "rubenromero-001-site1.itempurl.com",
"User-Agent": "Apache-HttpClient/4.1.1 (java 1.5)"

};

const xml = fs.readFileSync('C:/Users/Administrador/Documents/TPI IAEW/tpiaew/backend/test.xml', 'utf-8');

//app.use(bodyParser.xml());

//app.use(xmlparser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});




(async () => {
    try {
      console.log("Intentando");
      const { response } = await soapRequest(url, headers, xml, 1000);
      const { body } = response;
      //console.log("Test parser nuevo: "+parser.xml2json(body));
      const parseado = parser.parse(body);
      console.log(parseado["s:Envelope"]["s:Body"]
      .ConsultarPaisesResponse
      .ConsultarPaisesResult["a:Paises"]["b:PaisEntity"]);
      // console.log("Body: " + body);
    } catch (e) {
      // Test promise rejection for coverage
      console.log(e);
    }
  })();

//   const { response } = soapRequest(url, headers, xml, 1000);
//   const { body } = response;

//   parser.parseString(body, function (err, result) {
//     console.log("Body parser xml2js "+result);
// });


module.exports = app;
