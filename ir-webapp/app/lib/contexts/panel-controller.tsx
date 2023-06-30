"use client";

import { ObjectHash } from "app/lib/helpers";
import React, {
  ReactNode,
  FC,
  createContext,
  useState,
  useCallback,
} from "react";
import FilingSearchPanel from "app/components/filing-search-panel";
import AlertsPanel from "app/components/alerts-panel";

type PanelId = "filing-search" | "alerts";

export interface PanelState {
  open: (panelId: PanelId, panelProps?: ObjectHash) => void;
  close: () => void;
}

export const PanelControllerContext = createContext<PanelState>({
  open: () => null,
  close: () => null,
});

interface Props {
  children: ReactNode;
}

export const PanelControllerProvider: FC<Props> = ({ children }) => {
  const [panels, setPanels] = useState<Map<PanelId, ObjectHash | null>>(
    new Map([
      ["filing-search", null],
      ["alerts", null],
    ])
  );

  const getProps = useCallback(
    (panelId: PanelId) => {
      return panels.get(panelId) || {};
    },
    [panels]
  );

  const isOpen = useCallback(
    (panelId: PanelId): boolean => {
      return Boolean(panels.get(panelId));
    },
    [panels]
  );

  const handleOpen = (panelId: PanelId, panelProps?: ObjectHash) => {
    const updatedPanels = new Map(panels);
    updatedPanels.forEach((value, key) => {
      updatedPanels.set(key, key === panelId ? panelProps || {} : null);
    });

    setPanels(updatedPanels);
  };

  const handleClose = () => {
    const updatedPanels = new Map(panels);
    updatedPanels.forEach((value, key) => {
      updatedPanels.set(key, null);
    });

    setPanels(updatedPanels);
  };

  return (
    <PanelControllerContext.Provider
      value={{ open: handleOpen, close: handleClose }}
    >
      {children}
      <div>
        <FilingSearchPanel
          isOpen={isOpen("filing-search")}
          onClose={() => handleClose()}
          onLoad={() => null}
          {...getProps("filing-search")}
        />
        <AlertsPanel
          isOpen={isOpen("alerts")}
          onClose={() => handleClose()}
          {...getProps("alerts")}
        />
      </div>
    </PanelControllerContext.Provider>
  );
};
