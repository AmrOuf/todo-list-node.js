const fs = require("fs");
const { program } = require("commander");

const readTodos = () => {
  const todos = fs.readFileSync("./todo.json", { encoding: "utf8" });
  return JSON.parse(todos);
};

const listTodos = () => {
  console.log(readTodos());
};

const addTodo = title => {
  const todos = readTodos();
  const id = todos.todos[todos.todos.length-1].id;
  const newEntry = {
    id: id + 1,
    title: title
  };
  todos.todos.push(newEntry);
  fs.writeFileSync("./todo.json", JSON.stringify(todos, null, 2));
};

const editTodo = (id, title) => {
  const todos = readTodos();
  const [targetedTodo] = todos.todos.filter(todo => todo.id == id);
  if(targetedTodo)
  {
    targetedTodo.title = title;
    fs.writeFileSync("./todo.json", JSON.stringify(todos, null, 2));
  }
  else
    throw new Error('No such id');
};

const deleteTodo = id => {
  const todos = readTodos();
  const filteredTodos = todos.todos.filter(todo => todo.id != id);
  const newTodos = {
    todos: filteredTodos
  };
  fs.writeFileSync("./todo.json", JSON.stringify(newTodos, null, 2));
};

program
  .command("add <title>")
  .requiredOption("-t --title", "Title of the todo")
  .description("Add a new todo")
  .action(title => addTodo(title));

program
  .command("list")
  .description("Get all todos")
  .action(listTodos);

program
  .command("edit <title> <id>")
  .requiredOption("-t --title", "New todo title")
  .requiredOption("-i --id", "Id to be edited")
  .description("Edit a todo")
  .action((title, id) => editTodo(id, title));

program
  .command("delete <id>")
  .requiredOption("-i --id", "Id to be deleted")
  .description("Delete a todo")
  .action(id => deleteTodo(id));

program.parse(process.argv);
