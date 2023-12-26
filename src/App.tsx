import { Toaster } from "react-hot-toast";
import Board from "./pages/board";

const App = () => {
  return (
    <div>
      <Board />
      <Toaster
        position="bottom-left"
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