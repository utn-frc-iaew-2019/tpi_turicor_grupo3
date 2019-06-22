const express = require("express");
const mongoose = require("mongoose");
const Reserva = require("./models/reserva");
const bodyParser = require("body-parser");
const parser = require("fast-xml-parser");
var jsonxml = require("jsontoxml");
var moment = require("moment");
const passport = require('passport');
const app = express();
const soapRequest = require("easy-soap-request");

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(
    "mongodb+srv://ComandanteJr:SNcjNuPBMG42lOh1@cluster0-qvosw.mongodb.net/iaew-tp?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Conexión a base de datos exitosa");
  })
  .catch(() => {
    console.log("Fallo conexión a la base de datos");
  });

//Credenciales
//user: grupo_nro3
//pass: wGcs2tsBe5

const url =
  "http://rubenromero-001-site1.itempurl.com/WCFReservaVehiculos.svc/basic";

app.use(bodyParser.json());

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

//Obtener paises
app.get("/paises", (req, res, next) => {
  const headers = {
    "Content-Type": "text/xml;charset=UTF-8",
    SOAPAction: "http://tempuri.org/IWCFReservaVehiculos/ConsultarPaises",
    Host: "rubenromero-001-site1.itempurl.com",
    "User-Agent": "Apache-HttpClient/4.1.1 (java 1.5)"
  };

  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://schemas.datacontract.org/2004/07/ServicioWeb" xmlns:tem="http://tempuri.org/">
  <soapenv:Header>
     <Credentials>
        <ser:UserName>grupo_nro3</ser:UserName>
        <ser:Password>wGcs2tsBe5</ser:Password>
     </Credentials>
  </soapenv:Header>
  <soapenv:Body>
     <tem:ConsultarPaises/>
  </soapenv:Body>
</soapenv:Envelope>`;

  (async () => {
    try {
      const { response } = await soapRequest(url, headers, xml, 1000);
      const { body } = response;
      const parseado = parser.parse(body);

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

//Obtener ciudades
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

  const primeraParteXML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
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

//Consultar vehiculos disponibles
app.get("/vehiculosDisponibles", (req, res, next) => {
  const headers = {
    "Content-Type": "text/xml;charset=UTF-8",
    SOAPAction:
      "http://tempuri.org/IWCFReservaVehiculos/ConsultarVehiculosDisponibles",
    Host: "rubenromero-001-site1.itempurl.com",
    "User-Agent": "Apache-HttpClient/4.1.1 (java 1.5)"
  };

  const idCiudad = req.query.idCiudad;
  const fechaRetiro = req.query.fechaRetiro;
  const fechaDevolucion = req.query.fechaDevolucion;

  moment().format("YYYY-MM-DD-HH:mm");
  const fechaRetiroMoment = moment(fechaRetiro, "YYYY-MM-DD-HH:mm");
  const fechaDevolucionMoment = moment(fechaDevolucion, "YYYY-MM-DD-HH:mm");

  const duration = moment.duration(
    fechaDevolucionMoment.diff(fechaRetiroMoment)
  );
  var diferenciaEnDias = duration.as("days");
  diferenciaEnDias = Math.round(diferenciaEnDias);

  const primeraParteXML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
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
          .ConsultarVehiculosDisponiblesResult["a:VehiculosEncontrados"][
          "a:VehiculoModel"
        ];

      vehiculosvector.forEach(vehiculo => {
        vehiculo.precioDeVenta =
          vehiculo["a:PrecioPorDia"] * 1.2 * diferenciaEnDias;
      });
      res.status(200).json({
        vehiculos: vehiculosvector
      });
    } catch (e) {
      // Test promise rejection for coverage
      console.log(e);
    }
  })();
});

app.post("/reservar", (req, res, next) => {
  const headers = {
    "Content-Type": "text/xml;charset=UTF-8",
    SOAPAction: "http://tempuri.org/IWCFReservaVehiculos/ReservarVehiculo",
    Host: "rubenromero-001-site1.itempurl.com",
    "User-Agent": "Apache-HttpClient/4.1.1 (java 1.5)"
  };

  const primeraParteXML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://schemas.datacontract.org/2004/07/ServicioWeb" xmlns:tem="http://tempuri.org/" xmlns:wcf="http://schemas.datacontract.org/2004/07/WCFReservaVehiculos.Business.Entities"> <soapenv:Header> <Credentials> <ser:UserName>grupo_nro3</ser:UserName> <ser:Password>wGcs2tsBe5</ser:Password> </Credentials> </soapenv:Header>`;

  const ultimaParteXML = `</soapenv:Envelope>`;

  const requestBodySoap = {
    "soapenv:Body": {
      "tem:ReservarVehiculo": {
        "tem:ReservarVehiculoRequest": {
          "wcf:ApellidoNombreCliente": "", // string
          "wcf:FechaHoraDevolucion": "", // Tipo: Datetime
          "wcf:FechaHoraRetiro": "", // Tipo:Datetime
          "wcf:IdVehiculoCiudad": "", // Tipo: number
          "wcf:LugarDevolucion": "", // Tipo: LugarDevolucion
          "wcf:LugarRetiro": "", // Tipo: LugarRetiro
          "wcf:NroDocumentoCliente": "" // Tipo: number
        }
      }
    }
  };

  requestBodySoap["soapenv:Body"]["tem:ReservarVehiculo"][
    "tem:ReservarVehiculoRequest"
  ]["wcf:ApellidoNombreCliente"] = req.body.apellidoNombre;
  requestBodySoap["soapenv:Body"]["tem:ReservarVehiculo"][
    "tem:ReservarVehiculoRequest"
  ]["wcf:FechaHoraDevolucion"] = req.body.fechaDevolucion;
  requestBodySoap["soapenv:Body"]["tem:ReservarVehiculo"][
    "tem:ReservarVehiculoRequest"
  ]["wcf:FechaHoraRetiro"] = req.body.fechaRetiro;
  requestBodySoap["soapenv:Body"]["tem:ReservarVehiculo"][
    "tem:ReservarVehiculoRequest"
  ]["wcf:IdVehiculoCiudad"] = req.body.idVehiculoCiudad;
  requestBodySoap["soapenv:Body"]["tem:ReservarVehiculo"][
    "tem:ReservarVehiculoRequest"
  ]["wcf:LugarDevolucion"] = req.body.lugarDevolucion;
  requestBodySoap["soapenv:Body"]["tem:ReservarVehiculo"][
    "tem:ReservarVehiculoRequest"
  ]["wcf:LugarRetiro"] = req.body.lugarRetiro;
  requestBodySoap["soapenv:Body"]["tem:ReservarVehiculo"][
    "tem:ReservarVehiculoRequest"
  ]["wcf:NroDocumentoCliente"] = req.body.nroDocumento;

  const xmlbody = jsonxml(requestBodySoap);

  const xmlSOAP = primeraParteXML + xmlbody + ultimaParteXML;

  (async () => {
    try {
      const { response } = await soapRequest(url, headers, xmlSOAP, 1000);
      const { body } = response;
      const parseado = parser.parse(body);
      const fechaRetiroMoment = moment(
        req.body.fechaRetiro,
        "YYYY-MM-DD-HH:mm"
      );
      const fechaDevolucionMoment = moment(
        req.body.fechaDevolucion,
        "YYYY-MM-DD-HH:mm"
      );

      const duration = moment.duration(
        fechaDevolucionMoment.diff(fechaRetiroMoment)
      );
      var diferenciaEnDias = duration.as("days");
      diferenciaEnDias = Math.round(diferenciaEnDias);

      var datosReserva =
        parseado["s:Envelope"]["s:Body"].ReservarVehiculoResponse
          .ReservarVehiculoResult["a:Reserva"];

      //Armamos la reserva que se almacena en la base de datos
      var reservamongo = new Reserva({
        codigoReserva: datosReserva["b:CodigoReserva"],
        fechaReserva: datosReserva["b:FechaReserva"],
        idCliente: 1,
        costo:
          datosReserva["b:VehiculoPorCiudadEntity"]["b:VehiculoEntity"][
            "b:PrecioPorDia"
          ],
        precioVenta:
          datosReserva["b:VehiculoPorCiudadEntity"]["b:VehiculoEntity"][
            "b:PrecioPorDia"
          ] *
          1.2 *
          diferenciaEnDias
      });

      reservamongo.save().then(() => {
        res.status(201).json({
          message: "Reserva creada exitosamente.",
          reserva: reservamongo
        });
      });
    } catch (e) {
      // Test promise rejection for coverage
      console.log(e);
    }
  })();
});

app.get("/lista/reserva", (req, res, next) => {
  const idcliente = req.query.idCliente;
  Reserva.find({ idCliente: idcliente })
    .then(documents => {
      res.status(200).json({ reservas: documents });
    })
    .catch(e => console.log(e));
});

app.post("/cancelar", (req, res, next) => {
  const headers = {
    "Content-Type": "text/xml;charset=UTF-8",
    SOAPAction: "http://tempuri.org/IWCFReservaVehiculos/CancelarReserva",
    Host: "rubenromero-001-site1.itempurl.com",
    "User-Agent": "Apache-HttpClient/4.1.1 (java 1.5)"
  };

  const primeraParteXML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://schemas.datacontract.org/2004/07/ServicioWeb" xmlns:tem="http://tempuri.org/" xmlns:wcf="http://schemas.datacontract.org/2004/07/WCFReservaVehiculos.Business.Entities"> <soapenv:Header> <Credentials> <ser:UserName>grupo_nro3</ser:UserName> <ser:Password>wGcs2tsBe5</ser:Password> </Credentials> </soapenv:Header>`;

  const ultimaParteXML = `</soapenv:Envelope>`;

  const requestBodySoap = {
    "soapenv:Body": {
      "tem:CancelarReserva": {
        "tem:CancelarReservaRequest": { "wcf:CodigoReserva": "" }
      }
    }
  };

  requestBodySoap["soapenv:Body"]["tem:CancelarReserva"][
    "tem:CancelarReservaRequest"
  ]["wcf:CodigoReserva"] = req.body.codigoReserva;

  const xmlbody = jsonxml(requestBodySoap);
  const xmlSOAP = primeraParteXML + xmlbody + ultimaParteXML;

  (async () => {
    try {
      await soapRequest(url, headers, xmlSOAP, 1000);

      Reserva.deleteOne({ codigoReserva: req.body.codigoReserva })
        .then(() => {
          res.status(200).json({ message: "Reserva cancelada correctamente!" });
        })
        .catch(e => console.log(e));
    } catch (e) {
      // Test promise rejection for coverage
      console.log(e);
    }
  })();
});

app.get('/oauth', passport.authenticate('google', {
  scope: ['profile']
}));

app.get('/redirect', passport.authenticate('google'), (req, res) => {
  res.send('you reached the redirect URI');
});

module.exports = app;
