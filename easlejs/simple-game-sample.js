//Counting-by-5s
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
            this.outAnswer = bind(this.outAnswer, this);
            this.overAnswer = bind(this.overAnswer, this);
            this.checkAnswer = bind(this.checkAnswer, this);
            this.handleRoundComplete = bind(this.handleRoundComplete, this);
            return MainGameState.__super__.constructor.apply(this, arguments);
        }

        MainGameState.prototype.backgroundImage = 'background';

        MainGameState.prototype.round = 0;

        MainGameState.prototype.answers = [
            [25, 50],
            [20, 45],
            [15, 40],
            [10, 35],
            [5, 30]
        ];

        MainGameState.prototype.enter = function() {
            MainGameState.__super__.enter.apply(this, arguments);
            return this.startGame();
        };

        MainGameState.prototype.startGame = function() {
            this.playMusic();
            MainGameState.__super__.startGame.apply(this, arguments);
            this.livesCnt.setTransform(140, 10);
            this.mainCnt = new Container();
            this.adjustForAspectRatio(this.mainCnt);
            this.stage.addChild(this.mainCnt);
            this.makeSea();
            this.makeQuestion();
            return this.lastScene = false;
        };

        MainGameState.prototype.flySwan = function(x, y, speed) {
            var swan;
            this.flyingCnt = new Container();
            this.adjustForAspectRatio(this.flyingCnt);
            this.answerCnt.addChild(this.flyingCnt);
            swan = this.animation('flyingswan');
            swan.setTransform(x, y);
            swan.gotoAndPlay("all");
            swan.scaleX = 0.8;
            swan.scaleY = 0.8;
            swan.rotation = -10;
            this.flyingCnt.addChild(swan);
            swan.centreRegistrationPoint();
            return this.tweenMax.to(swan, speed, {
                x: 3300,
                y: 0,
                scaleX: 1.6,
                scaleY: 1.6,
                repeat: 0,
                ease: this.eases.Linear.easeNone
            });
        };

        MainGameState.prototype.makeSea = function() {
            var sea;
            this.seaCnt = new Container();
            this.adjustForAspectRatio(this.seaCnt);
            this.mainCnt.addChild(this.seaCnt);
            this.seaCnt.setTransform(this.stageD.width / 2, this.stageD.height - 180);
            sea = this.bitmap('sea');
            this.seaCnt.addChild(sea);
            return sea.centreRegistrationPoint();
        };

        MainGameState.prototype.handleRoundComplete = function() {
            if (this.round > this.variables.rounds && this.lastScene) {
                this.round = 0;
                this.mainCnt.removeAllChildren();
                return this.finn();
            } else if (this.round > this.variables.rounds && !this.lastScene) {
                this.lastFly();
                return this.lastScene = true;
            } else if (this.round <= this.variables.rounds) {
                return this.makeQuestion();
            }
        };

        MainGameState.prototype.makeQuestion = function() {
            var answerNum, firstLoop, secondLoop;
            if (this.answerCnt) {
                this.answerCnt.removeAllChildren();
            }
            this.mainCnt.mouseEnabled = true;
            this.answerCnt = new Container();
            this.adjustForAspectRatio(this.answerCnt);
            this.mainCnt.addChild(this.answerCnt);
            this.answerCnt.x = this.nativeD.width / 2;
            this.correctAnswer = this.answers[Util.randInt(0, 4)][Util.randInt(0, 1)];
            this.questionPics = this.spriteSheet('pics');
            answerNum = this.correctAnswer / 5;
            if (answerNum <= 5) {
                firstLoop = answerNum;
                secondLoop = 0;
                this.adjust = answerNum;
            } else if (answerNum > 5) {
                firstLoop = 5;
                secondLoop = answerNum - 5;
                this.adjust = 5;
            }
            this.maketopPics(firstLoop, 300);
            this.maketopPics(secondLoop, 140);
            return this.makeAnswer();
        };

        MainGameState.prototype.maketopPics = function(loopI, yP) {
            var i, l, pictures, ref, results;
            results = [];
            for (l = i = 0, ref = loopI; 0 <= ref ? i < ref : i > ref; l = 0 <= ref ? ++i : --i) {
                pictures = this.questionPics.bitmapFromFrame(Util.randInt(0, 19));
                pictures.x = (l * 170) - (this.adjust / 2 * 170 - this.adjust - 1 * 80);
                pictures.y = yP;
                pictures.scaleX = 0;
                this.answerCnt.addChild(pictures);
                pictures.centreRegistrationPoint();
                results.push(this.tweenMax.to(pictures, .7, {
                    scaleX: 1,
                    delay: l * .05,
                    ease: this.eases.Elastic.easeOut
                }));
            }
            return results;
        };

        MainGameState.prototype.makeAnswer = function() {
            var answer, c, clickable, i, r, results, swanAnswer;
            this.answersArray = [];
            this.playSound('splash');
            swanAnswer = this.spriteSheet('swan');
            results = [];
            for (c = i = 0; i < 5; c = ++i) {
                results.push((function() {
                    var j, results1;
                    results1 = [];
                    for (r = j = 0; j < 2; r = ++j) {
                        if (r % 2 === 0) {
                            answer = swanAnswer.bitmapFromFrame(this.answers[c][0] / 5 - 1);
                            answer.name = this.answers[c][0];
                        } else {
                            answer = swanAnswer.bitmapFromFrame(this.answers[c][1] / 5 - 1);
                            answer.name = this.answers[c][1];
                        }
                        this.answersArray.push(answer);
                        answer.centreRegistrationPoint();
                        answer.setTransform(-c * 200 - this.nativeD.width / 2 - 200, 100 + 80 * r * 2 + 340);
                        answer.scaleX = answer.scaleY = 0.6;
                        this.answerCnt.addChild(answer);
                        this.tweenMax.to(answer, 1, {
                            x: 200 * -c + 320,
                            delay: (c * r + c) * .1 + 1,
                            ease: this.eases.Sine.easeOut
                        });
                        clickable = this.makeClickable(answer);
                        clickable.on('click', this.checkAnswer);
                        clickable.on('over', this.overAnswer);
                        results1.push(clickable.on('out', this.outAnswer));
                    }
                    return results1;
                }).call(this));
            }
            return results;
        };

        MainGameState.prototype.tweenIt = function(xTween, yTween, what, ir) {
            return this.tweenMax.to(what, ir * 0.2, {
                x: xTween,
                y: yTween,
                repeat: 0,
                ease: this.eases.Linear.easeNone
            });
        };

        MainGameState.prototype.checkAnswer = function(e) {
            var i, len, n, ref, results;
            if (e.target.name === this.correctAnswer) {
                this.delayedCall(1, function() {
                    console.log(e.target.x);
                    this.flySwan(e.target.x, e.target.y, 4);
                    this.answerCnt.removeChild(e.target);
                    return this.tweenMax.to(this.answerCnt, 4, {
                        x: this.stageD.width - this.stageD.width - 1400,
                        onComplete: this.handleRoundComplete,
                        onCompleteScope: this,
                        repeat: 0,
                        ease: this.eases.Linear.easeNone
                    });
                });
                console.log("CORRECT");
                this.playSound('correct_1');
                this.round++;
                this.mainCnt.mouseEnabled = false;
                ref = this.answersArray;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    n = ref[i];
                    if (n.name !== this.correctAnswer) {
                        results.push(n.alpha = 0.5);
                    } else {
                        results.push(void 0);
                    }
                }
                return results;
            } else {
                this.livesStatus.removeLife();
                this.playSound('incorrect_' + Util.randInt(1, 3));
                e.target.alpha = 0.5;
                return e.target.mouseEnabled = false;
            }
        };

        MainGameState.prototype.overAnswer = function(e) {
            return this.tweenMax.to(e.target, 0.2, {
                scaleX: 0.7,
                scaleY: 0.7,
                repeat: 0,
                ease: this.eases.Linear.easeNone
            });
        };

        MainGameState.prototype.outAnswer = function(e) {
            return this.tweenMax.to(e.target, 0.2, {
                scaleX: 0.6,
                scaleY: 0.6,
                repeat: 0,
                ease: this.eases.Linear.easeNone
            });
        };

        MainGameState.prototype.lastFly = function() {
            var ad, adjustIt, allSwan, i, swan;
            this.tweenMax.to(this.seaCnt, 0.6, {
                y: this.stageD.height + 80,
                repeat: 0,
                ease: this.eases.Linear.easeNone
            });
            this.swanflyCnt = new Container();
            this.adjustForAspectRatio(this.swanflyCnt);
            this.mainCnt.addChild(this.swanflyCnt);
            this.swanflyCnt.setTransform(1600, 200);
            for (swan = i = 1; i < 6; swan = ++i) {
                allSwan = this.animation('flyingswan');
                allSwan.gotoAndPlay(Util.randInt(0, 19));
                adjustIt = 60;
                if (swan > 3) {
                    adjustIt = 60;
                    ad = 300;
                }
                allSwan.setTransform(60 * swan - ad, adjustIt * swan);
                this.swanflyCnt.addChild(allSwan);
                allSwan.scaleX = swan * -0.07;
                allSwan.scaleY = swan * 0.07;
                allSwan.centreRegistrationPoint();
            }
            return this.tweenMax.to(this.swanflyCnt, 6, {
                x: -1100,
                y: 0,
                scaleX: 1.6,
                scaleY: 1.6,
                repeat: 0,
                onComplete: this.handleRoundComplete,
                ease: this.eases.Linear.easeNone
            });
        };

        return MainGameState;

    })(Activity);
    return MainGameState;
});
