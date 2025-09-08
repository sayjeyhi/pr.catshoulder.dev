import BackgroundRays from "./components/ui/BackgroundRays";
import {Workbench} from "./components/workbench/Workbench.client.tsx";

function App() {
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Workbench />
    </div>
  )
}

export default App
