// Importa o framework Express para criar o servidor web
const express = require('express');
// Importa o Multer, usado para lidar com uploads de arquivos (multipart/form-data)
const multer = require('multer');
// Importa o MySQL2 para conectar ao banco de dados
const mysql = require('mysql2');
// Importa o CORS para permitir requisições entre domínios diferentes (front e back separados)
const cors = require('cors');
// Importa utilitários para lidar com caminhos de arquivos
const path = require('path');

// Cria a aplicação Express
const app = express();
// Define a porta do servidor
const port = 3000;

// Ativa o CORS para permitir acesso externo à API (por exemplo, via frontend em outra porta)
app.use(cors());
// Habilita o parse de JSON no corpo das requisições
app.use(express.json());
// Torna a pasta "uploads" pública para acesso às imagens via URL
app.use(express.static('uploads'));

// Configuração de upload de imagem
const storage = multer.diskStorage({
  // Define o diretório onde os arquivos serão salvos e define o nome do arquivo salvo (usando timestamp + extensão original)
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Conexão com o banco
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'coleta_verde',
});

// Rota POST de recebimento do cancelamento
// Usa o middleware "upload.single('imagem')" para processar o upload de um único arquivo com nome "imagem"
app.post('/cancelar', upload.single('imagem'), (req, res) => {
  // Obtém o valor do campo "motivo" enviado no formulário
  const motivo = req.body.motivo;
  // Se foi enviada uma imagem, obtém o nome do arquivo; senão, define como null
  const imagem = req.file ? req.file.filename : null;

  // SQL para inserir os dados na tabela "cancelamentos"
  const sql = 'INSERT INTO cancelamentos (motivo, imagem) VALUES (?, ?)';
  // Executa a query com os valores informados
  db.query(sql, [motivo, imagem], (err, result) => {
    if (err) return res.status(500).send('Erro ao salvar no banco de dados');// Retorna erro 500 se houver falha no banco de dados
    res.send('Cancelamento registrado com sucesso!');// Responde com mensagem de sucesso
  });
});

// Inicia o servidor na porta definida e exibe no console
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});