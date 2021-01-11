const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// welcome email

const welcomeEmail = async (name, user_email, link) => {
    try {
        await sgMail.send({
            to: user_email,
            from: 'nikku.a1998@gmail.com',
            subject: 'Welcome to Qburst' ,
            text: `Welcome ${name}, to our company QBurst. Click this link to direct to our page`,
            html: `Welcome ${name}, to our company QBurst. Click this <a href=${link}>link</a> to direct to our page`
        
        })
    }
    
    catch(err) {
        console.log(err)
    }
}

// forgot password

const forgotPasswordEmail = async (name, user_email, link) => {
    try {
        await sgMail.send({
            to: user_email,
            from: 'nikku.a1998@gmail.com',
            subject: 'Forgot password' ,
            text: `Hi ${name}, You requested to reset your password.Please click here`,
            html: `Hi ${name}, You requested to reset your password.Please click <a href=${link}>here</a>`           
        })
    }
    catch(err) {
        console.log(err)
    }
}


module.exports = {welcomeEmail, forgotPasswordEmail}