import { CornerDownRight } from "lucide-react";
import type { Source } from "../types";

const SourcesList = ({ sources }: { sources: Source[] }) => {
  return (
    <div className="mt-1 ml-2 text-xs text-gray-500 bg-gray-100 rounded-md px-2 py-1">
      {sources.map((source) => (
        <div key={source.id} className="flex items-center gap-1">
          <CornerDownRight size={14} className="inline-block mr-1" />
          {source.title} ({source.type})
        </div>
      ))}
    </div>
  );
};

export default SourcesList;
