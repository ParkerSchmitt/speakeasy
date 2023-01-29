"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./App.css");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const PageLogin_1 = __importDefault(require("./pages/PageLogin"));
const PageRegister_1 = __importDefault(require("./pages/PageRegister"));
function Router() {
    return (<react_router_dom_1.Routes>
      <react_router_dom_1.Route path="/login" element={<PageLogin_1.default />}/>
      <react_router_dom_1.Route path="/register" element={<PageRegister_1.default />}/>

    </react_router_dom_1.Routes>);
}
exports.default = Router;
//# sourceMappingURL=Router.js.map