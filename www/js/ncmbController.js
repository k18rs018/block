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
          // 順位を求める
          // ”score” フィールドの値が score より大きいものを取得
          Score.greaterThan("score", score)
            .count()    // 件数を結果に含める
            .fetchAll()
            .then(function(scores){
               // countの結果は、取得データscoresのcountプロパティに含まれる

               // 0件のとき正しく動作するように条件分岐
               var rank = (scores.count !== undefined) ? parseInt(scores.count) + 1 : 1;

               // ダイアログの表示
              if(typeof navigator.notification !== 'undefined'){
                navigator.notification.alert(
                  "今回の順位は #" + rank + " でした！",
                  function(){},
                  "スコア送信完了！"
                );
              } else {
                alert("スコア送信完了！\n今回の順位は #" + rank + " でした！");
             }
          })
        })
       .catch(function(err){
            console.log(err);
        });
  },

  // ユーザー登録
  createUser: function() {
    var self = this;

    //適当なUUIDを作成
    var uuid = self.uuid();

    //ユーザークラスのインスタンスを作成
    //userNameとパスワードにはuuidを設定
    var user = new self.ncmb.User({userName:uuid, password:uuid});

    //会員登録を行うメソッドを実行
    user.signUpByAccount()
        .then(function(user){
            // 登録完了後ログイン
            localStorage.setItem("userName", uuid);
            self.loginWithUUID();
        })

  },

  uuid: function() {
    var uuid = "", i, random;
    for(i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;

      if(i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += "-"
      }
      uuid += (i == 12 ? 4 :
        (i == 16 ? (random & 3 | 8) :
          random)).toString(16);
    }
    return uuid;
  },

  // UUIDが存在すればログイン、しなければ新規作成
  loginWithUUID: function() {
    var self = this;
    var userName = localStorage.getItem("userName");

    if(!userName){
        // ユーザーを作成したことがない
        self.createUser();
    } else if(!self.currentUser) {
        // ログアウト状態：userNameとパスワードでログイン
        // 今回はパスワード（第2引数）もuserNameを使用
        self.ncmb.User.login(userName, userName)
            .then(function(user){
                // ログイン後：ユーザーデータの更新
                self.currentUser = user;
                self.refreshCurrentUser();
            })
            .catch(function(err){
                // 失敗した場合：ユーザー作成
                console.log(err);
                self.createUser();
            });
    } else {
        // ログアウトしていない（前のログインデータが残っている）
        self.currentUser = self.ncmb.User.getCurrentUser();

        // userオブジェクトを使用してログイン
        self.ncmb.User.login(self.currentUser)
            .then(function(user){
                // ログイン後：ユーザーデータの更新
                self.currentUser = user;
                self.refreshCurrentUser();
            })
            .catch(function(err){
                // セッション切れの場合はログアウトして再ログイン
                console.log(err);

                self.ncmb.User.logout();  // ログアウト
                self.currentUser = null;
                self.loginWithUUID();       // 再ログイン
            });
    }
  },
  // currentUserプロパティを更新
  refreshCurrentUser: function() {
    var self = this;
    if(!self.currentUser) return;

    // オブジェクトIDを用いてユーザーを検索（fetchById）
    self.ncmb.User.fetchById(self.currentUser.get("objectId"))
             .then(function(user){
                 self.currentUser = user;
              })
             .catch(function(err){
                console.log(err);
                self.currentUser = null;
              });
  },

  init: function(screenSize) {
    var self = this;
    self.ncmb = new NCMB(self.APPLICATION_KEY,self.CLIENT_KEY);
    self.screenSize = screenSize;
  }
}