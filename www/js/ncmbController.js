// This is a JavaScript file

// ncmbController.js

var ncmbController = {
  APPLICATION_KEY: "134968afb07163a8af4430c2bc7b3057a5213e2039043ed5d6dd321783017f61",
  CLIENT_KEY: "7e5dbee9cfb18fefc4b94e6765a377e2b0277482af1b561e23007a5ad4fdf549",

  ncmb: null,
  currentUser: null,
  screenSize: null,

  //スコア送信処理
  sendScore: function(score) {
    var self = this;

    // [1]Score（クラス）を生成
    var Score = self.ncmb.DataStore("ScoreClass");

    // [2]インスタンス生成、スコア数値をフィールド名"score"にセット
    var scoreData = new Score({score: score});

    // [3]送信処理
    scoreData.save()
        .then(function (saved) {
            alert("スコア送信完了！");
        })
       .catch(function(err){
            console.log(err);
        });
  },

  init: function(screenSize) {
    var self = this;
    self.ncmb = new NCMB(self.APPLICATION_KEY,self.CLIENT_KEY);
    self.screenSize = screenSize;
  }
}