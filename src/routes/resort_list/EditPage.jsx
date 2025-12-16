import { useParams } from "react-router-dom";
import ResortForm from "../create_resort/ResortForm.jsx";

const EditPage = () => {
  const { id } = useParams();

  // Render the shared ResortForm but pass the id via prop `editId`
  return <ResortForm editId={id} />;
};

export default EditPage;
