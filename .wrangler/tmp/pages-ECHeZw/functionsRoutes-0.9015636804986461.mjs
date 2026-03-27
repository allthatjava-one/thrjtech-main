import { onRequestPost as __r2_presign_js_onRequestPost } from "D:\\Brian\\workspaces\\github-allthatjava-one\\thrj-main\\functions\\r2-presign.js"

export const routes = [
    {
      routePath: "/r2-presign",
      mountPath: "/",
      method: "POST",
      middlewares: [],
      modules: [__r2_presign_js_onRequestPost],
    },
  ]