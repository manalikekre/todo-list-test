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
  isSubtask,
  addDummySubtask,
}) => {
  const [editText, setEditText] = useState(todo.title);
  const editField = useRef(null);

  const handleSubmit = (event) => {
    var val = editText.trim();
    if (val) {
      onSave(val);
      setEditText(val);
    } else {
      onDestroy();
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
      onCancel();
    } else if (event.which === ENTER_KEY) {
      handleSubmit(event);
    }
  };
  const handleEdit = () => {
    onEdit();
    setEditText(todo.title);
  };

  const onAddSubtask = () => {
    addDummySubtask();
  };

  useEffect(() => {
    if (editing) {
      editField.current.focus();
      //editField.current.setSelectionRange(todo.title.length, todo.title.length);
    }
  }, [editing]);
  return (
    <>
      <li
        className={
          (todo.completed ? "completed" : "") +
          " " +
          (editing ? "editing" : "") +
          " " +
          (isSubtask ? "subtask" : "")
        }
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={(event) => onToggle(event)}
          />
          <label onDoubleClick={handleEdit}>{todo.title}</label>
          {!isSubtask ? (
            <button
              className="add-subtask"
              onClick={(event) => onAddSubtask(event, todo.id)}
            />
          ) : (
            ""
          )}
          <button className="destroy" onClick={() => onDestroy()} />
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
