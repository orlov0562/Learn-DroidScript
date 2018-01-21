
app.LoadScript('_Dialogs.js');
app.LoadScript('_Others.js');
app.LoadScript('_Simple_calc.js');
app.LoadScript('_About.js');




//var TextSize;
var TextSize = app.LoadNumber("TextSize", 0);
var Emails = app.LoadText('Emails', JSON.stringify([]));
var Currency = app.LoadText('Currency', 'руб');
if (Currency == 'гр') {
    Currency = 'грн';
    app.SaveText('Currency', 'грн');
}
var Exit = 0;
var WIDTH = app.GetScreenWidth();
var HEIGHT = app.GetScreenHeight();
//app.SaveText('Pass', JSON.stringify([null, null]));
var Pass = JSON.parse(app.LoadText('Pass', JSON.stringify([null, null])));
var TEMP = app.LoadText('Temp', JSON.stringify([]));
var HISTORY = app.LoadText('History', JSON.stringify({}));
var BASKET = app.LoadText('Basket', JSON.stringify({}));
var inputValues = [], inputValues2 = [];
var inputValues_1 = [], inputValues2_1 = [];
var inputPrices = [], inputPrices2 = [];
var listShow = [];
var list_select_cc1 = [];
var COLORS = [['#282828', '#333333'], ['#f0f0f0', '#ffffff']];
var TC = ['#cccccc', '#555555'];
var TC2 = ['#bbbbbb', '#666666'];
var FinFlag = 0;
var ROUNDING = app.LoadNumber('ROUNDING', 0);
var BG = app.LoadNumber('BG', 1);

if (BG > 1)
{
    BG = 1;
    app.SaveNumber('BG', 1);
}
var defaultPrices = JSON.parse(app.LoadText('defaultPrices', JSON.stringify({})));
var SetScreenBrightness = app.LoadBoolean('SetScreenBrightness', false);
var SetScreenSleep = app.LoadBoolean('SetScreenSleep', false);
var SetClose = app.LoadBoolean('SetClose', true);
var FullScreen = app.LoadBoolean('FullScreen', false);
var FIN = JSON.parse(app.LoadText('FIN', JSON.stringify([])));
var FIN2 = JSON.parse(app.LoadText('FIN2', JSON.stringify([])));
var Clipboard = [];
var PASS;



App.prototype.CreateTitle = function(title, end) {
    var text_size = HEIGHT * GET_TOP * 0.65;
    var lay = this.CreateLayout('linear', 'filly,vcenter');
    lay.SetSize(1, GET_TOP);
    lay.SetBackGradient('#99000000', '#99444444');
    var text = this.CreateText(title, 0.98, -1, 'left,bold');
    text.SetTextSize(text_size, 'px');
    text.SetEllipsize(end ? 'start' : "end");
    text.SetTextShadow( 1, 1, 1, "#000000" ); 
    text.SetTextColor(['#bbbbbb', '#eeeeee'][BG]);
    lay.AddChild(text);
    return lay;
}



function print() {
    var args = [];
    for (var i=0; i<arguments.length; i++)
    {
        var arg = JSON.stringify(arguments[i]);
        args.push(arg);
    }
    alert(args.join('\n'));
}


function calcValues() {
	for (var q in params_cc2) {
		var d = params_cc2[q];
		for (var key in d) {
			if (~['S', 'L', 'V'].indexOf(key.slice(-1))) {
				var j = d[key]['plus'];
				for (var i in j) {
					var v = j[i].slice(0,-1);
					for (var t in v) {
						var p = v[t];
						if (p) inputValues.push(p);
					}
				}
				var j = d[key]['minus'];
				for (var i in j) {
					var v = j[i].slice(0,-1);
					for (var t in v) {
						var p = v[t];
						if (p) inputValues.push(p);
					}
				}
			}
		}
	}
	sortValues(inputValues.pop());
}


function sortValues(val) {
    if (!val) return;
    inputValues.push(val);
    var hash = {};
    inputValues2 = [];
    for (var i in inputValues) {
        i = inputValues[i];
        (hash[i] != undefined) ? hash[i]++ : hash[i] = 1;
        if (inputValues2.indexOf(i) == -1) inputValues2.push(i);
        }
    inputValues2.sort(function(a, b) {return hash[b] - hash[a]});
    var indVal = inputValues2.indexOf(val);
    if (indVal > 1) 
    {
        inputValues2.splice(1, 0, val);
        inputValues2.splice(indVal + 1, 1);
    }
}


function resizeButton(obj, x, y) {
    obj.SetScale(x ? x : 0.9, y ? y : 0.9);
    app.Wait(0.05);
    resizeButton.tthis = obj;
    setTimeout('resizeButton.tthis.SetScale(1.0, 1.0), 500');
}


function sortValues2(val) {
    if (!val) return;
    inputValues_1.push(val);
    var hash = {};
    inputValues2_1 = [];
    for (var i in inputValues_1) {
        i = inputValues_1[i];
        (hash[i] != undefined) ? hash[i]++ : hash[i] = 1;
        if (inputValues2_1.indexOf(i) == -1) inputValues2_1.push(i);
    }
    inputValues2_1.sort(function(a, b) {return hash[b] - hash[a]});
}


function sortPrices(val) {
    if (!val) return;
    inputPrices.push(val);
    var hash = {};
    inputPrices2 = [];
    for (var i in inputPrices) {
        i = inputPrices[i];
        (hash[i] != undefined) ? hash[i]++ : hash[i] = 1;
        if (inputPrices2.indexOf(i) == -1) inputPrices2.push(i);
    }
    inputPrices2.sort(function(a, b) {return hash[b] - hash[a]});
}



function Round(val) {
    val = +val;
    return +(val.toFixed(2));
}


function mul(val){
	for (var i=0, m=1; i < val.length; m *= val[i++]);
	return Round(m);
}


function correction() {
    var txt = this.GetText();
    if (txt.indexOf('\n') > -1 || txt.length > 100) this.Undo();
    if (this.b) {
        var newtext = this.GetText();
        newtext = newtext.replace(/,/g, '‚')
          .replace(/:/g, ' -')
          .replace(/\n/g, ' ')
          .replace(/\t/g, ' ')
          .replace(/\"/g, '″')
          .replace(/\</g, '❮')
          .replace(/\>/g, '❯')
          .replace(/\\/g, '/') ;
       newtext = newtext.replace(/(^\s*)|(\s*)$/g, '');
        var t;
        if (!this.t) t = items_cc1[index_cc1];
        else t = item_cc2.slice(0, -1)
        var v = this.b.GetVisibility();
        if (this.g) newtext = '<u><i>' + newtext + '</i></u>';
        if (newtext == t && v == 'Show' || !newtext || newtext == '<u><i></i></u>') {
            this.b.SetVisibility('hide');
           // this.l.SetVisibility('hide');
        }
        else if (newtext && newtext != t && v != 'Show') {
            this.b.SetVisibility('show');
           // this.l.SetVisibility('show');
        }
     }
}

function sum(val){
	for (var i=0, sum=0; i < val.length; sum += +(val[i++]));
	return Round(sum);
  }


function TempCalc(v) {
    TEMP = JSON.stringify([]);
    Dialog.Dismiss();
    app.DestroyLayout(layDlg);
    if (this.ID != 'Yes') {
        app.SaveText('Temp', JSON.stringify([]));
        return app.ShowPopup('Незавершенный расчет удален', 'short');
        }
    params_cc2 = JSON.parse(app.LoadText('Temp', '[]'));
    app.ShowPopup('Продолжение расчета', 'short');
    return complexCalculation2(true);
}


(function  _sz()
{
    var lay = app.CreateLayout("Linear", "Top,FillXY");
    lay.SetVisibility('Hide');
    app.AddLayout(lay);
    var b = app.CreateButton('<big>❯</big>', -1, -1, "html");
    b.SetVisibility('Hide');
    lay.AddChild(b);
    var tmp = app.CreateButton('i', -1, 0.1);
    lay.AddChild(tmp);
    var u = app.CreateText('Jj'.big(), -1, -1, 'html');
    lay.AddChild(u);

    app.Wait(0.1);
    GET_TOP = app.GetTop();
    if (!GET_TOP) {
    	var u = u.GetHeight('px');
    	GET_TOP = u * 1.1 / HEIGHT;
    }
    var h = b.GetHeight();
    var w = b.GetWidth();
    var h2 = tmp.GetHeight();
    app.DestroyLayout(lay);
    TextButtonsSize = h * HEIGHT * 0.5;
    BTNHEIGHTCALC = h2;
    BTNWIDTH = w;
    BTNHEIGHT = h;
    return [h, h2, w]
})();

function isGroup(item) {
    var group;
    for (var i in items_cc1) {
        var i = items_cc1[i];
        if (i.charAt(0) == '<') group = '<img src="Img/group.png"> ' + i;
        else if (item.slice(0, -1) == i) return group;
    }
}





//старт 
var Ll1 = [];
function ComplexCalculation1(arg) {
  if (Settings.Flag) {
      app.ShowPopup('Настройки сохранены');
      Settings.Flag = false;
  }
  if (SetScreenBrightness) app.SetScreenBrightness( 1 );
  app.PreventScreenLock(SetScreenSleep );
  Exit = 1;
  showBack = false;
  if(arg==1) list_select_cc1 = [];//индексы выбр. пунктов
  lay_cc1 = app.CreateLayout("Linear", "Top,FillXY");
  Ll1.unshift(lay_cc1)
  lay_cc1.SetBackground('Img/bg'+BG+'.png', 'repeat');
  var lt = app.CreateLayout("Linear", "Right,Horizontal,FillX");
  var title = app.CreateTitle('Выбор работ для расчета');
  lay_cc1.AddChild(title);
  params_cc1 = app.LoadText('cc1', '').split('\n');
  items_cc1 = [];
  for(var i in params_cc1) {
    items_cc1[i] = params_cc1[i].slice(0, -1); }
  var data_cc1 = "";
  for (var i in items_cc1) {
    if(list_select_cc1.indexOf(+i) == -1) 
    {
        if (items_cc1[i].charAt(0) != '<') var ic = 'Img/unselect.png,';
        else var ic = 'Img/group.png,'
    }
    else var ic = "Img/selectItem.png,";
    data_cc1 += items_cc1[i] + ":" + ic;
    }
  lst_cc1 = app.CreateList(data_cc1, 1, 1-BTNHEIGHT-GET_TOP-0.005, 'html');
  lst_cc1.SetMargins(0, 0, 0, 0.005);
  lst_cc1.SetFontFile('fonts/DroidSerif-Regular.ttf');
  lst_cc1.SetTextColor(TC[BG]);
  lst_cc1.SetTextSize(TextSize);
  lst_cc1.SetTextMargins(0, 0.006, 0, 0.006);
  lst_cc1.SetOnTouch(cc1_OnTouch);
  lst_cc1.SetOnLongTouch(cc1_OnLongTouch);
  lay_cc1.AddChild(lst_cc1);
  if (typeof arg == "string") 
      lst_cc1.ScrollToItem(arg);
  var menu = app.CreateButton('[fa-ellipsis-v]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  menu.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  menu.SetTextColor(TC2[BG]);
  menu.SetTextSize(TextButtonsSize, 'px');
  menu.SetOnTouch(Menu);
  lt.AddChild(menu);
  var w = {'$':'[fa-dollar]', 'грн':'[fa-dollar]', '€':'[fa-euro]', 'руб':'[fa-ruble]'};
  var fin = app.CreateButton(w[Currency], 0.25, BTNHEIGHT, "FontAwesome, custom");
  fin.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  fin.SetTextColor(TC2[BG]);
  fin.SetTextSize(TextButtonsSize, 'px');
  fin.SetOnTouch(finOnTouch);
  lt.AddChild(fin);
  var hist = app.CreateButton('[fa-history]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  hist.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  hist.SetTextSize(TextButtonsSize, 'px');
  ComplexCalculation1.hist = hist;
  hist.SetOnTouch(HistOnTouchM);
  hist.SetTextColor((app.LoadText('History', "{}") != '{}') ? TC2[BG] : '#80'+TC2[BG].slice(1));
  lt.AddChild(hist);
  ok_cc1 = app.CreateButton('[fa-share]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  ok_cc1.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  ok_cc1.SetTextSize(TextButtonsSize, 'px');
  ok_cc1.SetOnTouch(Done_cc1);
  ok_cc1.SetTextColor((list_select_cc1.length) ? '#009000' : '#80'+TC2[BG].slice(1));
  lt.AddChild(ok_cc1);
  lay_cc1.AddChild(lt);
  app.AddLayout(lay_cc1);
  delLayouts(lay_cc1);
  if (Ll1.length > 1) {
      var n = Ll1.length;
      for (var i = 1; i < n; i++)
          app.DestroyLayout(Ll1.pop());
  }
  for (var i in Ll2) app.DestroyLayout(Ll2[i]);
  for (var i in Ll3) app.DestroyLayout(Ll3[i]);
    if (TEMP != JSON.stringify([])) {
      var yn = YesNoDialog(TempCalc, 'У Вас остался незавершенный расчет. Продолжить?', '<img src="Img/help.png"> Вопрос:');
      }
}


function HistOnTouchM(v) {
    
    if (app.LoadText('History', "{}") == '{}') {
        app.ShowPopup('История расчетов пуста.', 'Short');
        return;
        }
     HistoryBasketList(1, 1);
}

function Menu(a) {
    var list = [
        'Добавить пункт:Новый пункт работ:null',
        'Добавить метку:Новая группировочная метка:null',
        'Расчет «light»:Упрощенный расчет помещения:null',
        'Подсчет обоев:Сколько нужно рулонов?:null',
        'Учет доходов:Сколько получено:null',
        'Учет расходов:Сколько затрачено:null',
        'Калькулятор:Что-нибудь подсчитать:null',
        'Установить расценки:Расценки по-умолчанию:null',
        'Настройки:Размер шрифта‚ валюта‚ фон итд:null',
        'Отправить пункты:Экспорт на другой девайс:null',
        'Справка:Помощь по программе:null',
        'About:О программе:null',
        'Выйти:Закрыть программу:null'
        ]
    if (app.LoadText('Basket', "{}") != '{}') list.splice(3, 0, 'Открыть корзину:Расчеты‚ удаленные в корзину:null');
    if (app.LoadText('History', "{}") != '{}') list.splice(3, 0, 'Открыть историю:История расчетов:null');
    CreateListDialog(onTouchMenu, '<img src="Img/grey.png"> Меню', list, true);
}


function onTouchMenu (item) {
    if (item == 'Настройки') Settings();
    else if (item == 'About') About();
    else if (item == 'Калькулятор') {
        Exit = 'calc_cc1';
        showCalculator();
    }
    else if (item == 'Подсчет обоев') calcWallpaper(1);
    else if (item == 'Отправить пункты') sendItems();
    else if (item == 'Открыть историю') HistOnTouchM();
    else if (item == 'Установить расценки') setPricesDefault(1);
    else if (item == 'Учет доходов') finOnTouch();
    else if (item == 'Учет расходов') {
    	FinFlag = 1;
    	finOnTouch();
    }
    else if (item == 'Расчет «light»') SimpleCalculation(1);
    else if (item == 'Справка') About(1);
    else if (item == 'Добавить пункт') cc1_add();
    else if (item == 'Добавить метку') cc1_add(1);
    else if (item == 'Выйти')   _Exit();
    else if (item == 'Открыть корзину') HistoryBasketList(0, 1);
    else if (item == 'Открыть историю расчетов') HistoryBasketList(1, 1);
}


//выбор пунктов работ- поставить/убрать галку
function cc1_OnTouch(item, b, im, index){
  if (item.charAt(0) == '<')
  {
      app.ShowPopup("Для редактирования/удаления метки - долгое нажатие.", "Short");
      return;
  }
  var indexof = list_select_cc1.indexOf(index);
  if(indexof == -1) {
    list_select_cc1.push(index);
    this.SetItem(item, item, '', 'Img/selectItem.png'); 
  }
  else {
    list_select_cc1.splice(indexof, 1);
    this.SetItem(item, item, '', 'Img/unselect.png'); 
  }
  ok_cc1.SetTextColor((list_select_cc1.length) ? '#009000' : '#80'+TC2[BG].slice(1));
}


//удаляет пункт в случае подтверждения
function delCc1(result) {
    Dialog.Dismiss();
    app.DestroyLayout(layDlg);
  if(this.ID != 'Yes') return;
  delete defaultPrices[params_cc1[index_cc1]];
  app.SaveText('defaultPrices', JSON.stringify(defaultPrices));
  var item = items_cc1[index_cc1];
  items_cc1.splice(index_cc1, 1);
  params_cc1.splice(index_cc1, 1);
  var text = params_cc1.join('\n');
  lst_cc1.RemoveItem(item);
  var l =[];
  for(var ii in list_select_cc1) {
      var ind = list_select_cc1[ii];
      if(ind > index_cc1) l.push(ind - 1);
      else if(ind != index_cc1) l.push(ind);
      }
  list_select_cc1 = l;
  ok_cc1.SetTextColor((list_select_cc1.length) ? '#009000' : '#80'+TC2[BG].slice(1));
  app.SaveText("cc1", text); 
  if (item.charAt(0) == '<') app.ShowPopup('Метка удалена.', 'Short');
  else  app.ShowPopup('Пункт удален.', 'Short');
}


//новый пункт, шаг 1
function cc1_add(p){
    Dialog = app.CreateDialog("", 'NoTitle');
    layDlg = app.CreateLayout("linear", "vertical,fillxy" );
    layDlg.SetBackGradient(COLORS[BG][0], COLORS[BG][1]);
    Dialog.AddLayout(layDlg);
    if (!p)
        var titl = app.CreateText('<img src="Img/add.png"> <big><b>Новый пункт:</b></big>', 
            0.9, -1, 'multiline,html,left');
        else
        var titl = app.CreateText('<img src="Img/add.png"> <big><b>Новая группировочная метка:</b></big>', 
            0.9, -1, 'multiline,html,left');
        titl.SetTextColor('#3098ba');
        titl.SetMargins(0, 0.02, 0, 0.02);
        layDlg.AddChild(titl);
        var line = app.CreateText('', 0.95, 2/app.GetScreenHeight());
        line.SetBackColor('#3088aa');
        layDlg.AddChild(line);
    edt_cc1 = app.CreateTextEdit('', 0.8, -1);
    edt_cc1.SetCursorColor('#ff8800');;
    edt_cc1.SetHint('Введите название');
    edt_cc1.SetOnChange(correction);
    edt_cc1.SetTextColor(TC[BG]);
    var line = app.CreateText('', 1, 2/HEIGHT);
    line.SetMargins(0, 0.02, 0, 0);
    line.SetBackColor('#aaaaaa');
    var btn = app.CreateButton("OK", 0.475, -1, 'html');
    btn.SetBackColor('#00000000');
    btn.SetOnTouch(cc1_add2);
    btn.ID = p;
    btn.SetTextColor(TC[BG]);
    layDlg.AddChild(edt_cc1);
    layDlg.AddChild(line);
    var o = app.CreateLayout("linear", 'horizontal');
    layDlg.AddChild(o);
    var b = app.CreateButton("Отмена", 0.475, -1, 'html');
    b.SetBackColor('#00000000')
    b.SetOnTouch(dlgCancel2);
    b.SetTextColor(TC[BG]);
    o.AddChild(b);
    var l = app.CreateText('', 1.5/WIDTH, -1, 'filly');
    l.SetBackColor('#aaaaaa');
    o.AddChild(l);
    o.AddChild(btn);
    Dialog.Show(); 
    Dialog.SetOnCancel(dlgCancel);
}


//новый пункт, шаг 2
function cc1_add2() {
  this.SetBackColor('#33aacc');
  app.Wait(0.1);
  this.SetBackColor('#0033aacc');
  newname = edt_cc1.GetText();
  newname = newname.replace(/,/g, '‚')
      .replace(/:/g, ' -')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/\"/g, '″')
      .replace(/\</g, '❮')
      .replace(/\>/g, '❯')
      .replace(/\\/g, '/') ;
  newname = newname.replace(/(^\s*)|(\s*)$/g, '');
  if(!newname) return app.ShowPopup('Введите название.', 'Short');
  Dialog.Dismiss();
  app.DestroyLayout(layDlg);
  var itm = (this.ID ? 'Метка ' : 'Пункт ');
  if (this.ID) newname = '<u><i>' + newname + '</i></u>';
  if(items_cc1.indexOf(newname) != -1) {
    Alert(itm + newname + ' уже существует.', '<img src="Img/alert.png"> Oops!');
    return;
    }
  if (!this.ID)
  {
      var list = ['Площадь (м²)', 'Длина (м.п.)', 'Количество (ед.)', 'Объем (м³)','Масса (кг)', 'Без ед. измерения'];
      SelectionList(cc1_add3, list, '<img src="Img/grey.png"> Единица измерения:');
   }
   else
   {
       cc1_add3();
   }
}

//новый, шаг 3
function cc1_add3(item)
{
    try {
        this.SetBackColor('#33aacc');
        Dialog.Dismiss();
        app.DestroyLayout(layDlg);
    } catch(e){};
    Dialog = app.CreateDialog("", 'NoTitle');
    layDlg = app.CreateLayout("linear", "vertical,fillxy,left" );
    layDlg.SetBackGradient(COLORS[BG][0], COLORS[BG][1]);
    layDlg.SetPadding(0.02, 0, 0.02, 0.02);
    Dialog.AddLayout(layDlg);
    var titl = app.CreateText('<img src="Img/move.png"> <big><b>Поместить на позицию:</b></big>', 
            0.9, -1, 'multiline,html,left');
        titl.SetTextColor('#3098ba');
        titl.SetMargins(0, 0.02, 0, 0.02);
        layDlg.AddChild(titl);
        var line = app.CreateText('', 0.95, 2/app.GetScreenHeight());
        line.SetBackColor('#3088aa');
        layDlg.AddChild(line);
    var list = [];
    for(var z in items_cc1) {
           var q = items_cc1[z];
           if (q.charAt(0) != '<')
               list.push(q + ':Img/grey.png');
           else list.push(q + ':Img/group.png');
      }
    list.push('В самый низ:Img/grey.png')
    lstDlg = app.CreateList(list, 0.9, -1, 'html');
    lstDlg.SetTextColor(TC[BG]);
    lstDlg.SetOnTouch(cc1_add4);
    lstDlg.SetOnLongTouch(cc1_add4);
    lstDlg.ID = item;
    layDlg.AddChild(lstDlg);
    Dialog.Show(); 
    Dialog.SetOnCancel(dlgCancel);
}


//новый пункт, шаг 4
function cc1_add4(i, _, __ ,ind) {
  Dialog.Dismiss();
  var item = this.ID;
  if (!item) var e = '$';
  else if(item == "Площадь (м²)")  var e = "S";
  else if(item == "Длина (м.п.)") var e = "L";
  else if(item == "Объем (м³)") var e = "V";
  else if(item == "Масса (кг)") var e = "M";
  else if (item == 'Количество (ед.)') var e = "1";
  else var e = '0';
  items_cc1.splice(ind, 0, newname);
  params_cc1.splice(ind, 0, newname + e);
  app.SaveText("cc1", params_cc1.join('\n'));
  var lst = [];
  for (var i=0; i<list_select_cc1.length; i++)
  {
      var x = list_select_cc1[i];
      lst.push(x>=ind ? x+1 : x);
  }
  list_select_cc1 = lst;
  app.DestroyLayout(layDlg);
  ComplexCalculation1(newname);
  app.ShowPopup((!item ? 'Создана новая метка' : 'Создан новый пункт'), 'Short');
}


//результат диалога 'изменить-переместить-удалить'
function lst_cc1_editOnTouch(i) {
  var item = items_cc1[index_cc1];
  if(i == 'Удалить') {
    if (item.charAt(0) == '<') 
        var yn = YesNoDialog(delCc1, 'Удалить метку ' + item + '?', '<img src="Img/help.png"> Подтвердите:');
    else
        var yn = YesNoDialog(delCc1, 'Удалить пункт ' + item + '?', '<img src="Img/help.png"> Подтвердите:');
    }
  else if(i == 'Переместить') {
    Dialog = app.CreateDialog("", 'NoTitle');
    layDlg = app.CreateLayout("linear", "vertical,fillxy,left" );
    layDlg.SetBackGradient(COLORS[BG][0], COLORS[BG][1]);
    Dialog.AddLayout(layDlg);
    var titl = app.CreateText('<img src="Img/move.png"> <big><b>Поместить на позицию:</b></big>', 
            0.9, -1, 'multiline,html,left');
        titl.SetTextColor('#3098ba');
        titl.SetMargins(0, 0.02, 0, 0.02);
        layDlg.AddChild(titl);
        var line = app.CreateText('', 0.95, 2/app.GetScreenHeight());
        line.SetBackColor('#3088aa');
        layDlg.AddChild(line);
    var list = '';
    for(var z in items_cc1) {
      if(z == index_cc1) var icon = 'Img/right.png';
      else
      {
           var q = items_cc1[z];
           if (q.charAt(0) != '<')
               var icon = 'Img/transp.png';
           else var icon = 'Img/group.png';
      }
      list += items_cc1[z] + ':' + icon + ',';
      }
    lstDlg = app.CreateList(list, 0.9, -1, 'html');
    lstDlg.SetTextColor(TC[BG]);
    lstDlg.SetOnTouch(cc1_Move);
    lstDlg.SetOnLongTouch(cc1_Move);
    layDlg.AddChild(lstDlg);
    Dialog.Show(); 
    Dialog.SetOnCancel(dlgCancel);
    }
  else if(i == 'Изменить') {
    Dialog = app.CreateDialog("",'NoTitle');
    layDlg = app.CreateLayout("linear", "vertical,fillxy" );
    layDlg.SetBackGradient(COLORS[BG][0], COLORS[BG][1]);
    Dialog.AddLayout(layDlg);
    var titl = app.CreateText('<img src="Img/edit1.png"> <big><b>Изменить:</b></big>', 
            0.9, -1, 'multiline,html,left');
    titl.SetTextColor('#3098ba');
    titl.SetMargins(0, 0.02, 0, 0.02);
    layDlg.AddChild(titl);
    var line = app.CreateText('', 0.95, 2/app.GetScreenHeight());
    line.SetBackColor('#3088aa');
    layDlg.AddChild(line);
    var item_ = item.replace(/<[^>]+>/g, '');
    var isgroup = (item.charAt(0) == '<')
    edt_cc1 = app.CreateTextEdit(item_, 0.9, -1);
    edt_cc1.SetCursorColor('#ff8800');;
    edt_cc1.SetTextColor(TC[BG]);
    edt_cc1.SetOnChange(correction);
    edt_cc1.SetCursorPos(item_.length);
    var prc = defaultPrices[params_cc1[index_cc1]];
    var line = app.CreateText('', 1, 2/HEIGHT);
    line.SetMargins(0, 0.01, 0, 0);
    line.SetBackColor('#aaaaaa');
    var btn = app.CreateButton("OK", 0.475, -1, 'html');
    btn.SetBackColor('#00000000');
    btn.ID = isgroup;
    btn.SetVisibility('hide');
    edt_cc1.b = btn;
    edt_cc1.l = line;
    edt_cc1.g = isgroup;
    btn.SetOnTouch(cc1_edit);
    btn.SetTextColor(TC[BG]);
    layDlg.AddChild(edt_cc1);
    var prc = defaultPrices[params_cc1[index_cc1]];
    if (prc) {
      var chk = app.CreateCheckBox('Сохранить расценку по-умолчанию ' 
          + prc + ' ' + Currency 
          + {'S': '/м²', 'L': '/м.п.', '1': '/ед.', 'V': '/м³', 'M': '/кг', '0': ''}[params_cc1[index_cc1]
          .slice(-1)], 0.95, BTNHEIGHT);
      chk.SetTextColor(TC[BG]);
      chk.SetChecked(true);
      layDlg.AddChild(chk);
      btn.prc = chk;
    }
    layDlg.AddChild(line);
    var o = app.CreateLayout("linear", 'horizontal');
    layDlg.AddChild(o);
    var b = app.CreateButton("Отмена", 0.475, -1, 'html');
    b.SetBackColor('#00000000')
    b.SetOnTouch(dlgCancel2);
    b.SetTextColor(TC[BG]);
    o.AddChild(b);
    var l = app.CreateText('', 1.5/WIDTH, -1, 'filly');
    l.SetBackColor('#aaaaaa');
    o.AddChild(l);
    o.AddChild(btn);
    Dialog.Show(); 
    Dialog.SetOnCancel(dlgCancel);
  }
  else if (i == 'Информация о пункте')
  {
      var item = params_cc1[index_cc1];
      var dct = {'S': '/м²', 'L': '/м.п.', '1': '/ед.', 'V': '/м³', 'M': '/кг', '0': ''};
      var i = defaultPrices[item];
      if (i) var x = i + ' ' + Currency + dct[item.slice(-1)];
      else var x = 'не задана'
      var dct2 = {'S': 'м² (площадь).', 'L': 'м.п. (длина)', '1': 'ед. (количество)', 'V': 'м³ (объем)', 'M': 'кг (масса)', '0': 'нет'};
      var g = isGroup(item);
      var tg = 'Метка: ' + (g ? g : 'нет') + '\n';
      var text = tg + 'Пункт: ' + item.slice(0, -1) + '\nЕдиница измерения: ' + dct2[item.slice(-1)]
           + '\nРасценка по-умолчанию: ' + x;
      Alert(text, '<img src="Img/about.png"> Инфо о пункте', 'OK', 1)
  }
}


//изменить пункт
function cc1_edit(p) {
  this.SetBackColor('#33aacc');
  app.Wait(0.1);
  Dialog.Dismiss();
  var item = items_cc1[index_cc1];
  var newtext = edt_cc1.GetText();
  app.DestroyLayout(layDlg);
  newtext = newtext.replace(/,/g, '‚')
      .replace(/:/g, ' -')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/\"/g, '″')
      .replace(/\</g, '❮')
      .replace(/\>/g, '❯')
      .replace(/\\/g, '/') ;
  newtext = newtext.replace(/(^\s*)|(\s*)$/g, '');
  if (this.ID) newtext = '<u><i>' + newtext + '</i></u>';
  if(newtext == item || newtext == '' || newtext == '<u><i></i></u>') return app.ShowPopup('Без изменений', 'Short');
  if(items_cc1.indexOf(newtext) != -1) {
    Alert((this.ID ? 'Метка ' : 'Пункт ') + newtext + ' уже существует.', '<img src="Img/alert.png"> Oops!');
    return;
  }
  if (!this.ID)
  {
      var prc;
      if (this.prc && this.prc.GetChecked()) {
          var prc = defaultPrices[params_cc1[index_cc1]];
      }
      delete defaultPrices[params_cc1[index_cc1]];
      if (prc) defaultPrices[newtext + params_cc1[index_cc1].slice(-1)] = prc;
      app.SaveText('defaultPrices', JSON.stringify(defaultPrices));
      if(list_select_cc1.indexOf(index_cc1) != -1) var ic = 'selectItem';
      else var ic = 'unselect';
  }
  else var ic = 'group'
  var ic = 'Img/' + ic + '.png';
  var i = params_cc1[index_cc1].slice(-1);
  items_cc1.splice(index_cc1, 1, newtext);
  params_cc1.splice(index_cc1, 1, newtext + i);
  lst_cc1.SetItem(item, newtext, '', ic);
  var text = params_cc1.join('\n');
  app.SaveText('cc1', text);
  app.ShowPopup(this.ID ? 'Метка изменена.' : 'Пункт изменен.', 'Short');
}


//переместить пункт
function cc1_Move(item) {
  Dialog.Dismiss();
  app.DestroyLayout(layDlg);
  var ind = items_cc1.indexOf(item);
  if(ind == index_cc1) return app.ShowPopup('Без изменений', 'Short');
  var tmp = [];
  for(var i in list_select_cc1) tmp[i] = (items_cc1[list_select_cc1[i]]);
  var item_old = items_cc1[index_cc1];
  items_cc1.splice(index_cc1, 1);
  items_cc1.splice(ind, 0, item_old);
  var item2_old = params_cc1[index_cc1];
  params_cc1.splice(index_cc1, 1);
  params_cc1.splice(ind, 0, item2_old);
  var text = params_cc1.join('\n');
  list_select_cc1 = [];
  for(var x in tmp) list_select_cc1.push(items_cc1.indexOf(tmp[x]));
  app.SaveText("cc1", text); 
  app.ShowPopup('Выполнено.', 'Short');
  return ComplexCalculation1(item_old);
 }


//долгий тап- диалог что делать с пунктом
function cc1_OnLongTouch(item){
    index_cc1 = items_cc1.indexOf(item);
    var list = "Изменить";
    if(items_cc1.length > 1) list += ",Переместить,Удалить";
    if (item.charAt(0) != '<') list += ',Информация о пункте'
    CreateListDialog(lst_cc1_editOnTouch, '<img src="Img/grey.png">' + ((item.charAt(0) == '<') ? 'Метку ' : 'Пункт ') + item + ":", list);
}   


//пункты выбраны, идем дальше
function Done_cc1(ev) {
   if(!list_select_cc1.length) 
       return app.ShowPopup('Сначала выберите пункты работ.', 'Short');
   complexCalculation2(); 
}





//###############################################
__res = function(v, m, v2)
  {
      if (m == 'S') return sum(v.map(mul)) + ' м²';
      else if (m == 'L') return sum(v.map(mul)) + ' м.п.';
      else if (m == '1') return v + ' ед.';
      else if (m == 'M') return v + ' кг';
      else if (m == 'V') 
      {
          var p = sum(v.map(mul));
          return p + ' м²; ' + Round(p * v2) + ' м³';
      }
      else return false;
  }
;


function complexCalculation2(arg, title, scrollY){
  titleCalculation = title;
  if (!title) 
  {
      title = 'Ввод параметров'; 
      EditCalc = 0;
  }
  else EditCalc = 1;
  Exit = 2; 
  lay_cc2 = app.CreateLayout("Linear", "Top,FillXY");
  lay_cc2.SetBackground('Img/bg'+BG+'.png', 'repeat');
  var title_ = app.CreateTitle(title);
  lay_cc2.AddChild(title_);
  if(!arg) {
    params_cc2 = [];
    var events = [];
    for(var i in list_select_cc1) {
      var ii = params_cc1[list_select_cc1[i]];
      var mode = ii.slice(-1);
      var d = {
        "V": {"plus": [[0, 0, 1]], "minus": [[0, 0, 1]], 'depth': 0, "price": 0, "color+": "#dddddc", "color-": "#dddddc" }, 
        "S": {"plus": [[0, 0, 1]], "minus": [[0, 0, 1]], "price": 0, "color+": "#dddddc", "color-": "#dddddc" }, 
        "L": {"plus": [[0, 1]], "minus": [[0, 1]], "price": 0, "color+": "#dddddc", "color-": "#dddddc" },
        "M": {"plus": 0, "price": 0, "color+": "#dddddc"},
        "1": {"plus": 0, "price": 0, "color+": "#dddddc"},
        "0": {"plus": 1, "price": 0, "color+": "#dddddc"},
        }
      var obj = {};
      obj[ii] = d[mode];
      params_cc2.push(obj);
      }
    }
  arguments.callee.scroll = app.CreateScroller(1, 1-BTNHEIGHT-GET_TOP-0.005); 
  arguments.callee.scroll.SetMargins(0, 0, 0, 0.005);
  lay_cc2.AddChild(arguments.callee.scroll);
  var layScroll = app.CreateLayout("Linear", "Top"); 
  arguments.callee.scroll.AddChild( layScroll );
  var flg = false;
  var objs = []; 
  for(var i in params_cc2) {
        var par = params_cc2[i];
        for(var n in par) var name = n;
        par = par[name];
        var name_ = name.slice(0, -1);
        var md = name.slice(-1);
        var D = (md == "S" || md == "L" || md == "V");
        var body = __res(par['plus'], md, par['depth']);
        if (arg && D) {
            if (par['depth']) inputValues.push(par['depth']);
            for (var x=0; x<par['plus'].length; x++) {
                for (var f=0; f<par['plus'][x].length-1; f++) {
                    var xx = par['plus'][x][f];
                    if (xx) inputValues.push(xx);
                }
            }
            for (var x=0; x<par['minus'].length; x++) {
                for (var f=0; f<par['minus'][x].length-1; f++) {
                    var xx = par['minus'][x][f];
                    if (xx) inputValues.push(xx);
                }
            }
        }
        if (body)
            var b1 = app.CreateList(name_+ ':' + body + (par["color+"]=='#dddddc'?':Img/transp.png':':Img/edit.png') , 1, -1);
        else
            var b1 = app.CreateList(name_+ ':Нет ед. измерения:Img/transp.png', 1, -1);
        b1.SetTextColor(TC[BG]);
        b1.SetTextColor2(TC[BG]);
        b1.SetTextSize(TextSize);
        b1.SetBackColor(!BG?'#33eeeeee':'#22555522');
        b1.SetFontFile('fonts/DroidSerif-Regular.ttf');
        b1.SetOnTouch(cc2_OnTouch);
        b1.ID = name + 'i+' + i;
        b1.ID2 = name + ','+i;
        b1.SetOnLongTouch(cc2_OnLongTouch);
        var q = app.CreateLayout('Absolute');
        q.SetMargins(0, 0.01, 0, 0);
        q.AddChild(b1);
        objs.push(b1);
        if (D) {
          var fab = app.CreateButton("[fa-chevron-circle-down]", -1, -1, "fontawesome");
          fab.SetPosition(1-BTNWIDTH, 0);
          fab.SetOnTouch(fabOnTouch);
          fab.SetBackColor('#00000000');
          fab.SetTextColor(['#55999933', '#55666630'][BG]);
          fab.SetTextSize(TextButtonsSize*1.2);
          q.AddChild(fab);
        }
        layScroll.AddChild(q);
        if (D) {
          var line = app.CreateText('', 1, 2/HEIGHT);
          line.SetBackColor(COLORS[BG][1]);
          layScroll.AddChild(line);
          body = __res(par['minus'], md, par['depth']);
          var b2 = app.CreateList(name_ + ' (в минус)' +  ':' + body + (par["color-"]=='#dddddc' ? ':Img/transp.png' : ':Img/edit.png'), 1, -1);
          b1.minus = b2;
          b2.SetTextSize(TextSize);
          b2.SetTextColor(TC[BG]);
          b2.SetTextColor2(TC[BG]);
          b2.SetFontFile('fonts/DroidSerif-Italic.ttf');
          b2.SetBackColor(!BG?'#33eeeefe':'#22555522');
          b2.ID = name + 'i-' + i;
          b2.ID2 = name + ','+i;
          b2.SetOnLongTouch(cc2_OnLongTouch);
          b2.SetOnTouch(cc2_OnTouch);
          fab.list = b2;
          b2.fab = fab;
          if (body.slice(0, 2) == '0 ') {
              b2.SetVisibility('Gone');
          }
          else fab.SetVisibility('Gone');
          layScroll.AddChild(b2);
        }
  }
  var ltit = app.CreateLayout("Linear", "Horizontal,FillX,right");
  var add = app.CreateButton('[fa-ellipsis-v]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  add.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  add.SetTextColor(TC2[BG]);
  add.ID = 'add';
  add.SetTextSize(TextButtonsSize, 'px');
  add.SetOnTouch(cc2_OnTouch);
  ltit.AddChild(add);
  var calc = app.CreateButton('[fa-calculator]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  calc.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  calc.SetTextColor(TC2[BG]);
  calc.ID = 'calc';
  calc.SetTextSize(TextButtonsSize, 'px');
  calc.SetOnTouch(cc2_OnTouch);
  ltit.AddChild(calc);
  var help = app.CreateButton('[fa-info-circle]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  help.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  help.SetTextColor(TC2[BG]);
  help.ID = 'help';
  help.SetTextSize(TextButtonsSize, 'px');
  help.SetOnTouch(cc2_OnTouch);
  ltit.AddChild(help);
  var ok = app.CreateButton('[fa-share]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  ok.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  ok.SetTextColor('#009000');
  ok.SetTextSize(TextButtonsSize, 'px')
  ok.SetOnTouch(complexPriceForm);
  ltit.AddChild(ok);
  lay_cc2.AddChild(ltit);

  app.AddLayout(lay_cc2) ;
  delLayouts(lay_cc2);
  if (arg) sortValues(inputValues.pop());
  if (scrollY!==undefined) {
      complexCalculation2.scroll.ScrollTo(0, scrollY);
  }
  arguments.callee.objs = [];
  for (var i in objs) arguments.callee.objs.push(+objs[i].GetHeight() + 0.01);
}


function fabOnTouch() {
    var v = this.list.GetVisibility();
    switch (v) {
        case 'Gone':
            this.list.SetVisibility('Show'); 
            this.SetText('[fa-arrow-circle-up]');
            break;
        case 'Show':
            this.list.SetVisibility('Gone'); 
            this.SetText('[fa-chevron-circle-down]');
            break;
    }
}



function cc2_OnLongTouch()
{
    var i = this.ID2.lastIndexOf(',');
    item_cc2 = this.ID2.slice(0, i);
    index_cc2 = +this.ID2.slice(i+1);
    var list = "Изменить";
    if(params_cc2.length > 1) list += ",Переместить,Удалить";
    CreateListDialog(lst_cc2_editOnTouch, '<img src="Img/grey.png"> Пункт '  + item_cc2.slice(0, -1) + ":", list);
}


function cc2_OnTouch(ev) {
  var id = this.ID || 'add';
  objform = this;
  var ii = id.lastIndexOf('i');
  if(ii != -1) {
    item_cc2 = id.slice(0, ii);
    if (item_cc2.slice(-1) == '0')
        return app.ShowPopup("Пункт имеет только расценку.", 'Short')
    index_cc2 = +(id.slice(ii + 2));
    mode_cc2 = id.slice(ii+1, ii+2);
    return complexCalculationForm();
    }
  else if (id=='help') {
      About(2);
  }
  else if (id=='calc') {
      Exit = 'calc_cc2';
      showCalculator();
  }
  else if(id == 'add' ) {
    
    var list = ['Готово‚ далее', 'Добавить свой новый пункт', 'Добавить пункт из стартового списка', 'Справка', 'Прекратить расчет и выйти']
    CreateListDialog(onTouchMenu_cc2, '<img src="Img/grey.png"> Опции:', list);
    }
}


function onTouchMenu_cc2(item) {
  if (item == 'Добавить свой новый пункт') {
      SelectionList(cc2_add, ['Площадь (м²)', 'Длина (м.п.)', 'Количество (ед.)', 'Объем (м³)', 'Масса (кг)', 'Без ед. измерения'], '<img src="Img/grey.png"> Новый пункт:', 1);
  }
  else if (item == 'Добавить пункт из стартового списка') return add_cc2_2();
  else if (item == 'Справка') About(2);
  else if (item == 'Готово‚ далее') complexPriceForm();
  else if (item == 'Прекратить расчет и выйти') {
    YesNoDialog(query_exit, 'Прекратить расчет и закрыть программу?', '<img src="Img/exit.png"> Подтвердите:');
    }
}


function query_exit(r) {
    Dialog.Dismiss();
    app.DestroyLayout(layDlg);
    if (this.ID == 'Yes')   _Exit();

}


//доб. нов. пункт из стартового списка
function add_cc2_2() {
    var items_cc2_ = [];
    for(var i in params_cc2) {
        for(var ii in params_cc2[i]) items_cc2_.push(ii.slice(0, -1)); 
    }
    params_cc1 = app.LoadText('cc1', 'none').split('\n');
    var list = [];
    for(var z in params_cc1) {
      var a = params_cc1[z].slice(0, -1);
      var _ = a.charAt(0) == '<' ? ':Img/group.png' : ':Img/transp.png';
      list.push(a + (items_cc2_.indexOf(a) != -1 ? ':Img/right.png' : _));
      }

    Dialog = app.CreateDialog("", 'NoTitle');
    layDlg = app.CreateLayout("linear", "vertical,fillxy,left" );
    layDlg.SetBackGradient(COLORS[BG][0], COLORS[BG][1]);
    layDlg.SetPadding(0.02, 0, 0.02, 0.02);
    Dialog.AddLayout(layDlg);
    var titl = app.CreateText('<img src="Img/grey.png"> <big><b>Выбрать пункт:</b></big>', 
            0.9, -1, 'multiline,html,left');
        titl.SetTextColor('#3098ba');
        titl.SetMargins(0, 0.02, 0, 0.02);
        layDlg.AddChild(titl);
        var line = app.CreateText('', 0.95, 2/app.GetScreenHeight());
        line.SetBackColor('#3088aa');
        layDlg.AddChild(line);
    lstDlg = app.CreateList(list, 0.9, -1, "html");
    lstDlg.SetTextColor(TC[BG]);
    lstDlg.SetOnTouch(add_cc2_3);
    lstDlg.SetOnLongTouch(add_cc2_3);
    layDlg.AddChild(lstDlg);
    Dialog.Show(); 
    Dialog.SetOnCancel(dlgCancel);
}

// доб. нов. пункт из стартового списка, после add_cc2_2
function add_cc2_3(item) {
    Dialog.Dismiss();
    app.DestroyLayout(layDlg);
  if (item.charAt(0) == '<' ) return Alert('Пункт '+item+' является именем группировочной метки.', '<img src="Img/alert.png"> Oops!');
  var items_cc2_ = []; 
  for(var i in params_cc2) {
    for(var ii in params_cc2[i]) items_cc2_.push(ii.slice(0, -1)); 
    }
  if(items_cc2_.indexOf(item) != -1) {
    Alert('Пункт '+item+' уже существует', '<img src="Img/alert.png"> Oops!'); return;
    }
  params_cc1 = app.LoadText('cc1', 'none').split('\n');
  var im = [];
  for(var i in params_cc1) im.push(params_cc1[i].slice(0, -1));
  var ind = im.indexOf(item);  
  var itemfull = params_cc1[ind];
  var d = {
        "V": {"plus": [[0, 0, 1]], "minus": [[0, 0, 1]], 'depth': 0, "price": 0, "color+": "#dddddc", "color-": "#dddddc" }, 
        "S": {"plus": [[0, 0, 1]], "minus": [[0, 0, 1]], "price": 0, "color+": "#dddddc", "color-": "#dddddc" }, 
        "L": {"plus": [[0, 1]], "minus": [[0, 1]], "price": 0, "color+": "#dddddc", "color-": "#dddddc" },
        "M": {"plus": 0, "price": 0, "color+": "#dddddc"},
        "1": {"plus": 0, "price": 0, "color+": "#dddddc"},
        "0": {"plus": 1, "price": 0, "color+": "#dddddc"},
        }
  var obj = {};
  obj[itemfull] = d[itemfull.slice(-1)];
  params_cc2.push(obj);
  if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
  complexCalculation2(true, titleCalculation, 100);
  app.ShowPopup('Пункт из списка добавлен', 'Short');
}



function lst_cc2_editOnTouch(i) {
  var item = item_cc2.slice(0, -1);
  if(i == 'Удалить') {
    var yn = YesNoDialog(del_cc2, 'Удалить пункт ' + item + '?', '<img src="Img/help.png"> Подтвердите:');
    }
  else if(i == 'Переместить') {
    Dialog = app.CreateDialog("", 'NoTitle');
    layDlg = app.CreateLayout("linear", "vertical,fillxy,left" );
    layDlg.SetBackGradient(COLORS[BG][0], COLORS[BG][1]);
    layDlg.SetPadding(0.02, 0, 0.02, 0.02);
    Dialog.AddLayout(layDlg);
    var titl = app.CreateText('<img src="Img/move.png"> <big><b>Поместить на позицию:</b></big>', 
            0.9, -1, 'multiline,html,left');
        titl.SetTextColor('#3098ba');
        titl.SetMargins(0, 0.02, 0, 0.02);
        layDlg.AddChild(titl);
        var line = app.CreateText('', 0.95, 2/app.GetScreenHeight());
        line.SetBackColor('#3088aa');
        layDlg.AddChild(line);
    var list = '';
    for(var z in params_cc2) {
      if(z == index_cc2) var icon = 'Img/right.png';
      else var icon = 'Img/transp.png';
      for(var k in params_cc2[z]) var itm = k.slice(0, -1);
      list += itm + ':' + icon + ',';
      }
    lstDlg = app.CreateList(list, 0.9, -1);
    lstDlg.SetTextColor(TC[BG]);
    lstDlg.SetOnTouch(cc2_Move);
    lstDlg.SetOnLongTouch(cc2_Move);
    layDlg.AddChild(lstDlg);
    Dialog.Show(); 
    Dialog.SetOnCancel(dlgCancel);
    }
  else if(i == 'Изменить') {
    Dialog = app.CreateDialog("", 'NoTitle');
    layDlg = app.CreateLayout("linear", "vertical,fillxy" );
    layDlg.SetBackGradient(COLORS[BG][0], COLORS[BG][1]);
    Dialog.AddLayout(layDlg);
    var titl = app.CreateText('<img src="Img/edit1.png"> <big><b>Изменить:</b></big>', 
            0.9, -1, 'multiline,html,left');
        titl.SetTextColor('#3098ba');
        titl.SetMargins(0, 0.02, 0, 0.02);
        layDlg.AddChild(titl);
        var line = app.CreateText('', 0.95, 2/app.GetScreenHeight());
        line.SetBackColor('#3088aa');
        layDlg.AddChild(line);
    edt_cc2 = app.CreateTextEdit(item, 0.9, -1);
    edt_cc2.SetCursorColor('#ff8800');;
    edt_cc2.SetOnChange(correction);
    edt_cc2.SetTextColor(TC[BG]);
    edt_cc2.SetCursorPos(item.length);
    var line = app.CreateText('', 1, 2/HEIGHT);
    line.SetMargins(0, 0.02, 0, 0);
    line.SetBackColor('#aaaaaa');
    var btn = app.CreateButton("OK", 0.475, -1, 'html');
    btn.SetBackColor('#00000000')
    btn.SetOnTouch(cc2_edit);
    btn.SetTextColor(TC[BG]);
    layDlg.AddChild(edt_cc2);
    btn.SetVisibility('hide');
   // line.SetVisibility('hide');
    edt_cc2.b = btn;
    edt_cc2.l = line;
    edt_cc2.t = true;
    layDlg.AddChild(line);
    var o = app.CreateLayout("linear", 'horizontal');
    layDlg.AddChild(o);
    var b = app.CreateButton("Отмена", 0.475, -1, 'html');
    b.SetBackColor('#00000000')
    b.SetOnTouch(dlgCancel2);
    b.SetTextColor(TC[BG]);
    o.AddChild(b);
    var l = app.CreateText('', 1.5/WIDTH, -1, 'filly');
    l.SetBackColor('#aaaaaa');
    o.AddChild(l);
    o.AddChild(btn);
    Dialog.Show(); 
    Dialog.SetOnCancel(dlgCancel);
    }
}


//удалить пункт
function del_cc2(r) {
    Dialog.Dismiss();
    app.DestroyLayout(layDlg);
  if(this.ID != 'Yes') return;
  params_cc2.splice(index_cc2, 1);
  if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
  complexCalculation2(true, titleCalculation, complexCalculation2.scroll.GetScrollY());
  app.ShowPopup('Пункт удален', 'Short');
}


//переместить пункт
function cc2_Move(item) {
  Dialog.Dismiss();
  app.DestroyLayout(layDlg);
  var items_cc2_ = [];
  for(var i in params_cc2) {
    for(var ii in params_cc2[i]) items_cc2_.push(ii.slice(0, -1)); 
    }
  var ind = items_cc2_.indexOf(item);
  if(ind == index_cc2) return  app.ShowPopup('Без изменений', 'Short');
  var item_old = params_cc2[index_cc2];
  params_cc2.splice(index_cc2, 1);
  params_cc2.splice(ind, 0, item_old);
  if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
  app.ShowPopup('Выполнено.', 'Short');
  var old = complexCalculation2.objs[index_cc2];
  complexCalculation2.objs.splice(index_cc2, 1);
  complexCalculation2.objs.splice(ind, 0, old);
  var s = sum(complexCalculation2.objs.slice(0, ind));
  return complexCalculation2(true, titleCalculation, s);
 }


//изменить пункт
function cc2_edit() {
  this.SetBackColor('#33aacc');
  app.Wait(0.1);
  Dialog.Dismiss();
  var newtext = edt_cc2.GetText();
  app.DestroyLayout(layDlg);
  newtext = newtext.replace(/,/g, '‚')
      .replace(/:/g, ' -')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')
      //.replace(/\]/g, ')')
      .replace(/\"/g, '″')
      //.replace(/\[/g, '(')
      .replace(/\</g, '❮')
      .replace(/\>/g, '❯')
      .replace(/\\/g, '/') ;
  newtext = newtext.replace(/(^\s*)|(\s*)$/g, '');
  if(newtext == item_cc2.slice(0, -1) || !newtext) return  app.ShowPopup('Без изменений', 'Short');
  var items_cc2_ = [];
  for(var i in params_cc2) {
    for(var ii in params_cc2[i]) items_cc2_.push(ii.slice(0, -1)); 
    }
  if(items_cc2_.indexOf(newtext) != -1) {
    Alert('Пункт '+newtext+' уже существует','<img src="Img/alert.png"> Oops!'); return;
    };
  var newname = params_cc2[index_cc2][item_cc2];
  var o = {};
  o[newtext+item_cc2.slice(-1)] = newname;
  params_cc2.splice(index_cc2, 1, o);
  if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
  complexCalculation2(true, titleCalculation, complexCalculation2.scroll.GetScrollY());
  app.ShowPopup('Пункт изменен.', 'Short');
}


// свой новый пункт, читаем из ввода и добавляем
function cc2_add() {
  this.SetBackColor('#33aacc');
  app.Wait(0.05);
  this.SetBackColor('#00000000');
  newname = SelectionList.edt.GetText();
  newname = newname.replace(/,/g, '‚')
      .replace(/:/g, ' -')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/\"/g, '″')
      .replace(/\</g, '❮')
      .replace(/\>/g, '❯')
      .replace(/\\/g, '/') ;
  newname = newname.replace(/(^\s*)|(\s*)$/g, '');
  if(!newname) return app.ShowPopup('Введите название нового пункта.', 'Short');
  var slch = SelectionList.add.GetChecked();
  Dialog.Dismiss();
  app.DestroyLayout(layDlg);
  var items_cc2_ = [];
  for(var i in params_cc2) {
    for(var ii in params_cc2[i]) items_cc2_.push(ii.slice(0, -1)); 
    }
  if(items_cc2_.indexOf(newname) != -1) {
    Alert('Пункт '+newname+' уже существует.', '<img src="Img/alert.png"> Oops!'); return; };
  var mode = ["S", "L", "1", "V", "M", '0'][SelectionList.index];
  var d = {
        "V": {"plus": [[0, 0, 1]], "minus": [[0, 0, 1]], 'depth': 0, "price": 0, "color+": "#dddddc", "color-": "#dddddc" }, 
        "S": {"plus": [[0, 0, 1]], "minus": [[0, 0, 1]], "price": 0, "color+": "#dddddc", "color-": "#dddddc" }, 
        "L": {"plus": [[0, 1]], "minus": [[0, 1]], "price": 0, "color+": "#dddddc", "color-": "#dddddc" },
        "M": {"plus": 0, "price": 0, "color+": "#dddddc"},
        "1": {"plus": 0, "price": 0, "color+": "#dddddc"},
        "0": {"plus": 1, "price": 0, "color+": "#dddddc"},
        }
  var o = {};
  o[newname+mode] = d[mode];
  params_cc2.push(o);
  if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
  app.ShowPopup('Выполнено', 'Short');
  if(slch) {   
     params_cc1 = app.LoadText('cc1', 'none').split('\n');
     if (params_cc1.indexOf(newname+mode) != -1) 
       Alert('Пункт '+ newname +' не будет сохранен для будущих расчетов, т.к. уже существует в стартовом списке.', '<img src="Img/alert.png"> Oops');
     else
     {
         Dialog = app.CreateDialog("", 'NoTitle');
         layDlg = app.CreateLayout("linear", "vertical,fillxy,left" );
         layDlg.SetBackGradient(COLORS[BG][0], COLORS[BG][1]);
         Dialog.AddLayout(layDlg);
         var titl = app.CreateText('<img src="Img/move.png"> <big><b>Сохранение пункта для будущих расчетов.<br/>Поместить на позицию:</b></big>', 
            0.9, -1, 'multiline,html,left');
        titl.SetTextColor('#3098ba');
        titl.SetMargins(0, 0.02, 0, 0.02);
        layDlg.AddChild(titl);
        var line = app.CreateText('', 0.95, 2/HEIGHT);
        line.SetBackColor('#3088aa');
        layDlg.AddChild(line);
        var list = [];
        for(var z in items_cc1) {
           var q = items_cc1[z];
           if (q.charAt(0) != '<')
               list.push(q + ':Img/grey.png');
           else list.push(q + ':Img/group.png');
       }
       list.push('В самый низ:Img/grey.png')
       lstDlg = app.CreateList(list, 0.9, -1, 'html');
       lstDlg.SetTextColor(TC[BG]);
       lstDlg.SetOnTouch(cc2_addStart);
       lstDlg.SetOnLongTouch(cc2_addStart);
       lstDlg.ID = newname+mode;
       layDlg.AddChild(lstDlg);
       Dialog.Show(); 
       Dialog.SetOnCancel(dlgCancel);
     }
   }
   complexCalculation2(true, titleCalculation, 100);
}

function cc2_addStart(p1, p2, p3, p4)
{
    Dialog.Dismiss();
    params_cc1.splice(p4, 0, this.ID);
    app.SaveText('cc1', params_cc1.join('\n'));
    app.ShowPopup('Пункт сохранен для будущих расчетов', 'Short');
    app.DestroyLayout(layDlg);
}


function cc2_chk(r) {
  for(var i in list_cc2_chk_1) {
    var chk = list_cc2_chk_1[i];
    if(this !== chk) chk.SetChecked(false);
    }
  this.SetChecked(true)
}





//#########################################

var Ll = [];
function complexCalculationForm() {
  var params = params_cc2[index_cc2][item_cc2];
  var isDouble = (item_cc2.slice(-1) == "S" || item_cc2.slice(-1) == "V");
  var title = item_cc2.slice(0, -1);
  if (item_cc2.slice(-1) == "1" || item_cc2.slice(-1) == "M") {
      Exit = 'input2';
      return inputDigital(callbackForm, 'number', title, params['plus']);
  }
  Exit = 'form';
  if (mode_cc2 == '-') title = '[В минус] ' + title;
  var mode = item_cc2.slice(-1);
  lay_ccForm = app.CreateLayout("Linear", "FillXY");
  Ll.unshift(lay_ccForm);
  lay_ccForm.SetBackground('Img/bg'+BG+'.png', 'repeat');
  var title_ = app.CreateTitle(title);
  lay_ccForm.AddChild(title_);
    var ltit = app.CreateLayout("Linear", "Horizontal,right,FillX");
  lay_ccForm.AddChild(ltit);
  var menu = app.CreateButton('[fa-ellipsis-v]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  menu.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  menu.SetTextColor(TC2[BG]);
  menu.ID = 'menu';
  menu.SetTextSize(TextButtonsSize, 'px');
  menu.SetOnTouch(formOnTouchMenu);
  ltit.AddChild(menu);
  var help = app.CreateButton('[fa-info-circle]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  help.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  help.SetTextColor(TC2[BG]);
  help.SetTextSize(TextButtonsSize, 'px');
  help.SetOnTouch(formOnTouchHelp);
  ltit.AddChild(help);
  complexCalculationForm.add = app.CreateButton('[fa-plus]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  complexCalculationForm.add.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  complexCalculationForm.add.SetTextSize(TextButtonsSize, 'px')
  complexCalculationForm.add.ID = 'add';
  complexCalculationForm.add.SetOnTouch(formOnTouchAdd);
  isAdd();
  ltit.AddChild(complexCalculationForm.add);
  var ok = app.CreateButton('[fa-check]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  ok.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  ok.SetTextColor('#009000');
  ok.SetTextSize(TextButtonsSize, 'px')
  ok.ID = 'ok';
  ok.SetOnTouch(formOnTouchOk);
  ltit.AddChild(ok);
  var lay_ccForm2 = app.CreateLayout("Linear");
  lay_ccForm2.SetSize(1, 1-BTNHEIGHT-GET_TOP-0.005);
  lay_ccForm2.SetMargins(0, 0, 0, 0.005);
  lay_ccForm.AddChild(lay_ccForm2);
  if (item_cc2.slice(-1) == "V" && mode_cc2 != '-') {
      var ltit2 = app.CreateLayout("Linear", "Horizontal.vcenter,FillX");
      var ltit3 = app.CreateLayout("Linear", "left");
      ltit3.SetSize(0.67, -1);
      var t = app.CreateText('Толщина слоя, м:', -1, -1, 'multiline');
      t.SetTextSize(TextSize);
      t.SetTextColor(TC[BG]);
      t.SetMargins(0.01, 0.005, 0.01, 0.005);
      ltit3.AddChild(t);
      ltit2.AddChild(ltit3);
      var b = app.CreateTextEdit(+(params['depth'])||'', 0.3, -1, 'number, singleline, vcenter');
      b.SetCursorColor('#0088aa');
      b.SetHint('0');
      b.SetOnChange(OnChangeEdtNumber);
      b.ID = 'depth';
      b.SetOnTouch(formOnTouch);
      b.SetTextColor(TC2[BG]);
      b.SetMargins(0, 0.005, 0.01, 0.005);
      ltit2.AddChild(b);
      lay_ccForm2.AddChild(ltit2);
  }
  var scroll = app.CreateScroller(0.99, -1); 
  lay_ccForm2.AddChild(scroll);
  var layScroll = app.CreateLayout("Linear", "fillxy,top"); 
  scroll.AddChild( layScroll );
  var d = {'-': "minus", '+': "plus"}
  params_form = params[d[mode_cc2]];
  form_obj2 = [];
  form_obj_btns = [];
  form_lays = [];
  clear_form_list = [];
  if (params_form.length>9)
  	app.ShowProgress('', 'nodim');
  for (var i in params_form) {
    var pf = params_form[i];
    var l = app.CreateLayout("Linear", "Horizontal,FillX");
    form_lays.push(l);
    if (isDouble) {
      var a = pf[0]; var b_ = pf[1]; var c = pf[2];
      var w =  0.365;
      var b = app.CreateTextEdit(+a||'', w, -1, 'right, number,singleline');
      b.SetCursorColor('#0088aa');
      b.SetHint('0');
      b.SetOnChange(OnChangeEdtNumber);
      form_obj_btns.push([b]);
      b.SetTextColor(TC2[BG]);
      b.SetOnTouch(formOnTouch);
      l.AddChild(b)
      b.ID = '0' + i ;
      var b1 = app.CreateText('×', 0.05, -1);
      b1.SetTextColor(TC[BG]);
      b1.SetTextSize(TextSize);
      l.AddChild(b1);
      var b2 = app.CreateTextEdit(+b_||'', w, -1, 'number,singleline');
      b2.SetCursorColor('#0088aa');
      b2.SetHint('0');
      b2.SetOnChange(OnChangeEdtNumber);
      form_obj_btns[i].push(b2);
      b2.SetTextColor(TC[BG]);
      b2.SetOnTouch(formOnTouch);
      l.AddChild(b2)
      b2.ID = "1" + i ;
      var b = app.CreateButton('['+c+']', 0.21, -1, 'custom');
      b.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#30888888', 1, 0);
      b.SetTextSize(TextSize);
      b.SetOnTouch(formOnTouch);
      form_obj2.push(b);
      b.ID = +i;
      b.SetTextColor(TC[BG]);
      l.AddChild(b)
    }
    else {
      var a = pf[0]; var c = pf[1];
      var w = 0.65;
      b = app.CreateTextEdit(+a||'', w, -1, "vcenter, number, singleline");
      b.SetCursorColor('#0088aa');
      b.SetHint('0');
      b.SetOnChange(OnChangeEdtNumber);
      form_obj_btns.push([b])
      b.SetTextColor(TC2[BG]);
      b.SetOnTouch(formOnTouch);
      l.AddChild(b)
      b.ID = '0' + i ;
      var b = app.CreateButton('['+c+']', 0.23, -1, 'custom');
      b.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#30888888', 1, 0);
      b.SetTextSize(TextSize);
      form_obj2.push(b);
      b.ID = +i;
      b.SetOnTouch(formOnTouch);
      b.SetTextColor(TC[BG]);
      l.AddChild(b);
    }
    layScroll.AddChild(l);
    l.SetMargins(0, 0.01, 0, 0);
  }

  if (complexCalculationForm.New) {
      form_lays[0].SetVisibility("Hide");
  }
  app.AddLayout(lay_ccForm);
  if (params_form.length>9)
  	app.HideProgress();
  	app.SimulateTouch(form_obj_btns[0][0]);
	form_obj_btns[0][0].SetCursorPos(form_obj_btns[0][0].GetText().length);
  if (complexCalculationForm.New) {
      form_lays[0].Animate('SlideFromTop');
      complexCalculationForm.New = false;
  }
  if (Ll.length > 1) {
      var n = Ll.length;
      for (var i = 1; i < n; i++)
          app.DestroyLayout(Ll.pop());
  }
}

function formOnTouchHelp() {
    About(3);
}

function isAdd() {
        var par = params_cc2[index_cc2][item_cc2][{'-': "minus", '+': "plus"}[mode_cc2]];
        var x = par[0];
        if (!x) return
        if ((x.length == 2 && x[0]) || (x.length == 3 && (x[0] || x[1])))
            complexCalculationForm.add.SetTextColor(TC2[BG]);
        else
            complexCalculationForm.add.SetTextColor('#44'+TC2[BG].slice(1));
}


function formOnTouchOk() {
        clearFormList();
        Exit = 2; 
        lay_ccForm.Animate('FadeOut');
        app.DestroyLayout(lay_ccForm); 
}


function formOnTouchMenu(f) {
      
      var itemsListDialog = ['Справка', 'Прекратить расчет и выйти'];
      var pm = {'-': "minus", '+': "plus"}[mode_cc2]
      var p = params_cc2[index_cc2][item_cc2][pm];
      if (p.length==1
          && (JSON.stringify(p[0]) != JSON.stringify([0, 1]) && JSON.stringify(p[0]) != JSON.stringify([0, 0, 1]))
          || p.length > 1) {
              itemsListDialog.unshift('Очистить все');
      }
      objAddParams = {};
      if (params_cc2.length > 1) {
          var mode = item_cc2.slice(-1);
          var flag = false;
          for (var i in params_cc2) {
            for (var item in params_cc2[i]) {
              var is = item.slice(-1);
              var hz = (is == 'S' && mode == 'V' || is == 'V' && mode == 'S' || is == mode);
              if (!hz || item_cc2 == item) continue;
              for (i in params_cc2) {
                  try { 
                      var par = params_cc2[i][item][pm], tmp = [];
                      for (i in par) {
                          var ii = par[i].slice(0, -1);
                          if (ii[0] || mode=='S'&&ii[1] || mode=='V'&&ii[1]) {
                              tmp.push(par[i]);
                              }
                          }
                      if (tmp.length) {
                          objAddParams[item] = tmp;
                          flag = true;
                          }
                      }
                  catch(err) {continue};
                  }
                }
              }
          if (flag) itemsListDialog.unshift('Взять параметры');
          }
      objAddParams = JSON.parse(JSON.stringify(objAddParams))
      itemsListDialog.unshift('Готово');
      CreateListDialog(selectItemDialogFormMenu, '<img src="Img/grey.png"> Опции:', itemsListDialog);
}


function selectItemDialogFormMenu(val) {
    if (val == 'Очистить все') {
      YesNoDialog(clearAllForm, 'Очистить все?', '<img src="Img/help.png"> Подтвердите:');
      }
   else if (val == 'Готово') {
        Exit = 2; 
        clearFormList();
        lay_ccForm.Animate('FadeOut');
        app.DestroyLayout(lay_ccForm); 
       }
   else if (val == 'Справка') About(3);
   else if (val == 'Взять параметры') {
       var list = [];
       for (var i in objAddParams) {
           list.push(i.slice(0, -1))
           }
      CreateListDialog(selectItemDialogFormVp2, '<img src="Img/grey.png"> Взять из пункта:', list);
       }
   else if (val == 'Прекратить расчет и выйти') {
       YesNoDialog(query_exit, 'Прекратить расчет и закрыть программу?', '<img src="Img/exit.png"> Подтвердите:');
       }
}


function selectItemDialogFormVp2(it) {
    var u =app.CreateLayout('linear');
    u.SetVisibility('hide');
    var l = app.CreateList('Blba:Img/select.png,Blba:Img/select.png,Blba:Img/select.png,Blba:Img/select.png');
    var titl = app.CreateText('<img src="Img/grey.png"> <big><b>Выбрать параметры:</b></big>', 
            0.9, -1, 'multiline,html,left');
    u.AddChild(l);
    u.AddChild(titl);
    app.AddLayout(u);
    app.Wait(0.05);
    var hl = l.GetHeight()/4;
    var htitl = titl.GetHeight();
    app.DestroyLayout(u);
    for (var i in objAddParams) {
          if (it == i.slice(0, -1)) selectParamsForm = objAddParams[i];
          }
    var list_names_form_menu2 = [];
    list_names_form_menu = [];
    list_index_form_menu = [];
    Dialog = app.CreateDialog( "",'NoTitle' );
    layDlg = app.CreateLayout( "linear", "vertical,fillxy" );
    layDlg.SetBackGradient(COLORS[BG][0], COLORS[BG][1]);
    layDlg.SetSize(-1, Math.min(BTNHEIGHT*3+hl*selectParamsForm.length+htitl+2/HEIGHT, 0.8));
    Dialog.AddLayout( layDlg );
    var titl = app.CreateText('<img src="Img/grey.png"> <big><b>Выбрать параметры:</b></big>', 
            0.9, htitl, 'multiline,html,left');
    titl.SetTextColor('#3098ba');
    titl.SetMargins(0, 0.02, 0, 0.02);
    layDlg.AddChild(titl);
    var line = app.CreateText('', 0.95, 2/HEIGHT);
    line.SetBackColor('#3088aa');
    layDlg.AddChild(line);
    var sss = 0;
    if (selectParamsForm.length > 10) {
        app.ShowProgress('');
        }
    for (var i in selectParamsForm) {
            var ss = selectParamsForm[i]; 
            list_index_form_menu.push(sss)
            sss += 1;
            var t = sss + ')  ' + ss.slice(0, -1).join(' × ') + ' м‚  ' + ss.slice(-1) + 'шт.'
            list_names_form_menu2.push(t + ':Img/select.png')
            list_names_form_menu.push(t);
        }
    var lstDlg = app.CreateList( list_names_form_menu2 , -1, Math.min(hl*selectParamsForm.length, 0.8-BTNHEIGHT*3-htitl));
    lstDlg.SetTextColor(TC[BG]);
    lstDlg.SetOnTouch(setOnTouchList);
    lstDlg.SetOnLongTouch(setOnTouchList);
    layDlg.AddChild( lstDlg );
    var line = app.CreateText('', 1, 2/HEIGHT);
    line.SetBackColor('#aaaaaa');
    layDlg.AddChild(line);
    var btn1 = app.CreateCheckBox("Заменить текущие", 1, BTNHEIGHT);
    btn1.SetTextColor(TC[BG]);
    layDlg.AddChild( btn1);
    btn1.SetOnTouch(touchFormToggle);
    btn1.SetChecked(true);
    var line = app.CreateText('', 1, 2/HEIGHT);
    line.SetBackColor('#aaaaaaaa');
    layDlg.AddChild(line);
    var btn2 = app.CreateCheckBox("Добавить к текущим", 1, BTNHEIGHT);
    btn2.SetTextColor(TC[BG]);
    btn2.SetOnTouch(touchFormToggle);
    layDlg.AddChild( btn2 );
    var line = app.CreateText('', 1, 2/HEIGHT);
    line.SetBackColor('#aaaaaa');
    layDlg.AddChild(line);
    checlDict = {'Re': btn1, 'Add': btn2};
    Dialog.SetOnCancel(dlgCancel);
    var o = app.CreateLayout("linear", 'horizontal');
    layDlg.AddChild(o);
    var b = app.CreateButton("Отмена", 0.475, -1, 'html');
    b.SetBackColor('#00000000')
    b.SetOnTouch(dlgCancel2);
    b.SetTextColor(TC[BG]);
    o.AddChild(b);
    var l = app.CreateText('', 1.5/WIDTH, -1, 'filly');
    l.SetBackColor('#aaaaaa');
    o.AddChild(l);
    var ok = app.CreateButton("OK", 0.475, BTNHEIGHT, 'html');
    ok.SetOnTouch(touchSelectParamsP);
    ok.SetBackColor('#00000000');
    ok.SetTextColor(TC[BG]);
    o.AddChild(ok);
    Dialog.Show();
    if (selectParamsForm.length > 10) app.HideProgress();
}


function touchFormToggle(c) {
    if (!c) return this.SetChecked(true);
    for (var i in checlDict) {
        var obj = checlDict[i];
        if (this != obj) obj.SetChecked(false)
        }
    this.SetChecked(true)
}

function touchSelectParamsP() {
     this.SetBackColor('#33aacc')
     form_pm = {'+': 'plus', '-': 'minus'}[mode_cc2];
     var list = [];
     if (list_index_form_menu.length) {
         for (var i in list_index_form_menu) {
             list.push(selectParamsForm[list_index_form_menu[i]]);
             }
         if (checlDict.Re.GetChecked()) {
             params_cc2[index_cc2][item_cc2][form_pm] = list;
             }
         else {
             for (var i in list) {
                 params_cc2[index_cc2][item_cc2][form_pm].push(list[i]);
                 }
             }
         Dialog.Dismiss();
         app.ShowPopup('Выполнено', 'Short');
         params_cc2[index_cc2][item_cc2]['color'+mode_cc2] = '#ff91ff';
         if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
         var body = __res(params_cc2[index_cc2][item_cc2][form_pm], item_cc2.slice(-1), params_cc2[index_cc2][item_cc2]['depth']);
         var _ = objform.GetList()[0].title
         objform.SetItem(_, _, body, 'Img/edit.png');
         if (form_pm == 'minus') {
             objform.fab.SetVisibility('Gone');
             objform.SetVisibility('Show');
         }
         return complexCalculationForm();
         }
     else  {
         app.ShowPopup('Ни один пункт не отмечен.', 'Short');
         this.SetBackColor('#00000000');
         }
}


function setOnTouchList(item) {
    
    var index = list_names_form_menu.indexOf(item);
    var indexof = list_index_form_menu.indexOf(index);
    if (indexof != -1) {
        list_index_form_menu.splice(indexof, 1);
        this.SetItem(item, item, '', 'Img/unselect.png'); 
        }
    else {
        list_index_form_menu.push(index);
        this.SetItem(item, item, '', 'Img/select.png'); 
        }
    
}


function clearAllForm(yn) {
    Dialog.Dismiss();
    app.DestroyLayout(layDlg);
    if (this.ID == 'Yes') {
        form_pm = {'+': 'plus', '-': 'minus'}[mode_cc2];
        params_cc2[index_cc2][item_cc2][form_pm] = item_cc2.slice(-1) == 'L' ? [[0, 1]] : [[0, 0, 1]];
        if (item_cc2.slice(-1) == 'V' && form_pm == 'plus') {
            params_cc2[index_cc2][item_cc2]['depth'] = 0;
            } 
        if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
        var body = __res(params_cc2[index_cc2][item_cc2][form_pm], item_cc2.slice(-1), params_cc2[index_cc2][item_cc2]['depth']);
        var _ = objform.GetList()[0].title;
        objform.SetItem(_, _, body, 'Img/edit.png');
        if (form_pm == 'minus') {
            objform.fab.SetText('[fa-chevron-circle-down]');
            objform.fab.SetVisibility('Show');
            objform.SetVisibility('Gone');
        }
        return complexCalculationForm();
        }
}


function formOnTouchAdd(f) {
        var par = params_cc2[index_cc2][item_cc2][{'-': "minus", '+': "plus"}[mode_cc2]];
        var x = par[0];
        if ((x.length == 2 && x[0]) || (x.length == 3 && (x[0] || x[1]))) {
            clearFormList();
             params_cc2[index_cc2][item_cc2][{'-': "minus", '+': "plus"}[mode_cc2]].unshift(x.length==2 ? [0, 1] : [0, 0, 1]);
            // app.ShowPopup('Добавлен новый пункт.',"Short,bottom");
             complexCalculationForm.New = true;
             return  complexCalculationForm();
          }
          else app.ShowPopup('Нет смысла добавлять пункт.', 'Short');
}


FlagFormTouch = false;
function formOnTouch(v) {
	form_pm = {'+': 'plus', '-': 'minus'}[mode_cc2];
	var id = this.ID;
	if (typeof id == 'string') {
		if (!FlagFormTouch) {
			FlagFormTouch = true;	setTimeout(function(){
				FlagFormTouch=false}, 400);
		}
		else {
			FlagFormTouch = false;
			calcValues();
			form_obj = this;
			if (inputValues2.length)
				CreateListDialog(function(v){
					form_obj.SetText(v);
					form_obj.SetCursorPos(v.length);
					callbackForm(+v);
				}, 'Выбрать значение:', inputValues2);
			form_obj = this;
			var r = /([0-1])(\d+)$/g;
			if (id.match(r)) {
				form_index = +(id.replace(r, '$2'));
			}
		}
	}
	else if (id == 'depth') {}
  else {
      form_index = id;
      var itemsListDialog = ['+1', 'Указать количество'];
      var g = params_cc2[index_cc2][item_cc2][form_pm];
      var p = g[form_index];
      if (p.length == 3 && p[0] != p[1])
          itemsListDialog.push('Поменять множители местами');
      if (JSON.stringify(p) != JSON.stringify([0, 1]) && JSON.stringify(p) != JSON.stringify([0, 0, 1]))
          itemsListDialog.push('Сбросить параметры');
      if ((g.length-clear_form_list.length)>1) itemsListDialog.push('Переместить пункт');
      if (form_index && (g.length-clear_form_list.length)>1) itemsListDialog.push('Удалить пункт');
      CreateListDialog(selectItemDialogAddParams, '<img src="Img/grey.png"> Опции:', itemsListDialog);
  }
}


function OnChangeEdtNumber() {
	var r = this.ID=='depth'?/^\d{0,4}\.?\d{0,3}$/g:/^\d{0,5}\.?\d{0,2}$/g;
	var t = this.GetText();
	if (t===null)
		return app.ShowPopup('Не торопитесь', 'short');
	if (t == '.') {
		this.SetText('0.');
		t = '0.';
		this.SetCursorPos(2);
	}
	else if (!t.match(r)) {
		this.Undo();
	}
	t = Round(t || 0);
	if (this.ID=='depth') {
		setDepth(t);
	}
	else if (this.ID.match(/[0-1].+/g)) {
		var r = /([0-1])(\d+)$/g;
		form_index = +(this.ID.replace(r, '$2'));
		form_obj = this;
		callbackForm(t);
	}
}


function clearFormList() {
  try {
    var l = params_cc2[index_cc2][item_cc2][form_pm], n = [];
    for (var i = 0; i < l.length; i++) {
        if (! ~clear_form_list.indexOf(i)) {
            n.push(l[i]);
        }
    }
    clear_form_list = [];
    form_lays = [];
    params_cc2[index_cc2][item_cc2][form_pm] = n;
    if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
    var body = __res(params_cc2[index_cc2][item_cc2][form_pm], item_cc2.slice(-1), params_cc2[index_cc2][item_cc2]['depth']);
    var _ = objform.GetList()[0].title;
    objform.SetItem(_, _, body, objform.GetList()[0].image);
  }
  catch(e) {}
}


function selectItemDialogAddParams(i) {
    var n = +(form_obj2[form_index].GetText().slice(1, -1)) + 1;
    if (i == '+1') {
    	if (n > 999)
    		return app.ShowPopup('Превышение лимита!', 'short');
        form_obj2[form_index].SetText('[' + n + ']');
        form_obj2[form_index].SetTextColor('#ff8800');
        setTimeout('form_obj2[form_index].SetTextColor(TC[BG])', 300);
        params_cc2[index_cc2][item_cc2][form_pm][form_index].splice(-1, 1, n);
        params_cc2[index_cc2][item_cc2]['color'+mode_cc2] = '#ff91ff';
        if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
        var body = __res(params_cc2[index_cc2][item_cc2][form_pm], item_cc2.slice(-1), params_cc2[index_cc2][item_cc2]['depth']);
        var _ = objform.GetList()[0].title;
        objform.SetItem(_, _, body, 'Img/edit.png');
    }
    else if (i == 'Поменять множители местами') {
        var p = params_cc2[index_cc2][item_cc2][form_pm][form_index];
        params_cc2[index_cc2][item_cc2][form_pm][form_index].splice(0, 2, p[1], p[0]);
        form_obj_btns[form_index][0].SetText('');
        app.Wait(0.1);
        form_obj_btns[form_index][1].SetText('');
        form_obj_btns[form_index][0].SetTextColor("#ff5500");
        form_obj_btns[form_index][1].SetTextColor("#ff5500");
        app.Wait(0.1);
        form_obj_btns[form_index][0].SetText(p[0]);
        app.Wait(0.1);
        form_obj_btns[form_index][1].SetText(p[1]);
        app.Wait(0.1);
        form_obj_btns[form_index][0].SetTextColor(TC[BG]);
        form_obj_btns[form_index][1].SetTextColor(TC[BG]);
        if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
    }
    else if (i == 'Сбросить параметры') {
        if (form_obj_btns[form_index].length == 1) {
            params_cc2[index_cc2][item_cc2][form_pm][form_index].splice(0, 2, 0, 1);
            form_obj_btns[form_index][0].SetText('0');
            form_obj2[form_index].SetText('[1]');
            form_obj_btns[form_index][0].SetTextColor("#ff5500");
            form_obj2[form_index].SetTextColor("#ff5500");
            app.Wait(0.15);
            form_obj_btns[form_index][0].SetTextColor(TC[BG]);
            form_obj2[form_index].SetTextColor(TC[BG]);
         }
        else {
            params_cc2[index_cc2][item_cc2][form_pm][form_index].splice(0, 3, 0, 0, 1);
            form_obj_btns[form_index][0].SetText('0');
            form_obj_btns[form_index][1].SetText('0');
            form_obj2[form_index].SetText('[1]');
            form_obj_btns[form_index][0].SetTextColor("#ff5500");
            form_obj_btns[form_index][1].SetTextColor("#ff5500");
            form_obj2[form_index].SetTextColor("#ff5500");
            app.Wait(0.15);
            form_obj_btns[form_index][0].SetTextColor(TC[BG]);
            form_obj_btns[form_index][1].SetTextColor(TC[BG]);
            form_obj2[form_index].SetTextColor(TC[BG]);
        }
        isAdd();
        var body = __res(params_cc2[index_cc2][item_cc2][form_pm], item_cc2.slice(-1), params_cc2[index_cc2][item_cc2]['depth']);
        var _ = objform.GetList()[0].title;
        objform.SetItem(_, _, body, 'Img/edit.png');
        if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
        if (form_pm == 'minus') {
            if (body.slice(0, 2) == '0 ') {
                objform.fab.SetText('[fa-chevron-circle-down]');
                objform.fab.SetVisibility('Show');
                objform.SetVisibility('Gone');
            }
            else {
                objform.fab.SetVisibility('Gone');
                objform.SetVisibility('Show');
            }
        }
    }
    else if (i == 'Удалить пункт') {
        for (var i = 9; i > 0; i--) form_lays[form_index].SetScale(1, i/10);
        form_lays[form_index].SetScale(0, 0);
        app.Wait(0.2);
        form_lays[form_index].SetVisibility("gone");
        clear_form_list.push(form_index);
        var q = params_cc2[index_cc2][item_cc2][form_pm];
        var body = __res(q.slice(0, form_index).concat(q.slice(form_index+1)), item_cc2.slice(-1), params_cc2[index_cc2][item_cc2]['depth']);
       if (form_pm == 'minus') {
            if (body.slice(0, 2) == '0 ') {
                objform.fab.SetText('[fa-chevron-circle-down]');
                objform.fab.SetVisibility('Show');
                objform.SetVisibility('Gone');
            }
            else {
                objform.fab.SetVisibility('Gone');
                objform.SetVisibility('Show');
            }
        }
    }
    else if (i == 'Указать количество') {
        Exit = 'input3';
        return inputDigital(callbackForm2, 'int', i, 0);
    }
    else if (i == 'Переместить пункт') {
        Dialog = app.CreateDialog("", 'NoTitle');
        layDlg = app.CreateLayout("linear", "vertical,fillxy,left" );
        layDlg.SetBackGradient(COLORS[BG][0], COLORS[BG][1]);
        layDlg.SetPadding(0.02, 0, 0.02, 0.02);
        Dialog.AddLayout(layDlg);
        var titl = app.CreateText('<img src="Img/move.png"> <big><b>Поместить на позицию:</b></big>', 
            0.9, -1, 'multiline,html,left');
        titl.SetTextColor('#3098ba');
        titl.SetMargins(0, 0.02, 0, 0.02);
        layDlg.AddChild(titl);
        var line = app.CreateText('', 0.95, 2/app.GetScreenHeight());
        line.SetBackColor('#3088aa');
        layDlg.AddChild(line);
        var list = '', lf = params_cc2[index_cc2][item_cc2][form_pm];
        for(var z in lf) {
            if(z == form_index) var icon = 'Img/right.png';
            else var icon = 'Img/transp.png';
            if (~clear_form_list.indexOf(+z))  {}//list += 'Удален:' + icon + ',';
            else {
                var i = lf[z];
                if (i.length==2) list += i[0] + '  [' + i[1] + ']:' + icon + ',';
                else if (i.length==3) list += i[0] + ' × ' + i[1] + '  [' + i[2] + ']:' + icon + ',';
            }
       }
       lstDlg = app.CreateList(list, 0.9, -1, 'html');
       lstDlg.SetTextColor(TC[BG]);
       lstDlg.SetOnTouch(form_Move);
       lstDlg.SetOnLongTouch(form_Move);
       layDlg.AddChild(lstDlg);
       Dialog.Show(); 
       Dialog.SetOnCancel(dlgCancel);
    }
}


function form_Move (p1, p2, p3, ind) {
   Dialog.Dismiss();
   app.DestroyLayout(layDlg);
   var v = form_index;
   for (var i = 0; i<clear_form_list.length; i++) {
       if (clear_form_list[i]<form_index) v -= 1;
   }
   if (v==ind) return app.ShowPopup('Без изменений', 'short');
   form_index = v;
    var l = params_cc2[index_cc2][item_cc2][form_pm], n = [];
    for (var i = 0; i < l.length; i++) {
        if (! ~clear_form_list.indexOf(i)) {
            n.push(l[i]);
        }
    }
    clear_form_list = [];
    form_lays = [];
    params_cc2[index_cc2][item_cc2][form_pm] = n;
   var p = params_cc2[index_cc2][item_cc2][form_pm][form_index];
   params_cc2[index_cc2][item_cc2][form_pm].splice(form_index, 1);
   params_cc2[index_cc2][item_cc2][form_pm].splice(ind, 0, p);
   clearFormList();
   app.ShowPopup('Выполнено', 'short');
   return complexCalculationForm();
}


function callbackForm2(num) {
    Exit = 'form';
    var n = params_cc2[index_cc2][item_cc2][form_pm][form_index].slice(-1);
    if (num < 1)  {
        app.ShowPopup('Нулевое значение, отменено.', 'Short');  return;
        }
    else if (num > 999) {
        app.ShowPopup('Превышение лимита, отменено.', 'Short'); return;
        }
    form_obj2[form_index].SetText('[' + num + ']');
    form_obj2[form_index].SetTextColor('#ff8800');
    setTimeout('form_obj2[form_index].SetTextColor(TC[BG])', 300);
    params_cc2[index_cc2][item_cc2][form_pm][form_index].splice(-1, 1, num);
    params_cc2[index_cc2][item_cc2]['color'+mode_cc2] = '#ff91ff';
    if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
    var body = __res(params_cc2[index_cc2][item_cc2][form_pm], item_cc2.slice(-1), params_cc2[index_cc2][item_cc2]['depth']);
    var _ = objform.GetList()[0].title;
    objform.SetItem(_, _, body, 'Img/edit.png');
}


function setDepth(num) {
    params_cc2[index_cc2][item_cc2]['depth'] = num;
    var body = __res(params_cc2[index_cc2][item_cc2][form_pm], 'V', num);
    var _ = objform.GetList()[0].title;
    objform.SetItem(_, _, body, 'Img/edit.png');
    if (form_pm == 'plus')
    {
        var _ = objform.minus.GetList()[0].title;
        objform.minus.SetItem(_, _, __res(params_cc2[index_cc2][item_cc2]['minus'], 'V', num), objform.minus.GetList()[0].image);
    }
    if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
}

function callbackForm(num) {
  if  (item_cc2.slice(-1) == "1" || item_cc2.slice(-1) == "M") {
    Exit = 2;
    params_cc2[index_cc2][item_cc2]['plus'] = num;
    var body = __res(num, item_cc2.slice(-1));
    }
  else {
    params_cc2[index_cc2][item_cc2][form_pm][form_index].splice(+(form_obj.ID.slice(0, 1)), 1, +num);
    var n2 = +params_cc2[index_cc2][item_cc2][form_pm][form_index][+(!(+form_obj.ID.slice(0, 1)))];
    var body = __res(params_cc2[index_cc2][item_cc2][form_pm], item_cc2.slice(-1), params_cc2[index_cc2][item_cc2]['depth']);
    if (form_pm == 'minus') {
        if (body.slice(0, 2) == '0 ') {
            objform.fab.SetText('[fa-chevron-circle-down]');
            objform.fab.SetVisibility('Show');
            objform.SetVisibility('Gone');
        }
        else {
            objform.fab.SetVisibility('Gone');
            objform.SetVisibility('Show');
        }
    }
  }
  params_cc2[index_cc2][item_cc2]['color'+mode_cc2] = '#ff91ff';
  var _ = objform.GetList()[0].title;
  objform.SetItem(_, _, body, 'Img/edit.png');
  if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
  isAdd();
}





//####prices

function isCurrentPrice() {
	for (var i in params_cc2) {
		var obj = params_cc2[i];
		for (i in obj) {
			if (obj[i]["price"]) {
				return true;
			}
		}
	}
	return false;
}
LLPrice = [];
function complexPriceForm(v) {
  Exit = 'price';
  lay_priceForm = app.CreateLayout("Linear", "Top,FillXY");
  LLPrice.unshift(lay_priceForm);
  lay_priceForm.SetBackground('Img/bg'+BG+'.png', 'repeat');
  var ltit = app.CreateLayout("Linear", "Horizontal,FillX,vcenter") ;
  var t = app.CreateTitle("Ввод расценок");
  lay_priceForm.AddChild(t);
  var scroll = app.CreateScroller(1, 1-BTNHEIGHT-GET_TOP-0.005); 
  scroll.SetMargins(0, 0, 0, 0.005);
  lay_priceForm.AddChild(scroll);
  var layScroll = app.CreateLayout("Linear", "fillxy,top"); 
  scroll.AddChild( layScroll );
  for (var i in params_cc2) {
     var obj = params_cc2[i];
     var flg;
     for (i in obj) {
      var l = app.CreateLayout("Linear", "Horizontal,FillX,vcenter");
      var dct = {'S': '/м²', 'L': '/м.п.', '1': '/ед.', 'V': '/м³', 'M': '/кг', '0': ''};
      var price = '' + obj[i]['price'];
      var def_price = defaultPrices[i];
      var text = i.slice(0, -1) + '‚ ' + Currency + dct[i.slice(-1)];
      var item = app.CreateText(text, 0.69, -1, 'multiline, left');
      item.SetFontFile('fonts/DroidSerif-Regular.ttf');
      item.SetTextSize(TextSize);
      item.SetTextColor(TC[BG]);
      item.SetMargins(0, 0.008, 0, 0.008);
      l.AddChild(item);
      var btn = app.CreateTextEdit(+price||def_price||'', 0.266, -1, 'number,singleline');
      if (!flg) {
          flg = btn;
      }
      btn.SetHint('0');
      item.obj = [obj, i, btn];
      btn.SetCursorColor('#0088aa');
      btn.SetTextColor(TC[BG]);
      btn.obj = [obj, i, btn];
      btn.SetOnChange(setPrice);
      btn.SetMargins(0, 0, 0.01, 0);
      l.AddChild(btn);
      layScroll.AddChild(l);
      var line = app.CreateText('', 1, 2/HEIGHT);
      line.SetBackColor('#aa888888');
      layScroll.AddChild(line);
      }
    }  
  var m = app.CreateButton('[fa-ellipsis-v]', 0.5, BTNHEIGHT, "FontAwesome, custom");
  m.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  m.SetTextColor(TC2[BG]);
  m.SetTextSize(TextButtonsSize, 'px')
  m.SetOnTouch(ccFormMenuOnTouch);
  ltit.AddChild(m);
    var ok = app.CreateButton('[fa-share]', 0.5, BTNHEIGHT, "FontAwesome, custom");
  ok.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  ok.SetTextColor('#009000');
  ok.SetTextSize(TextButtonsSize, 'px')
  ok.ID = 'ok';
  ok.SetOnTouch(inputSaveCalculation);
  ltit.AddChild(ok);
  lay_priceForm.AddChild(ltit);  
  app.AddLayout(lay_priceForm);
  app.SimulateTouch(flg);
  flg.SetCursorPos(flg.GetText().length);
  if (LLPrice.length>1) {
      app.DestroyLayout(LLPrice.pop());
  }
}


function ccFormMenuOnTouch() {
	var list = ['Готово‚ далее', 'Прекратить расчет и выйти'];
	if (isCurrentPrice())
		list.push('Обнулить все');
	CreateListDialog(
		onTouchMenu_ccForm, '<img src="Img/grey.png"> Опции:', list);
}


function onTouchMenu_ccForm(val) {
    if (val == 'Готово‚ далее') 
       inputSaveCalculation();
    else if (val == 'Прекратить расчет и выйти') 
       YesNoDialog(query_exit, 'Прекратить расчет и закрыть программу?', '<img src="Img/exit.png"> Подтвердите:');
   else if (val=='Обнулить все') {
       YesNoDialog(
           onTouchMenu_ccForm, 'Обнулить все расценки?', '<img src="Img/exit.png"> Подтвердите:');
   }
   else {
       this.SetBackColor('#33aacc');
       app.Wait(0.05);
       Dialog.Dismiss();
       if (this.ID=="Yes") {
           for (var i in params_cc2) {
               var obj = params_cc2[i];
               for (i in obj) {
                   obj[i]["price"] = 0;
               }
           }
           complexPriceForm();
           app.ShowPopup('Выполнено', "short");
       }
   }
}
 
 


function setPrice() {
	var t = this.GetText();
	if (t===null)
		return app.ShowPopup('Не торопитесь', 'short');
	if (t == '.') {
		this.SetText('0.');
		t = '0.';
		this.SetCursorPos(2);
	}
	else if (
		!t.match(/^\d{0,4}\.?\d{0,2}$/g)
		&& !t.match(/^\d{0,5}\.?\d{0,1}$/g)
		&& !t.match(/^\d{0,7}$/g)) {
			this.Undo();
	}
	var v = Round(t || 0);
        var t = {'S': '/м²', 'L': '/м.п.', '1': '/ед.', 'V': '/м³', 'M': '/кг', '0': ''}[this.obj[1].slice(-1)];
                this.obj[0][this.obj[1]]['price'] = v;
        if (!EditCalc) app.SaveText('Temp', JSON.stringify(params_cc2));
}



function inputSaveCalculation(){
    if (typeof titleCalculation == 'string') {
        var title = 'Имя отредактированного расчета, как сохранить расчет:'
        var nam = ['Сохранить как новый, старый оставить', 'Сохранить как новый, старый удалить', 'Сохранить как старый расчет', 'Не сохранять, просто просмотр'];
        var txt = titleCalculation.slice(21);
    }
    else {
        var title = 'Имя расчета:'
        var nam = ['Сохранить расчет' , 'Не сохранять, просто просмотр'];
        var txt = '';
    }
    SelectionList(touch_inputSaveCalculation, nam, title, 2, txt, 'Только дата');
    SelectionList.edt.SetCursorPos(txt.length);
    Dialog.SetOnCancel(dlgCancel);
}



function touch_inputSaveCalculation() {
    this.SetBackColor('#33aacc');
    app.Wait(0.05);
    Dialog.Dismiss();
    for (var i in params_cc2) {
        var obj = params_cc2[i];
        for (var key in obj) {
            obj[key]['color+'] = "#dddddc";
            if (key.slice(-1) == 'S' || key.slice(-1) == 'V' || key.slice(-1) == 'L') obj[key]['color-'] = "#dddddc";
            }
        }
    var i = SelectionList.index;
    var Name = SelectionList.edt.GetText();
    Name = Name.replace(/,/g, '‚')
      .replace(/:/g, ' -')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/\"/g, '″')
      .replace(/\</g, '❮')
      .replace(/\>/g, '❯')
      .replace(/\\/g, '/') ;
    Name = Name.replace(/(^\s*)|(\s*)$/g, '');
    var d = new Date();
    var date = d.getFullYear() + "." + Format(d.getMonth()+1) + "." + Format(d.getDate()) + "; " + Format(d.getHours()) + "-" + Format(d.getMinutes()) + "-" + Format(d.getSeconds());
    var title = (date + " " + Name).replace(/(\s*)$/g, '');
    var hist = JSON.parse(HISTORY);
    if (i == 0) {
        hist[title] = JSON.parse(JSON.stringify(params_cc2));
        HISTORY = JSON.stringify(hist);
        app.SaveText("History", HISTORY);
        }
    else if (typeof titleCalculation == 'string') {
        if (i == 1) {
            hist[title] = JSON.parse(JSON.stringify(params_cc2));
            IndexOf(showKeySelect);
            delete hist[showKeySelect];
            }
        else if(i == 2) {
            IndexOf(showKeySelect);
            delete hist[showKeySelect];
            hist[showKeySelect.slice(0, 20) + ' ' + Name] = JSON.parse(JSON.stringify(params_cc2));
            title = showKeySelect.slice(0, 20) + ' ' + Name;
            }
        HISTORY = JSON.stringify(hist);
        app.SaveText("History", HISTORY);
        }
    app.ShowPopup('Расчет ' + ((typeof titleCalculation != 'string' && i==1 || typeof titleCalculation == 'string' && i==3) ? 'не ' : '') + 'сохранен.', 'Short');
    app.SaveText('Temp', JSON.stringify([]));
    TEMP = JSON.stringify([]);
    app.DestroyLayout(layDlg);
    doShow(title, 0);
}


function IndexOf(text) {
    for (var i in listShow) {
        if (!listShow[i].indexOf('Расчет от ' + text)) listShow.splice(i, 1);
        }
}


function Format(val) {
    if (val < 10) return '0' + val;
    return String(val);
}


function formatNum(n) {
    return String(n).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
}

function doShow(label, argument) {
    function RND(total) {
        if (ROUNDING == 1) total = Math.round(+total);
        else if (ROUNDING == 2) total = Math.floor(+total);
        else if (ROUNDING == 3) total = Math.ceil(+total);
        return total;
    }
    var params_cc2_ = JSON.parse(JSON.stringify(params_cc2));
   /* for (var i in params_cc2_) {
    	var d = params_cc2_[i];
    	for (var i2 in d) {
    		var n = d[i2];
    		for (var ii in params_cc2_) {
    			var dd = params_cc2_[ii];
    			for (var ii2 in dd) {
    				var nn = dd[ii2];
    				if (nn != n) {
    					
    				}
    			}
    			
    		}
    	}
    }
    */
    var lst_params = [], lst_cost = [], total = 0;
    var hsh = {'1': 'ед.', 'M': 'кг', 'V': 'м³', 'S': 'м²', 'L': 'м.п.', '0': ''};
    for (var i in params_cc2) {
        var itm = params_cc2[i];
        for (var nm in itm) {
            var title = nm.slice(0, -1), obj = itm[nm]; 
            var nm_slice = nm.slice(-1);
            if (nm_slice == '0' && obj['price'])  {
                    lst_params.push('\n' + title);
                    lst_cost.push(title + '^c^\n	' + formatNum(RND(obj['price'])) + ' ' + Currency + '.');
                    total += RND(obj['price']);
            }
            else if (nm_slice == '1' || nm_slice == 'M') {
                if (obj['plus']) {
                    lst_params.push('\n' + title + '^c^ ' + obj['plus'] + ' ' + hsh[nm_slice]);
                    if (obj['price']) {
                        lst_cost.push(title + '^c^\n	' + obj['plus'] + hsh[nm_slice] + ' × ' + formatNum(obj['price']) + ' ' + Currency + '/' + hsh[nm_slice] + ' = ' + formatNum(RND(Round(obj['plus'] * obj['price']))) + ' ' + Currency + '.');
                        total += RND(Round(obj['plus'] * obj['price'], 2));
                    }
                }
            }
            else {
                var plus = 0, minus = 0; plist = []; mlist = [];
                for (var q in obj['plus']) {
                    q = obj['plus'][q];
                    var par = mul(q);
                    if (!par) continue;
                    plus += par;
                    if (nm_slice == 'L')  {
                        if (q[1] == 1) plist.push(q[0] + ' м');
                        else plist.push('(' + q[0] + ' м × ' + q[1] + ')');
                    } 
                    else {
                        if (q[2] == 1) plist.push(q[0] + ' м × ' + q[1] + ' м' + ' = ' + par + ' м².');
                        else plist.push('(' + q[0] + ' м × ' + q[1] + ' м) × ' + q[2] + ' = ' + par + ' м².');
                    }
                }
                plus = Round(plus);
                var len = plist.length;
                if (nm_slice == 'L' && len) {
                    lst_params.push('\n' + title + '^c^');
                    if (len == 1 && plist[0].slice(0, 1) != '(')  {
                        lst_params.push('  ' + plist[0] + '.п.');
                    } 
                    else {
                        lst_params.push('	' + plist.join(' + ') + ' = ' + plus + ' м.п.');
                    }
                }
                else if ((nm_slice == 'S' || nm_slice == 'V') && len) {
                    lst_params.push('\n' + title + '^c^');
                    for (var j in plist) lst_params.push('	' + plist[j]);
                    if (plist.length > 1) lst_params.push('	всего^c^ ' + plus + ' м².')
                }

                for (var q in obj['minus']) {
                    q = obj['minus'][q];
                    var par = mul(q);
                    if (!par) continue;
                    minus += par;
                    if (nm_slice == 'L') {
                        if (q[1] == 1) mlist.push(q[0] + ' м');
                        else mlist.push('(' + q[0] + ' м' + ' × ' + q[1] + ')');
                    } 
                    else {
                        if (q[2] == 1) mlist.push(q[0] + ' × ' + q[1] + ' = ' + par + ' м².');
                        else mlist.push('(' + q[0] + ' м' + ' × ' + q[1] + ' м' + ')' + ' × ' + q[2] + ' = ' + par + ' м².');
                    }
                }
                minus = Round(minus);
                if (nm_slice == 'L' && mlist.length) {
                    if (plist.length) var t = 'вычитаемые участки^c^';
                    else var t = '\n' + title + ' (вычитаемые участки)^c^';
                    lst_params.push(t);
                    if (mlist.length == 1 && mlist[0].slice(0, 1) != '(') lst_params.push('  ' + mlist[0] + '.п.');
                    else lst_params.push('	' + mlist.join(' + ') + ' = ' + minus + ' м.п.');
                }
                else if ((nm_slice == 'S' || nm_slice == 'V') && mlist.length) {
                    if (plist.length) var t = 'вычитаемые участки^c^';
                    else var t = '\n' + title + ' (вычитаемые участки)^c^';
                    lst_params.push(t);
                    for (var j in mlist) lst_params.push('	' + mlist[j]);
                    if (mlist.length > 1) lst_params.push('	всего^c^ ' + minus + ' м².')
                }
                var r = Round(plus - minus);
                if (plist.length && mlist.length) {
                    var y = hsh[nm_slice].replace(/³/, '²');
                    lst_params.push('Итого^c^ ' + plus  + ' ' + y + ' - ' + minus + ' ' + y + ' = ' + r + ' ' + y + (y.slice(-1)=='.' ? '' : '.'))
                }
                if (nm_slice == 'V' && (plus || minus)) {
                    lst_params.push('Объем' + '^c^\n	' + r + ' м² × '  + obj['depth'] + ' м = ' +  Round(r * obj['depth']) + ' м³.' + (obj['depth'] ? '' : ' (не задана толщина слоя!)'));
                    r = Round(r * obj['depth']);
                }
                if (obj['price'] && (plus || minus) && (nm_slice != 'V' || nm_slice == 'V' && obj['depth'])) {
                    lst_cost.push(title + '^c^\n	' + r  +  ' ' + hsh[nm_slice] + ' × ' + formatNum(obj['price']) + ' ' + Currency + '/' + hsh[nm_slice] + ' = ' + formatNum(RND(Round(r * obj['price']))) + ' ' + Currency + '.');
                    total += RND(Round(r * obj['price']));
                }
            }
        }
    }
    var result  = 'Расчет от ' + label + '\n';
    if (!lst_params.length) lst_params.push('\nНет (или недостаточно) данных для подсчета.')
    result += lst_params.join('\n');
    if (lst_cost.length) {
        total = RND(total);
        lst_cost.push('\nИтого^c^  ' + formatNum(Round(total)) + ' ' + Currency + '.');
        result += '\n\n💰  Стоимость работ^c^\n\n' + lst_cost.join('\n');
    }
    var ind = listShow.indexOf(result);
    if (~ind && ~argument )  listShow.splice(ind, 1);
    if (~argument) 
        listShow.unshift(result);
    if (!argument) 
        Show();
    else if (argument < 0) 
        Alert2(result.replace(/\^c\^/gm, ':'), 'Просмотр расчета:', 'Ясно', true);
}


//###################### show
var Ll3 = [], fontSizeShow = TextSize;
function Show(label, scrollY) {
    if (!listShow.length) return ComplexCalculation1(1);
    Exit = 'show';
    showBack = 'false'
    showFlag = false, showCheck = [], showButtonsFlags = [true, false];
  lay_ccShow = app.CreateLayout("Absolute", "FillXY");
  Ll3.unshift(lay_ccShow);
  lay_ccShow.SetBackground('Img/bg'+BG+'.png', 'repeat');
  arguments.callee.scroll = app.CreateScroller(1, 1-BTNHEIGHT-0.005); 
  
  arguments.callee.scroll.SetMargins(0, 0, 0, 0.005);
  lay_ccShow.AddChild(arguments.callee.scroll);
  var layScroll = app.CreateLayout("Linear", "fillxy,top"); 
  arguments.callee.scroll.AddChild( layScroll );
  showListList = [];
  var objs = []; nm = 0;
  showMenuBtnList = [];
  for (var i in listShow) {
      nm += 1;
      var tx = listShow[i];
      var l = app.CreateLayout("Linear", "FillX");
      var lhrz = app.CreateLayout('linear', 'horizontal,fillx, vcenter, right');
      lhrz.SetBackGradient('#77'+COLORS[BG][0].slice(1), '#77'+COLORS[BG][1].slice(1));
      l.AddChild(lhrz);
      var t = app.CreateText(('Расчет #'+nm).bold(), 0.72, -1, 'left,html');
      t.SetTextColor('#3098ba');
      t.SetTextSize(fontSizeShow);
      lhrz.AddChild(t);
       var menu = app.CreateButton('[fa-ellipsis-v]', 0.25, BTNHEIGHT, "FontAwesome");
      menu.SetTextColor(TC2[BG]);
      menu.SetBackColor('#00000000');
      menu.SetTextSize(TextButtonsSize, 'px');
      menu.SetOnTouch(showOnTouchList);
      lhrz.AddChild(menu);
      showMenuBtnList.push(menu);
      var lst = app.CreateList(tx, 1, -1);
      lst.SetFontFile('fonts/DroidSerif-Regular.ttf');
      menu.tx = tx;
      lst.SetTextMargins(0, 0, 0, 0.02);
      lst.SetOnLongTouch(showOnTouchLongList);
      lst.SetOnTouch(showOnTouchList);
      lst.SetBackGradient('#77'+COLORS[BG][0].slice(1), '#77'+COLORS[BG][1].slice(1));
      showListList.push(lst);
      lst.SetTextSize(fontSizeShow);
      var mo = tx.match(/.+\n\nНет \(или недостаточно\) данных для подсчета\.$/gm);
      var tc = mo ? '#66' + TC[BG].slice(1) : TC[BG];
      lst.SetTextColor(tc);
      l.AddChild(lst);
      objs.push(lst);
      layScroll.AddChild(l);
      var line = app.CreateText('', 1, 2/HEIGHT);
      line.SetBackColor('#999999');
      layScroll.AddChild(line);
  }
    var l = app.CreateLayout('linear', 'horizontal');
    lay_ccShow.AddChild(l);
    l.SetPosition(1-BTNWIDTH*2-0.005, 1-BTNHEIGHT*2-0.005);
    var b = app.CreateButton('[fa-search-minus]', BTNWIDTH, BTNHEIGHT, "FontAwesome"+(BG?',gray':',alum'));
    b.ID = 'minus';
    b.SetTextSize(TextButtonsSize, 'px');
    b.SetTextColor('#50' + TC2[BG].slice(1));
    b.SetBackColor('#00555555');
    b.SetOnTouch(editFont);
    l.AddChild(b);
    var b = app.CreateButton('[fa-search-plus]', BTNWIDTH, BTNHEIGHT, "FontAwesome"+(BG?',gray':',alum'));
    b.ID = 'plus';
    b.SetTextSize(TextButtonsSize, 'px');
    b.SetBackColor('#00555555');
    b.SetTextColor('#50' + TC2[BG].slice(1));
    b.SetOnTouch(editFont);
    l.AddChild(b);
  var ltit = app.CreateLayout("Linear", "Horizontal,FillX");
  arguments.callee.l = ltit;
  ltit.SetPosition(0, 1-BTNHEIGHT);
  showListButtons = [];
  var basket = app.CreateButton('[fa-trash-o]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  basket.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  basket.SetTextColor(TC2[BG]);
  showListButtons.push(basket);
  basket.ID = 'basket';
  basket.SetTextSize(TextButtonsSize, 'px');
  basket.SetOnTouch(showOnTouchButton);
  basket.SetVisibility('gone');
  ltit.AddChild(basket);
  var send = app.CreateButton('[fa-share-alt]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  send.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  send.SetTextColor(TC2[BG]);
  showListButtons.push(send);
  send.ID = 'send';
  send.SetTextSize(TextButtonsSize, 'px');
  send.SetOnTouch(showOnTouchButton);
  send.SetVisibility('gone');
  ltit.AddChild(send);
   var check = app.CreateButton('[fa-check-square-o]', 0.25, BTNHEIGHT, "FontAwesome, custom");
   check.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
   check.SetTextColor(TC2[BG]);
   showListButtons.push(check);
  check.ID = 'check';
  check.SetTextSize(TextButtonsSize, 'px');
  check.SetOnTouch(showOnTouchButton);
  check.SetVisibility('gone');
  ltit.AddChild(check);
  var money = app.CreateButton('[fa-money]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  money.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  money.SetTextColor(TC2[BG]);
  showListButtons.push(money);
  money.ID = 'money';
  money.SetTextSize(TextButtonsSize, 'px');
  money.SetOnTouch(showOnTouchButton);
  money.SetVisibility('gone');
  ltit.AddChild(money);
  var ex = app.CreateButton('[fa-power-off]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  ex.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  ex.SetTextColor("#bb0000");
  showListButtons.push(ex);
  ex.SetTextSize(TextButtonsSize, 'px');
  ex.SetOnTouch(_exitOnTouch);
  ltit.AddChild(ex);
  var w = {'$':'[fa-dollar]', 'грн':'[fa-dollar]', '€':'[fa-euro]', 'руб':'[fa-ruble]'};
  var ex = app.CreateButton(w[Currency], 0.25, BTNHEIGHT, "FontAwesome, custom");
  ex.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  ex.SetTextColor(TC2[BG]);
  ex.ID = 'fin';
  showListButtons.push(ex);
  ex.SetTextSize(TextButtonsSize, 'px');
  ex.SetOnTouch(finOnTouch);
  ltit.AddChild(ex);
  var calc = app.CreateButton('[fa-calculator]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  calc.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  calc.SetTextColor(TC2[BG]);
  showListButtons.push(calc);
  calc.SetTextSize(TextButtonsSize, 'px');
  calc.ID = 'calc';
  calc.SetOnTouch(showOnTouchButton);
  ltit.AddChild(calc);
  var hist = app.CreateButton('[fa-history]', 0.25, BTNHEIGHT, "FontAwesome, custom");
  hist.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  hist.SetTextColor(TC2[BG]);
  showListButtons.push(hist);
  hist.SetTextSize(TextButtonsSize, 'px');
  hist.ID = 'hist';
  hist.SetOnTouch(showOnTouchButton);
  ltit.AddChild(hist);
  lay_ccShow.AddChild(ltit);
  app.AddLayout(lay_ccShow);
  if (scrollY!==undefined) {
      arguments.callee.scroll.ScrollTo(0, scrollY);
  }
  delLayouts(lay_ccShow);
  if (Ll3.length > 1) {
      var n = Ll3.length;
      for (var i = 1; i < n; i++)
          app.DestroyLayout(Ll3.pop());
  }
  arguments.callee.objs = [];
  for (var i in objs) arguments.callee.objs.push(+objs[i].GetHeight());
  arguments.callee.lsts = objs;
}



function editFont()
{
    this.SetBackColor('#aaff8822');
    if (this.ID == 'minus') {
        var fontSizeShow_ = Math.max(5, fontSizeShow - 1);
    }
    else if (this.ID == 'plus') {
        var fontSizeShow_ = Math.min(40, fontSizeShow + 1);
    }
    if (fontSizeShow_ != fontSizeShow) {
        fontSizeShow = fontSizeShow_;
        var t;
        if (TextSize == fontSizeShow) t = ' (default)';
        else t = (fontSizeShow > TextSize ? ' (+' : ' (-') + Math.abs(fontSizeShow-TextSize) + ')'; 
        app.ShowPopup(fontSizeShow + ' dp' + t, 'short');
        return Show(null, Show.scroll.GetScrollY());
    }
    this.SetBackColor('#00555555');
}

function showOnTouchLongList(ev) {
    var ind = showCheck.indexOf(ev);
    if (!showFlag) {
        this.SetBackGradient('#5533aacc', '#5533aadc');
        showCheck.push(ev)
        showFlag = true;
        Exit = 'show2';
        onoffShowButtons();
        Show.l.Animate('ScaleToBottom');
        for (var i in showListButtons) {
            if (i < 4) showListButtons[i].SetVisibility('show');
            else showListButtons[i].SetVisibility('gone');
        }
        Show.l.Animate('ScaleFromTop');
        for (var f in showMenuBtnList)
            showMenuBtnList[f].SetTextColor('#33'+TC[BG].slice(1));
    }
    else {
       if (ind == -1) {
          this.SetBackGradient('#5533aacc', '#5533aadc');
          showCheck.push(ev);
          onoffShowButtons()
       }
       else {
          this.SetBackGradient('#77'+COLORS[BG][0].slice(1), '#77'+COLORS[BG][1].slice(1));
          showCheck.splice(ind, 1);
          onoffShowButtons();
       }
    }
    for (var m in showCheck) {
        if (showCheck[m].indexOf('Итого:  ') != -1) {
            var money = TC2[BG];
            showButtonsFlags[1] = true;
            break;
        }
        else {
            var money = '#80' + TC2[BG].slice(1);
            showButtonsFlags[1] = false;
        }
    }
    showListButtons[3].SetTextColor(money);
}


function checkCalc(p)
{
    showCheck = [];
    if (p == 'Отметить все')
    {
        for (var i = 0; i < showListList.length; i++) {
            showListList[i].SetBackGradient('#5533aacc', '#5533aadc');
            showCheck.push(listShow[i].replace(/\^c\^/gm, ':').replace(/\n/gm, '^n^'));
        }
        for (var m in showCheck) {
            if (showCheck[m].indexOf('Итого:  ') != -1) {
                var money = TC2[BG];
                showButtonsFlags[1] = true;
                break;
            }
            else {
                var money = '#80' + TC2[BG].slice(1);
                showButtonsFlags[1] = false;
            }
        }
        showListButtons[3].SetTextColor(money);
        for (var i in showListButtons) {
            if (i < 3) {
                showListButtons[i].SetTextColor(TC2[BG]);
                showButtonsFlags[0] = true;
            }
        }
    }
    else if (p == 'Разотметить все')
    {
        for (var i = 0; i < showListList.length; i++) 
            showListList[i].SetBackGradient('#77'+COLORS[BG][0].slice(1), '#77'+COLORS[BG][1].slice(1));
        onoffShowButtons();
    }
}

function _Exit() {
	var f = app.ListFolder('/sdcard/.Object_light');
	if (!f.length) return app.Exit();
	app.ShowProgress("");
	setTimeout(app.Exit, 500);
	for (var i in f) {
		app.DeleteFile('/sdcard/.Object_light/' + f[i]);
		//app.Exit();
	}
}

function _exitOnTouch()
{
         if (!SetClose) _Exit();
         else
             YesNoDialog(query_exit, 'Закрыть программу?', '<img src="Img/exit.png"> Вопрос:');
}

function onoffShowButtons() {
      if (showCheck.length == 1) {
            for (var i in showListButtons) {
                if (i < 3) {
                    showListButtons[i].SetTextColor(TC2[BG]);
                    showButtonsFlags[0] = true;
                }
            }
      }
      else if (!showCheck.length) {
            for (var i in showListButtons) {
                if (i < 4 && i != 2) {
                    showListButtons[i].SetTextColor('#80' + TC2[BG].slice(1));
                    showButtonsFlags = [false, false];
                    }
                }
           }
}

function cancelShowCheck() {
    showButtonsFlags = [true, true]
    showFlag = false;
    showCheck = [];
    Exit = 'show';
    Show.l.Animate('ScaleToBottom');
    for (var i = 4; i<8; i++) {
        showListButtons[i].SetVisibility('show');
    }
    for (var i = 0; i<4; i++) {
        showListButtons[i].SetVisibility('gone');
    }
    Show.l.Animate('ScaleFromTop');
    for (var i in showListList) {
        showListList[i].SetBackGradient('#77'+COLORS[BG][0].slice(1), '#77'+COLORS[BG][1].slice(1));
    }
    for (var f in showMenuBtnList)
        showMenuBtnList[f].SetTextColor(TC[BG]);
}


function showOnTouchList(ev) {
    if (!showFlag) 
    {
        if (ev) return;
        this.SetBackColor('#550088aa');
        app.Wait(0.05);
        this.SetBackColor('#000088aa');
        ev = this.tx.replace(/\n/gm, '^n^').replace(/\^c\^/gm, ':');
        showOnTouchList.item = ev;
        showKeySelect = ev.slice(10, ev.indexOf('^n^^n^'));
        var menu = ['Удалить'];
        var hist = JSON.parse(HISTORY);
        if (hist[showKeySelect] != undefined) {
            menu.unshift('Редактировать');
        }
        var m = ev.match(/Итого:  \-?[\d\.\s]+/gm);
        if (m) {
            menu.push('Ввести сумму аванса');
        }
        menu.push('Отметить');
        CreateListDialog(showOnTouchDialog, '<img src="Img/grey.png"> Опции:', menu);
    }
    else {
      if (!ev) return;
      var ind = showCheck.indexOf(ev);
      if (ind == -1) {
          this.SetBackGradient('#5533aacc', '#5533aadc');
          showCheck.push(ev);
          onoffShowButtons()
      }
      else {
          this.SetBackGradient('#77'+COLORS[BG][0].slice(1), '#77'+COLORS[BG][1].slice(1));
          showCheck.splice(ind, 1);
          onoffShowButtons()
          }
    for (var m in showCheck) {
        if (showCheck[m].indexOf('Итого:  ') != -1) {
            var money = TC2[BG];
            showButtonsFlags[1] = true;
            break;
            }
        else {
            var money = '#80' + TC2[BG].slice(1);
            showButtonsFlags[1] = false;
            }
        }
      showListButtons[3].SetTextColor(money);
      }
}


function setAvans(v)
{
    Exit = oldEXIT;
    var item = showOnTouchList.item.replace(/:/gm, '^c^').replace(/\^n\^/gm, '\n');
    if (~item.indexOf('\nПолучено^c^ '))
    {
        var lst = item.split('\n');
        lst.splice(-2, 2);
        item = lst.join('\n');
    }
    if (v)
    {
        var m = item.match(/Итого\^c\^  \-?[\d\.\s]+/gm);
        var s = +m[0].slice(9).replace(/\s/g, '');
        var total = s - v;
        if (ROUNDING == 1) total = Math.round(total);
        else if (ROUNDING == 2) total = Math.floor(total);
        else if (ROUNDING == 3) total = Math.ceil(total);
        item += '\nПолучено^c^ ' + formatNum(v) + ' ' + Currency + '.\n';
        item += 'Остаток^c^ ' + formatNum(Round(total)) + ' ' + Currency + '.';
    }
    listShow.splice(showOnTouchList.index, 1, item);
    Show(null, Show.scroll.GetScrollY()+0.1);
}


function showOnTouchDialog(ev) {
    if (ev == 'Редактировать') {
        var title = showKeySelect.slice(21);
        params_cc2 = JSON.parse(HISTORY)[showKeySelect] ;
        complexCalculation2(1, showKeySelect);
    }
    else if (ev == 'Отметить') {
        var index = listShow.indexOf(showOnTouchList.item.replace(/:/gm, '^c^').replace(/\^n\^/gm, '\n'));
        //print(Show.lsts[index]);return;
        window.showOnTouchLongList.call(Show.lsts[index], showOnTouchList.item);
    }
    else if (ev == 'Удалить') {
        var hist = JSON.parse(HISTORY);
        if (hist[showKeySelect] == undefined) return showOnTouchDialog('Навсегда');
        SelectionList(showOnTouchDialog, ['В корзину', 'Навсегда'], '<img src="Img/delete.png"> Удалить расчет:', -1);
    }
    else if (ev == 'Ввести сумму аванса') {
        showOnTouchList.index = listShow.indexOf(showOnTouchList.item.replace(/:/gm, '^c^').replace(/\^n\^/gm, '\n'));
        oldEXIT = Exit;
        Exit = 'SetAvans';
        inputDigital(setAvans, 'float', 'Введите сумму аванса:', 0);
    }
    else if (ev == 'В корзину' || ev == 'Навсегда') {
        for (var i in listShow) {
            if (!listShow[i].indexOf('Расчет от ' + showKeySelect)) break;
        }
        IndexOf(showKeySelect);
        var hist = JSON.parse(HISTORY);
        if (hist[showKeySelect] != undefined) {
            if (ev == 'В корзину') {
                var basket = JSON.parse(BASKET);
                basket[showKeySelect] = hist[showKeySelect];
                BASKET = JSON.stringify(basket);
                app.SaveText("Basket", BASKET);
            }
            delete hist[showKeySelect];
            HISTORY = JSON.stringify(hist);
        }
        app.SaveText("History", HISTORY);
        app.ShowPopup('Выполнено', 'Short');
        (listShow.length) ? Show(null, Show.scroll.GetScrollY()-Show.objs[i]) : ComplexCalculation1(1)
    }
}


function showOnTouchButton(ev) {
    var id = this.ID;
    if (id != 'check' && (!showButtonsFlags[0] || id == 'money' && !showButtonsFlags[1])) return;
    if (id == 'hist') {
        if ( HISTORY != '{}') {
            HistoryBasketList(1, 1);
            showBack = true;
        }
        else app.ShowPopup('История расчетов пуста', 'Short');
    }
    else if (id == 'calc') {
         Exit = 'calcShow';
         showCalculator();
     }
    else if (id == 'basket') {
        var $ = false, $2 = false, hist = JSON.parse(HISTORY);
        for (var i in showCheck) {
            var ev2 = showCheck[i];
            var showKeySelect = ev2.slice(10, ev2.indexOf('^n^^n^'))
            if (hist[showKeySelect] != undefined) $ = true; 
            else $2 = true;
        }
        if ($) {
            if (showCheck.length == 1) var q = '<img src="Img/delete.png"> Удалить отмеченный расчет:';
            else var q = '<img src="Img/delete.png"> Удалить отмеченныe расчеты' + ($2 ? ' ( в корзину - только сохраненные):' : ':') ;
            SelectionList(showDelete, ['В корзину', 'Навсегда'], q, -1);
        }
        else return showDelete('Навсегда');
    }
    else {
        var txt = (showCheck.join('\n\n--------------------\n\n')).replace(/\^n\^/g, '\n');
        if (id == 'send') {
            if (showCheck.length == 1) var tcopy = 'Отмеченный расчет:';
            else var tcopy = 'Отмеченные расчеты (' + showCheck.length + '):';
            ShowCopy.txt = txt;
            var lst = ['Отослать на e-mail',  'Отправить в файле .txt', 'Копировать в буфер', 'Сохранить в файл .txt']
            var j = 0, hist = JSON.parse(HISTORY);
            for (var i=0; i<showCheck.length; i++)
            {
                var k = showCheck[i].split('^n^')[0].slice(10);
                if (hist[k]) j++;
            }
            if (j) {
                var addmenu = 'Сохранить в файле .json';
                var addmenu2 = 'Отправить в файле .json';
                if (j < showCheck.length) {
                    var r;
                    var s1 = (j + '').slice(-1), s2 = (j + '').slice(-2);
                    if (s2 > 4 && s2 < 21 || s1 > 4 || s1 == 0)  r = ' расчетов';
                    else if (s1 == 1) r = ' расчет';
                    else if (s1 < 5)  r = ' расчета';
                    var x = j>1 ? 1 : 0;
                    var a = ' (только ' + j + r + '‚ сохраненны' + ['й', 'е'][x] + ' в "Истории")';
                    addmenu += a;
                    addmenu2 += a;
                    
                }
                lst.push(addmenu2);
                lst.push(addmenu);
            }
            CreateListDialog(ShowCopy, tcopy, lst);
        }
        else if (id == 'check') {
            var menu = [];
            if (showListList.length > showCheck.length)
                menu.push('Отметить все');
            if (showCheck.length)
                menu.push('Разотметить все');
            CreateListDialog(checkCalc, 'Расчет(ы):', menu);
        }
        else if (id == 'money') {
            var m = txt.match(/Остаток: \-?[\d\.\s]+/gm);
            if (m)
                CreateListDialog(CalcTotalSum, 'Подбить общую сумму:', ['Без учета аванса(ов)', 'С учетом аванса(ов)']);
            else CalcTotalSum();
        }
    }
}


function CalcTotalSum(p)
{
    if (!p || p == 'Без учета аванса(ов)')
    {
        var txt = showCheck.join('\n');
        var m = txt.match(/Итого:  \-?[\d\.\s]+/gm), l = [], ll = [];
        for (var e in m) {
            l.push(m[e].slice(7).replace(/\s/g, ''));
            ll.push(formatNum(m[e].slice(7).replace(/\s/g, '')));
        }
        if (showCheck.length == 1) 
            var tsum = 'Сумма в отмеченном расчете:\n'  + formatNum(sum(l)) + ' ' + Currency;
        else 
            var tsum = 'Общая сумма в отмеченных расчетах:\n' + (l.length>1 ? (ll.join(' + ') + ' = ' ) : '') + formatNum(sum(l)) + ' ' + Currency;
        YesNoDialog.txt = sum(l);
        YesNoDialog(totalSum, tsum, '<img src="Img/calc.png"> Итого:', 'В буфер', 'Ясно', !BG);
    }
    else
    {
        var l = [], ll = [];
        for (var i=0; i<showCheck.length; i++)
        {
            var m = showCheck[i].match(/Остаток: \-?[\d\.\s]+/gm);
            if (m) 
            {
                l.push(m[0].slice(9).replace(/\s/g, ''));
                ll.push(formatNum(m[0].slice(9).replace(/\s/g, '')));
            }
            else
            {
                var m = showCheck[i].match(/Итого:  \-?[\d\.\s]+/gm);
                if (m)
                {
                    l.push(m[0].slice(7).replace(/\s/g, ''));
                    ll.push(formatNum(m[0].slice(7).replace(/\s/g, '')));
                }
            }
        }
        if (showCheck.length == 1) 
            var tsum = 'Сумма с учетом аванса в отмеченном расчете:\n'  + formatNum(sum(l)) + ' ' + Currency;
        else 
            var tsum = 'Общая сумма с учетом аванса(ов) в отмеченных расчетах:\n' + (l.length>1 ? (ll.join(' + ') + ' = ' ) : '') + formatNum(sum(l)) + ' ' + Currency;
        YesNoDialog.txt = sum(l);
        YesNoDialog(totalSum, tsum, '<img src="Img/calc.png"> Итого:', 'В буфер', 'Ясно', !BG);
    }
}


function ShowCopy(i) {
    if (i == 'Копировать в буфер') {
        app.SetClipboardText(ShowCopy.txt);
        app.ShowPopup('Скопировано в буфер', 'short');
        cancelShowCheck();
    }
    else if (i=='Отправить в файле .txt') {
    	sendBTtxt();
    }
    else if (i == 'Сохранить в файл .txt') 
    {
        cancelShowCheck();
        ShowCopy.flag = 'txt';
        FileManager(selectFm, JSON.parse(app.LoadText('FM', '["/"]')));
        app.ShowPopup('Выбор директории - длинное нажатие на нужную папку.')
    }
    else if (i == 'Отослать на e-mail') 
    {
        var txt = (showCheck.join('\n\n--------------------\n\n')).replace(/\^n\^/g, '\n');
        sendTextEmail = txt;
        setEmail(1);
        cancelShowCheck();
    }
    else if (i.indexOf('Отправить в файле .json') > -1)  {
    	sendBT();
    }
    else
    {
        ShowCopy.flag = 'json';
        FileManager(selectFm, JSON.parse(app.LoadText('FM', '["/"]')));
        app.ShowPopup('Выбор директории - длинное нажатие на нужную папку.')
    }
}




function totalSum() {
    var yn = this.ID;
    Dialog.Dismiss();
    app.DestroyLayout(layDlg);
    if (yn == 'Yes') {
        var t = '' + YesNoDialog.txt;
        app.SetClipboardText(t);
        var i = Clipboard.indexOf(t);
        if (~i) Clipboard.splice(i, 1);
        Clipboard.unshift(t);
        app.ShowPopup('Сумма скопирована в буфер обмена.', 'Short');
        }
}


function showDelete(v) {
        var hist = JSON.parse(HISTORY);
        if (v == 'В корзину') var basket = JSON.parse(BASKET);
        var z = 0;
        for (var i in showCheck) {
            ev = showCheck[i];
            showKeySelect = ev.slice(10, ev.indexOf('^n^^n^'))
            for (var ii in listShow) {
                if (!listShow[ii].indexOf('Расчет от ' + showKeySelect)) break;
            }
            z += Show.objs[ii];
            IndexOf(showKeySelect);
            if (hist[showKeySelect] != undefined) {
                if (v == 'В корзину') basket[showKeySelect] = hist[showKeySelect];
                delete hist[showKeySelect];
                }
            }
        HISTORY = JSON.stringify(hist);
        if (v == 'В корзину')  {
            BASKET = JSON.stringify(basket);
            app.SaveText("Basket", BASKET);
            }
        app.SaveText("History", HISTORY);
        var del = +i + 1;
        app.ShowPopup('Удалено расчетов: ' + del, 'Short');
        cancelShowCheck();
        listShow.length ? Show(null, Show.scroll.GetScrollY()-z) : ComplexCalculation1(1);
}


function ChekUnchekHist(p) {
    if (p == 'Отметить все') {
        app.ShowProgress('');
        var histCheck_ = [];
        for (var i=0; i<histListList.length; i++) {
            var obj = histListList[i];
            var t = obj.GetList()[0].title;
            histCheck_.push(t);
            if (~histCheck.indexOf(t)) continue;
            obj.SetBackColor('#00000000');
            obj.SetItemByIndex(0, t, null, 'Img/select.png')
        }
        histCheck = histCheck_;
        app.HideProgress();
    }
    else {
        HistoryBasketList(histMode);
    }
    onoffHistButtons();
}


function OnTouchCheckUncheckHist() {
    var l = [];
    if (histCheck.length < histListList.length)
        l.push('Отметить все');
    if (histCheck.length)
        l.push('Разотметить все');
    CreateListDialog(ChekUnchekHist, '<img src="Img/grey.png"> Расчет(ы):', l);
}


function histOnTouchList(ev){
    var ind = histCheck.indexOf(ev);
    if (ind == -1) {
        histCheck.push(ev);
        this.SetBackColor('#00000000');
        this.SetItemByIndex(0, ev, null, 'Img/select.png');
        }
    else {
       var col = (this.col[0] ? this.col[1] : '#00000000');
       this.SetBackColor(col);
       this.SetItemByIndex(0, ev, null, 'Img/unselect.png');
       histCheck.splice(ind, 1);
   }
   if (histCheck.length == 1 || !histCheck.length) onoffHistButtons();
}


function histOnLongTouchList(i)
{
    var basket = JSON.parse(BASKET);
    params_cc2 = basket[i];
    doShow(i, -1);
}


function histOnLongTouchList2(i)
{
    var hist = JSON.parse(HISTORY);
    params_cc2 = hist[i];
    doShow(i, -1);
}



function onoffHistButtons() {
    for (var i in histListButtons) {
        if (histListButtons[i].ID == 'clear' 
            && listShow.length || histListButtons[i].ID == 'open' 
            && (listShow.length || listShow.length) && histMode) 
                continue;
        histListButtons[i].SetTextColor(histCheck.length ? TC2[BG] : '#80' + TC2[BG].slice(1));
        }
}

function histOnTouchButton(ev) {
    
    var id = this.ID;
    var len = histCheck.length;
    if (histMode && id != 'clear') {
        if (!listShow.length && !len && id == 'open' || !len && id != 'open' ) {
            return app.ShowPopup('Ни один расчет не отмечен!', 'short');
        }
    }
    else if (!histMode && !len) {
        return app.ShowPopup('Ни один расчет не отмечен!', 'short');
    }
    var hist = JSON.parse(HISTORY);
    var basket = JSON.parse(BASKET);
    if (id == 'open') {
        if (histMode) {
            if (len > 10) app.ShowProgress('');
            for (var i in histCheck) {
                params_cc2 = hist[histCheck[i]];
                doShow(histCheck[i], 1);
            }
            Show();
            if (len > 10) app.HideProgress();
        }
        else {
            for (var i in histCheck) {
                var key = histCheck[i];
                hist[key] = basket[key];
                delete basket[key];
            }
            HISTORY = JSON.stringify(hist);
            app.SaveText("History", HISTORY);
            BASKET = JSON.stringify(basket);
            app.SaveText("Basket", BASKET);
            app.ShowPopup('Восстановлено расчетов: ' + len, 'Short');
            ComplexCalculation1.hist.SetTextColor(TC2[BG]);
            (BASKET != '{}') ? HistoryBasketList() : ComplexCalculation1();
        }
    }
    else if (id == 'clear') {
        if (histMode) {
            if (!histCheck.length && !listShow.length) return app.ShowPopup('Нечего очищать.', 'short');
            listShow = [];
            HistoryBasketList(true);
        }
    }
    else if (id == 'basket') {
        if (histMode) {
            if (len == 1) var q = 'Удалить отмеченный расчет:';
            else var q = 'Удалить отмеченныe расчеты:';
            SelectionList(histDeleted, ['В корзину', 'Навсегда'], '<img src="Img/delete.png"> ' + q, -1);
        }
        else {
            var a = histCheck.length == 1 ? 'й' : 'е';
            var b = histCheck.length == 1 ? '' : 'ы';
            YesNoDialog(basketDeleted, 'Удалить из корзины отмеченны'+a+' расчет'+b+' ?', '<img src="Img/help.png"> Подтвердите:');
        }
    }
}


function basketDeleted(v) 
{
    Dialog.Dismiss();
    app.DestroyLayout(layDlg);
    if(this.ID == 'Yes') {
        var len = histCheck.length;
        var basket = JSON.parse(BASKET);
        for (var i in histCheck) {
            var key = histCheck[i];
            delete basket[key];
        }
        BASKET = JSON.stringify(basket);
        app.SaveText("Basket", BASKET);
        app.ShowPopup('Удалено из корзины расчетов: ' + len, 'Short');
        (BASKET != '{}') ? HistoryBasketList() : ComplexCalculation1();
    }
}


function histDeleted(v) {
    var hist = JSON.parse(HISTORY);
    if (v == 'В корзину') var basket = JSON.parse(BASKET);
    for (var i in histCheck) {
        var key = histCheck[i];
        IndexOf(key);
        if (v == 'В корзину') basket[key] = hist[key];
        delete hist[key];
    }
    HISTORY = JSON.stringify(hist);
    app.SaveText("History", HISTORY);
    if (v == 'В корзину') {BASKET = JSON.stringify(basket);
        app.SaveText("Basket", BASKET);
    }
    app.ShowPopup('Удалено ' + ((v == 'В корзину') ? 'в корзину ' : '') + 'расчетов: ' + histCheck.length, 'Short');
    (HISTORY != '{}') ? HistoryBasketList(1) : ComplexCalculation1();
}


function isShow(text) {
    for (var i in listShow) {
        if (listShow[i].indexOf('Расчет от ' + text) != -1) return true;
    }
}


var Ll2 = [];
function HistoryBasketList(mode, slide) {
    if (Exit != 'hist') OldExit = Exit;
    Exit = 'hist';
    histMode = mode;
    var res = JSON.parse(mode ? HISTORY : BASKET);
    var len = 0; 
    for (var i in res) len ++;
    var len_text = '[' + len + ']';
    histCheck = [];
  lay_ccHist = app.CreateLayout("Linear", "Top,FillXY");
  var title_ = app.CreateTitle((mode ? 'История расчетов ' : 'Расчеты, удаленные в корзину ') + len_text);
  lay_ccHist.AddChild(title_);
  Ll2.unshift(lay_ccHist);
  //lay_ccHist.SetBackGradient(COLORS[BG][0], COLORS[BG][1]);
  lay_ccHist.SetBackground('Img/bg'+BG+'.png', 'repeat');
  var scroll = app.CreateScroller(1, 1-BTNHEIGHT-GET_TOP-0.005); 
  scroll.SetMargins(0, 0, 0, 0.005);
  lay_ccHist.AddChild(scroll);
  var layScroll = app.CreateLayout("Linear", "fillxy,top"); 
  scroll.AddChild( layScroll );
  histListList = []; var ls = [];
  for (var tx in res) {
      ls.unshift(tx);
  }
  ls.sort(); ls.reverse();
  if (ls.length > 10) app.ShowProgress('');
  var isref = false;
  for (var tx in ls) {
      tx = ls[tx];
      var l = app.CreateLayout("Linear", "FillX");
      var lst = app.CreateList(tx+':Img/unselect.png', 1, -1);
      lst.SetOnTouch(histOnTouchList);
      lst.SetFontFile('fonts/DroidSerif-Regular.ttf');
      lst.SetOnLongTouch(mode ? histOnLongTouchList2 : histOnLongTouchList);
      lst.SetTextMargins(0, 0.01, 0, 0.01);
      lst.SetTextColor(TC[BG]);
      histListList.push(lst);
      lst.SetTextSize(TextSize);
      var iscol = mode && isShow(tx);
      if (!isref) isref = iscol;
      var col = iscol ? ['#50ffddff', '#20331133'][BG] : '#00000000';
      lst.SetBackColor(col);
      lst.col = [mode, col];
      l.AddChild(lst);
      layScroll.AddChild(l);
      var line = app.CreateText('', 1, 2/HEIGHT);
      line.SetBackColor('#999999');
      layScroll.AddChild(line);
  }
  if (slide) lay_ccHist.SetVisibility("Hide");
  var ltit = app.CreateLayout("Linear", "Horizontal,FillX");
  histListButtons = [];
  var chb = app.CreateButton('[fa-check-square-o]',  mode?0.25:0.333, BTNHEIGHT, "FontAwesome, custom");
  chb.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  chb.SetTextColor(TC2[BG]);
  chb.SetTextSize(TextButtonsSize, 'px');
  chb.SetOnTouch(OnTouchCheckUncheckHist);
  ltit.AddChild(chb);
  if (mode) {
      var clear = app.CreateButton('[fa-refresh]', 0.25, BTNHEIGHT, "FontAwesome, custom");
      clear.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
      clear.SetTextColor('#80' + TC2[BG].slice(1));
      histListButtons.push(clear);
      clear.ID = 'clear';
      clear.SetTextSize(TextButtonsSize, 'px');
      clear.SetOnTouch(histOnTouchButton);
      ltit.AddChild(clear);
      }
  var basket = app.CreateButton('[fa-trash]',  mode?0.25:0.333, BTNHEIGHT, "FontAwesome, custom");
  basket.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  basket.SetTextColor('#80' + TC2[BG].slice(1));
  histListButtons.push(basket);
  basket.ID = 'basket';
  basket.SetTextSize(TextButtonsSize, 'px');
  basket.SetOnTouch(histOnTouchButton);
  ltit.AddChild(basket);
  var open = app.CreateButton(mode ? '[fa-share-square-o]' : '[fa-level-up]', mode?0.25:0.333, BTNHEIGHT, "FontAwesome, custom");
  open.SetStyle(COLORS[BG][1], COLORS[BG][1], 4, '#888888', 1, 0);
  histListButtons.push(open);
  open.SetTextColor(mode && !histCheck.length && ! listShow.length || !mode ? '#80'+TC2[BG].slice(1) : TC2[BG]);
  open.ID = 'open';
  open.SetTextSize(TextButtonsSize, 'px');
  open.SetOnTouch(histOnTouchButton);
  ltit.AddChild(open);
  lay_ccHist.AddChild(ltit);
  app.AddLayout(lay_ccHist);
  if (slide) lay_ccHist.Animate('ScaleFromLeft');
  if (mode && isref) clear.SetTextColor(TC2[BG]);
  if (ls.length > 10) app.HideProgress();
  if (Ll2.length > 1) {
      var n = Ll2.length;
      for (var i = 1; i < n; i++)
          app.DestroyLayout(Ll2.pop());
  }
}


function OnMenu(n) {
	if (n==null) {
		if (Exit==1) Menu();
		else if (Exit==2) cc2_OnTouch();
		else if (Exit=='form') 
			formOnTouchMenu();
		else if (Exit=='price') 
			ccFormMenuOnTouch();
		else if (Exit=='finance') 
			FinOnTouchButton();
		else if (Exit=='simple') 
			menuSimpleOnTouch();
	}
}


function OnBack() 
{
  if(Exit == 1)
      _exitOnTouch();
  else if (Exit == 'filemanager') {
        if(fm_params.path.length==1 )  {
            app.DestroyLayout(lst_fm_lay[0]);
            cancelShowCheck();
            Exit = 'show';
        }
        else {
            fm_params.path.pop(); 
            FileManager(fm_params.callback, fm_params.path)
        }
    }

  else if(Exit == 2) {
    YesNoDialog(toback, 'Вы хотите прекратить ' + (EditCalc ? 'редактирование' : 'расчет') + '?', '<img src="Img/help.png"> Подтвердите:');
  }
  else if (Exit == 'form') {
    Exit = 2; 
    clearFormList();
    lay_ccForm.Animate('FadeOut');
    app.DestroyLayout(lay_ccForm); 
  }
  else if (Exit == 'show2') cancelShowCheck();
  else if (Exit == 'simple_history') {
      Exit = OldExit;
      simpleScrollY = SimpleHistoryShow.scroll.GetScrollY();
      laySimpleHistory.Animate('FadeOut');
      app.DestroyLayout(laySimpleHistory);
  }
  else if (Exit == 'hist') {
      Exit = OldExit;
      lay_ccHist.Animate('FadeOut');
      app.DestroyLayout(lay_ccHist);
  }
  else if (Exit == 'show') 
      ComplexCalculation1(1);
  else if (Exit == 'finance')
  {
      Exit = OldExit;
      FinFlag = 0;
      lay_ccFin.Animate('FadeOut');
      app.DestroyLayout(lay_ccFin);
  }
  else if (Exit == 'simple' ) 
  {
      if (!ListSimplePricesOld) {
          Exit = 1;
          lay_simple.Animate('FadeOut');
          app.DestroyLayout(lay_simple);
      }
      else 
          CreateListDialog(simpleDialogOnTouch, '<img src="Img/grey.png"> Назад:', ['Вернуть первоначальный расчет', 'Закрыть раздел']);
  }    
  else if (Exit == 'wallpaper' ) 
  {
      Exit = 1;
      lay_wallpaper.Animate('FadeOut');
      app.DestroyLayout(lay_wallpaper);
  }    
  else if (Exit == 'price') {
    Exit = 2; 
    lay_priceForm.Animate('FadeOut');
    app.DestroyLayout(lay_priceForm);
    }
  else if (Exit == 'calc_input_fin') {
      Exit = 'finance';
      layCalculator.Animate('FadeOut');
      app.DestroyLayout(layCalculator);
  }
  else if (Exit == 'simple_calc') {
      Exit = 'simple';
      layCalculator.Animate('FadeOut');
      app.DestroyLayout(layCalculator);
  }
  else if (Exit == 'calc_cc1') {
      Exit = 1;
      layCalculator.Animate('FadeOut');
      app.DestroyLayout(layCalculator);
  }
  else if (Exit == 'calc_cc2') {
      Exit = 2;
      layCalculator.Animate('FadeOut');
      app.DestroyLayout(layCalculator);
  }
  else if (Exit == 'calc_show_wall') {
      Exit = 'wallpaper';
      layCalculator.Animate('FadeOut');
      app.DestroyLayout(layCalculator);
  }
  else if (Exit == 'calcShow') {
      Exit = 'show';
      layCalculator.Animate('FadeOut');
      app.DestroyLayout(layCalculator);
  }
  else if (Exit == 'price2') {
    Exit = 1; 
    lay_prices.Animate('FadeOut');
    app.DestroyLayout(lay_prices);
  }
  else if (Exit == 'sett') {
    //  for (var i=20; i>=0; i--) lay_sett.SetScale(i/20, i/20);
      lay_sett.Animate('FadeOut');
      ComplexCalculation1(); 
  }
  else if (Exit == 'input' || Exit == 'input3') {
    app.DestroyLayout(layInputDigital);
    flagInput = false;
    Exit = 'form'; 
  }
  else if (Exit == 'simple2') {
    app.DestroyLayout(layInputDigital)
    flagInput = false;
    Exit = 'simple'; 
  }
  else if (Exit == 'input_fin') {
    app.DestroyLayout(layInputDigital)
    flagInput = false;
    Exit = 'finance'; 
  }
  else if (Exit == 'input2') {
    app.DestroyLayout(layInputDigital);
    flagInput = false;
    Exit = 2; 
    }
  else if (Exit == 'SetAvans') {
    app.DestroyLayout(layInputDigital);
    flagInput = false;
    Exit = oldEXIT; 
  }
  else if (Exit == 'inputwall') {
    app.DestroyLayout(layInputDigital);
    flagInput = false;
    Exit = 'wallpaper'; 
  }

  else if (Exit == 'inputPrice') {
    app.DestroyLayout(layInputDigital);
    flagInput = false;
    Exit = 'price'; 
  }
  else if (Exit == 'inputPrice2') {
    app.DestroyLayout(layInputDigital);
    flagInput = false;
    Exit = 'price2'; 
  }
}

function toback() {
    Dialog.Dismiss();
    app.DestroyLayout(layDlg);
    if(this.ID == 'Yes') !EditCalc ? ComplexCalculation1(1) : Show();
}

function delLayouts(lay) 
{
  lays = [ 'lay_cc1', 'layDlg', 'lay_cc2', 'layInputDigital', 'lay_sett', 'lay_priceForm', 'lay_ccShow', 'lay_ccHist', 'lay_wallpaper', 'lay_prices', 'lay_ccFin', 'laySimpleHistory', 'lay_simple'];
  for(var l in lays) {
    try {
      l = eval(lays[l]);
      if(l != lay) app.DestroyLayout(l)
      }
    catch(err) {}
    }
}



function OnStart() {
  app.SetSharedApp('Object_light');
  app.SetOrientation("Portrait");
  app.EnableBackKey(false) ;
  if(!TextSize) {
      var t = app.ReadFile('files/complex_calculation_1.txt').replace(/(^\s*)|(\s*)$/g, '');
    app.SaveText('cc1',  t);

    app.SaveNumber("TextSize", 18);
    TextSize = 18;
    Settings();
    Alert('Это первый запуск программы, установите нужные Вам параметры.', '<img src="Img/dimy44.png"> Приветствую!');
    }
  else
  {
      ComplexCalculation1(1);
         var file = app.GetSharedFiles();
         if (file) {
    		if (file[0].slice(-6) == '.items') {
	    		return readItems(file[0]);
	    	}
            readJson(file[0]);
        }
  }
}



