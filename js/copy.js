(function () {
    $(document).ready(function () {
        /*@@ 棋盘*/
        function BigBox() {
            // 触发上下左右键
            var self = this;
            this.swipeToSide = function () {
                var self = this;
                $(document).on('keydown', function (event) {
                    switch (event.keyCode) {
                        case 37: // 左
                            break;
                        case 38: // 上
                            break;
                        case 39: // 右：左1列 -> 右4列 左1列值给右1列
                            // function right() {
                            //     // 检测是否需要移动
                            //     var isNeedMove = self.checkIsNeedMove();
                            //     // 需要移动
                            //     if (isNeedMove) {
                            //         self.moveToRight();
                            //     }
                            //     // 相加消失
                            //     self.ifSameAdd();
                            // }
                            // right();
                            var param = {
                                direction: "right",
                                lineOrRow: [self.line1Arr, self.line2Arr, self.line3Arr, self.line4Arr]
                            };
                            self.moveThenCalculate(param);
                            break;
                        case 40: // 下
                            break;
                    }
                });
            };
            // 第一行
            this.pos11 = $(".line-0 .row-0");
            this.pos12 = $(".line-0 .row-1");
            this.pos13 = $(".line-0 .row-2");
            this.pos14 = $(".line-0 .row-3");

            // 第二行
            this.pos21 = $(".line-1 .row-0");
            this.pos22 = $(".line-1 .row-1");
            this.pos23 = $(".line-1 .row-2");
            this.pos24 = $(".line-1 .row-3");

            // 第三行
            this.pos31 = $(".line-2 .row-0");
            this.pos32 = $(".line-2 .row-1");
            this.pos33 = $(".line-2 .row-2");
            this.pos34 = $(".line-2 .row-3");

            // 第四行
            this.pos41 = $(".line-3 .row-0");
            this.pos42 = $(".line-3 .row-1");
            this.pos43 = $(".line-3 .row-2");
            this.pos44 = $(".line-3 .row-3");

            // 四行
            self.line1Arr = [self.pos11, self.pos12, self.pos13, self.pos14];
            self.line2Arr = [self.pos21, self.pos22, self.pos23, self.pos24];
            self.line3Arr = [self.pos31, self.pos32, self.pos33, self.pos34];
            self.line4Arr = [self.pos41, self.pos42, self.pos43, self.pos44];

            this.linesArr = [self.line1Arr, self.line2Arr, self.line3Arr, self.line4Arr];

            // 四列
            this.row1Arr = [this.pos11, this.pos21, this.pos31, this.pos41];
            this.row2Arr = [this.pos12, this.pos22, this.pos32, this.pos42];
            this.row3Arr = [this.pos13, this.pos23, this.pos33, this.pos43];
            this.row4Arr = [this.pos14, this.pos24, this.pos34, this.pos44];

            // 检查是否需要移动
            this.checkIsNeedMove = function (param) {
                var isNeedMove;
                // 向右或向下
                if (param.direction == "right" || param.direction == "bottom") {
                    $.each(param.lineOrRow, function (key, value) {
                        for (var j = 3; j >= 0; j--) {
                            var currentContent = param.lineOrRow[j].text();
                            var currentIsEmpty = (currentContent == undefined) || (currentContent == "");

                            if (currentIsEmpty) { // 当前为空

                                if (j == 0) { // 最后一个
                                    break;
                                }
                                // 检测以后是否都为空
                                for (var n = j-1; n >= 0; n--) {
                                    var nextContent = param.lineOrRow[n].text();
                                    var nextIsNotEmpty = !((nextContent == undefined) || (nextContent == ""));

                                    if (nextIsNotEmpty) {
                                        break;
                                    }
                                }
                                // 以后有不为空的 isNeedMove设为true 调用移动函数
                                if (nextIsNotEmpty) {
                                    isNeedMove = true;
                                    break;
                                }
                            }
                        }
                    });
                }

                return isNeedMove;
            };

            // 相邻相同相加
            this.ifSameAdd = function (param) {
                // 向右或向下
                if (param.direction == "right" || param.direction == "bottom") {
                    for (var i = 3; i >= 0; i--) {
                        if (i > 0) {
                            var currentPosition = param.lineOrRow[i];
                            var currentContent = currentPosition.text();
                            var nextPosition = param.lineOrRow[i-1];
                            var nextContent = nextPosition.text();

                            // 相邻两数相等 相加消失
                            if (currentContent == nextContent && (currentContent*nextContent != 0)) {
                                currentPosition.text(2*currentContent);
                                nextPosition.text("");
                                var isNeedMove = self.checkIsNeedMove(param);
                                if (isNeedMove) {
                                    self.moveToRight(param);
                                }
                                self.ifSameAdd(param);
                            } else {
                                continue;
                            }
                        }
                    }
                }

            };

            // 向右合并
            /*
             * 自右向左 右为前 左为后
             * 满足移动的条件
             * 当前为空 且 后面不为空， 退出break
             * 若当前为空 且 为最后一个a[0]， 退出break
             * */
            this.moveToRight = function (param) {
                if (param.direction == "right" || param.direction == "bottom") {
                    for (var i = 3, k = 3; i >= 0; i--) {
                        var iContent = param.lineOrRow[i].text();
                        var iIsEmpty = (iContent == undefined) || (iContent == "");
                        if (iIsEmpty) {
                            // 无数据
                            continue;
                        } else {
                            param.lineOrRow[k].text(iContent);
                            if (k != i) {
                                param.lineOrRow[i].text("");
                            }
                            k--;
                        }
                    }
                }
            };

            // 移动并计算!! 入口函数！！
            /*
             * param = {
             *   direction: right, //(left, top, bottom)
             *   lineOrRow: line1Arr,line2Arr, line3Arr, line4Arr // (row)
             * }*/
            this.moveThenCalculate = function (param) {
                if ( typeof param != "object") {
                    alert("参数类型错误！应为对象");
                } else {

                    var isNeedMove = self.checkIsNeedMove(param);
                    // 需要移动
                    if (isNeedMove) {
                        self.moveToRight(param);
                    }
                    // 相加消失
                    self.ifSameAdd(param);
                }

            };

        }


        /*@@ 数字块*/
        function BoxItemSuper(num, color) {
            this.num = num;
            this.color = color;
        }
        BoxItemSuper.prototype = {
            constructor: BoxItemSuper,
            addNum: function (val1, val2) {
                return (val1 + val2);
            }
        };

        /*@@ 单个数字块*/
        function BoxItem2(pos) {
            BoxItemSuper.call(this);
            this.pos = pos;
        }


        /*@@ 棋盘实例*/
        var bigBox = new BigBox();
        bigBox.swipeToSide();

    });
})();