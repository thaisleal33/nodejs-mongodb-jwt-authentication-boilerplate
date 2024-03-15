require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function registerUser(req, res) {
    const { username, name, email, password, confirmPassword } = req.body;

    // Validations
    if (!username || !name || !email || !password || password !== confirmPassword) {
        return res.status(422).json({ message: "Verifique os dados fornecidos. Certifique-se de preencher todos os campos obrigatórios." });
    }

    try {
        // Check if user exists
        const emailExists = await User.findOne({ email: email });
        const usernameExists = await User.findOne({ username: username });
        
        if (emailExists || usernameExists) {
            return res.status(422).json({ message: 'Usuário já cadastrado.' });
        }

        // Create password hash
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            username,
            name,
            email,
            password: passwordHash,
        });

        await user.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro no servidor, tente novamente em alguns instantes." });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    // Validations
    if (!email || !password) {
        return res.status(422).json({ message: "Verifique os dados fornecidos." });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(422).json({ message: 'Credenciais inválidas.' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.SECRET);
        res.status(200).json({ message: "Login realizado com sucesso!", token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro no servidor, tente novamente em alguns instantes." });
    }
}

async function getUser(req, res) {
    const id = req.params.id;

    try {
        // Check if user exists
        const user = await User.findById(id, '-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro no servidor, tente novamente em alguns instantes." });
    }
}

async function changePassword(req, res) {
    const { userId, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId;
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.'});
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Senha atual incorreta.'})
        }

        const salt = await bcrypt.genSalt(12)
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        user.password = newPasswordHash;
        await user.save();

        res.status(200).json({ message: 'Senha alterada com sucesso!' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao alterar a senha.'});
    }
}

async function deleteUser(req, res) {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.'});
        }

        //Delete user
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Usuário deletado com sucesso!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar o usuário.'});
    }
}

async function updateUser(req, res) {
    const userId = req.params.id;
    const { username, name, email } = req.body;
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado. '});
        }

        //Update info
        if (username) user.username = username;
        if (name) user.name = name;
        if(email) user.email = email;

        await user.save();
        res.status(200).json({ message: 'Dados atualizados com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar as informações do usuário. Tente novamente em alguns instantes. '});
    }
}

module.exports = { registerUser, loginUser, getUser, changePassword, deleteUser, updateUser };
