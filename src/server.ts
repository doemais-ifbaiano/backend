import express, { Request, Response } from "express";
import { createPayment } from "./paymentService"; 
const PORT = 3000;

const app = express();
app.use(express.json());

app.post("/pay", async (req: Request, res: Response) => {
  try {
    console.log("Dados recebidos no backend:", req.body); 

    const { 
      transaction_amount, 
      description, 
      payment_method_id, 
      email, 
      first_name, 
      last_name, 
      identification,
      address 
    } = req.body;

    if (!transaction_amount || !description || !payment_method_id || !email) {
      res.status(400).json({ error: "Todos os campos são obrigatórios!!" });
      return;
    }
    // Aceita apenas pix ou boleto bradesco
    const allowedMethods = ["pix", "bolbradesco"];
    if (!allowedMethods.includes(payment_method_id)) {
      res.status(400).json({ error: "Método de pagamento não suportado!!" });
      return;
    }

    // Se o pagamento for por boleto, verifica se as informações necessárias vieram na req
    if (payment_method_id === "bolbradesco") {
      if (!identification || !first_name || !last_name || !address) {
        res.status(400).json({ error: "Informações de CPF/CNPJ, nome, sobrenome e endereço são obrigatórias para boleto." });
        return;
      }
    }

    const paymentResponse = await createPayment(
      transaction_amount, 
      description, 
      payment_method_id, 
      email, 
      first_name, 
      last_name, 
      identification,
      address 
    );
    
    res.status(200).json(paymentResponse);
  } catch (error: any) {
    console.error("Erro ao processar pagamento:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get("/", (req: Request, res: Response) => {
  res.send("Backend Doe Mais");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
