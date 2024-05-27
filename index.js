const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://adexifeoluwa:cOp2M3dDmEnQBvvh@cluster0.hyisbht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoUri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define ToDo schema
const todoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean
});

const ToDo = mongoose.model('ToDo', todoSchema);

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/api/todo', async (req, res) => {
    const todos = await ToDo.find();
    res.json(todos);
});

app.post('/api/todo', async (req, res) => {
    const { task, completed } = req.body;
    const todo = new ToDo({ task, completed });
    await todo.save();
    res.status(201).json(todo);
});

app.put('/api/todo/:id', async (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    const updatedTodo = await ToDo.findByIdAndUpdate(id, { task, completed }, { new: true });
    res.json(updatedTodo);
});

app.delete('/api/todo/:id', async (req, res) => {
    const { id } = req.params;
    await ToDo.findByIdAndDelete(id);
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
