import { MercadoPagoConfig, Payment } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config(); 

const client = new MercadoPagoConfig({ 
	accessToken: process.env.accessToken || "",
	options: {
		timeout: 5000
	}
});
const payment = new Payment(client);

export const createPayment = async (
	transaction_amount: number,
	description: string,
	payment_method_id: string,
	email: string,
	first_name?: string,
	last_name?: string,
	identification?: { type: string; number: string },
	address?: {
	  zip_code: string;
	  street_name: string;
	  street_number: string;
	  neighborhood: string;
	  city: string;
	  federal_unit: string;
	}
  ) => {
	try {
	  const allowedMethods = ["pix", "bolbradesco"];
  
	  if (!allowedMethods.includes(payment_method_id)) {
		throw new Error("Método de pagamento não suportado!");
	  }
  
	  const body: any = {
		transaction_amount,
		description,
		payment_method_id,
		payer: { email },
	  };
  
	  // Se for boleto, adiciona CPF/CNPJ, nome e endereço do pagador na req para a api do mercado
	  if (payment_method_id === "bolbradesco") {
		if (!identification || !first_name || !last_name) {
		  throw new Error("CPF/CNPJ, nome e sobrenome são obrigatórios para boleto!");
		}
  
		if (!address) {
		  throw new Error("Endereço completo é obrigatório para boleto!");
		}
  
		// Validação do CPF/CNPJ
		const validIdentification = identification.number.replace(/\D/g, ""); // Just numbers
		if (validIdentification.length !== 11 && validIdentification.length !== 14) {
		  throw new Error("Número de identificação inválido! Deve ser CPF (11 dígitos) ou CNPJ (14 dígitos).");
		}
  
		body.payer = {
		  email,
		  first_name,
		  last_name,
		  identification: {
			type: identification.type.toUpperCase(), // CPF ou CNPJ
			number: validIdentification, // Just numbers
		  },
		  address: {
			zip_code: address.zip_code.replace(/\D/g, ""), // Remove caracteres não numéricos
			street_name: address.street_name,
			street_number: address.street_number,
			neighborhood: address.neighborhood,
			city: address.city,
			federal_unit: address.federal_unit,
		  },
		};
	  }
    
	  const response = await payment.create({ body });
	  return response;
	} catch (error: any) {
	  console.error("Erro no pagamento:", error.response ? error.response.data : error.message);
	  throw new Error(`Erro ao processar pagamento: ${error.message}`);
	}
  };
  