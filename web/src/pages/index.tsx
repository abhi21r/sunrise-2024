import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { initialTasks } from "@/utils/TaskList";
import { TiTick, TiEdit, TiDelete, TiPlus } from "react-icons/ti";

export default function Home() {
  // State to hold tasks
  const [tasks, setTasks] = useState(initialTasks);

  // State for new task input
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // State for editing task
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");

  // State for toggling the "Add Task" form
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const filterTasks = (groups, completed) => {
    return tasks.filter(task => groups.includes(task.group) && task.completed === completed);
  };

  const areAllTasksInGroupCompleted = (group) => {
    return tasks.filter(task => task.group === group).every(task => task.completed);
  };

  const handleDoneClick = (taskId) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          if (task.group === 1) {
            return { ...task, completed: true };
          } else if (areAllTasksInGroupCompleted(task.group - 1)) {
            return { ...task, group: 1 };
          }
        }
        return task;
      });
      return updatedTasks;
    });
  };

  const getTasksForDisplay = (group, completed) => {
    if (group === 1) {
      return filterTasks([group], completed);
    } else if (areAllTasksInGroupCompleted(group - 1)) {
      return filterTasks([group], completed);
    }
    return [];
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
      title: newTaskTitle,
      description: newTaskDescription,
      group: 2,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setShowAddTaskForm(false);
  };

  const handleEditClick = (taskId) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    setEditTaskId(taskId);
    setEditTaskTitle(taskToEdit.title);
    setEditTaskDescription(taskToEdit.description);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === editTaskId) {
        return { ...task, title: editTaskTitle, description: editTaskDescription };
      }
      return task;
    }));
    setEditTaskId(null);
    setEditTaskTitle("");
    setEditTaskDescription("");
  };

  const handleDeleteClick = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const toggleAddTaskForm = () => {
    setShowAddTaskForm(prevState => !prevState);
  };

  return (
    <>
      <Head>
        <title>Task Board</title>
        <meta name="description" content="Task Board Documentation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Task Board</h1>
        </header>
        <div className={styles.grid}>
          <div className={styles.section}>
            <div className={styles.todoHeader}>
              <h2 className={styles.sectionTitle}>
                To-Do <span className={styles.taskCounttodo}>{tasks.filter(task => !task.completed && task.group !== 1).length}</span>
              </h2>
              <button className={styles.toggleButton} onClick={toggleAddTaskForm}>
                <TiPlus /> {showAddTaskForm ? 'Hide' : 'Add Task'}
              </button>
            </div>
            {showAddTaskForm && (
              <div className={styles.newTaskFormContainer}>
                <form className={styles.taskForm} onSubmit={handleAddTask}>
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Task Description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    required
                  />
                  <button type="submit">Add Task</button>
                </form>
              </div>
            )}
            {tasks.filter(task => !task.completed && task.group !== 1).map(task => (
              <div className={styles.card} key={task.id}>
                <div className={styles.cardHeader}>
                  <span>Task {task.id}: {task.title}</span>
                </div>
                <p className={styles.cardDescription}>{task.description}</p>
                <div className={styles.cardActions}>
                  <button className={styles.editButton} onClick={() => handleEditClick(task.id)}>
                    <TiEdit /> Edit
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDeleteClick(task.id)}>
                    <TiDelete /> Delete
                  </button>
                  <button className={styles.doneButtonin} onClick={() => handleDoneClick(task.id)}>
                    <TiTick className={styles.tick} /> Done
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              In Progress <span className={styles.taskCountinpr}>{getTasksForDisplay(1, false).length}</span>
            </h2>
            {getTasksForDisplay(1, false).map(task => (
              <div className={styles.card} key={task.id}>
                <div className={styles.cardHeader}>
                  <span>Task {task.id}: {task.title}</span>
                  <button className={styles.doneButton} onClick={() => handleDoneClick(task.id)}>
                    <TiTick className={styles.tick} /> Done
                  </button>
                </div>
                <p className={styles.cardDescription}>{task.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Completed <span className={styles.taskCountcmpt}>{filterTasks([1], true).length}</span>
            </h2>
            {filterTasks([1], true).map(task => (
              <div className={styles.card} key={task.id}>
                <div className={styles.cardHeader}>
                  <span>Task {task.id}: {task.title}</span>
                  <button className={styles.doneButtonct} disabled>Done</button>
                </div>
                <p className={styles.cardDescription}>{task.description}</p>
              </div>
            ))}
          </div>
        </div>
        {editTaskId && (
          <div className={styles.editModal}>
            <h2>Edit Task</h2>
            <form onSubmit={handleSaveEdit}>
              <input
                type="text"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                required
              />
              <textarea
                value={editTaskDescription}
                onChange={(e) => setEditTaskDescription(e.target.value)}
                required
              />
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditTaskId(null)}>Cancel</button>
            </form>
          </div>
        )}
      </main>
    </>
  );
}