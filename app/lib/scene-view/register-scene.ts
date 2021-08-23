import { SceneStoreService } from "@base-sdk/scene-store";
import {
  __S_DesignOrigin,
  __S_StorableSceneType,
} from "@base-sdk/scene-store/__api/server-types";
import { getAccessToken } from "../auth";
import { upload } from "@base-sdk/hosting";

export async function registerScene(scene: {
  preview: Uint8Array;
  id: string;
  width: number;
  height: number;
  name: string;
  code?: {
    flutter: {
      raw: string;
    };
  };
}) {
  const token = await getAccessToken();
  const service = new SceneStoreService({
    type: "token",
    token: token,
  });

  // upload preview image
  const previewImageUploaded = await upload({
    file: new Blob([scene.preview], {
      type: "image/png",
    }),
    name: `scene-preview-${scene.name}/${scene.id}-w${scene.width}-h${scene.height}.png`,
  });

  const registeredScene = await service.register({
    preview: previewImageUploaded.url,
    fileId: "", // TODO: get fileid
    nodeId: scene.id,
    rawname: scene.name,
    width: scene.width,
    height: scene.height,
    customdata_1p: {
      code: scene.code,
    },
    initialTags: [],
    sceneType: __S_StorableSceneType.ANYNODE,
    from: __S_DesignOrigin.FIGMA_DESKTOP,
    raw: {
      id: scene.id,
    }, // TODO: add raw node data
  });

  return registeredScene;
}
