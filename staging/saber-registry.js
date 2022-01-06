"use strict";
exports.__esModule = true;
exports.RegistryStager = exports.SaberRegistry = exports.SaberPiece = exports.SaberAttributes = void 0;
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
    function SaberRegistry() {
        this.guards = new Array();
        this.grips = new Array();
        this.pommels = new Array();
        this.composites = new Array();
    }
    return SaberRegistry;
}());
exports.SaberRegistry = SaberRegistry;
var RegistryStager = /** @class */ (function () {
    function RegistryStager() {
    }
    RegistryStager.GetPiecePaths = function (pieceRoot) {
        var result = new Array();
        var piecePaths = fs.readdirSync(pieceRoot, { withFileTypes: true });
        //console.log("---\nwith root " + pieceRoot + ", \npiecePaths: " + piecePaths + "\n---")
        while (piecePaths.length > 0) {
            var dirElt = piecePaths.pop();
            if (dirElt == undefined)
                break;
            //console.log("on piecePath" + dirElt.name)
            if (!/.*\.glb/.test(dirElt.name)) {
                //console.log("is folder")
                var nuPaths = this.GetPiecePaths(path.join(pieceRoot, dirElt.name));
                nuPaths.forEach(function (nuPath) { return result.push(nuPath); });
            }
            else {
                //console.log("is not folder")
                result.push(path.join(pieceRoot, dirElt.name));
            }
        }
        return result;
    };
    RegistryStager.Stage = function (pieceRoot) {
        var registry = new SaberRegistry();
        var piecePaths = this.GetPiecePaths(pieceRoot);
        piecePaths.forEach(function (piecePath) {
            var nuPiece = new SaberPiece(piecePath);
            if (/.*grip.*/.test(piecePath)) {
                registry.grips.push(nuPiece);
            }
            else if (/.*guard.*/.test(piecePath)) {
                registry.guards.push(nuPiece);
            }
            else if (/.*pommel.*/.test(piecePath)) {
                registry.pommels.push(nuPiece);
            }
            else {
                registry.composites.push(nuPiece);
            }
        });
        fs.writeFileSync("src/_registry.json", JSON.stringify(registry));
        return registry;
    };
    return RegistryStager;
}());
exports.RegistryStager = RegistryStager;
