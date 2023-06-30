import { useContext } from "react";
import {
  PanelControllerContext,
  PanelState,
} from "app/lib/contexts/panel-controller";

const usePanelController = () => useContext<PanelState>(PanelControllerContext);

export default usePanelController;
