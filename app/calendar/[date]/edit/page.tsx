import Tiptap from "@/app/ui/components/editor/tiptap";
import { merriweather } from "@/app/ui/fonts";
import { fetchTodosGivenId } from "@/lib/actions";

const TodoEditorPage = async (props: { params: Promise<{ date: string }> }) => {
  const params = await props.params;
  const todos = await fetchTodosGivenId(params.date);
  console.log(todos);
  return (
    <>
      <div className="m-9">
        <h1 className={`${merriweather.className} mb-5`}>
          Edit Todo for <span className="font-bold">{`[${params.date}]`}</span>
        </h1>

        {todos.error && <div>error: {`${todos.error}`}</div>}

        <div>
          <Tiptap content={todos.todos ?? { type: "doc", content: [] }} />
        </div>
      </div>
    </>
  );
};

export default TodoEditorPage;
