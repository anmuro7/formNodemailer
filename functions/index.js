const functions = require("firebase-functions");

const nodemailer=require("nodemailer");
const express=require("express");
const cors=require("cors");
const config = require('./config.js');

//init express
const app=express();
//configurar middleware 
app.use(cors({origin:true}));

app.post('/',(req,res)=>{
    
   
//create transport
    const transporter = nodemailer.createTransport({
        host: 'mail.mobleslapaz.com',
        port: 2525,
        secure: false,
        auth: {
            user: config.MAIL,
            pass: config.PASS_MAIL
        },
        tls: {
            //this app does not send the mail from the same domain
            rejectUnauthorized: false
        }
    });
 
    //proof of email for the establishment
    contentHTML = `
    <h1>Solicitud de cita previa</h1>
    <ul>
        <li>Nombre : ${req.body.name}</li>
        <li>Apellidos: ${req.body.apellidos}</li>
        <li>Email: ${req.body.email}</li>
        <li>Teléfono: ${req.body.phone}</li>
        <li>Fecha: ${req.body.date} (*Año-Mes-Día)</li>
        <li>Horario: ${req.body.horario}</li>
        <li>Motivo visita: ${req.body.motivo}</li>
    </ul>
    <h2>Mensaje</h2>
    <p>${req.body.message}</p>
`;
    //proof of email for the customer
    contentCliente=`
        <h3> Gracias por tu solicitud ${req.body.name}</h3>
        <p>En breve contactaremos contigo para gestionar tu cita.</p>
        <h4>Datos solicitud</h4>
        <ul>
            <li>Nombre: ${req.body.name} </li>
            <li>Apellidos:${req.body.apellidos}</li>
            <li>Email: ${req.body.email}</li>
            <li>Teléfono: ${req.body.phone}</li>
            <li>Fecha: ${req.body.date}</li>
            <li>Horario: ${req.body.horario}</li>
            <li>Motivo visita: ${req.body.motivo}</li>

        </ul>
        <h2>Mensaje</h2>
        <p>${req.body.message}</p>
    `;
    //configure mail delivery for the establishment
    const mailOptionsTienda={
        from:"info@mobleslapaz.com",
        to: req.body.tienda,
        subject: "Solicitud cita previa de "+req.body.name,
        html:contentHTML
    };
    //configure mail delivery for the customer
    const mailOptionsCliente={
        from:"info@mobleslapaz.com",
        to: req.body.email,
        subject: "Comprobante de solicitud de cita prévia ",
        html:contentCliente
    };
    
    //response html page
    htmlRes=`
    <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Sitio Web</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/litera/bootstrap.min.css">
            <link rel="stylesheet" href="main.css">
        </head>

        <body>

            <div class="row h-100">
                <div class="col-md-6 offset-md-3 my-auto text-center">
                    <div class="display-4">
                        Gracias por su solicitud. En breve contactaremos con usted para gestionar su cita.
                    </div>
                    <br>
                    <a href="https://www.mobleslapaz.com/es" class="btn btn-danger">
                        Volver web
                    </a>
                </div>
            </div>
        </body>

        </html>
    `;
  
    //send email to the establishment
    transporter.sendMail(mailOptionsTienda,(err, data)=>{
        //if server fails...
            if(err){
                return res.status(500).send({message:'error'+err.message});
            }
            //return success response page
            return res.send(htmlRes);
    });  

//send email to the customer
    transporter.sendMail(mailOptionsCliente,(err, data)=>{

        //if server fails...
            if(err){
                return res.status(500).send({message:'error'+err.message});
            }
            //return success response page
            return res.send(htmlRes);
    });  


    
});


module.exports.citas= functions.https.onRequest(app);