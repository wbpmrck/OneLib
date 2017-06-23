/**提供SVG相关的操作
 * Created by cuikai on 2015/12/7.
 */

define('OneLib.SVG', [], function (require, exports, module) {

    /**
     * 类型定义：点
     * @param t：操作类型，有M(ove),L(ine)
     * @param x
     * @param y
     * @constructor
     */
    function Point(t, x, y) {
        this.t = t;
        this.x = x;
        this.y = y;
    }

    Point.prototype.toString = function () {
        return [this.t, this.x + ',' + this.y].join('');
    }
    //一个简易的SVG path string生成类
    function Path() {
        var self = this;//save the this ref

        self.points = [];
    }

    Path.prototype.moveTo = function (x, y) {
        var self = this;//save the this ref
        self.points.push(new Point('M', x, y));
        return self;
    }
    Path.prototype.lineTo = function (x, y) {
        var self = this;//save the this ref
        self.points.push(new Point('L', x, y));
        return self;
    }
    Path.prototype.resolve = function () {
        var self = this;//save the this ref

        var str = [];
        for (var i = 0, j = self.points.length; i < j; i++) {
            var p = self.points[i];
            str.push(p.toString());
        }
        return str.join('');
    }

    exports.newPath = function () {
        return new Path();
    }
});