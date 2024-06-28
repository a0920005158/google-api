import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
var myState = {
  $NearbyAttractionsList: [],
  $locationLat: '', // 所在經緯度
  $locationLng: '',
  $loading: true,
  $Details: [],
  $PhotosUrl: [],
  $user: {},
  $timeLineData: [{ title: '請輸入項目名稱...', price: 0, time: '請輸入日期時間' }],
  $NoteData: [{
    TravelNotes: {
      content: "",
      imgContent: [{
        content: "",
        img: "",
        showContentText: false,
      }],
      title: "",
    },
    UserId: ""
  }],
  $Favor: [],
  $RouterPush: '',
  $NowRouter: '',
  $showLoad: false,
  $showLoad2: false,
  $SearchResult: [],
  $WriteStore: {
    title: '',
    list: [

    ]
  }
}

const store = new Vuex.Store({
  state: myState,
  mutations: {
    $deleteFavor (state, value) {
      var index = state.$Favor.map(x => x.name).indexOf(value);
      state.$Favor.splice(index, 1);
    },
    $PostValue (state, value) { // 根據參數更改vuex值
      state[value.paramName] = value.data
    },
    $PushValue (state, value) { // 根據參數更改vuex值
      state[value.paramName].push(value.data)
    },
    $AddCost (state, value) {
      state.$timeLineData.push({ title: '請輸入項目名稱...', price: 0, time: '請輸入日期時間' })
    },
    $DeleteCost (state, value) {
      state.$timeLineData.splice(value, 1)
    },
    $UpdateTimeLineData (state, value) {
      switch (value.item) {
        case 'title':
          state.$timeLineData[value.index].title = value.data;
          break
        case 'price':
          state.$timeLineData[value.index].price = value.data;
          break
        case 'time':
          state.$timeLineData[value.index].time = value.data;
          break
      }
    }
  }
})
export default store
