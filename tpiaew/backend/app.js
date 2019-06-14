const express = require("express");
//const bodyParser = require('body-parser');
//const parser = require('xml2json-light');
const parser = require("fast-xml-parser");
var jsonxml = require("jsontoxml");

const app = express();

const soapRequest = require("easy-soap-request");
const fs = require("fs");

//Credenciales
//user: grupo_nro3
//pass: wGcs2tsBe5

const url =
  "http://rubenromero-001-site1.itempurl.com/WCFReservaVehiculos.svc/basic";

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

app.get("/paises", (req, res, next) => {
  const headers = {
    "Content-Type": "text/xml;charset=UTF-8",
    SOAPAction: "http://tempuri.org/IWCFReservaVehiculos/ConsultarPaises",
    Host: "rubenromero-001-site1.itempurl.com",
    "User-Agent": "Apache-HttpClient/4.1.1 (java 1.5)"
  };

  const xml = fs.readFileSync(
    "C:/Users/Administrador/Downloads/UTN/Repo IAEW/tpi_turicor_grupo3/tpiaew/backend/test.xml",
    "utf-8"
  );

  (async () => {
    try {
      console.log("Intentando");
      const { response } = await soapRequest(url, headers, xml, 1000);
      const { body } = response;
      //console.log("Test parser nuevo: "+parser.xml2json(body));
      const parseado = parser.parse(body);

      console.log(
        parseado["s:Envelope"]["s:Body"].ConsultarPaisesResponse
          .ConsultarPaisesResult["a:Paises"]["b:PaisEntity"]
      );
      const paisesvector =
        parseado["s:Envelope"]["s:Body"].ConsultarPaisesResponse
          .ConsultarPaisesResult["a:Paises"]["b:PaisEntity"];

      res.status(200).json({
        paises: paisesvector
      });
    } catch (e) {
      // Test promise rejection for coverage
      console.log(e);
    }
  })();
});

app.get("/ciudades", (req, res, next) => {
  const headers = {
    "Content-Type": "text/xml;charset=UTF-8",
    SOAPAction: "http://tempuri.org/IWCFReservaVehiculos/ConsultarCiudades",
    Host: "rubenromero-001-site1.itempurl.com",
    "User-Agent": "Apache-HttpClient/4.1.1 (java 1.5)"
  };

  const idPais = req.query.idPais;

  const requestBodySoap = {
    "soapenv:Body": {
      "tem:ConsultarCiudades": {
        "tem:ConsultarCiudadesRequest": { "wcf:IdPais": "" }
      }
    }
  };

  requestBodySoap["soapenv:Body"]["tem:ConsultarCiudades"][
    "tem:ConsultarCiudadesRequest"
  ]["wcf:IdPais"] = idPais;

  const xmlbody = jsonxml(requestBodySoap);

  const primeraParteXML =
  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ser="http://schemas.datacontract.org/2004/07/ServicioWeb"
  xmlns:tem="http://tempuri.org/"
  xmlns:wcf="http://schemas.datacontract.org/2004/07/WCFReservaVehiculos.Business.Entities">
 <soapenv:Header>
    <Credentials>
       <ser:UserName>grupo_nro3</ser:UserName>
       <ser:Password>wGcs2tsBe5</ser:Password>
    </Credentials>
 </soapenv:Header>`;

  const ultimaParteXML = `</soapenv:Envelope>`;

  const xmlSOAP = primeraParteXML + xmlbody + ultimaParteXML;

  (async () => {
    try {
      const { response } = await soapRequest(url, headers, xmlSOAP, 1000);
      const { body } = response;

      const parseado = parser.parse(body);
      // console.dir(parseado);
      const ciudadesvector =
        parseado["s:Envelope"]["s:Body"].ConsultarCiudadesResponse
          .ConsultarCiudadesResult["a:Ciudades"]["b:CiudadEntity"];

      res.status(200).json({
        ciudades: ciudadesvector
      });
    } catch (e) {
      // Test promise rejection for coverage
      console.log(e);
    }
  })();
});

app.get("/vehiculosDisponibles", (req, res, next) =>{
  const headers = {
    "Content-Type": "text/xml;charset=UTF-8",
    SOAPAction: "http://tempuri.org/IWCFReservaVehiculos/ConsultarVehiculosDisponibles",
    Host: "rubenromero-001-site1.itempurl.com",
    "User-Agent": "Apache-HttpClient/4.1.1 (java 1.5)"
  };

  const idCiudad= req.query.idCiudad;
  const fechaRetiro= req.query.fechaRetiro;
  const fechaDevolucion= req.query.fechaDevolucion;

  const primeraParteXML =
  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ser="http://schemas.datacontract.org/2004/07/ServicioWeb"
  xmlns:tem="http://tempuri.org/"
  xmlns:wcf="http://schemas.datacontract.org/2004/07/WCFReservaVehiculos.Business.Entities">
 <soapenv:Header>
    <Credentials>
       <ser:UserName>grupo_nro3</ser:UserName>
       <ser:Password>wGcs2tsBe5</ser:Password>
    </Credentials>
 </soapenv:Header>`;

  const ultimaParteXML = `</soapenv:Envelope>`;

  const requestBodySoap = {
    "soapenv:Body": {
    "tem:ConsultarVehiculosDisponibles": {
      "tem:ConsultarVehiculosRequest": {
        "wcf:IdCiudad": "",
        "wcf:FechaHoraRetiro": "",
        "wcf:FechaHoraDevolucion": ""
      }
    }
  }
};

requestBodySoap["soapenv:Body"]["tem:ConsultarVehiculosDisponibles"][
  "tem:ConsultarVehiculosRequest"
]["wcf:IdCiudad"] = idCiudad;
requestBodySoap["soapenv:Body"]["tem:ConsultarVehiculosDisponibles"][
  "tem:ConsultarVehiculosRequest"
]["wcf:FechaHoraRetiro"] = fechaRetiro;
requestBodySoap["soapenv:Body"]["tem:ConsultarVehiculosDisponibles"][
  "tem:ConsultarVehiculosRequest"
]["wcf:FechaHoraDevolucion"] = fechaDevolucion;

const xmlbody = jsonxml(requestBodySoap);

const xmlSOAP = primeraParteXML + xmlbody + ultimaParteXML;

  (async () => {
    try {
      const { response } = await soapRequest(url, headers, xmlSOAP, 1000);
      const { body } = response;

      const parseado = parser.parse(body);

      const vehiculosvector =
        parseado["s:Envelope"]["s:Body"].ConsultarVehiculosDisponiblesResponse
        .ConsultarVehiculosDisponiblesResult["a:VehiculosEncontrados"]["a:VehiculoModel"];

      res.status(200).json({
        vehiculos: vehiculosvector
      });
    } catch (e) {
      // Test promise rejection for coverage
      console.log(e);
    }
  })();
});

module.exports = app;
