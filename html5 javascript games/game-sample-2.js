//How Much Chnage?
//@example code written by Alireza Dezfoolian for a simple game using EasleJs
//@this is just a sample code to show to whom concern, please DO NOT reuse
//@CopyWrite 2014

var bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    },
    extend = function(child, parent) {
        for (var key in parent) {
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    },
    hasProp = {}.hasOwnProperty;

define(['../../common/game_states/activity', 'easel', 'caper/util', 'underscore'], function(Activity, easel, Util, _) {
    var Bitmap, Container, MainGameState, Point, Rectangle, SpriteSheet, Text;
    Bitmap = easel.Bitmap, Container = easel.Container, Text = easel.Text, SpriteSheet = easel.SpriteSheet, Point = easel.Point, Rectangle = easel.Rectangle;
    MainGameState = (function(superClass) {
        extend(MainGameState, superClass);

        function MainGameState() {
            this.makeItems = bind(this.makeItems, this);
            this.pressAnswer = bind(this.pressAnswer, this);
            this.outAnswer = bind(this.outAnswer, this);
            this.overAnswer = bind(this.overAnswer, this);
            this.checkAnswer = bind(this.checkAnswer, this);
            this.makeFirstQ = bind(this.makeFirstQ, this);
            this.removeStage = bind(this.removeStage, this);
            this.makeCoins = bind(this.makeCoins, this);
            this.handleRoundComplete = bind(this.handleRoundComplete, this);
            return MainGameState.__super__.constructor.apply(this, arguments);
        }

        MainGameState.prototype.backgroundImage = 'background';

        MainGameState.prototype.round = 0;

        MainGameState.prototype.enter = function() {
            MainGameState.__super__.enter.apply(this, arguments);
            return this.startGame();
        };

        MainGameState.prototype.startGame = function() {
            this.playMusic();
            MainGameState.__super__.startGame.apply(this, arguments);
            this.mainCnt = new Container();
            this.adjustForAspectRatio(this.mainCnt);
            this.stage.addChild(this.mainCnt);
            return this.newRound();
        };

        MainGameState.prototype.newRound = function() {
            this.roundCheck();
            if (this.firstround) {
                this.playSound("narrator Count how much money you have.");
            }
            return this.makeCoins();
        };

        MainGameState.prototype.handleRoundComplete = function() {
            if (this.round >= this.variables.rounds) {
                this.round = 0;
                this.mainCnt.removeAllChildren();
                return this.finn();
            } else {
                return this.newRound();
            }
        };

        MainGameState.prototype.makeCoins = function() {
            var i, j, len, moneySprite, note, noteMaker, notes, position;
            if (this.firstround) {
                if (this.variables.version === 1) {
                    this.correctNumber = Util.randInt(5, 9);
                    this.priceNumber = Util.randInt(1, this.correctNumber - 3);
                    this.allNumbers = Util.shuffleWithDistractors([this.correctNumber], [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 4);
                    this.coinNum = 3;
                    this.secNum = 5;
                } else if (this.variables.version === 2) {
                    this.correctNumber = Util.randInt(11, 20);
                    this.priceNumber = Util.randInt(1, this.correctNumber - 3);
                    this.allNumbers = Util.shuffleWithDistractors([this.correctNumber], [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 4);
                    this.coinNum = 4;
                    this.secNum = 15;
                }
            }
            if (this.itemCnt) {
                this.mainCnt.removeChild(this.itemCnt);
            }
            this.currencyCnt = new Container();
            this.adjustForAspectRatio(this.currencyCnt);
            this.mainCnt.addChild(this.currencyCnt);
            moneySprite = this.spriteSheet("currency");
            noteMaker = this.correctNumber;
            notes = [
                ["ten", 10, this.stageD.width / 2 - this.stage.dimensions["native"].x - 200, this.stage.height / 2 - 200],
                ["five", 5, this.stageD.width / 2 - this.stage.dimensions["native"].x - 200, this.stage.height / 2],
                ["two", 2, this.stageD.width / 2 - this.stage.dimensions["native"].x + 200, this.stage.height / 2 - 200],
                ["one", 1, this.stageD.width / 2 - this.stage.dimensions["native"].x + 200, this.stage.height / 2]
            ];
            for (i = j = 0, len = notes.length; j < len; i = ++j) {
                note = notes[i];
                position = 1;
                while (noteMaker - notes[i][1] >= 0) {
                    note = moneySprite.bitmapFromFrame(notes[i][0]);
                    this.currencyCnt.addChild(note);
                    note.setTransform(this.stageD.width / 2 - this.stage.dimensions["native"].x, this.stage.height - 1000);
                    this.tweenMax.to(note, 0.4, {
                        x: notes[i][2],
                        y: notes[i][3] + 100 * position,
                        alpha: 1,
                        repeat: 0,
                        ease: this.eases.Linear.easeNone
                    });
                    position += 1.4;
                    note.centreRegistrationPoint();
                    noteMaker -= notes[i][1];
                }
            }
            if (this.firstround) {
                return this.tweenIt(this.makeFirstQ);
            } else {
                return this.tweenIt(this.removeStage);
            }
        };

        MainGameState.prototype.tweenIt = function(f) {
            return this.tweenMax.to(this.currencyCnt, 0.2, {
                y: this.stage.height / 2 - this.stage.height / 2.5,
                x: this.stage.width / 2 - this.stage.dimensions["native"].x - 70 * this.adjustIt,
                alpha: 1,
                onComplete: f,
                repeat: 0,
                ease: this.eases.Linear.easeNone
            });
        };

        MainGameState.prototype.removeStage = function() {
            return this.delayedCall(3, function() {
                this.mainCnt.removeAllChildren();
                this.round++;
                return this.handleRoundComplete();
            });
        };

        MainGameState.prototype.makeFirstQ = function() {
            var answer, clickable, cnt, i, j, len, nums, ref, results;
            this.mainCnt.mouseEnabled = true;
            this.saveNumber = [];
            this.prices = this.spriteSheet('prices');
            ref = this.allNumbers;
            results = [];
            for (i = j = 0, len = ref.length; j < len; i = ++j) {
                nums = ref[i];
                answer = this.prices.bitmapFromFrame(nums - 1);
                answer.proportionalRegistrationPoint(0, 0.5);
                cnt = new Container;
                cnt.addChild(answer);
                cnt.setTransform(this.stageD.width / 2 - this.stage.dimensions["native"].x - 256 + 160 * i, this.stageD.height + 100);
                this.tweenMax.to(cnt, i * 0.25 + 0.1, {
                    y: this.stageD.height - 70,
                    repeat: 0,
                    ease: this.eases.Linear.easeNone
                });
                cnt.name = nums;
                this.saveNumber.push(cnt);
                this.mainCnt.addChild(cnt);
                clickable = this.makeClickable(cnt);
                clickable.cnt.addHitArea(new Rectangle(-60, -60, 120, 120));
                console.log(this.clickable);
                clickable.on('click', this.checkAnswer);
                clickable.on('over', this.overAnswer);
                clickable.on('out', this.outAnswer);
                results.push(clickable.on('press', this.pressAnswer));
            }
            return results;
        };

        MainGameState.prototype.checkAnswer = function(e, clickable) {
            var i, j, len, nums, ref, results;
            console.log(e.target.name);
            if (e.target.name === this.correctNumber) {
                this.mainCnt.mouseEnabled = false;
                e.target.mouseEnabled = false;
                if (this.firstround) {
                    this.tweenMax.to(e.target, 1, {
                        y: 80,
                        x: this.stageD.width / 2 - this.stage.dimensions["native"].x - 220,
                        onComplete: this.makeItems,
                        repeat: 0,
                        ease: this.eases.Linear.easeNone
                    });
                    this.playSound("narrator " + this.variables.narrator[3]);
                    this.firstround = false;
                } else {
                    this.tweenMax.to(e.target, 1, {
                        y: 80,
                        x: this.stageD.width / 2 - this.stage.dimensions["native"].x + 278,
                        onComplete: this.handleRoundComplete,
                        repeat: 0,
                        ease: this.eases.Linear.easeNone
                    });
                    this.playSound("narrator " + this.variables.narrator[4]);
                }
                ref = this.saveNumber;
                results = [];
                for (i = j = 0, len = ref.length; j < len; i = ++j) {
                    nums = ref[i];
                    if (nums.name !== this.correctNumber) {
                        this.mainCnt.removeChild(nums);
                        results.push(console.log("Remove"));
                    } else {
                        results.push(void 0);
                    }
                }
                return results;
            } else {
                console.log("WRONG");
                this.playSound("narrator " + this.variables.narrator[2]);
                e.target.alpha = 0.5;
                return e.target.mouseEnabled = false;
            }
        };

        MainGameState.prototype.overAnswer = function(e) {
            return this.tweenMax.to(e.target, 0.2, {
                scaleY: 1.2,
                scaleX: 1.2,
                repeat: 0,
                ease: this.eases.Linear.easeNone
            });
        };

        MainGameState.prototype.outAnswer = function(e) {
            return this.tweenMax.to(e.target, 0.2, {
                scaleY: 1,
                scaleX: 1,
                repeat: 0,
                ease: this.eases.Linear.easeNone
            });
        };

        MainGameState.prototype.pressAnswer = function(e) {
            return this.tweenMax.to(e.target, 0.2, {
                scaleY: 2,
                scaleX: 2.2,
                repeat: 1,
                yoyo: true,
                ease: this.eases.Linear.easeNone
            });
        };

        MainGameState.prototype.makeItems = function() {
            var item, items, tag, tagPrice, tagbase;
            if (this.currencyCnt) {
                this.mainCnt.removeChild(this.currencyCnt);
            }
            this.itemCnt = new Container();
            this.adjustForAspectRatio(this.itemCnt);
            this.itemCnt.x = this.stageD.width / 2 - this.stage.dimensions["native"].x;
            this.mainCnt.addChild(this.itemCnt);
            this.resetCorrectNo();
            item = this.spriteSheet('items');
            items = item.bitmapFromFrame(Util.randInt(0, 17));
            items.y = this.stageD.height / 2;
            this.itemCnt.addChild(items);
            items.centreRegistrationPoint();
            tagPrice = this.priceNumber + 1;
            tag = new Text(this.variables.currency + tagPrice, "normal 50px " + (this.findFont('anja eliane')), "#000000");
            tag.setTransform(90, this.stageD.height / 2 - 144);
            tagbase = this.bitmap('tag');
            tagbase.setTransform(60, this.stageD.height / 2 - 146);
            this.itemCnt.addChild(tagbase, tag);
            tag.centreRegistrationPoint();
            tagbase.centreRegistrationPoint();
            tag.rotation = -10;
            this.maketopQuestion();
            this.round++;
            return this.makeFirstQ();
        };

        MainGameState.prototype.resetCorrectNo = function() {
            var j, ref, results;
            this.correctNumber = this.correctNumber - 1 - this.priceNumber;
            return this.allNumbers = Util.shuffleWithDistractors([this.correctNumber], (function() {
                results = [];
                for (var j = 1, ref = this.secNum; 1 <= ref ? j < ref : j > ref; 1 <= ref ? j++ : j--) {
                    results.push(j);
                }
                return results;
            }).apply(this), 4);
        };

        MainGameState.prototype.maketopQuestion = function() {
            var currencySign, formula, i, j, len, order, points, results;
            if (this.variables.currency === '$') {
                currencySign = 'dollar';
            } else if (this.variables.currency === '£') {
                currencySign = 'pound';
            }
            formula = [currencySign, 'minus', currencySign, this.priceNumber, 'equal', currencySign, 'answer'];
            points = this.variables.points;
            results = [];
            for (i = j = 0, len = formula.length; j < len; i = ++j) {
                order = formula[i];
                order = this.prices.bitmapFromFrame(formula[i]);
                order.alpha = 0;
                order.x = this.stageD.width / 2 - this.stage.dimensions["native"].x - 280 + points[i] * i;
                order.y = 80;
                this.tweenMax.to(order, i * 0.5, {
                    alpha: 1,
                    repeat: 0,
                    ease: this.eases.Linear.easeNone
                });
                this.mainCnt.addChild(order);
                results.push(order.proportionalRegistrationPoint(0, 0.5));
            }
            return results;
        };

        MainGameState.prototype.roundCheck = function() {
            if (this.round % 2 === 0) {
                return this.firstround = true;
            } else {
                return this.firstround = false;
            }
        };

        return MainGameState;

    })(Activity);
    return MainGameState;
});
