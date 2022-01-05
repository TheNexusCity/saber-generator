"use strict";
exports.__esModule = true;
exports.SaberRegistry = exports.SaberPiece = exports.SaberAttributes = void 0;
var fs = require("fs");
var path = require("path");
var SaberAttributes = /** @class */ (function () {
    function SaberAttributes() {
    }
    return SaberAttributes;
}());
exports.SaberAttributes = SaberAttributes;
var SaberPiece = /** @class */ (function () {
    function SaberPiece(_glbPath) {
        this.glbPath = _glbPath;
        this.thumbnailPath = "";
        this.attributes = {};
    }
    return SaberPiece;
}());
exports.SaberPiece = SaberPiece;
var SaberRegistry = /** @class */ (function () {
    function SaberRegistry(pieceRoot) {
        this.guards = new Array();
        this.grips = new Array();
        this.pommels = new Array();
        var piecePaths = this.GetPiecePaths(pieceRoot);
        for (var piecePath in piecePaths) {
            if (/.*grip.*/.test(piecePath)) {
                this.grips.push(new SaberPiece(piecePath));
            }
            else if (/.*guard.*/.test(piecePath)) {
                this.guards.push(new SaberPiece(piecePath));
            }
            else if (/.*pommel.*/.test(piecePath)) {
                this.pommels.push(new SaberPiece(piecePath));
            }
        }
        fs.writeFileSync("src/_registry.json", JSON.stringify(this));
    }
    SaberRegistry.prototype.GetPiecePaths = function (pieceRoot) {
        var result = new Array();
        var piecePaths = fs.readdirSync(pieceRoot, { withFileTypes: true });
        while (piecePaths.length > 0) {
            var dirElt = piecePaths.pop();
            if (dirElt == undefined)
                break;
            console.log(dirElt);
            if (!/.*\.glb/.test(dirElt.name)) {
                var nuPaths = this.GetPiecePaths(path.join(pieceRoot, dirElt.name));
                nuPaths.forEach(function (nuPath) { return result.push(nuPath); });
            }
            else {
                result.push(dirElt.name);
            }
        }
        return result;
    };
    return SaberRegistry;
}());
exports.SaberRegistry = SaberRegistry;
