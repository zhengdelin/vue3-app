import { $query } from "..";
export default {
  getPermissions: () => $query.get("/global/permissions"),
} as const;
