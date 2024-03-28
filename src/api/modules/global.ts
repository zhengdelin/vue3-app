import { $query } from "..";
export default {
  getPermissions: () => $query.get<any[]>("/global/permissions"),
} as const;
