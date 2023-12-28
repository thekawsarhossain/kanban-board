import { Toaster } from "react-hot-toast";
import BoardPage from "./pages/board";
import Header from "./Components/common/Header";

const App = () => {
  return (
    <div>
      <Header />
      <BoardPage />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 10000,
          success: {
            style: {
              background: "#ECFDF3",
            },
          },
          error: {
            style: {
              background: "#FEF3F2",
            },
          },
        }}
      />
    </div>
  );
};

export default App;