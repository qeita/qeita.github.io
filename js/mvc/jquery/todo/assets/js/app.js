(function(){

  /**
   * モデル
   */
  const Model = {
    todos: [],

    /**
     * イベント
     */
    events: {
      LOAD_TASK: 'LOAD_TASK',
      ADD_TASK: 'ADD_TASK',
      SEE_TASK: 'SEE_TASK',
      OPEN_MODAL: 'OPEN_MODAL',
      CLOSE_MODAL: 'CLOSE_MODAL',
      UPDATE_TASK: 'UPDATE_TASK',
      REMOVE_TASK: 'REMOVE_TASK',
    },

    /**
     * タスク読み込み
     */
    loadTask: function(data){
      this.todos = data;
      $(this).trigger(this.events.LOAD_TASK);
    },

    /**
     * タスクの追加(todosの配列に追加してやる)
     * @param {object} 追加されるタスク
     */
    addTask: function(obj){
      $(this).trigger(this.events.ADD_TASK, obj);      
    },

    seeTask: function(n){
      $(this).trigger(this.events.SEE_TASK, n);
    },

    /**
     * タスクの削除
     * @param {number} 削除されるタスクのインデックス
     */
    removeTask: function(n){
      $(this).trigger(this.events.REMOVE_TASK, n);
    },

    /**
     * モーダル開く
     */
    openModal: function(type){
      $(this).trigger(this.events.OPEN_MODAL, type); 
    },

    /**
     * モーダル閉じる
     */
    closeModal: function(type){
      $(this).trigger(this.events.CLOSE_MODAL, type); 
    }
  };


  /**
   * ビュー
   */
  const View = function(o){
    this.o = o;
    this.init();
  };

  View.prototype = {
    /**
     * 初期化
     */
    init: function(){
      let me = this;
      
      // タスク読み込み完了を受けて一覧表示
      $(Model).on(Model.events.LOAD_TASK, function(ev){
        me.render(me.o);
      });

      // タスク追加を受けて一覧に追加タスク表示
      $(Model).on(Model.events.ADD_TASK, function(ev, obj){
        me.addTask(obj);
      });

      // タスク詳細を受けて一覧の指定タスクの詳細表示
      $(Model).on(Model.events.SEE_TASK, function(ev, n){
        me.seeTask(n);
      });

      // タスク削除を受けて一覧の指定タスクの削除
      $(Model).on(Model.events.REMOVE_TASK, function(ev, n){
        me.removeTask(n);
      });

      // モーダルイベントを受けてモーダル表示
      $(Model).on(Model.events.OPEN_MODAL, function(ev, type){
        me.setModalBtn();
        me.openModal(type);
      });

      // モーダルイベントを受けてモーダル非表示
      $(Model).on(Model.events.CLOSE_MODAL, function(ev, type){
        me.setModalBtn();
        me.closeModal(type);
      });
      
    },

    /**
     * タスク一覧出力表示
     * @param {object} 一覧表示させる要素
     */
    render: function(elm){
      for(let i = 0, count = Model.todos.length; i < count; i++){
        const _desc = $('<p>').text(Model.todos[i].description);
        const _date = $('<p>').text(Model.todos[i].date);

        const _header = $('<div>').addClass('mdl-list__item-primary-content');
        const _title = $('<p>').addClass('js-txt__title').text(Model.todos[i].title);
        const _btn = $('<button>').addClass('mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab todo__delete js-btn--delete').append( $('<i>').addClass('material-icons').text('add') );

        const _detail = $('<div>').addClass('todo__detail').append(_date).append(_desc);
        const _list = $('<div>').addClass('mdl-list__item todo__item');

        _header.append(_title);
        _header.append(_btn);

        _list.append(_header);
        _list.append(_detail);
        $(elm).append(_list);
      }
    },

    /**
     * 追加タスク表示
     * @param {object} 追加タスクの情報(タイトル、詳細、日付)
     */    
    addTask: function(obj){
      let me = this;

      const _desc = $('<p>').text(obj.desc);
      const _date = $('<p>').text(obj.date);

      const _header = $('<div>').addClass('mdl-list__item-primary-content');
      const _title = $('<p>').addClass('js-txt__title').text(obj.title);
      const _btn = $('<button>').addClass('mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab todo__delete js-btn--delete').append( $('<i>').addClass('material-icons').text('add') );

      const _detail = $('<div>').addClass('todo__detail').append(_date).append(_desc);
      const _list = $('<div>').addClass('mdl-list__item todo__item');

      _header.append(_title);
      _header.append(_btn);

      _list.append(_header);
      _list.append(_detail);
      $(me.o).append(_list);

      // モーダル内のインプット要素をリセット
      $('#todo__title').val('').parent().removeClass('is-upgraded is-dirty');
      $('#todo__desc').val('').parent().removeClass('is-upgraded is-dirty');
    },

    /**
     * タスク詳細表示
     * @param {number} タスクのインデックス番号
     */        
    seeTask: function(n){
      let _target = $('.todo__item').eq(n).find('.todo__detail');

      if(_target.hasClass('is-open')){
        _target.removeClass('is-open');
      }else{
        _target.addClass('is-open');
      }
    },

    /**
     * タスク削除
     * @param {number} タスクのインデックス番号
     */            
    removeTask: function(n){
      $('.todo__item').eq(n).addClass('is-removed');

      setTimeout(function(){
        $('.todo__item').eq(n).remove();
      }, 400);
    },

    /**
     * モーダルボタンの状態変更
     */
    setModalBtn: function(){
      if($('.js-btn--add').hasClass('is-active')){
        $('.js-btn--add').removeClass('is-active');
      }else{
        $('.js-btn--add').addClass('is-active');
      }
    },

    openModal: function(type){
      $('.js-modal__box').each(function(){
        if($(this).attr('data-modal') === type){
          $(this).addClass('is-show');
        }
      });
    },

    closeModal: function(type){
      $('.js-modal__box').each(function(){
        if(type){
          if($(this).attr('data-modal') === type){
            $(this).removeClass('is-show');
          }            
        }else{
          $(this).removeClass('is-show');
        }
      });
    }
  };



  /**
   * コントローラ
   */
  const Controller = function(){
    this.init();
  };
  Controller.prototype = {
    /**
     * 初期化
     */
    init: function(){
      let me = this;

      // AjaxでJSONファイルの情報を取得
      const promise = $.ajax({
        url: './assets/data/itemData.json',
        type: 'GET',
        cache: false,
        dataType: 'json',
      });
      promise.done(function(data){
        Model.loadTask(data);
        me.todoEv();
      });
      promise.fail(function(){
        alrert('Sorry, it failed to load todos... Please access this page later');
      });
    },

    /**
     * ToDo系のイベント追加
     */    
    todoEv: function(){

      // ToDoタイトルをクリックするとタスク詳細を表示
      $(document).on('click', '.js-txt__title', function(e){
        let _n = $('.todo__item').index($(this).parent().parent());
        Model.seeTask(_n);
      });

      // 削除ボタンをクリックすると、モデルにタスク削除を伝搬      
      $(document).on('click', '.js-btn--delete', function(e){
        let _n = $('.todo__delete').index($(this));
        Model.removeTask(_n);
      });

      // 右下ボタンをクリックすると、モデルにモーダル展開を伝搬
      $('.js-btn--add').on('click', function(){
        let _type = $(this).attr('data-modal');

        if($(this).hasClass('is-active')){
          Model.closeModal(_type);
        }else{
          Model.openModal(_type);
        }
      });

      $('.js-modal--close').on('click', function(){
        Model.closeModal();
      });

      // ADDボタンをクリックすると、フィールドの値を取得してモデルにタスク追加を伝搬      
      $('.js-btn--submit').on('click', function(){

        /**
         * 日付フォーマットに変換
         * https://javascript.programmer-reference.com/js-date-format-yyyymmdd/
         */
        function getNowYMD(){
          var dt = new Date();
          var y = dt.getFullYear();
          var m = ("00" + (dt.getMonth()+1)).slice(-2);
          var d = ("00" + dt.getDate()).slice(-2);
          var result = y + "/" + m + "/" + d;
          return result;
        }

        let _obj = {
          title: $('#todo__title').val(),
          date: getNowYMD(),
          desc: $('#todo__desc').val()
        };
        Model.addTask(_obj);
      });
    }
  };


  /**
   * メインプログラム
   */
  function Main(){
    new Controller();
    new View(document.querySelector('.js-list__box'));

    /**
     * 画面ロード時の演出
     */
    window.addEventListener('load', function(){
      setTimeout(function(){
        // body要素にis-visibleクラス付与
        document.body.classList.add('is-visible');

        setTimeout(function(){
          // .todo__content要素にis-showクラス付与
          document.querySelector('.todo__content').classList.add('has-shadow');

          setTimeout(function(){
            // .todo__items要素にis-visibleクラス付与
            document.querySelector('.todo__items').classList.add('is-visible');
          }, 1000);
        }, 1000);
      }, 500);
    });
  }

  Main();


})();