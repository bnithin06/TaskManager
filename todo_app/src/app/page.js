import Link from "next/link";
import DatePreview from "./components/DatePreview";

const page = () => {
  return (
    <div>
      <div >
        <Link href={'/taskform'}>Add Task</Link>
      </div>
      <DatePreview/>
    </div>
  );
}

export default page;