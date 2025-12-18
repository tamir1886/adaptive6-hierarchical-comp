import { Box} from "@mui/material";
import Header from "./components/Header";
import Content from "./components/Content";



export default function App() {


  return (
    <Box sx={{ minHeight: "100vh", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Content />
    </Box>
  );
}
