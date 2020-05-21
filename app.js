const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort("COM3", { baudRate: 9600 })
console.log("Arduino conectando...")

var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "[Hidden]",
    authDomain: "[Hidden]",
    databaseURL: "[Hidden]",
    projectId: "[Hidden]",
    storageBucket: "[Hidden]",
    messagingSenderId: "[Hidden]",
    appId: "[Hidden]",
    measurementId: "[Hidden]"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

const parser = new Readline()
port.pipe(parser)

var admin = require("firebase-admin");
console.log("!Arduino conectado na porta COM3!")

var serviceAccount = require("./iot-rfid-ceub-firebase-adminsdk-m0e2v-a6b3d87a28.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iot-rfid-ceub.firebaseio.com"
});
let database = admin.firestore();

parser.on('data', function(line) {

    firebase.auth()
    line = line.replace(/(\r\n|\n|\r)/gm,"")
    console.log("Cartao: "+line)

    let cartoesRef = database.collection('cartoes');
    cartoesRef.where('cartao', '==', line).get()
        .then(cartoes => {
            if(cartoes.empty){
                port.write('Cadastrando cartao...')
                    let setCartao = cartoesRef.doc().set({
                        nome: "",
                        cartao: line,
                        valido: false

                    });
                    console.log(cartao)
                return
            }
            
            cartoes.forEach(function(cartao){ 
                cartao = cartao.data();
                console.log(cartao)
                if(cartao.valido == true){
                    port.write("Acesso permitido "+cartao.nome)
                    return
                }
                console.log(cartao)
                port.write("Acesso Negado "+cartao.nome)
            }) 
        })
        .catch(err =>{
            console.log('ero',err);
        })
})
