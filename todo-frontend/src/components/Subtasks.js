import Tasks from "./Tasks";
import DispatchContext from "../DispatchContext";
import { useContext } from "react";

const Subtasks = ({ subtasks, editingSubtask }) => {
  const appDispatch = useContext(DispatchContext);
  return (
    <>
      {subtasks.map((subtask) => (
        <Tasks
          todo={subtask}
          key={subtask.id}
          onToggle={() =>
            appDispatch({
              type: "toggleSubtask",
              subtaskID: subtask.id,
              taskID: subtask.taskID,
            })
          }
          onDestroy={() =>
            appDispatch({
              type: "deleteSubtask",
              subtaskID: subtask.id,
              taskID: subtask.taskID,
            })
          }
          onEdit={() =>
            appDispatch({
              type: "editSubtask",
              subtaskID: subtask.id,
              taskID: subtask.taskID,
            })
          }
          editing={editingSubtask.subtaskID === subtask.id}
          onSave={(title) =>
            appDispatch({
              type: "updateSubtask",
              subtaskID: subtask.id,
              title,
              taskID: subtask.taskID,
            })
          }
          onCancel={() => appDispatch({ type: "cancelSubtask" })}
          isSubtask={true}
        />
      ))}
    </>
  );
};

export default Subtasks;
