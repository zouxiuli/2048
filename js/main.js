(function () {
    $(document).ready(function () {
        /*@@ 棋盘*/
        function BigBox() {
            // 触发上下左右键
            var self = this;
            this.posEmpty = new Array(4); // 4*4二维数组
            this.posEmpty[0] = new Array(4);
            this.posEmpty[1] = new Array(4);
            this.posEmpty[2] = new Array(4);
            this.posEmpty[3] = new Array(4);

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
            self.row1Arr = [self.pos11, self.pos21, self.pos31, self.pos41];
            self.row2Arr = [self.pos12, self.pos22, self.pos32, self.pos42];
            self.row3Arr = [self.pos13, self.pos23, self.pos33, self.pos43];
            self.row4Arr = [self.pos14, self.pos24, self.pos34, self.pos44];

            this.rowsArr = [self.row1Arr, self.row2Arr, self.row3Arr, self.row4Arr];

            this.canAdd = true;
            this.isFull = false;


            // @@ 操作棋盘 上下左右
            this.swipeToSide = function () {
                var self = this;
                var param = {};
                $(document).on('keydown', function (event) {
                    switch (event.keyCode) {
                        case 37: // 左
                            param = {
                                direction: "left",
                                lineOrRow: self.linesArr
                            };
                            break;
                        case 38: // 上
                            param = {
                                direction: "top",
                                lineOrRow: self.rowsArr
                            };
                            break;
                        case 39: // 右：左1列 -> 右4列 左1列值给右1列
                            param = {
                                direction: "right",
                                lineOrRow: self.linesArr
                            };
                            break;
                        case 40: // 下
                            param = {
                                direction: "bottom",
                                lineOrRow: self.rowsArr
                            };
                            break;
                    }
                    self.moveThenCalculate(param);
                });
            };

            // @@ 检查是否需要移动
            this.checkIsNeedMove = function (param) {
                var isNeedMove,
                    direction,
                    j,
                    n;
                if (param.direction == "right" || param.direction == "bottom") {
                    direction = "rb";
                }
                if (param.direction == "left" || param.direction == "top") {
                    direction = "lt";
                }

                $.each(param.lineOrRow, function (key, value) {
                    for ((direction == "rb") ? j = 3 : j = 0;
                         (direction == "rb") ? j >= 0 : j <= 3;
                         (direction == "rb") ? j-- : j++) {
                        var currentContent = value[j].text();
                        var currentIsEmpty = (currentContent == undefined) || (currentContent == "");

                        if (currentIsEmpty) { // 当前为空
                            if ((direction == "rb") ? j == 0 : j == 3) { // 最后一个
                                break;
                            }
                            // 检测以后是否都为空
                            for ((direction == "rb") ? n = j-1 : n = j+1;
                                 (direction == "rb") ? n >= 0 : n <= 3;
                                 (direction == "rb") ? n-- : n++) {
                                var nextContent = value[n].text();
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
                return isNeedMove;
            };

            // @@ 移动合并
            /*
             * 思路：
             * 自右向左 右为前 左为后
             * 满足移动的条件：
             * 当前为空 且 后面不为空， 退出break
             * 若当前为空 且 为最后一个a[0]， 退出break
             * */
            this.moveToSide = function (param) {
                var direction,
                    i,
                    k;
                if (param.direction == "right" || param.direction == "bottom") {
                    direction = "rb";
                }
                if (param.direction == "left" || param.direction == "top") {
                    direction = "lt";
                }
                $.each(param.lineOrRow, function (key, value) {
                    for ((direction == "rb") ? i = 3 : i = 0, (direction == "rb") ? k = 3 : k = 0;
                         (direction == "rb") ? i >= 0 : i <= 3;
                         (direction == "rb") ? i-- : i++) {
                        var iContent = value[i].text();
                        var iIsEmpty = (iContent == undefined) || (iContent == "");
                        if (iIsEmpty) {
                            // 无数据
                            continue;
                        } else {
                            value[k].text(iContent);
                            if (k != i) {
                                value[i].text("");
                            }
                            (direction == "rb") ? k-- : k++;
                        }
                    }
                });
            };

            // @@ 相邻相同两数相加
            this.ifSameAdd = function (param) {
                var direction,
                    i;
                if (param.direction == "right" || param.direction == "bottom") {
                    direction = "rb";
                }
                if (param.direction == "left" || param.direction == "top") {
                    direction = "lt";
                }
                $.each(param.lineOrRow, function (key, value) {
                    for ((direction == "rb") ? i = 3 : i = 0;
                         (direction == "rb") ? i >= 0 : i <= 3;
                         (direction == "rb") ? i-- : i++) {
                        if ((direction == "rb") ? i > 0 : i < 3) {
                            var currentPosition = value[i];
                            var currentContent = currentPosition.text();
                            var nextPosition = (direction == "rb") ? value[i-1] : value[i+1];
                            var nextContent = nextPosition.text();

                            // 相邻两数相等 相加消失
                            if (currentContent == nextContent && (currentContent*nextContent != 0)) {
                                currentPosition.text(2*currentContent);
                                // 成功出口
                                if (+(2*currentContent) == 2048) {
                                    alert("you win");
                                    return;
                                }
                                nextPosition.text("");
                                var isNeedMove = self.checkIsNeedMove(param);
                                if (isNeedMove) {
                                    self.moveToSide(param);
                                }
                                self.ifSameAdd(param);
                            } else {
                                continue;
                            }
                        }
                    }
                });
            };

            // @@ 随机生成新值----检测是否有空位
            this.createNewRandom = function () {
                var res = 1;
                $.each(self.linesArr, function (key, value) {
                    $.each(self.linesArr[key], function (key1, value) {
                        if (self.linesArr[key][key1].text() == undefined || self.linesArr[key][key1].text() == "") {
                            self.posEmpty[key][key1] = 0;
                        } else {
                            self.posEmpty[key][key1] = 1;
                        }
                        res = res*self.posEmpty[key][key1];
                    });
                });
                if (res == 1) {
                    self.isFull = true;
                    return;
                } else {
                    self.isFull = false;
                    self.getRandom();
                }
            };

            // @@ 随机生成新值----若有空位，生成新值
            this.getRandom = function () {
                var num1 = Math.floor(Math.random()*4),
                    num2 = Math.floor(Math.random()*4),
                    s;
                while (self.isFull == false && self.posEmpty[num1][num2] != 0) {
                    num1 = Math.floor(Math.random()*4);
                    num2 = Math.floor(Math.random()*4);
                }
                s = "pos"+(num1+1)+(num2+1);
                self[s].text("2");
            };

            // @@ 检测相邻两数字是否相同——用于判断失败结束条件，当棋盘没有空位，且相邻数无法相加，则失败退出
            this.checkNumIsSame = function () {
                self.canAdd = false;
                $.each(self.linesArr, function (key, value) {
                    $.each(self.linesArr[key], function (key1, value) {
                        if (key < 3 && key1 < 3) {
                            if (self.linesArr[key][key1].text() == self.linesArr[key][key1+1].text() ||
                                self.linesArr[key+1][key1].text() == self.linesArr[key][key1].text()) {
                                self.canAdd = true;
                            }
                        } else if (key < 3 && key1 == 3) {
                            if (self.linesArr[key][key1].text() == self.linesArr[key+1][key1].text()) {
                                self.canAdd = true;
                            }
                        } else {}
                    });
                });
            };

            // @@ 重新开始
            this.restart = function () {
                var restartBtn = $(".restart");
                restartBtn.on("click", function () {
                    $.each(self.linesArr, function (key, value) {
                        $.each(self.linesArr[key], function (key1, value) {
                            self.linesArr[key][key1].text("");
                        });
                    });
                    self.createNewRandom();
                });
            };


            // @@ 每次上下左右，需执行函数：判断是否可移动-移动合并-相邻相同相加-（检测空位，若有）生成新值-（检测空位，若无）检测相邻两数是否相同-无相同，游戏失败结束
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
                        self.moveToSide(param);
                    }
                    // 相加消失
                    self.ifSameAdd(param);
                    // 随机生成新值
                    self.createNewRandom();
                    // 检测是否满格（无空位）
                    if (self.isFull) {
                        // 如果满格，检测相邻数字是否相同。若无相同，则游戏失败
                        self.checkNumIsSame();
                        if (self.canAdd == false) {
                            alert("游戏结束");
                        }
                    }
                }
            };

            // @@ 初始化（刚开始）游戏
            this.startGame = function () {
                self.swipeToSide();
                self.createNewRandom();
                self.restart();
            };
        }

        /*@@ 棋盘实例*/
        var bigBox = new BigBox();
        bigBox.startGame();
    });
})();