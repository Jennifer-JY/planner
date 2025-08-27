import Tiptap from "@/app/ui/components/editor/tiptap";
import { merriweather } from "@/app/ui/fonts";
import { fetchTodosGivenId } from "@/lib/actions/todo";

const TodoEditorPage = async (props: { params: Promise<{ date: string }> }) => {
  const params = await props.params;
  const todos = await fetchTodosGivenId(params.date);

  return (
    <>
      <div className="ml-24 mr-24 mt-4">
        <h1 className={`${merriweather.className} mb-5 text-2xl`}>
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
