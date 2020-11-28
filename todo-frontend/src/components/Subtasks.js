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
          key={subtask._id}
          onToggle={() =>
            appDispatch({
              type: "toggleSubtask",
              subtaskID: subtask._id,
              taskID: subtask.taskID,
            })
          }
          onDestroy={() =>
            appDispatch({
              type: "deleteSubtask",
              subtaskID: subtask._id,
              taskID: subtask.taskID,
            })
          }
          onEdit={() =>
            appDispatch({
              type: "editSubtask",
              subtaskID: subtask._id,
              taskID: subtask.taskID,
            })
          }
          editing={editingSubtask.subtaskID === subtask._id}
          onSave={(title) =>
            appDispatch({
              type: "updateSubtask",
              subtaskID: subtask._id,
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
