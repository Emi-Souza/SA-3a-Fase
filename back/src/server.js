const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'petmate',
    password: 'senai',
    port: 5432,
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(express.json());

app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

app.post('/usuarios', async (req, res) => {
    const { nome, endereco, email, telefone, senha, cpf } = req.body;
    try {
        const existingUser = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Este email já está em uso' });
        }

        const result = await pool.query(
            'INSERT INTO usuarios (nome, endereco, email, telefone, senha, cpf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nome, endereco, email, telefone, senha, cpf]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar usuário' });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, endereco, telefone, cpf } = req.body;
    try {
        const result = await pool.query(
            'UPDATE usuarios SET nome = $1, email = $2, senha = $3, endereco = $4, telefone = $5, cpf = $6 WHERE id_usuario = $7 RETURNING *',
            [nome, email, senha, endereco, telefone, cpf, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM pets WHERE id_usuario = $1', [id]);

        const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário e seus pets deletados com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar usuário:', err.message);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [email, senha]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        res.json({ message: 'Login bem-sucedido', user: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao validar login' });
    }
});

// CRUD para pets
app.get('/pets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pets');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar pets' });
    }
});

app.get('/pets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM pets WHERE id_pet = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pet não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar pet' });
    }
});

app.post('/pets', async (req, res) => {
    const { nome, idade, raca, descricao, porte, genero, imagem, id_usuario } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO pets (nome, idade, raca, descricao, porte, genero, imagem, id_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [nome, idade, raca, descricao, porte, genero, imagem, id_usuario]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar pet' });
    }
});


app.put('/pets/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, idade, raca, descricao, porte, genero, imagem, id_usuario } = req.body;
    try {
        const result = await pool.query(
            'UPDATE pets SET nome = $1, idade = $2, raca = $3, descricao = $4, porte = $5, genero = $6, imagem = $7, id_usuario = $8 WHERE id_pet = $9 RETURNING *',
            [nome, idade, raca, descricao, porte, genero, imagem, id_usuario, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pet não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar pet:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar pet' });
    }
});

app.delete('/pets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM pets WHERE id_pet = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pet não encontrado' });
        }
        res.json({ message: 'Pet deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar pet:', err.message);
        res.status(500).json({ error: 'Erro ao deletar pet' });
    }
});



app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});