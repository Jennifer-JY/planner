import Tiptap from "@/app/ui/components/editor/tiptap";
import { merriweather } from "@/app/ui/fonts";

export const TodoEditor = () => {
  return (
    <>
      <div className="m-9">
        <h1 className={`${merriweather.className} mb-5`}>
          Add Todo for [Date]
        </h1>
        <Tiptap></Tiptap>
      </div>
    </>
  );
};

export default TodoEditor;
