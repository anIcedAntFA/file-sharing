/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_MOCK_DATA: boolean;
  readonly VITE_API_MOCK_DATA: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_QUICK_BOARD_API_BASE_URL: string;
  readonly VITE_QUICK_BOARD_API_KEY: string;
  readonly VITE_QUICK_BOARD_API_CLIENT_ID: string;
  readonly VITE_QUICK_BOARD_GROUP_ID_KO: number;
  readonly VITE_QUICK_BOARD_GROUP_ID_EN: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
