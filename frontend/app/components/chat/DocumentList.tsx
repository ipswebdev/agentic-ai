import DocumentCard from "./DocumentCard";

export default function DocumentList({documents,onDocSelect}) {
    const fetchedDocs = documents.map((d,i)=> {
    return <DocumentCard onDocSelect={onDocSelect} key={i} file={d}></DocumentCard>
    })
    return (

    <div
    className="
        flex-1
        overflow-y-auto
    "
>
        {
        fetchedDocs
        }
    </div>
  );
}