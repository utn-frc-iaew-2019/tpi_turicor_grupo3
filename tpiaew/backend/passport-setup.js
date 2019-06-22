const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys");
const Cliente = require("./models/cliente");

passport.serializeUser((cliente, done) => {
  done(null, cliente.id);
});

passport.deserializeUser((id, done) => {
  Cliente.findById(id).then(cliente => {
    done(null, cliente);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
      Cliente.findOne({ id: profile.id }).then(usuario => {
        if (usuario) {
          console.log("El cliente es: ", usuario);
          done(null, usuario);
        } else {
          new Cliente({
            id: profile.id,
            nombre: profile.name,
            // documento: profile.
          })
            .save()
            .then(nuevoUsuario => {
              console.log("Creado un nuevo usuario: ", nuevoUsuario);
              done(null, nuevoUsuario);
            });
        }
      });
    }
  )
);
