import nodemailer from 'nodemailer'

const mail = (email,link)=>{
    let mailTransporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"sowzhasai25@gmail.com",
            pass:"byaw zqmf plll lqwl"
        }
    })
        
    let details ={
        from:"sowzhasai25@gmail.com",
        to:email,
        subject:"Reset Password Link",
        text:link
    }

    mailTransporter.sendMail(details,(err)=>{
        if(err){
            console.log(err);
            console.log("mail not send");
        }else{
            console.log("mail sent successfully");
        }
    })
    
}

export default mail;