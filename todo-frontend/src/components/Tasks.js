import { useState, useRef, useEffect } from "react";

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

const Tasks = ({
  onDestroy,
  todo,
  editing,
  onToggle,
  onEdit,
  onSave,
  onCancel,
}) => {
  const [editText, setEditText] = useState(todo.title);
  const editField = useRef(null);

  const handleSubmit = (event) => {
    var val = editText.trim();
    if (val) {
      onSave(todo.id, val);
      setEditText(val);
    } else {
      onDestroy(event, todo.id);
    }
  };
  const handleChange = (event) => {
    if (editing) {
      setEditText(event.target.value);
    }
  };
  const handleKeyDown = (event) => {
    if (event.which === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel(event);
    } else if (event.which === ENTER_KEY) {
      handleSubmit(event);
    }
  };
  const handleEdit = () => {
    onEdit(todo.id);
    setEditText(todo.title);
  };

  useEffect(() => {
    if (editing) {
      editField.current.focus();
      // editField.current.setSelectionRange(todo.title.length, todo.title.length);
    }
  }, [editing]);
  return (
    <>
      <li
        className={
          todo.completed ? "completed" : "" + "" + (editing ? "editing" : "")
        }
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={(event) => onToggle(event, todo.id)}
          />
          <label onDoubleClick={handleEdit}>{todo.title}</label>
          <button
            className="destroy"
            onClick={(event) => onDestroy(event, todo.id)}
          />
        </div>
        <input
          ref={editField}
          className="edit"
          value={editText}
          onBlur={handleSubmit}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </li>
    </>
  );
};

export default Tasks;
