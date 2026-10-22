import { useEffect, useState } from 'react';
import { readWorkspace, subscribeWorkspace, type WorkspaceState } from '@/services/workspaceService';

export const useWorkspace = (): WorkspaceState => {
  const [workspace, setWorkspace] = useState(readWorkspace);
  useEffect(() => subscribeWorkspace(() => setWorkspace(readWorkspace())), []);
  return workspace;
};
