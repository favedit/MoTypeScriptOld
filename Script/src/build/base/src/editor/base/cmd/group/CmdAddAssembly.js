var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../CompositeCommand'], function (require, exports, CompositeCommand_1) {
    "use strict";
    var CmdAddAssembly = (function (_super) {
        __extends(CmdAddAssembly, _super);
        function CmdAddAssembly() {
            _super.apply(this, arguments);
        }
        return CmdAddAssembly;
    }(CompositeCommand_1.CompositeCommand));
    exports.CmdAddAssembly = CmdAddAssembly;
});
//# sourceMappingURL=CmdAddAssembly.js.map