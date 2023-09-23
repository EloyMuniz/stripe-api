import { Stripe } from "stripe";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Users from "../models/Users";
import { raw } from "express";
const stripe = new Stripe(process.env.STRIPE, {
  apiVersion: "2020-08-27",
});
const endpointSecretprod = process.env.ENDPOINT_SECRETPROD;
const endpointSecretdev = process.env.ENDPOINT_SECRETDEV;
//Configuração das credenciais do email de envio
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: TRUE, //Usar "false" para ambiente de desenvolvimento
  },
});

class StripeController {
  //Esta API trata webhooks do Stripe para processar pagamentos bem-sucedidos. Ao receber um evento de pagamento confirmado, ela atualiza o tipo de plano e status de membro de um usuário no banco de dados.
  //Em seguida, envia um e-mail de confirmação de compra ao cliente, com informações relevantes sobre a transação.
  async handleStripeWebhook(req, res) {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecretdev
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    switch (event.type) {
      //   case "checkout.session.completed":
      //     const checkoutSessionCompleted = event.data.object;
      //     const phone_number = checkoutSessionCompleted.phone;
      //     break;
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        const customerEmail = paymentIntentSucceeded.receipt_email;
        const amount = paymentIntentSucceeded.amount / 100;
        let type_plan;
        if (amount == 100) {
          type_plan = "1";
        } else if (amount == 200) {
          type_plan = "2";
        } else if (amount == 300) {
          type_plan = "3";
        } else {
          type_plan = "0";
        }
        try {
          await Users.update(
            {
              use_type_plan: type_plan,
              use_type_member: true,
            },
            {
              where: { use_email: customerEmail },
            }
          );
        } catch (error) {
          console.error("Error updating phone_number:", error);
        }
        const emailBody = `
        <p>Olá,</p>
                  `;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const mailOptions = {
          from: process.env.EMAIL,
          to: customerEmail,
          subject: "Confirmação de Compra",
          text: "Corpo de email em desenvolvimento",
          html: emailBody,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Erro ao enviar o e-mail:", error);
          } else {
            console.log("E-mail enviado:", info.res);
          }
        });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.send();
  }
}

export default new StripeController();
