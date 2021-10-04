const express = require("express");
const { getDb, saveDb } = require("./db");
const app = express();

// 配置解析请求体：application/json
app.use(express.json());

// 配置解析请求体：application/x-www-form-urlencoded
app.use(express.urlencoded());

app.get("/todos", async (req, res) => {
  try {
    const db = await getDb();
    res.status(200).json(db.todos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const db = await getDb();
    const todo = db.todos.find((todo) => todo.id == req.params.id);
    if (!todo) {
      return res.status(404).end();
    }
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const todo = req.body;
    if (!todo.title) {
      return res.status(422).json({
        error: "The field title is required",
      });
    }
    const db = await getDb();

    db.todos.push({
      id: db.todos[db.todos.length - 1].id + 1,
      title: todo.title,
    });
    await saveDb(db);
    res.status(200).json(todo);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

app.patch("/todos/:id", async (req, res) => {
  try {
    const todo = req.body;
    const db = await getDb();
    const ret = db.todos.find((todo) => todo.id == req.params.id);

    if (!ret) {
      return res.status(404).end();
    }
    Object.assign(ret, todo);
    await saveDb(db);

    res.status(200).json(ret);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const todoId = Number(req.params.id);
    const db = await getDb();
    const index = db.todos.findIndex((todo) => todo.id === todoId);
    if (index === -1) {
      return res.status(404).end();
    }
    db.todos.splice(index, 1);
    await saveDb(db);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000`);
});
