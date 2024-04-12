const express = require('express');
const app = express();
require('dotenv').config();
const Food = require('./model/food');
//  conversão para JSON
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const mongoose = require('mongoose');
mongoose.connect(process.env.CONECTION,{
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rota para listar todos os alimentos
app.get('/api/foods', async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});

// Rota para buscar um alimento específico pelo ID
app.get('/api/foods/:id', async(req, res) => {
    try {
        const newFood = new Food(req.body);
        await newFood.save();
        res.status(201).json(newFood);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
});

// Rota para criar um novo alimento
app.post('/api/foods',async (req, res) => {
    try {
        const { id, name, category, quantity, expirationDate, price } = req.body;
        const newFood = new Food({
          id,
          name,
          category,
          quantity,
          expirationDate,
          price
        });
    
        
        await newFood.save();
        res.status(201).json({message:'elemento criado'}); // Responder com o novo alimento criado
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
});

// Rota para atualizar um alimento existente pelo ID
app.put('/api/foods/:id',async (req, res) => {
    try {
        const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedFood) {
          res.json(updatedFood);
        } else {
          res.status(404).json({ error: 'Alimento não encontrado' });
        }
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
});

// Rota para excluir um alimento pelo ID
app.delete('/api/foods/:id',async (req, res) => {
    try {
        await Food.findByIdAndDelete(req.params.id);
        res.status(204).json({message:'elemento deletado'}); 
        
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
