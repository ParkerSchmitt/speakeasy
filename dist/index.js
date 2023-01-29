"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const react_router_dom_1 = require("react-router-dom");
require("./frontend/index.css");
const Router_1 = __importDefault(require("./frontend/Router"));
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = client_1.default.createRoot(document.getElementById('root'));
root.render(<react_1.default.StrictMode>
    <react_router_dom_1.BrowserRouter>
      <Router_1.default />
    </react_router_dom_1.BrowserRouter>
  </react_1.default.StrictMode>);
//# sourceMappingURL=index.js.map