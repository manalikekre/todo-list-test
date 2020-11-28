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
              type: "updateSubtaskStart",
              subtask: {
                taskID: subtask.taskID,
                title: subtask.title,
                completed: !subtask.completed,
                subtaskID: subtask._id,
              },
            })
          }
          onDestroy={() =>
            appDispatch({
              type: "deleteSubtaskStart",
              subtaskID: subtask._id,
              taskID: subtask.taskID,
            })
          }
          onEdit={() =>
            appDispatch({
              type: "editSubtaskStart",
              subtaskID: subtask._id,
              taskID: subtask.taskID,
            })
          }
          editing={editingSubtask.subtaskID === subtask._id}
          onSave={(title) =>
            appDispatch({
              type: "updateSubtaskStart",
              subtask: {
                taskID: subtask.taskID,
                subtaskID: subtask._id,
                title,
                completed: subtask.completed,
              },
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
