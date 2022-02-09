const _activationAccount = (params) => `
    <p>Estimado(a), <b>${params.fullName}</b> muchas gracias por elegir nuestros servicios. Por favor, inserte el siguiente código (<b>${params.code}</b>) para activar su cuenta.</p>
    <br>
    <p>Un saludo, y muchas gracias por preferirnos.</p>`

const _forgotPassword = (params) => `
    <p>Hola ${params.fullName}, se ha solicitado el cambio de contraseña. Escriba este código <b>${params.code}</b> en página para generar otra contraseña. No comparta este código con nadie. </p>
    <br>
    <br>
    <p>Has recibido este correo porque has ingresado esta dirección como correo de recuperación. Si no fuiste tú ignora este correo, ya que no es necesario realizar ninguna acción.</p>
    <p>Un saludo, y muchas gracias por preferirnos.</p>`

module.exports = (param, type) => {
    let result = {};
    switch (type) {
        case 1: result = { body: _activationAccount(param), subject: 'Bienvenido(a) a NOMBRE_DE_APP.' }; break
        case 2: result = { body: _forgotPassword(param), subject: 'Ha olvidado la contraseña?.' }; break
        default: break;
    }
    return result;
}