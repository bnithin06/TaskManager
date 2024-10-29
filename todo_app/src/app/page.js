import Link from "next/link";
import TaskList from "./components/TaskList";

const page = () => {
  return (
    <div>
      <div >
        <Link href={'/taskform'}>Add Task</Link>
      </div>
      <TaskList/>
    </div>
  );
}

export default page;